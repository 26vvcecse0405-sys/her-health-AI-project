import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, Pill } from 'lucide-react'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'
import { reminderCopy } from '../i18n/reminders'
import { formatWhen } from '../lib/format'
import { countdownTarget, formatCountdown, inQuietHours, loadPrefs, loadReads, saveReads, todaysOccurrences, type DoseOccurrence } from '../services/doseSchedule'

function alertKey(row: DoseOccurrence, logs: { id: string; occurrenceId?: string }[]) {
  const latest = logs.find((log) => log.occurrenceId === row.occurrenceId)
  return `${row.occurrenceId}:${latest?.id ?? 'open'}`
}

function seen(key: string) {
  return sessionStorage.getItem(`sakhi-dose-seen:${key}`) === '1'
}

function markSeen(key: string) {
  sessionStorage.setItem(`sakhi-dose-seen:${key}`, '1')
}

function chime() {
  const Context = window.AudioContext || window.webkitAudioContext
  if (!Context) return
  const audio = new Context()
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.frequency.value = 523
  gain.gain.value = 0.04
  osc.connect(gain)
  gain.connect(audio.destination)
  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.35)
  osc.stop(audio.currentTime + 0.36)
  window.setTimeout(() => void audio.close(), 500)
}

export function DoseCompanion() {
  const { snapshot, logDose } = useHealth()
  const [now, setNow] = useState(() => new Date())
  const [open, setOpen] = useState(false)
  const [forcedId, setForcedId] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [support, setSupport] = useState(false)
  const [reads, setReads] = useState<string[]>(() => loadReads())
  const [prefs, setPrefs] = useState(() => loadPrefs())
  const fired = useRef(new Set<string>())
  const lang = snapshot?.profile.language ?? 'en'

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    const onPrefs = () => setPrefs(loadPrefs())
    const onDemo = () => {
      const current = snapshot
      if (!current) return
      const next = todaysOccurrences(current.doses, current.doseLogs, new Date())
      const row = next.find((item) => item.state === 'due')
        ?? next.find((item) => item.state === 'snoozed' || item.state === 'upcoming' || item.state === 'missed' || item.state === 'skipped')
        ?? next[0]
      if (row) setForcedId(row.occurrenceId)
    }
    window.addEventListener('sakhi-reminder-prefs', onPrefs)
    window.addEventListener('sakhi-demo-reminder', onDemo)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('sakhi-reminder-prefs', onPrefs)
      window.removeEventListener('sakhi-demo-reminder', onDemo)
    }
  }, [snapshot])

  const rows = useMemo(
    () => (snapshot ? todaysOccurrences(snapshot.doses, snapshot.doseLogs, now) : []),
    [snapshot, now],
  )
  const due = rows.find((row) => row.state === 'due') ?? null
  const quiet = inQuietHours(now, prefs.quietStart, prefs.quietEnd)
  const automatic = !quiet && due && !seen(alertKey(due, snapshot?.doseLogs ?? [])) ? due : null
  const active = (forcedId ? rows.find((row) => row.occurrenceId === forcedId) : null) ?? automatic
  const follow = due && seen(alertKey(due, snapshot?.doseLogs ?? [])) && !seen(`follow:${alertKey(due, snapshot?.doseLogs ?? [])}`)
    && now.getTime() - due.at.getTime() > prefs.followUpMinutes * 60_000
    ? due
    : null

  useEffect(() => {
    if (!automatic || !snapshot) return
    const key = alertKey(automatic, snapshot.doseLogs)
    if (fired.current.has(key)) return
    fired.current.add(key)
    try {
      if (prefs.sound) chime()
      if ('Notification' in window && Notification.permission === 'granted') {
        const body = prefs.systemDetails
          ? `${automatic.plan.name}. ${automatic.plan.time}. ${automatic.plan.notes || t(lang, reminderCopy.noInstructions)}`
          : t(lang, reminderCopy.genericPush)
        new Notification('SAKHI', { body })
      }
    } catch {
      /* In-app alert remains the fallback when the browser blocks sound or a system notification. */
    }
  }, [automatic, lang, prefs.sound, prefs.systemDetails, snapshot])

  if (!snapshot) return null
  const logs = snapshot.doseLogs

  const events = [
    ...rows.filter((row) => row.state === 'due').map((row) => ({ id: row.occurrenceId, name: row.plan.name, status: 'due' as const, at: row.at.toISOString() })),
    ...logs.slice(0, 12).map((log) => ({ id: log.id, name: log.name, status: log.status, at: log.createdAt })),
  ]
  const unread = events.filter((event) => !reads.includes(event.id)).length

  async function respond(row: DoseOccurrence, status: 'taken' | 'missed' | 'snoozed', minutes = 10) {
    const saved = await logDose({
      planId: row.plan.id,
      name: row.plan.name,
      status,
      note: row.plan.notes,
      occurrenceId: row.occurrenceId,
      snoozeUntil: status === 'snoozed' ? new Date(Date.now() + minutes * 60_000).toISOString() : undefined,
    })
    markSeen(alertKey(row, logs))
    setForcedId(null)
    if (!saved) return
    if (status === 'taken') setSuccess(true)
    if (status === 'missed') setSupport(true)
  }

  function markAllRead() {
    const next = [...new Set([...reads, ...events.map((event) => event.id)])]
    setReads(next)
    saveReads(next)
  }

  const countdown = active && countdownTarget(active).getTime() > now.getTime()
    ? formatCountdown(countdownTarget(active).getTime() - now.getTime())
    : active ? t(lang, active.state === 'taken' ? reminderCopy.taken : reminderCopy.due) : ''

  return (
    <>
      <div className="reminder-bell">
        <button type="button" className="btn ghost bell-btn" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((value) => !value)}>
          <Bell size={18} aria-hidden="true" />
          <span className="sr-only">{t(lang, reminderCopy.centre)}</span>
          {unread > 0 ? <span className="bell-count">{unread > 9 ? '9+' : unread}</span> : null}
        </button>
        {open ? (
          <div className="bell-panel" role="dialog" aria-label={t(lang, reminderCopy.centre)}>
            <div className="flex items-center justify-between gap-2">
              <strong>{t(lang, reminderCopy.centre)}</strong>
              <button type="button" className="btn quiet" onClick={markAllRead}>{t(lang, reminderCopy.markRead)}</button>
            </div>
            {events.length === 0 ? <p className="mt-2 text-sm text-muted">{t(lang, reminderCopy.emptyAlert)}</p> : events.map((event) => (
              <p key={event.id} className="bell-row">
                <span className={`status-dot status-${event.status}`} />
                <span>
                  <strong className="block">{event.name}</strong>
                  <span className="text-sm text-muted">{t(lang, event.status === 'due' ? reminderCopy.due : event.status === 'taken' ? reminderCopy.taken : event.status === 'snoozed' ? reminderCopy.snoozed : event.status === 'skipped' ? reminderCopy.missed : reminderCopy.missed)} · {formatWhen(event.at, lang)}</span>
                </span>
              </p>
            ))}
          </div>
        ) : null}
      </div>
      {follow ? (
        <div className="dose-follow" role="status">
          <p>{t(lang, reminderCopy.follow)} {follow.plan.name}</p>
          <button type="button" className="btn ghost" onClick={() => { markSeen(`follow:${alertKey(follow, logs)}`); setForcedId(follow.occurrenceId) }}>{t(lang, reminderCopy.due)}</button>
        </div>
      ) : null}
      {active ? (
        <div className="dose-alert-back">
          <div className="dose-alert" role="dialog" aria-modal="true" aria-labelledby="dose-alert-title">
            <p className="dose-kicker"><Pill size={18} aria-hidden="true" /> {t(lang, reminderCopy.alertTitle)}</p>
            <h2 id="dose-alert-title">{active.plan.name}</h2>
            <p className="mt-1">{t(lang, reminderCopy.alertBody)} · {active.plan.time}</p>
            <p className="mt-2 text-sm">{active.plan.notes || t(lang, reminderCopy.noInstructions)}</p>
            <p className="mt-2 text-sm text-muted">{t(lang, reminderCopy.care)} {countdown}</p>
            {active.state === 'taken' ? (
              <div className="mt-4">
                <p>{t(lang, reminderCopy.already)}</p>
                <button type="button" className="btn ghost mt-3" onClick={() => setForcedId(null)}>{t(lang, reminderCopy.dismiss)}</button>
              </div>
            ) : (
              <>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="btn primary" onClick={() => void respond(active, 'taken')}>{t(lang, reminderCopy.taken)}</button>
                  <button type="button" className="btn ghost" onClick={() => void respond(active, 'missed')}>{t(lang, reminderCopy.missed)}</button>
                  <button type="button" className="btn ghost" onClick={() => { markSeen(alertKey(active, logs)); setForcedId(null) }}>{t(lang, reminderCopy.dismiss)}</button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2" aria-label={t(lang, reminderCopy.later)}>
                  {[5, 10, 15].map((minutes) => (
                    <button key={minutes} type="button" className="chip" onClick={() => void respond(active, 'snoozed', minutes)}>{t(lang, reminderCopy.later)} · {minutes} {t(lang, reminderCopy.minutes)}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
      {success ? (
        <div className="dose-alert-back">
          <div className="dose-success" role="status">
            <p className="text-2xl" aria-hidden="true">🌸</p>
            <h2>{t(lang, reminderCopy.successTitle)}</h2>
            <p className="mt-2">{t(lang, reminderCopy.successBody)}</p>
            <button type="button" className="btn primary mt-4" onClick={() => setSuccess(false)}>{t(lang, reminderCopy.dismiss)}</button>
          </div>
        </div>
      ) : null}
      {support ? (
        <div className="dose-alert-back">
          <div className="dose-success" role="status">
            <h2>{t(lang, reminderCopy.missed)}</h2>
            <p className="mt-2">{t(lang, reminderCopy.missSupport)}</p>
            <button type="button" className="btn ghost mt-4" onClick={() => setSupport(false)}>{t(lang, reminderCopy.dismiss)}</button>
          </div>
        </div>
      ) : null}
    </>
  )
}
