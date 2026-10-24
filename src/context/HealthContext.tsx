import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { HOSPITALS } from '../data/hospitals'
import { ARTICLES } from '../data/catalog'
import { loadSnapshot, memorySnapshot, removeRecord, resetSnapshot, saveRecords, type Snapshot } from '../services/db'
import { t } from '../i18n'
import { reminderCopy } from '../i18n/reminders'
import { doseLogged, doseMissed } from '../i18n/sakhi'
import { isLang, languageMeta } from '../languages'
import { showSymptoms, uid } from '../lib/format'
import type { DoseLog, DosePeriod, DosePlan, LabEntry, Lang, LifeStage, MedicineCheck, OriginId, OutboxItem, Profile, Reminder, ReportRecord, SymptomEntry } from '../types'

type Notice = { id: string; text: string; tone: 'good' | 'warn' | 'bad' }

type HealthApi = {
  ready: boolean
  persistent: boolean
  browserOnline: boolean
  offline: boolean
  snapshot: Snapshot | null
  notices: Notice[]
  notify: (text: string, tone?: Notice['tone']) => void
  dismissNotice: (id: string) => void
  setLanguage: (language: Lang) => Promise<void>
  addDose: (entry: { name: string; time: string; period: DosePeriod; notes: string; repeat?: DosePlan['repeat']; weekdays?: number[] }) => Promise<void>
  updateDose: (id: string, patch: Partial<Pick<DosePlan, 'name' | 'time' | 'period' | 'notes' | 'repeat' | 'weekdays'>>) => Promise<void>
  logDose: (entry: { planId: string; name: string; status: DoseLog['status']; note: string; occurrenceId?: string; snoozeUntil?: string }) => Promise<boolean>
  setLifeStage: (lifeStage: LifeStage) => Promise<void>
  setInterests: (interests: string[]) => Promise<void>
  setLocation: (locationId: OriginId) => Promise<void>
  setLocationEnabled: (locationEnabled: boolean) => Promise<void>
  setOnlineConsent: (onlineModelConsent: boolean) => Promise<void>
  setSimulatedOffline: (simulatedOffline: boolean) => Promise<void>
  addSymptom: (entry: Omit<SymptomEntry, 'kind' | 'id' | 'createdAt' | 'sample'>) => Promise<void>
  addLab: (entry: Omit<LabEntry, 'kind' | 'id' | 'createdAt' | 'sample'>) => Promise<void>
  addReport: (entry: Omit<ReportRecord, 'kind' | 'id' | 'createdAt'>) => Promise<void>
  addMedicine: (entry: Omit<MedicineCheck, 'kind' | 'id' | 'createdAt'>) => Promise<void>
  deleteById: (id: string) => Promise<void>
  toggleReminder: (id: string) => Promise<void>
  syncNow: () => Promise<{ ok: boolean; message: string }>
  clearHealthData: () => Promise<void>
}

const HealthContext = createContext<HealthApi | null>(null)

