import type { DoseLog, DosePlan } from '../types'

export type DoseState = 'upcoming' | 'due' | 'taken' | 'snoozed' | 'missed' | 'skipped'

export type DoseOccurrence = {
  plan: DosePlan
  occurrenceId: string
  at: Date
  state: DoseState
  snoozeUntil?: string
  respondedAt?: string
}

export function localDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function occurrenceId(planId: string, day = localDateKey()) {
  return `${planId}:${day}`
}

export function scheduledAt(time: string, day = new Date()) {
  const [hours, minutes] = time.split(':').map((part) => Number(part))
  const next = new Date(day)
  next.setHours(Number.isFinite(hours) ? hours : 0, Number.isFinite(minutes) ? minutes : 0, 0, 0)
  return next
}

export function planRunsOn(plan: DosePlan, day: Date) {
  if (plan.repeat === 'weekly') return (plan.weekdays ?? []).includes(day.getDay())
  return true
}

function latestFor(logs: DoseLog[], id: string) {
  return logs.filter((log) => log.occurrenceId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
}

export function occurrenceState(plan: DosePlan, logs: DoseLog[], now = new Date(), day = now): DoseOccurrence | null {
  if (!planRunsOn(plan, day)) return null
  const id = occurrenceId(plan.id, localDateKey(day))
  const at = scheduledAt(plan.time, day)
  const related = logs.filter((log) => log.occurrenceId === id)
  const taken = related.find((log) => log.status === 'taken')
  if (taken) return { plan, occurrenceId: id, at, state: 'taken', respondedAt: taken.createdAt }
  const latest = latestFor(logs, id)
  if (latest?.status === 'snoozed' && latest.snoozeUntil && new Date(latest.snoozeUntil).getTime() > now.getTime()) {
    return { plan, occurrenceId: id, at, state: 'snoozed', snoozeUntil: latest.snoozeUntil, respondedAt: latest.createdAt }
  }
  if (latest?.status === 'missed') return { plan, occurrenceId: id, at, state: 'missed', respondedAt: latest.createdAt }
  if (latest?.status === 'skipped') return { plan, occurrenceId: id, at, state: 'skipped', respondedAt: latest.createdAt }
  const due = at.getTime() <= now.getTime()
  return { plan, occurrenceId: id, at, state: due ? 'due' : 'upcoming' }
}

export function todaysOccurrences(plans: DosePlan[], logs: DoseLog[], now = new Date()) {
  return plans
    .map((plan) => occurrenceState(plan, logs, now))
    .filter((row): row is DoseOccurrence => Boolean(row))
    .sort((a, b) => a.at.getTime() - b.at.getTime())
}

export function nextOccurrence(rows: DoseOccurrence[]) {
  const waiting = rows.filter((row) => row.state === 'upcoming' || row.state === 'due' || row.state === 'snoozed')
  if (waiting.length === 0) return null
  return [...waiting].sort((a, b) => {
    const aTime = a.state === 'snoozed' && a.snoozeUntil ? new Date(a.snoozeUntil).getTime() : a.at.getTime()
    const bTime = b.state === 'snoozed' && b.snoozeUntil ? new Date(b.snoozeUntil).getTime() : b.at.getTime()
    const aRank = a.state === 'due' ? 0 : 1
    const bRank = b.state === 'due' ? 0 : 1
    return aRank - bRank || aTime - bTime
  })[0] ?? null
}

export function countdownTarget(row: DoseOccurrence) {
  if (row.state === 'snoozed' && row.snoozeUntil) return new Date(row.snoozeUntil)
  return row.at
}

export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const pad = (value: number) => String(value).padStart(2, '0')
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`
}

export function weekBars(plans: DosePlan[], logs: DoseLog[], now = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now)
    day.setHours(12, 0, 0, 0)
    day.setDate(day.getDate() - (6 - index))
    const key = localDateKey(day)
    const end = new Date(day)
    end.setHours(23, 59, 59, 999)
    const scheduled = plans.filter((plan) => planRunsOn(plan, day) && new Date(plan.createdAt).getTime() <= end.getTime()).length
    const taken = new Set(
      logs.filter((log) => log.status === 'taken' && (log.occurrenceId?.endsWith(`:${key}`) || (!log.occurrenceId && localDateKey(new Date(log.createdAt)) === key))).map((log) => log.occurrenceId ?? `${log.planId}:${key}`),
    ).size
    return { key, day, scheduled, taken: Math.min(taken, scheduled || taken) }
  })
}

export function inQuietHours(now: Date, start: string, end: string) {
  if (!start || !end) return false
  const current = now.getHours() * 60 + now.getMinutes()
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const from = sh * 60 + sm
  const to = eh * 60 + em
  if (from === to) return false
  if (from < to) return current >= from && current < to
  return current >= from || current < to
}

export type ReminderPrefs = {
  quietStart: string
  quietEnd: string
  sound: boolean
  systemDetails: boolean
  followUpMinutes: number
}

export const defaultPrefs: ReminderPrefs = {
  quietStart: '',
  quietEnd: '',
  sound: false,
  systemDetails: false,
  followUpMinutes: 15,
}

const PREFS_KEY = 'sakhi-reminder-prefs'
const READ_KEY = 'sakhi-reminder-reads'

export function loadPrefs(): ReminderPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return defaultPrefs
    return { ...defaultPrefs, ...JSON.parse(raw) as Partial<ReminderPrefs> }
  } catch {
    return defaultPrefs
  }
}

export function savePrefs(prefs: ReminderPrefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
}

export function loadReads(): string[] {
  try {
    const raw = localStorage.getItem(READ_KEY)
    return raw ? JSON.parse(raw) as string[] : []
  } catch {
    return []
  }
}

export function saveReads(ids: string[]) {
  localStorage.setItem(READ_KEY, JSON.stringify(ids.slice(0, 200)))
}
