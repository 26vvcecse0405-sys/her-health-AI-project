import { matchFaq, suggestLinks } from '../data/faqs'
import { t } from '../i18n'
import { emptyQuestion, fallbackAnswer } from '../i18n/sakhi'
import { asksForDiagnosis, asksForDose, diagnosisAnswer, doseAnswer, replyLooksUnsafe, textLooksUrgent, urgentAnswer } from './triage'
import type { AssistantAnswer, Lang } from '../types'

export type ModelStatus = {
  reachable: boolean
  openai: boolean
  local: boolean
}

export async function modelStatus(): Promise<ModelStatus> {
  try {
    const response = await fetch('/api/health', { signal: AbortSignal.timeout(2500) })
    if (!response.ok) return { reachable: false, openai: false, local: false }
    const body = (await response.json()) as { openai?: boolean; local?: boolean }
    return { reachable: true, openai: Boolean(body.openai), local: Boolean(body.local) }
  } catch {
    return { reachable: false, openai: false, local: false }
  }
}

export async function answerQuestion(input: { message: string; lang: Lang; consent: boolean; offline: boolean }): Promise<AssistantAnswer> {
  const message = input.message.trim()
  if (!message) {
    return {
      source: 'curated',
      text: t(input.lang, emptyQuestion),
      detail: { en: 'Nothing was sent.', kn: 'ಏನನ್ನೂ ಕಳುಹಿಸಿಲ್ಲ.' },
      links: [],
    }
  }
  if (textLooksUrgent(message)) return urgentAnswer(input.lang)
  if (asksForDose(message)) return doseAnswer(input.lang)
  if (asksForDiagnosis(message)) return diagnosisAnswer(input.lang)

  const faq = matchFaq(message)
  const links = (faq ? [{ href: faq.href, label: faq.link }, ...suggestLinks(message)] : suggestLinks(message))
    .filter((link, index, all) => all.findIndex((item) => item.href === link.href) === index)
  const curated = faq
    ? {
        source: 'curated' as const,
        text: t(input.lang, faq.body),
        detail: input.offline
          ? { en: 'Curated answer stored on this device. No model was contacted.', kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಸಿದ್ಧ ಉತ್ತರ. ಯಾವ ಮಾದರಿಯನ್ನೂ ಸಂಪರ್ಕಿಸಿಲ್ಲ.' }
          : input.consent
            ? { en: 'Curated answer. A configured model was not used for this reply.', kn: 'ಸಿದ್ಧ ಉತ್ತರ. ಈ ಉತ್ತರಕ್ಕೆ ಮಾದರಿಯನ್ನು ಬಳಸಿಲ್ಲ.' }
            : { en: 'Curated answer. Online models stay off until you allow them in Privacy.', kn: 'ಸಿದ್ಧ ಉತ್ತರ. ಗೌಪ್ಯತೆಯಲ್ಲಿ ಅನುಮತಿಸುವವರೆಗೆ ಆನ್‌ಲೈನ್ ಮಾದರಿಗಳು ಆಫ್ ಆಗಿರುತ್ತವೆ.' },
        links: links.slice(0, 3),
      }
    : null
  if (curated) return curated

  if (!input.offline && input.consent) {
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language: input.lang, consent: true }),
        signal: AbortSignal.timeout(12000),
      })
      const body = (await response.json()) as { source?: string; reply?: string }
      if (body.reply && !replyLooksUnsafe(body.reply) && (body.source === 'local' || body.source === 'online')) {
        return {
          source: body.source === 'local' ? 'local-model' : 'online-model',
          text: body.reply,
          detail: {
            en: body.source === 'local'
              ? 'Reply from the configured local model. Educational only. It did not examine you.'
              : 'Reply from the configured online model. Your question text was sent because you allowed it. Educational only.',
            kn: body.source === 'local'
              ? 'ಸ್ಥಳೀಯ ಮಾದರಿಯ ಉತ್ತರ. ಶೈಕ್ಷಣಿಕ ಮಾತ್ರ. ಅದು ನಿಮ್ಮನ್ನು ಪರೀಕ್ಷಿಸಿಲ್ಲ.'
              : 'ಆನ್‌ಲೈನ್ ಮಾದರಿಯ ಉತ್ತರ. ನೀವು ಅನುಮತಿ ನೀಡಿದ್ದರಿಂದ ಪ್ರಶ್ನೆಯ ಪಠ್ಯ ಹೋಗಿದೆ. ಶೈಕ್ಷಣಿಕ ಮಾತ್ರ.',
          },
          links: links.slice(0, 3),
        }
      }
    } catch (error) {
      console.error('SAKHI model request failed', error instanceof Error ? error.name : 'Error')
    }
  }

  return {
    source: 'fallback',
    text: t(input.lang, fallbackAnswer),
    detail: {
      en: 'No saved answer matched. Nothing was invented as medical advice.',
      kn: 'ಉಳಿಸಿದ ಉತ್ತರ ಹೊಂದಿಕೆಯಾಗಲಿಲ್ಲ. ವೈದ್ಯಕೀಯ ಸಲಹೆಯನ್ನು ಕಲ್ಪಿಸಿಲ್ಲ.',
    },
    links: [
      { href: '/health', label: { en: 'Browse women’s health topics', kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯ ವಿಷಯಗಳನ್ನು ನೋಡಿ' } },
      ...links,
    ].slice(0, 3),
  }
}
