import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mic, Volume2 } from 'lucide-react'
import { SakhiMark } from '../components/SakhiMark'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { FAQS } from '../data/faqs'
import { chrome, t } from '../i18n'
import { sakhiError, sakhiThinking, sakhiWelcome } from '../i18n/sakhi'
import { languageMeta } from '../languages'
import { answerQuestion, modelStatus, type ModelStatus } from '../services/assistant'
import { advanceTiredGuide, startTiredGuide, tiredQuestion, type TiredGuide } from '../services/guide'
import { doseAnswer, textLooksUrgent } from '../services/triage'
import type { AssistantAnswer, Copy } from '../types'

type Turn = { id: string; role: 'user' | 'sakhi'; text: string; answer?: AssistantAnswer }
type AskOptions = { fresh?: boolean; dose?: boolean }

function faqCopy(id: string): Copy {
  const faq = FAQS.find((item) => item.id === id)
  if (!faq) return { en: id }
  return faq.title
}

const DOSE_LABEL: Copy = {
  en: 'Ask for a dose (refused)',
  kn: 'ಡೋಸ್ ಕೇಳಿ (ನಿರಾಕರಣೆ)',
  hi: 'खुराक पूछें (मना)',
  gu: 'માત્રા પૂછો (ના)',
  mr: 'मात्रा विचारा (नाकार)',
  ta: 'அளவு கேளுங்கள் (மறுப்பு)',
  te: 'మోతాదు అడగండి (నిరాకరణ)',
  bn: 'ডোজ জিজ্ঞাসা (প্রত্যাখ্যান)',
  ml: 'ഡോസ് ചോദിക്കുക (നിരസനം)',
  pa: 'ਖੁਰਾਕ ਪੁੱਛੋ (ਇਨਕਾਰ)',
  or: 'ଡୋଜ୍ ପଚାରନ୍ତୁ (ମନା)',
  ur: 'خوراک پوچھیں (انکار)',
}

