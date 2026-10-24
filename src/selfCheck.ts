import { answerQuestion } from './services/assistant'
import { inQuietHours, localDateKey, occurrenceId, occurrenceState, todaysOccurrences } from './services/doseSchedule'
import type { DoseLog, DosePlan } from './types'
import { SAMPLE_BILL, SAMPLE_PACKAGE, SAMPLE_PRESCRIPTION, SAMPLE_REPORT, compareMedicines, extractMedicines, parseReport, reviewBill } from './services/documents'
import { buildPassport } from './services/passport'
import { concernFor, rankHospitals, routeEta } from './services/rank'
import { matchFaq } from './data/faqs'
import { asksForDose, replyLooksUnsafe, textLooksUrgent } from './services/triage'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const heavyVillage = rankHospitals('malenahalli', 'heavy', concernFor('pregnancy', false))
assert(heavyVillage[0]?.hospital.id === 'greenfield', `pregnancy from the village should feature Greenfield, got ${heavyVillage.map((row) => row.hospital.id).join(', ')}`)
assert(heavyVillage[0]?.chosenRoute.id === 'highway', 'heavy traffic should pick the longer highway')
assert(heavyVillage[0]!.chosenRoute.km > heavyVillage[0]!.routes.find((route) => route.id === 'town')!.km, 'highway is the longer route')
assert(heavyVillage.find((row) => row.hospital.id === 'phc')!.clinicalTier > heavyVillage[0]!.clinicalTier, 'the PHC lacks obstetrics and ranks in a lower clinical tier')

const lightVillage = rankHospitals('malenahalli', 'light', concernFor('pregnancy', false))
assert(lightVillage.find((row) => row.hospital.id === 'greenfield')?.chosenRoute.id === 'town', 'light traffic should keep the shorter town road')

const town = rankHospitals('nelamangala', 'moderate', concernFor('gynecology', false))
assert(town[0]?.hospital.id === 'taluk', `from Nelamangala the taluk hospital should lead, got ${town.map((row) => row.hospital.id).join(', ')}`)

const urgent = rankHospitals('malenahalli', 'moderate', concernFor('emergency', true))
assert(urgent[0]?.hospital.services.includes('Emergency') === true, 'urgent care should not lead with a clinic that has no emergency service')
assert(urgent.find((row) => row.hospital.id === 'phc')!.clinicalTier > 0, 'PHC is not an emergency service in this dataset')

const general = rankHospitals('malenahalli', 'moderate', concernFor('general', false))
assert(general[0]?.hospital.id === 'phc', `general care should not skip the nearer suitable PHC, got ${general[0]?.hospital.id}`)

const cauvery = heavyVillage.find((row) => row.hospital.id === 'cauvery')!
assert(cauvery.factorsMissing.includes('beds') && cauvery.factorsMissing.includes('doctor'), 'missing beds and doctors stay missing')
assert(!cauvery.factorsUsed.includes('beds') && !cauvery.factorsUsed.includes('doctor'), 'missing data must not earn points')

const bill = reviewBill(SAMPLE_BILL)
assert(bill.computedTotal === 5900, `bill total ${bill.computedTotal}`)
assert(bill.printedTotal === 6400, 'printed total')
assert(bill.flags.some((flag) => flag.en.includes('duplicate')), 'duplicate flag')
assert(bill.flags.some((flag) => flag.en.includes('difference')), 'arithmetic flag')

const flags = compareMedicines(extractMedicines(SAMPLE_PRESCRIPTION, 'prescription'), extractMedicines(SAMPLE_PACKAGE, 'package'))
assert(flags.some((flag) => flag.level === 'mismatch' && flag.text.en.includes('500') && flag.text.en.includes('650')), 'strength mismatch')
assert(flags.some((flag) => flag.level === 'missing' && flag.text.en.includes('Omeprazole')), 'missing medicine')
assert(!flags.some((flag) => /genuine/i.test(flag.text.en)), 'no genuine claim')

const fields = parseReport(SAMPLE_REPORT)
assert(fields.find((field) => field.label === 'Hemoglobin')?.flag === 'outside', 'hemoglobin outside printed range')
assert(fields.find((field) => field.label === 'WBC')?.flag === 'inside', 'wbc inside printed range')
assert(!fields.some((field) => /you have anemia/i.test(field.note)), 'no anemia diagnosis')

assert(textLooksUrgent('I cannot breathe'), 'urgent text')
assert(!textLooksUrgent('what should I carry to a visit'), 'ordinary question')
assert(asksForDose('how many iron tablets should I take'), 'dose ask')
assert(asksForDose('Ask for a dose (refused)'), 'dose chip label')
assert(matchFaq('Help me understand women’s health.')?.id === 'womens-health', 'women’s health prompt')
assert(matchFaq('Help me prepare for a health appointment.')?.id === 'appointment', 'appointment prompt')
assert(matchFaq('Find a hospital with the service I need.')?.id === 'find-hospital', 'hospital prompt')
assert(matchFaq('What is a primary health centre?')?.id === 'phc', 'phc prompt')
assert(matchFaq('When is pelvic health screening required?')?.id === 'pelvic-screening', 'pelvic prompt')
assert(matchFaq('When is period bleeding urgent?')?.id === 'period', 'period prompt')
assert(matchFaq('What should I carry to a visit?')?.id === 'bag', 'visit bag prompt')
assert(replyLooksUnsafe('You have anemia. Take 100 mg now.'), 'unsafe model text')
assert(!replyLooksUnsafe('Tiredness has many causes. Ask a clinician.'), 'safe education')

