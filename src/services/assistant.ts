import { matchFaq, suggestLinks } from '../data/faqs'
import { GUIDES, continueGuide, isBleedingEmergency, matchGuide, renderGuide } from '../data/guides'
import { t } from '../i18n'
import { emptyQuestion, fallbackAnswer } from '../i18n/sakhi'
import { asksForDiagnosis, asksForDose, diagnosisAnswer, doseAnswer, replyLooksUnsafe, textLooksUrgent, urgentAnswer } from './triage'
import type { AssistantAnswer, Lang } from '../types'

export type AnswerHistory = { role: 'user' | 'sakhi'; text: string; topicId?: string }

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

const savedDetail = {
  en: 'Saved educational guidance on this device. A live AI model was not called.',
  kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಶೈಕ್ಷಣಿಕ ಮಾರ್ಗದರ್ಶನ. ನೇರ AI ಮಾದರಿಗೆ ಕರೆ ಮಾಡಿಲ್ಲ.',
}

function guideAnswer(topic: { id: string; href: string; link: { en: string; kn?: string }; text: string }, message: string): AssistantAnswer {
  const links = [{ href: topic.href, label: topic.link }, ...suggestLinks(message)]
    .filter((link, index, all) => all.findIndex((item) => item.href === link.href) === index)
  return {
    source: 'curated',
    text: topic.text,
    topicId: topic.id,
    detail: savedDetail,
    links: links.slice(0, 3),
  }
}

export async function answerQuestion(input: { message: string; lang: Lang; consent: boolean; offline: boolean; history?: AnswerHistory[] }): Promise<AssistantAnswer> {
  const message = input.message.trim()
  if (!message) {
    return {
      source: 'curated',
      text: t(input.lang, emptyQuestion),
      detail: { en: 'Nothing was sent.', kn: 'ಏನನ್ನೂ ಕಳುಹಿಸಿಲ್ಲ.' },
      links: [],
    }
  }
  if (asksForDose(message)) return doseAnswer(input.lang)
  if (isBleedingEmergency(message)) {
    const urgentBleed = matchGuide(message)
    if (urgentBleed) return guideAnswer({ ...urgentBleed, text: renderGuide(urgentBleed) }, message)
  }
  if (textLooksUrgent(message)) return urgentAnswer(input.lang)

  const guide = matchGuide(message)
  if (guide) return guideAnswer({ ...guide, text: renderGuide(guide) }, message)
  if (asksForDiagnosis(message)) return diagnosisAnswer(input.lang)

  const faq = matchFaq(message)
  const links = (faq ? [{ href: faq.href, label: faq.link }, ...suggestLinks(message)] : suggestLinks(message))
    .filter((link, index, all) => all.findIndex((item) => item.href === link.href) === index)
  if (faq) {
    return {
      source: 'curated',
      text: t(input.lang, faq.body),
      detail: savedDetail,
      links: links.slice(0, 3),
    }
  }

  const previous = [...(input.history ?? [])].reverse().find((turn) => turn.role === 'sakhi' && turn.topicId)
  const followUp = /\b(recent(?:ly)?|always|ago|weeks?|days?|months?|yesterday|started|yes|no|sometimes|regular|pregnant|first time|since|never|used to|not really)\b/i
  const looksLikeFollowUp = message.length < 240 && (followUp.test(message) || (message.length < 48 && !message.includes('?')))
  if (previous?.topicId && looksLikeFollowUp) {
    const topic = GUIDES.find((item) => item.id === previous.topicId)
    const continued = topic ? continueGuide(topic.id, message) : null
    if (topic && continued) return guideAnswer({ ...topic, text: continued }, message)
  }

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
      en: 'This question is outside the saved notes. A live AI model was not called.',
      kn: 'ಈ ಪ್ರಶ್ನೆ ಉಳಿಸಿದ ಟಿಪ್ಪಣಿಗಳ ಹೊರಗಿದೆ. ನೇರ AI ಮಾದರಿಗೆ ಕರೆ ಮಾಡಿಲ್ಲ.',
    },
    links: [
      { href: '/health', label: { en: 'Browse women’s health topics', kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯ ವಿಷಯಗಳನ್ನು ನೋಡಿ' } },
      ...links,
    ].slice(0, 3),
  }
}