export function HealthProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [persistent, setPersistent] = useState(true)
  const [browserOnline, setBrowserOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)
  const [notices, setNotices] = useState<Notice[]>([])
  const snapRef = useRef<Snapshot | null>(null)
  const persistentRef = useRef(true)
  const takenLock = useRef(new Set<string>())
  useEffect(() => {
    snapRef.current = snapshot
    persistentRef.current = persistent
  }, [snapshot, persistent])

  useEffect(() => {
    let live = true
    loadSnapshot()
      .then((next) => {
        if (!live) return
        const stored = next.profile.language
        const profile = next.profile.languageChosen && isLang(stored) ? next.profile : { ...next.profile, language: 'en' as const }
        setSnapshot({ ...next, profile })
      })
      .catch(() => {
        if (!live) return
        setPersistent(false)
        setSnapshot(memorySnapshot())
      })
    const on = () => setBrowserOnline(navigator.onLine)
    window.addEventListener('online', on)
    window.addEventListener('offline', on)
    return () => {
      live = false
      window.removeEventListener('online', on)
      window.removeEventListener('offline', on)
    }
  }, [])

  useEffect(() => {
    if (snapshot) {
      const meta = languageMeta(snapshot.profile.language)
      document.documentElement.lang = meta.id
      document.documentElement.dir = meta.dir
    }
  }, [snapshot])

  const phrase = (en: string, kn: string) => t(snapRef.current?.profile.language ?? 'en', { en, kn })
  const notify = (text: string, tone: Notice['tone'] = 'good') => {
    const id = uid('note')
    setNotices((current) => [...current, { id, text, tone }])
    window.setTimeout(() => setNotices((current) => current.filter((item) => item.id !== id)), 4800)
  }

  async function patchProfile(patch: Partial<Profile>) {
    const current = snapRef.current
    if (!current) return
    const profile = { ...current.profile, ...patch }
    if (persistentRef.current) await saveRecords([profile])
    setSnapshot((state) => (state ? { ...state, profile } : state))
  }

  async function queue(record: SymptomEntry | LabEntry | ReportRecord | MedicineCheck, label: string) {
    const current = snapRef.current
    if (!current) return
    const offline = current.meta.simulatedOffline || !navigator.onLine
    const box: OutboxItem | null = offline
      ? {
          kind: 'outbox',
          id: uid('out'),
          refKind: record.kind === 'symptom' ? 'symptom' : record.kind === 'lab' ? 'lab' : record.kind === 'report' ? 'report' : 'medicine',
          refId: record.id,
          label,
          createdAt: record.createdAt,
          status: 'pending',
        }
      : null
    if (persistentRef.current) await saveRecords(box ? [record, box] : [record])
    setSnapshot((state) => {
      if (!state) return state
      if (record.kind === 'symptom') return { ...state, symptoms: [record, ...state.symptoms], outbox: box ? [box, ...state.outbox] : state.outbox }
      if (record.kind === 'lab') return { ...state, labs: [record, ...state.labs], outbox: box ? [box, ...state.outbox] : state.outbox }
      if (record.kind === 'report') return { ...state, reports: [record, ...state.reports], outbox: box ? [box, ...state.outbox] : state.outbox }
      return { ...state, medicines: [record, ...state.medicines], outbox: box ? [box, ...state.outbox] : state.outbox }
    })
    notify(offline ? phrase('Saved on this device and queued. Nothing was sent to a server.', 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿ ಸರದಿಗೆ ಸೇರಿಸಲಾಗಿದೆ. ಸರ್ವರ್‌ಗೆ ಏನೂ ಹೋಗಿಲ್ಲ.') : phrase('Saved on this device.', 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ.'))
  }

  const api = useMemo<HealthApi>(() => {
    const offline = !browserOnline || Boolean(snapshot?.meta.simulatedOffline)
    return {
      ready: Boolean(snapshot),
      persistent,
      browserOnline,
      offline,
      snapshot,
      notices,
      notify,
      dismissNotice: (id) => setNotices((current) => current.filter((item) => item.id !== id)),
      setLanguage: (language) => patchProfile({ language, languageChosen: true }),
      addDose: async (entry) => {
        const row: DosePlan = { kind: 'dose', id: uid('dose'), createdAt: new Date().toISOString(), sample: false, repeat: entry.repeat ?? 'daily', name: entry.name, time: entry.time, period: entry.period, notes: entry.notes, weekdays: entry.weekdays }
        if (persistentRef.current) await saveRecords([row])
        setSnapshot((state) => (state ? { ...state, doses: [row, ...state.doses] } : state))
        notify(phrase('Reminder saved on this device. It does not change a prescription.', 'ಜ್ಞಾಪನೆ ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿದಿದೆ. ಇದು ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಬದಲಾಯಿಸುವುದಿಲ್ಲ.'))
      },
      updateDose: async (id, patch) => {
        const current = snapRef.current
        const existing = current?.doses.find((item) => item.id === id)
        if (!existing) return
        const row: DosePlan = { ...existing, ...patch }
        if (persistentRef.current) await saveRecords([row])
        setSnapshot((state) => (state ? { ...state, doses: state.doses.map((item) => (item.id === id ? row : item)) } : state))
      },
      logDose: async (entry) => {
        const current = snapRef.current
        const lang = current?.profile.language ?? 'en'
        const already = entry.occurrenceId
          ? current?.doseLogs.some((log) => log.occurrenceId === entry.occurrenceId && log.status === 'taken') || takenLock.current.has(entry.occurrenceId)
          : false
        if (already) {
          notify(t(lang, reminderCopy.already), 'warn')
          return false
        }
        if (entry.status === 'taken' && entry.occurrenceId) takenLock.current.add(entry.occurrenceId)
        const row: DoseLog = { kind: 'dose-log', id: uid('log'), createdAt: new Date().toISOString(), sample: false, ...entry }
        if (persistentRef.current) await saveRecords([row])
        setSnapshot((state) => (state ? { ...state, doseLogs: [row, ...state.doseLogs] } : state))
        const message = entry.status === 'taken' ? doseLogged : entry.status === 'snoozed' ? reminderCopy.snoozed : doseMissed
        notify(t(lang, message), entry.status === 'taken' ? 'good' : 'warn')
        return true
      },
      setLifeStage: (lifeStage) => patchProfile({ lifeStage }),
      setInterests: (interests) => patchProfile({ interests }),
      setLocation: (locationId) => patchProfile({ locationId }),
      setLocationEnabled: (locationEnabled) => patchProfile({ locationEnabled }),
      setOnlineConsent: (onlineModelConsent) => patchProfile({ onlineModelConsent }),
      setSimulatedOffline: async (simulatedOffline) => {
        const current = snapRef.current
        if (!current) return
        const meta = { ...current.meta, simulatedOffline }
        if (persistentRef.current) await saveRecords([meta])
        setSnapshot((state) => (state ? { ...state, meta } : state))
      },
      addSymptom: async (entry) => {
        const row: SymptomEntry = { ...entry, kind: 'symptom', id: uid('sym'), createdAt: new Date().toISOString(), sample: false }
        await queue(row, showSymptoms(row.symptoms) || row.notes.slice(0, 80) || row.module)
      },
      addLab: async (entry) => {
        const row: LabEntry = { ...entry, kind: 'lab', id: uid('lab'), createdAt: new Date().toISOString(), sample: false }
        await queue(row, `${row.name} ${row.value}`)
      },
      addReport: async (entry) => {
        const row: ReportRecord = { ...entry, kind: 'report', id: uid('report'), createdAt: new Date().toISOString() }
        await queue(row, row.title)
      },
      addMedicine: async (entry) => {
        const row: MedicineCheck = { ...entry, kind: 'medicine', id: uid('med'), createdAt: new Date().toISOString() }
        await queue(row, 'Medicine comparison')
      },
      deleteById: async (id) => {
        if (persistentRef.current) await removeRecord(id)
        setSnapshot((state) => {
          if (!state) return state
          return {
            ...state,
            symptoms: state.symptoms.filter((row) => row.id !== id),
            labs: state.labs.filter((row) => row.id !== id),
            reports: state.reports.filter((row) => row.id !== id),
            medicines: state.medicines.filter((row) => row.id !== id),
            reminders: state.reminders.filter((row) => row.id !== id),
            doses: state.doses.filter((row) => row.id !== id),
            doseLogs: state.doseLogs.filter((row) => row.id !== id),
            outbox: state.outbox.filter((row) => row.id !== id),
          }
        })
        notify(phrase('Deleted from this device.', 'ಈ ಸಾಧನದಿಂದ ಅಳಿಸಲಾಗಿದೆ.'))
      },
      toggleReminder: async (id) => {
        const current = snapRef.current
        const reminder = current?.reminders.find((item) => item.id === id)
        if (!reminder) return
        const next: Reminder = { ...reminder, done: !reminder.done }
        if (persistentRef.current) await saveRecords([next])
        setSnapshot((state) => (state ? { ...state, reminders: state.reminders.map((item) => (item.id === id ? next : item)) } : state))
      },
      syncNow: async () => {
        const current = snapRef.current
        if (!current) return { ok: false, message: phrase('Nothing to sync.', 'ಸಿಂಕ್ ಮಾಡಲು ಏನೂ ಇಲ್ಲ.') }
        if (current.meta.simulatedOffline || !navigator.onLine) {
          return {
            ok: false,
            message: current.meta.simulatedOffline
              ? phrase('Simulated offline mode is on. This is a demo control, not a live network check. Turn it off to run a local sync. No hospital server will be contacted.', 'ಆಫ್‌ಲೈನ್ ಅನುಕರಣೆ ಆನ್ ಆಗಿದೆ. ಇದು ನೇರ ಜಾಲ ಪರಿಶೀಲನೆಯಲ್ಲ. ಸ್ಥಳೀಯ ಸಿಂಕ್‌ಗೆ ಅದನ್ನು ಆಫ್ ಮಾಡಿ. ಆಸ್ಪತ್ರೆ ಸರ್ವರ್ ಅನ್ನು ಸಂಪರ್ಕಿಸಲಾಗುವುದಿಲ್ಲ.')
              : phrase('This browser reports no network. Cached records stay as they are. Live traffic and bed counts cannot be refreshed.', 'ಈ ಬ್ರೌಸರ್‌ಗೆ ಜಾಲವಿಲ್ಲ. ಉಳಿಸಿದ ದಾಖಲೆಗಳು ಹಾಗೆಯೇ ಇರುತ್ತವೆ. ನೇರ ಸಂಚಾರ ಮತ್ತು ಹಾಸಿಗೆಗಳನ್ನು ನವೀಕರಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.'),
          }
        }
        const now = new Date().toISOString()
        const meta = { ...current.meta, lastSync: now, hospitalsCachedAt: now, educationCachedAt: now }
        const hospitals = HOSPITALS.map((hospital) => ({ ...hospital, cachedAt: now }))
        const articles = ARTICLES.map((article) => ({ ...article }))
        const count = current.outbox.length
        if (persistentRef.current) {
          await saveRecords([meta, ...hospitals, ...articles])
          for (const item of current.outbox) await removeRecord(item.id)
        }
        setSnapshot((state) => (state ? { ...state, meta, hospitals, articles, outbox: [] } : state))
        return {
          ok: true,
          message: phrase(
            `Local sync finished. ${count} queued change${count === 1 ? '' : 's'} cleared on this device. No cloud health record is connected. Hospital rows were refreshed from the fictional demo dataset.`,
            `ಸ್ಥಳೀಯ ಸಿಂಕ್ ಮುಗಿದಿದೆ. ${count} ಸರದಿ ಬದಲಾವಣೆಗಳು ಈ ಸಾಧನದಲ್ಲಿ ತೆರವಾಗಿವೆ. ಮೋಡದ ಆರೋಗ್ಯ ದಾಖಲೆ ಇಲ್ಲ. ಆಸ್ಪತ್ರೆ ಸಾಲುಗಳು ಕಾಲ್ಪನಿಕ ಮಾದರಿ ಡೇಟಾದಿಂದ ನವೀಕರಿಸಲ್ಪಟ್ಟಿವೆ.`,
          ),
        }
      },
      clearHealthData: async () => {
        const next = persistentRef.current ? await resetSnapshot() : memorySnapshot()
        setSnapshot(next)
        notify(phrase('Sample profile restored on this device.', 'ಮಾದರಿ ಪ್ರೊಫೈಲ್ ಈ ಸಾಧನದಲ್ಲಿ ಮರಳಿಸಲಾಗಿದೆ.'))
      },
    }
  }, [browserOnline, notices, persistent, snapshot])

  return <HealthContext.Provider value={api}>{children}</HealthContext.Provider>
}

export function useHealth() {
  const value = useContext(HealthContext)
  if (!value) throw new Error('useHealth must be used inside HealthProvider')
  return value
}
