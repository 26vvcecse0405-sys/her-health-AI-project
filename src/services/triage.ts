import { t } from '../i18n'
import { diagnosisText, doseText, emergencyText } from '../i18n/sakhi'
import type { AssistantAnswer, Copy, Lang } from '../types'

export type Level = 'emergency' | 'prompt'

export type SymptomChoice = {
  id: string
  label: Copy
  level?: Level
  notice?: Copy
}

const emergencyBody: Copy = emergencyText

const promptBody: Copy = {
  en: 'Contact a clinician or a nearby health centre today. If you feel suddenly worse, faint, cannot breathe, or have heavy bleeding, use emergency services now instead of waiting.',
  kn: 'ಇಂದು ವೈದ್ಯರನ್ನು ಅಥವಾ ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ. ಇದ್ದಕ್ಕಿದ್ದಂತೆ ಹದಗೆಟ್ಟರೆ, ಮೂರ್ಛೆ, ಉಸಿರಾಟ ಕಷ್ಟ, ಅಥವಾ ತೀವ್ರ ರಕ್ತಸ್ರಾವವಿದ್ದರೆ ಕಾಯದೆ ತುರ್ತು ಸೇವೆಯನ್ನು ಬಳಸಿ.',
}

export function noticeFor(choice: SymptomChoice): Copy {
  return choice.notice ?? (choice.level === 'prompt' ? promptBody : emergencyBody)
}

const URGENT = /heavy bleeding|soaking through|cannot breathe|can't breathe|trouble breathing|chest pain|seizure|fainted|fainting|black stool|not moving|suicidal|kill myself|hurt myself|end my life|ರಕ್ತಸ್ರಾವ|ಉಸಿರಾಟ|ಎದೆ ನೋವು|ಮೂರ್ಛೆ|ಆತ್ಮಹತ್ಯೆ/i

const DOSE = /how (many|much).{0,40}(iron|tablet|supplement|dose)|iron.{0,30}(dose|tablet|mg|supplement)|prescrib(e|ing)|ask for a dose|dose \(refused\)|ಡೋಸ್|ಎಷ್ಟು ಮಾತ್ರೆ|ಕಬ್ಬಿಣದ ಮಾತ್ರೆ|लोह|खुराक|લોખંડ|માત્રા|मात्रा|இரும்பு|அளவு|ఇనుప|మోతాదు|লোহার|ডোজ|ഇരുമ്പ്|ഡോസ്|ਲੋਹੇ|ਖੁਰਾਕ|ଲୌହ|ଡୋଜ୍|لوہے|خوراک/i

const DIAGNOSIS = /do i have|have i got|am i anemic|am i anaemic|is this (anemia|anaemia|endometriosis|cancer)|diagnose me|ನನಗೆ .{0,24}ಇದೆಯೇ|ರೋಗ ನಿರ್ಣಯ/i

export function textLooksUrgent(text: string) {
  return URGENT.test(text)
}

export function asksForDose(text: string) {
  return DOSE.test(text)
}

export function asksForDiagnosis(text: string) {
  return DIAGNOSIS.test(text)
}

export function urgentAnswer(lang: Lang): AssistantAnswer {
  return {
    source: 'urgent-rule',
    text: t(lang, emergencyBody),
    detail: {
      en: 'Shown from a fixed safety rule before any model or extra question.',
      kn: 'ಯಾವುದೇ ಮಾದರಿ ಅಥವಾ ಹೆಚ್ಚುವರಿ ಪ್ರಶ್ನೆಗೆ ಮೊದಲು ನಿಗದಿತ ಸುರಕ್ಷತಾ ನಿಯಮದಿಂದ ತೋರಿಸಲಾಗಿದೆ.',
    },
    links: [{ href: '/hospitals?need=emergency', label: { en: 'See fictional emergency-listed hospitals', kn: 'ತುರ್ತು ಸೇವೆ ನಮೂದಿಸಿದ ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆಗಳನ್ನು ನೋಡಿ' } }],
  }
}

export function doseAnswer(lang: Lang): AssistantAnswer {
  return {
    source: 'curated',
    text: t(lang, doseText),
    detail: {
      en: 'Curated safety reply. A model was not asked.',
      kn: 'ಸಿದ್ಧಪಡಿಸಿದ ಸುರಕ್ಷತಾ ಉತ್ತರ. ಮಾದರಿಯನ್ನು ಕೇಳಿಲ್ಲ.',
    },
    links: [{ href: '/health/iron', label: { en: 'Open IronWise education', kn: 'IronWise ಶಿಕ್ಷಣ ತೆರೆಯಿರಿ' } }],
  }
}

export function diagnosisAnswer(lang: Lang): AssistantAnswer {
  return {
    source: 'curated',
    text: t(lang, diagnosisText),
    detail: {
      en: 'Curated safety reply. A model was not asked.',
      kn: 'ಸಿದ್ಧಪಡಿಸಿದ ಸುರಕ್ಷತಾ ಉತ್ತರ. ಮಾದರಿಯನ್ನು ಕೇಳಿಲ್ಲ.',
    },
    links: [{ href: '/health', label: { en: 'Open the women’s health hub', kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯ ಕೇಂದ್ರ ತೆರೆಯಿರಿ' } }],
  }
}

const UNSAFE_REPLY = /you have (anemia|anaemia|endometriosis|cancer)|i prescribe|take \d+\s*mg|diagnos(is|e):|start iron \d+/i

export function replyLooksUnsafe(text: string) {
  return UNSAFE_REPLY.test(text)
}