const passport = buildPassport({
  lang: 'en',
  displayName: 'Meera H.',
  symptoms: [
    { kind: 'symptom', id: 'a', module: 'mama', createdAt: '2026-10-01T00:00:00.000Z', severity: 3, symptoms: ['nausea'], notes: 'sample note', sample: true },
    { kind: 'symptom', id: 'b', module: 'iron', createdAt: '2026-10-02T00:00:00.000Z', severity: 4, symptoms: ['fatigue'], notes: 'kept', sample: false },
  ],
  labs: [],
  reports: [],
  medicines: [],
  questions: 'What does this timeline mean for me?',
  includeSamples: false,
})
assert(passport.includes('kept') && !passport.includes('sample note'), 'passport respects the sample switch')
assert(routeEta({ id: 'x', label: 'x', km: 1, baseMin: 10, sensitivity: 0 }, 'heavy') === 10, 'zero sensitivity ignores traffic')

const banned = /No saved answer matched|health topics saved on this device|I cannot diagnose or prescribe|Nothing was invented as medical advice/i
const symptomQuestions = [
  ['I have irregular periods. What should I do?', /Understanding your concern/, /PCOS|thyroid/i, /When did your last period/],
  ['I have severe period cramps. What can help?', /cramp/i, /ibuprofen|paracetamol/i, /warm/i],
  ['What are the symptoms of PCOS?', /PCOS/, /acne|hair growth/i, /you have PCOS/i],
  ['I have unusual vaginal discharge. What could be the reason?', /discharge/i, /thrush|bacterial/i],
  ['What can I do if I think I have anemia?', /blood count|hemoglobin/i, /iron/i],
  ['What should I know before taking medicine for period pain?', /pharmacist/i, /ibuprofen/i],
  ['I am bleeding heavily and feeling faint.', /urgent care now/i, /112/],
] as const

const symptomAnswers: string[] = []
for (const [question, ...patterns] of symptomQuestions) {
  const answer = await answerQuestion({ message: question, lang: 'en', consent: false, offline: true })
  symptomAnswers.push(answer.text)
  assert(!banned.test(answer.text), `banned phrase in ${question}`)
  assert(!replyLooksUnsafe(answer.text), `unsafe reply for ${question}`)
  assert(!/\b\d+\s*mg\b/i.test(answer.text), `dose number in ${question}`)
  for (const pattern of patterns) {
    const negative = pattern.source.startsWith('you have PCOS')
    assert(negative ? !pattern.test(answer.text) : pattern.test(answer.text), `${question} :: ${pattern}`)
  }
}
assert(new Set(symptomAnswers).size === symptomQuestions.length, 'symptom answers must differ')
assert(!/urgent care now/i.test(symptomAnswers[0]), 'irregular periods should not open as an emergency')
const follow = await answerQuestion({
  message: 'They used to be regular and this started recently.',
  lang: 'en',
  consent: false,
  offline: true,
  history: [{ role: 'sakhi', text: symptomAnswers[0], topicId: 'irregular-periods' }],
})
assert(/new for you/i.test(follow.text), 'irregular follow-up')
assert(!banned.test(follow.text), 'follow-up keeps a useful reply')

const plan: DosePlan = {
  kind: 'dose',
  id: 'dose-check',
  name: 'Sample tablet',
  time: '08:00',
  period: 'morning',
  notes: 'With food',
  repeat: 'daily',
  createdAt: '2026-10-24T00:00:00.000Z',
  sample: true,
}
const morning = new Date(2026, 9, 24, 7, 30, 0)
const later = new Date(2026, 9, 24, 9, 0, 0)
const dayKey = localDateKey(later)
assert(dayKey === '2026-10-24', `local date key ${dayKey}`)
assert(occurrenceId(plan.id, dayKey) === 'dose-check:2026-10-24', 'stable occurrence id')
assert(occurrenceState(plan, [], morning)?.state === 'upcoming', 'before the clock the dose is upcoming')
assert(occurrenceState(plan, [], later)?.state === 'due', 'after the clock the dose is due')
const takenLog: DoseLog = { kind: 'dose-log', id: 'log-1', planId: plan.id, name: plan.name, status: 'taken', note: '', occurrenceId: occurrenceId(plan.id, dayKey), createdAt: later.toISOString(), sample: false }
assert(occurrenceState(plan, [takenLog], later)?.state === 'taken', 'a confirmation is the only taken state')
assert(occurrenceState(plan, [takenLog, { ...takenLog, id: 'log-2' }], later)?.state === 'taken', 'a second taken log does not create another occurrence')
const snoozeUntil = new Date(2026, 9, 24, 9, 10, 0).toISOString()
const snoozed: DoseLog = { ...takenLog, id: 'log-s', status: 'snoozed', snoozeUntil }
assert(occurrenceState(plan, [snoozed], later)?.state === 'snoozed', 'a future snooze is not due')
assert(occurrenceState(plan, [snoozed], new Date(2026, 9, 24, 9, 11, 0))?.state === 'due', 'an expired snooze becomes due again')
const weekly: DosePlan = { ...plan, id: 'dose-week', repeat: 'weekly', weekdays: [1] }
assert(occurrenceState(weekly, [], later) === null, 'weekly plan stays off other weekdays')
assert(todaysOccurrences([weekly], [], new Date(2026, 9, 26, 12, 0, 0)).length === 1, 'weekly plan runs on its weekday')
assert(inQuietHours(new Date(2026, 9, 24, 23, 30), '22:00', '07:00') === true, 'quiet hours can cross midnight')
assert(inQuietHours(new Date(2026, 9, 24, 12, 0), '', '') === false, 'empty quiet hours stay off')

console.log('HerHealth self-check passed.')
