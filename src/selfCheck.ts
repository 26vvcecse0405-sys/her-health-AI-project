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

console.log('HerHealth self-check passed.')
