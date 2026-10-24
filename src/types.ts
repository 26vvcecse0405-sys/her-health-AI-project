export type Lang = 'en' | 'kn' | 'hi' | 'gu' | 'mr' | 'ta' | 'te' | 'bn' | 'ml' | 'pa' | 'or' | 'ur'

/** English is required. Any other language may be omitted and then falls back to English. */
export type Copy = { en: string } & Partial<Record<Exclude<Lang, 'en'>, string>>

export type LifeStage =
  | 'unspecified'
  | 'adolescence'
  | 'reproductive'
  | 'pregnancy'
  | 'postpartum'
  | 'perimenopause'
  | 'menopause'

export type OriginId = 'malenahalli' | 'nelamangala' | 'junction'

export type TrafficLevel = 'light' | 'moderate' | 'heavy'

export type ModuleId = 'mama' | 'iron' | 'endo' | 'meno' | 'skin' | 'wellness' | 'nutrition' | 'general'

export type Profile = {
  kind: 'profile'
  id: 'profile'
  displayName: string
  language: Lang
  /** True only after the person picks a language. Absent or false keeps English. */
  languageChosen?: boolean
  lifeStage: LifeStage
  interests: string[]
  locationId: OriginId
  locationEnabled: boolean
  onlineModelConsent: boolean
  sample: true
}

export type Meta = {
  kind: 'meta'
  id: 'meta'
  lastSync: string | null
  hospitalsCachedAt: string | null
  educationCachedAt: string | null
  simulatedOffline: boolean
}

export type SymptomEntry = {
  kind: 'symptom'
  id: string
  module: ModuleId
  createdAt: string
  severity: number
  symptoms: string[]
  notes: string
  sample: boolean
  stage?: string
  bodyArea?: string
  duration?: string
  impact?: string
  bleeding?: string
  cycleDay?: number
  mood?: string
  sleepHours?: number
  hotFlashes?: number
  dietNotes?: string
}

export type LabEntry = {
  kind: 'lab'
  id: string
  createdAt: string
  name: string
  value: number
  unit: string
  reference: string
  context: string
  sample: boolean
  source: 'user' | 'report' | 'sample'
}

export type ReportFlag = 'inside' | 'outside' | 'unclear'

export type ReportField = {
  id: string
  label: string
  value: string
  unit: string
  reference: string
  flag: ReportFlag
  note: string
}

export type ReportRecord = {
  kind: 'report'
  id: string
  createdAt: string
  title: string
  docKind: 'report' | 'bill'
  source: 'demo-text' | 'ocr' | 'manual'
  rawText: string
  fields: ReportField[]
  sample: boolean
  bill?: BillReview
}

export type BillLine = {
  id: string
  description: string
  amount: number
  note: string
}

export type BillReview = {
  lines: BillLine[]
  computedTotal: number
  printedTotal: number | null
  flags: Copy[]
}

export type MedicineRow = {
  id: string
  source: 'prescription' | 'package'
  name: string
  form: string
  strength: string
  raw: string
}

export type MedicineFlag = {
  level: 'match' | 'mismatch' | 'missing' | 'extra'
  text: Copy
}

export type MedicineCheck = {
  kind: 'medicine'
  id: string
  createdAt: string
  rows: MedicineRow[]
  flags: MedicineFlag[]
  pharmacistConfirmed: boolean
  source: 'demo-text' | 'ocr' | 'manual'
  sample: boolean
}

export type DosePeriod = 'morning' | 'afternoon' | 'evening' | 'night'

export type DosePlan = {
  kind: 'dose'
  id: string
  name: string
  time: string
  period: DosePeriod
  notes: string
  repeat: 'daily' | 'weekly'
  /** Weekdays for a weekly plan, 0 = Sunday. Daily plans ignore this. */
  weekdays?: number[]
  createdAt: string
  sample: boolean
}

export type DoseLog = {
  kind: 'dose-log'
  id: string
  planId: string
  name: string
  status: 'taken' | 'missed' | 'skipped' | 'snoozed'
  note: string
  createdAt: string
  sample: boolean
  /** One calendar occurrence, for example `dose-folic:2026-10-24`. */
  occurrenceId?: string
  snoozeUntil?: string
}

export type Reminder = {
  kind: 'reminder'
  id: string
  title: Copy
  due: string
  href: string
  done: boolean
}

export type OutboxItem = {
  kind: 'outbox'
  id: string
  refKind: 'symptom' | 'lab' | 'report' | 'medicine'
  refId: string
  label: string
  createdAt: string
  status: 'pending' | 'synced'
}

export type Article = {
  kind: 'article'
  id: string
  title: Copy
  body: Copy
  source: string
  reviewed: string
  href: string
}

export type CostBand = 'lower' | 'moderate' | 'higher'

export type RouteDef = {
  id: string
  label: string
  km: number
  baseMin: number
  sensitivity: number
}

export type Doctor = {
  name: string
  specialty: string
  onDuty: boolean | null
}

export type Hospital = {
  kind: 'hospital'
  id: string
  name: string
  area: string
  phone: string
  specialties: string[]
  services: string[]
  bedsAvailable: number | null
  bedsTotal: number | null
  doctors: Doctor[] | null
  costBand: CostBand | null
  accessibility: string[]
  updatedAt: string
  fictional: true
  map: { x: number; y: number }
  routes: Record<OriginId, RouteDef[]>
  cachedAt?: string
}

export type AnyRecord =
  | Profile
  | Meta
  | SymptomEntry
  | LabEntry
  | ReportRecord
  | MedicineCheck
  | Reminder
  | DosePlan
  | DoseLog
  | OutboxItem
  | Article
  | Hospital

export type CareNeed = 'any' | 'general' | 'pregnancy' | 'anemia' | 'gynecology' | 'mental' | 'emergency'

export type Concern = {
  specialty: string | null
  service: string | null
  urgent: boolean
}

export type AnswerSource = 'urgent-rule' | 'curated' | 'local-model' | 'online-model' | 'fallback'

export type AssistantAnswer = {
  text: string
  source: AnswerSource
  detail: Copy
  links: { href: string; label: Copy }[]
  topicId?: string
}