export function Assistant() {
  const { snapshot, offline, addSymptom } = useHealth()
  const [status, setStatus] = useState<ModelStatus | null>(null)
  const [message, setMessage] = useState('')
  const [turns, setTurns] = useState<Turn[]>([])
  const [busy, setBusy] = useState(false)
  const [voiceNote, setVoiceNote] = useState('')
  const [guide, setGuide] = useState<TiredGuide | null>(null)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [retry, setRetry] = useState<{ text: string; dose?: boolean } | null>(null)
  const turnsRef = useRef<Turn[]>([])
  const busyRef = useRef(false)
  const endRef = useRef<HTMLDivElement>(null)
  const lang = snapshot?.profile.language ?? 'en'
  turnsRef.current = turns

  useEffect(() => {
    let live = true
    void modelStatus().then((next) => { if (live) setStatus(next) })
    return () => { live = false }
  }, [offline])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    endRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
  }, [turns, busy, errorText])

  if (!snapshot) return null
  const consent = snapshot.profile.onlineModelConsent

  function pushTurn(turn: Omit<Turn, 'id'>) {
    const next = [...turnsRef.current, { ...turn, id: `${turn.role}-${Date.now()}-${turnsRef.current.length}` }]
    turnsRef.current = next
    setTurns(next)
  }

  async function ask(text: string, options?: AskOptions) {
    const trimmed = text.trim()
    if (!trimmed || busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setErrorText(null)
    setMessage('')
    const last = turnsRef.current.at(-1)
    if (!(last?.role === 'user' && last.text === trimmed)) pushTurn({ role: 'user', text: trimmed })
    try {
      await new Promise((resolve) => { window.setTimeout(resolve, 450) })
      const activeGuide = options?.fresh || options?.dose ? null : guide
      if (options?.fresh || options?.dose || textLooksUrgent(trimmed)) setGuide(null)
      if (options?.dose) {
        const answer = doseAnswer(lang)
        pushTurn({ role: 'sakhi', text: answer.text, answer })
        setRetry(null)
        return
      }
      if (!textLooksUrgent(trimmed) && activeGuide) {
        const wasReview = activeGuide.step === 'review'
        const next = advanceTiredGuide(activeGuide, trimmed, lang)
        if (wasReview && next.summary) {
          await addSymptom({ module: 'general', symptoms: ['tiredness'], severity: 0, notes: next.summary })
        }
        setGuide(next.guide)
        pushTurn({ role: 'sakhi', text: next.text })
        setRetry(null)
        return
      }
      if (!textLooksUrgent(trimmed)) {
        const started = startTiredGuide(trimmed)
        if (started) {
          setGuide(started)
          pushTurn({ role: 'sakhi', text: tiredQuestion(lang) })
          setRetry(null)
          return
        }
      }
      const answer = await answerQuestion({ message: trimmed, lang, consent, offline })
      pushTurn({ role: 'sakhi', text: answer.text, answer })
      setRetry(null)
    } catch (error) {
      console.error('SAKHI could not finish a reply', error instanceof Error ? error.name : 'Error')
      setRetry({ text: trimmed, dose: options?.dose })
      setErrorText(t(lang, sakhiError))
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  function listen() {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Ctor) {
      setVoiceNote(t(lang, { en: 'This browser has no speech recognition. Type the question instead.', kn: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಇಲ್ಲ. ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ.' }))
      return
    }
    const rec = new Ctor()
    rec.lang = languageMeta(lang).locale
    rec.interimResults = false
    rec.onresult = (event) => setMessage(event.results[0]?.[0]?.transcript ?? '')
    rec.start()
  }

  function speak(text: string) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = languageMeta(lang).locale
    window.speechSynthesis.speak(utterance)
  }

  const sourceLabel = (answer: AssistantAnswer) => {
    const map = {
      'urgent-rule': { en: 'Fixed urgent rule', kn: 'ನಿಗದಿತ ತುರ್ತು ನಿಯಮ' },
      curated: { en: 'Curated on this device', kn: 'ಈ ಸಾಧನದ ಸಿದ್ಧ ಉತ್ತರ' },
      'local-model': { en: 'Local model', kn: 'ಸ್ಥಳೀಯ ಮಾದರಿ' },
      'online-model': { en: 'Online model', kn: 'ಆನ್‌ಲೈನ್ ಮಾದರಿ' },
      fallback: { en: 'Saved fallback', kn: 'ಉಳಿಸಿದ ಪರ್ಯಾಯ' },
    } as const
    return `${t(lang, map[answer.source])}. ${t(lang, answer.detail)}`
  }

  return (
    <div>
      <PageIntro kicker="SAKHI AI" title={t(lang, { en: 'Your health companion', kn: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಚರಿ', hi: 'आपकी स्वास्थ्य साथी', gu: 'તમારી તબિયત સાથી', mr: 'तुमची आरोग्य सोबती', ta: 'உங்கள் உடல்நல துணை', te: 'మీ ఆరోగ్య సహచరి', bn: 'আপনার স্বাস্থ্য সঙ্গী', ml: 'നിങ്ങളുടെ ആരോഗ്യ കൂട്ടുകാരി', pa: 'ਤੁਹਾਡੀ ਸਿਹਤ ਸਾਥਣ', or: 'ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ', ur: 'آپ کی صحت کی ساتھی' })} lede={t(lang, { en: 'SAKHI answers in the language you chose. Urgent wording is answered by a fixed rule before any model. Saved answers work with no API key.', kn: 'ನೀವು ಆಯ್ಕೆಮಾಡಿದ ಭಾಷೆಯಲ್ಲಿ SAKHI ಉತ್ತರಿಸುತ್ತದೆ. ತುರ್ತು ಮಾತುಗಳಿಗೆ ಯಾವುದೇ ಮಾದರಿಗಿಂತ ಮೊದಲು ನಿಗದಿತ ನಿಯಮ ಉತ್ತರಿಸುತ್ತದೆ. API ಕೀ ಇಲ್ಲದೆ ಉಳಿಸಿದ ಉತ್ತರಗಳು ಕೆಲಸ ಮಾಡುತ್ತವೆ.', hi: 'SAKHI आपकी चुनी भाषा में जवाब देती है। आपातकालीन शब्द किसी मॉडल से पहले एक निश्चित नियम से आते हैं। सहेजे जवाब बिना API कुंजी के काम करते हैं।' })} />
      <SafetyNote lang={lang} />
      <p className="mb-4 text-sm text-muted">
        {offline
          ? t(lang, { en: 'Connection for models: paused. Answers come from this device.', kn: 'ಮಾದರಿಗಳ ಸಂಪರ್ಕ: ನಿಲ್ಲಿಸಿದೆ. ಉತ್ತರಗಳು ಈ ಸಾಧನದಿಂದ.' })
          : status
            ? t(lang, { en: `App server ${status.reachable ? 'reachable' : 'not reachable'}. Local model ${status.local ? 'configured' : 'not configured'}. Online model ${status.openai ? 'configured' : 'not configured'}. Consent ${snapshot.profile.onlineModelConsent ? 'on' : 'off'}.`, kn: `ಅಪ್ಲಿಕೇಶನ್ ಸರ್ವರ್ ${status.reachable ? 'ಸಿಗುತ್ತದೆ' : 'ಸಿಗುತ್ತಿಲ್ಲ'}. ಸ್ಥಳೀಯ ಮಾದರಿ ${status.local ? 'ಹೊಂದಿಸಿದೆ' : 'ಹೊಂದಿಸಿಲ್ಲ'}. ಆನ್‌ಲೈನ್ ಮಾದರಿ ${status.openai ? 'ಹೊಂದಿಸಿದೆ' : 'ಹೊಂದಿಸಿಲ್ಲ'}. ಅನುಮತಿ ${snapshot.profile.onlineModelConsent ? 'ಆನ್' : 'ಆಫ್'}.` })
            : t(lang, { en: 'Checking the app server…', kn: 'ಅಪ್ಲಿಕೇಶನ್ ಸರ್ವರ್ ಪರಿಶೀಲಿಸುತ್ತಿದೆ…' })}
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { id: 'tired', dose: false, prompt: { en: 'I have been feeling tired lately.', kn: 'ಇತ್ತೀಚೆಗೆ ನನಗೆ ಆಯಾಸವಾಗುತ್ತಿದೆ.', hi: 'इधर मुझे थकान हो रही है।', gu: 'આજકાલ મને થાક લાગે છે.', mr: 'आता मला थकवा येतो आहे.', ta: 'சமீபத்தில் எனக்கு சோர்வு ஏற்படுகிறது.', te: 'ఇటీవల నాకు అలసటగా ఉంది.', bn: 'ইদানীং আমার ক্লান্তি লাগছে।', ml: 'ഈയിടെ എനിക്ക് ക്ഷീണം ഉണ്ട്.', pa: 'ਇਹਨਾਂ ਦਿਨਾਂ ਮੈਨੂੰ ਥਕਾਵਟ ਹੋ ਰਹੀ ਹੈ।', or: 'ଏବେ ମୋତେ ଥକ୍କା ଲାଗୁଛି।', ur: 'آج کل مجھے تھکاوٹ ہو رہی ہے۔' } },
          { id: 'appointment', dose: false, prompt: faqCopy('appointment') },
          { id: 'find-hospital', dose: false, prompt: faqCopy('find-hospital') },
          { id: 'womens-health', dose: false, prompt: faqCopy('womens-health') },
          { id: 'phc', dose: false, prompt: faqCopy('phc') },
          { id: 'period', dose: false, prompt: faqCopy('period') },
          { id: 'pelvic-screening', dose: false, prompt: faqCopy('pelvic-screening') },
          { id: 'dose', dose: true, prompt: DOSE_LABEL },
        ].map((prompt) => (
          <button key={prompt.id} type="button" className="chip" disabled={busy} onClick={() => void ask(t(lang, prompt.prompt), { fresh: true, dose: prompt.dose })}>{t(lang, prompt.prompt)}</button>
        ))}
      </div>
      <section className="sakhi-hello mb-4">
        <SakhiMark />
        <div>
          <p className="text-sm font-semibold text-teal">SAKHI</p>
          <p className="mt-1 leading-7">{t(lang, sakhiWelcome)}</p>
          <p className="mt-2 text-sm text-muted">{t(lang, chrome.demoDraft)}</p>
        </div>
      </section>
      <p className="mb-3 text-sm text-muted">{t(lang, { en: 'Follow-up questions about tiredness are a labelled script until you allow a configured model. SAKHI does not diagnose.', kn: 'ಆಯಾಸದ ಮುಂದಿನ ಪ್ರಶ್ನೆಗಳು ಲೇಬಲ್ ಮಾಡಿದ ಲಿಪಿ. ನೀವು ಮಾದರಿಗೆ ಅನುಮತಿಸುವವರೆಗೆ ಹಾಗೆಯೇ. SAKHI ರೋಗ ನಿರ್ಣಯ ಮಾಡುವುದಿಲ್ಲ.', hi: 'थकान के आगे के सवाल एक लेबल वाली स्क्रिप्ट हैं, जब तक आप मॉडल की अनुमति नहीं देते। SAKHI निदान नहीं करती।' })}</p>
      <div className="grid gap-3">
        {turns.length === 0 ? <p className="text-muted">{t(lang, { en: 'Choose a starter or type a question.', kn: 'ಒಂದು ಪ್ರಾರಂಭ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ.' })}</p> : null}
        {turns.map((turn) => (
          <article key={turn.id} className={turn.role === 'sakhi' ? 'sakhi-bubble p-4' : 'glass p-4'}>
            <p className="text-sm text-muted">{turn.role === 'user' ? t(lang, { en: 'You', kn: 'ನೀವು', hi: 'आप', gu: 'તમે', mr: 'तुम्ही', ta: 'நீங்கள்', te: 'మీరు', bn: 'আপনি', ml: 'നിങ്ങൾ', pa: 'ਤੁਸੀਂ', or: 'ଆପଣ', ur: 'آپ' }) : 'SAKHI'}</p>
            <p className="mt-1 leading-7">{turn.text}</p>
            {turn.answer ? (
              <>
                <p className="mt-2 text-sm text-teal">{sourceLabel(turn.answer)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {turn.answer.links.map((link) => <Link key={link.href} className="btn ghost" to={link.href}>{t(lang, link.label)}</Link>)}
                  <button type="button" className="btn ghost" onClick={() => speak(turn.text)}><Volume2 size={16} /> {t(lang, { en: 'Read aloud', kn: 'ಓದಿ ಹೇಳಿ' })}</button>
                  <button type="button" className="btn ghost" onClick={() => void addSymptom({ module: 'general', symptoms: ['sakhi-note'], severity: 0, notes: turn.text.slice(0, 500) })}>
                    {t(lang, { en: 'Save as a note', kn: 'ಟಿಪ್ಪಣಿಯಾಗಿ ಉಳಿಸಿ' })}
                  </button>
                </div>
              </>
            ) : null}
          </article>
        ))}
        {busy ? (
          <article className="sakhi-bubble p-4" role="status">
            <p className="text-sm text-muted">SAKHI</p>
            <p className="mt-1 leading-7">{t(lang, sakhiThinking)}</p>
          </article>
        ) : null}
        {errorText ? (
          <article className="sakhi-bubble p-4" role="alert">
            <p className="mt-1 leading-7">{errorText}</p>
            {retry ? (
              <button type="button" className="btn ghost mt-2" onClick={() => void ask(retry.text, { fresh: true, dose: retry.dose })}>
                {t(lang, { en: 'Try again', kn: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ', hi: 'फिर कोशिश करें', gu: 'ફરી પ્રયત્ન કરો', mr: 'पुन्हा प्रयत्न करा', ta: 'மீண்டும் முயலவும்', te: 'మళ్లీ ప్రయత్నించండి', bn: 'আবার চেষ্টা করুন', ml: 'വീണ്ടും ശ്രമിക്കുക', pa: 'ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ', or: 'ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ', ur: 'دوبارہ کوشش کریں' })}
              </button>
            ) : null}
          </article>
        ) : null}
        <div ref={endRef} />
      </div>
      <form className="mt-4 flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); void ask(message) }}>
        <label className="sr-only" htmlFor="sakhi-q">{t(lang, { en: 'Question', kn: 'ಪ್ರಶ್ನೆ', hi: 'सवाल', gu: 'પ્રશ્ન', mr: 'प्रश्न', ta: 'கேள்வி', te: 'ప్రశ్న', bn: 'প্রশ্ন', ml: 'ചോദ്യം', pa: 'ਸਵਾਲ', or: 'ପ୍ରଶ୍ନ', ur: 'سوال' })}</label>
        <input id="sakhi-q" className="field min-w-0 flex-1" value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void ask(message) } }} maxLength={2000} disabled={busy} />
        <button type="button" className="btn ghost" onClick={listen} disabled={busy}><Mic size={16} /> {t(lang, { en: 'Voice', kn: 'ಧ್ವನಿ' })}</button>
        <button className="btn primary" type="submit" disabled={busy || !message.trim()}>{t(lang, { en: 'Ask', kn: 'ಕೇಳಿ' })}</button>
      </form>
      {voiceNote ? <p className="mt-3 text-sm text-warn" role="status">{voiceNote}</p> : null}
      <p className="mt-3 text-sm text-muted">{t(lang, { en: 'Voice input and read-aloud depend on this browser. If Kannada speech is not installed, the device voice may stay in another language.', kn: 'ಧ್ವನಿ ಮತ್ತು ಓದುವಿಕೆ ಈ ಬ್ರೌಸರ್ ಅನ್ನು ಅವಲಂಬಿಸಿದೆ. ಕನ್ನಡ ಧ್ವನಿ ಸ್ಥಾಪಿತವಿಲ್ಲದಿದ್ದರೆ ಸಾಧನದ ಧ್ವನಿ ಬೇರೆ ಭಾಷೆಯಲ್ಲಿರಬಹುದು.' })}</p>
    </div>
  )
}
