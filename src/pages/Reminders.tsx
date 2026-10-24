import { useEffect, useMemo, useState } from 'react'
import { Pill } from 'lucide-react'
import { PageIntro, SafetyNote } from '../components/ui'
import { useHealth } from '../context/HealthContext'
import { t } from '../i18n'
import { reminderCopy } from '../i18n/reminders'
import { languageMeta } from '../languages'
import { formatWhen } from '../lib/format'
import { countdownTarget, formatCountdown, loadPrefs, savePrefs, todaysOccurrences, weekBars, type DoseOccurrence, type DoseState, type ReminderPrefs } from '../services/doseSchedule'
import type { DosePeriod } from '../types'

const periods: DosePeriod[] = ['morning', 'afternoon', 'evening', 'night']

const periodCopy: Record<DosePeriod, { en: string; kn: string; hi: string; gu: string; mr: string; ta: string; te: string; bn: string; ml: string; pa: string; or: string; ur: string }> = {
  morning: { en: 'morning', kn: 'ಬೆಳಗ್ಗೆ', hi: 'सुबह', gu: 'સવાર', mr: 'सकाळ', ta: 'காலை', te: 'ఉదయం', bn: 'সকাল', ml: 'രാവിലെ', pa: 'ਸਵੇਰ', or: 'ସକାଳ', ur: 'صبح' },
  afternoon: { en: 'afternoon', kn: 'ಮಧ್ಯಾಹ್ನ', hi: 'दोपहर', gu: 'બપોર', mr: 'दुपार', ta: 'மதியம்', te: 'మధ్యాహ్నం', bn: 'দুপুর', ml: 'ഉച്ച', pa: 'ਦੁਪਹਿਰ', or: 'ଅପରାହ୍ନ', ur: 'دوپہر' },
  evening: { en: 'evening', kn: 'ಸಂಜೆ', hi: 'शाम', gu: 'સાંજ', mr: 'संध्याकाळ', ta: 'மாலை', te: 'సాయంత్రం', bn: 'সন্ধ্যা', ml: 'വൈകുന്നേരം', pa: 'ਸ਼ਾਮ', or: 'ସନ୍ଧ୍ୟା', ur: 'شام' },
  night: { en: 'night', kn: 'ರಾತ್ರಿ', hi: 'रात', gu: 'રાત', mr: 'रात्र', ta: 'இரவு', te: 'రాత్రి', bn: 'রাত', ml: 'രാത്രി', pa: 'ਰਾਤ', or: 'ରାତି', ur: 'رات' },
}

function stateLabel(state: DoseState) {
  if (state === 'due') return reminderCopy.due
  if (state === 'upcoming') return reminderCopy.upcoming
  if (state === 'taken') return reminderCopy.taken
  if (state === 'snoozed') return reminderCopy.snoozed
  return reminderCopy.missed
}

export function Reminders() {
  const { snapshot, addDose, updateDose, deleteById, logDose, notify } = useHealth()
  const [now, setNow] = useState(() => new Date())
  const [name, setName] = useState('')
  const [time, setTime] = useState('08:00')
  const [period, setPeriod] = useState<DosePeriod>('morning')
  const [repeat, setRepeat] = useState<'daily' | 'weekly'>('daily')
  const [weekdays, setWeekdays] = useState<number[]>([new Date().getDay()])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [prefs, setPrefs] = useState<ReminderPrefs>(() => loadPrefs())
  const [successName, setSuccessName] = useState('')

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const lang = snapshot?.profile.language ?? 'en'
  const rows = useMemo(
    () => (snapshot ? todaysOccurrences(snapshot.doses, snapshot.doseLogs, now) : []),
    [snapshot, now],
  )
  const bars = useMemo(
    () => (snapshot ? weekBars(snapshot.doses, snapshot.doseLogs, now) : []),
    [snapshot, now],
  )

  if (!snapshot) return null
  const locale = languageMeta(lang).locale
  const taken = rows.filter((row) => row.state === 'taken').length
  const progress = rows.length === 0 ? 0 : Math.round((taken / rows.length) * 100)
  const next = rows.find((row) => row.state === 'due') ?? rows.find((row) => row.state === 'upcoming' || row.state === 'snoozed') ?? rows.find((row) => row.state === 'missed' || row.state === 'skipped') ?? rows.at(-1) ?? null
  const morning = rows.filter((row) => row.plan.period === 'morning')
  const weekTaken = bars.reduce((sum, bar) => sum + bar.taken, 0)
  const weekScheduled = bars.reduce((sum, bar) => sum + bar.scheduled, 0)
  const groups: DoseState[] = ['due', 'upcoming', 'snoozed', 'taken', 'missed']

  function changePrefs(patch: Partial<ReminderPrefs>) {
    const nextPrefs = { ...prefs, ...patch }
    setPrefs(nextPrefs)
    savePrefs(nextPrefs)
    window.dispatchEvent(new Event('sakhi-reminder-prefs'))
  }

  async function respond(row: DoseOccurrence, status: 'taken' | 'missed' | 'snoozed', minutes = 10) {
    const saved = await logDose({
      planId: row.plan.id,
      name: row.plan.name,
      status,
      note: '',
      occurrenceId: row.occurrenceId,
      snoozeUntil: status === 'snoozed' ? new Date(Date.now() + minutes * 60_000).toISOString() : undefined,
    })
    if (saved && status === 'taken') setSuccessName(row.plan.name)
  }

  return (
    <div className="grid gap-5">
      <PageIntro kicker={t(lang, { en: 'Medicine reminders', kn: 'ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು', hi: 'दवा रिमाइंडर', gu: 'દવા રિમાઇન્ડર', mr: 'औषध आठवणी', ta: 'மருந்து நினைவூட்டல்', te: 'మందు రిమైండర్లు', bn: 'ওষুধের রিমাইন্ডার', ml: 'മരുന്ന് ഓർമ്മപ്പെടുത്തൽ', pa: 'ਦਵਾਈ ਯਾਦ-ਦਹਾਨੀ', or: 'ଔଷଧ ସ୍ମାରକ', ur: 'دوا کی یاددہانی' })} title={`${t(lang, reminderCopy.greeting)} 💜`} lede={t(lang, reminderCopy.limit)} />
      <SafetyNote lang={lang} />
      <section className="dose-hero">
        <div>
          <p className="dose-kicker"><Pill size={18} aria-hidden="true" /> {t(lang, reminderCopy.next)}</p>
          {next ? (
            <>
              <h2 className="mt-2 text-3xl">{next.plan.name}</h2>
              <p className="mt-1">{next.plan.time} · {t(lang, periodCopy[next.plan.period])} · {t(lang, stateLabel(next.state))}</p>
              <p className="mt-2">{next.plan.notes || t(lang, reminderCopy.noInstructions)}</p>
              <p className="dose-count" aria-live="polite">{next.state === 'upcoming' || next.state === 'snoozed' ? formatCountdown(countdownTarget(next).getTime() - now.getTime()) : t(lang, stateLabel(next.state))}</p>
            </>
          ) : <p className="mt-2">{t(lang, reminderCopy.none)}</p>}
        </div>
        <div className="dose-ring" style={{ background: `conic-gradient(#5eead4 ${progress * 3.6}deg, rgba(255,255,255,0.12) 0)` }} role="img" aria-label={`${t(lang, reminderCopy.progress)} ${taken}/${rows.length}`}>
          <span><strong>{taken}</strong><small>/{rows.length}</small></span>
        </div>
      </section>
      <section className="glass p-4">
        <h2 className="text-xl">{t(lang, reminderCopy.morning)}</h2>
        {morning.length === 0 ? <p className="mt-2 text-muted">{t(lang, reminderCopy.none)}</p> : morning.map((row) => (
          <p key={row.occurrenceId} className="mt-2">{row.plan.time} · {row.plan.name} · {t(lang, stateLabel(row.state))}</p>
        ))}
      </section>
      <section className="glass p-4">
        <h2 className="text-xl">{t(lang, reminderCopy.timeline)}</h2>
        <div className="dose-timeline">
          {rows.length === 0 ? <p className="text-muted">{t(lang, reminderCopy.none)}</p> : rows.map((row) => (
            <div key={row.occurrenceId} className={`dose-slot slot-${row.state}`}>
              <strong>{row.plan.time}</strong>
              <span>{row.plan.name}</span>
            </div>
          ))}
        </div>
      </section>
      {groups.map((state) => (
        <section key={state} className="glass p-4">
          <h2 className="text-xl">{t(lang, stateLabel(state))}</h2>
          {rows.filter((row) => row.state === state || (state === 'missed' && row.state === 'skipped')).length === 0 ? <p className="mt-2 text-muted">{t(lang, reminderCopy.none)}</p> : rows.filter((row) => row.state === state || (state === 'missed' && row.state === 'skipped')).map((row) => (
            <article key={row.occurrenceId} className="dose-card">
              <div>
                <h3>{row.plan.name}</h3>
                <p className="text-sm text-muted">{row.plan.time} · {t(lang, periodCopy[row.plan.period])} · {row.plan.repeat === 'weekly' ? t(lang, reminderCopy.weekly) : t(lang, reminderCopy.daily)}</p>
                <p className="mt-1 text-sm">{row.plan.notes || t(lang, reminderCopy.noInstructions)}</p>
              </div>
              {row.state === 'taken' ? <p className="text-sm">{t(lang, reminderCopy.already)}</p> : (
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn primary" onClick={() => void respond(row, 'taken')}>{t(lang, reminderCopy.taken)}</button>
                  <button type="button" className="btn ghost" onClick={() => void respond(row, 'missed')}>{t(lang, reminderCopy.missed)}</button>
                  {[5, 10, 15].map((minutes) => (
                    <button key={minutes} type="button" className="chip" onClick={() => void respond(row, 'snoozed', minutes)}>{minutes} {t(lang, reminderCopy.minutes)}</button>
                  ))}
                </div>
              )}
              <button type="button" className="btn quiet w-fit" onClick={() => void deleteById(row.plan.id)}>{t(lang, reminderCopy.delete)}</button>
              <label className="mt-2 grid max-w-xs gap-1 text-sm">
                {t(lang, { en: 'Change time', kn: 'ಸಮಯ ಬದಲಿಸಿ', hi: 'समय बदलें', gu: 'સમય બદલો', mr: 'वेळ बदला', ta: 'நேரத்தை மாற்று', te: 'సమయం మార్చు', bn: 'সময় বদলান', ml: 'സമയം മാറ്റുക', pa: 'ਸਮਾਂ ਬਦਲੋ', or: 'ସମୟ ବଦଳାନ୍ତୁ', ur: 'وقت بدلیں' })}
                <input className="field" type="time" value={row.plan.time} onChange={(event) => void updateDose(row.plan.id, { time: event.target.value })} />
              </label>
            </article>
          ))}
        </section>
      ))}
      <section className="glass p-4">
        <h2 className="text-xl">{t(lang, reminderCopy.week)}</h2>
        <p className="mt-1 text-sm text-muted">{t(lang, reminderCopy.summary)} · {weekTaken}/{weekScheduled}</p>
        <div className="week-chart">
          {bars.map((bar) => (
            <div key={bar.key} className="week-col">
              <div className="week-track" aria-hidden="true">
                <div style={{ height: `${bar.scheduled === 0 ? 0 : Math.round((bar.taken / bar.scheduled) * 100)}%` }} />
              </div>
              <span>{new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(bar.day)}</span>
              <span className="sr-only">{bar.taken}/{bar.scheduled}</span>
            </div>
          ))}
        </div>
      </section>
      {successName ? (
        <div className="dose-success" role="status">
          <p aria-hidden="true">🌸</p>
          <h2>{t(lang, reminderCopy.successTitle)}</h2>
          <p className="mt-2">{successName}. {t(lang, reminderCopy.successBody)}</p>
          <button type="button" className="btn primary mt-3" onClick={() => setSuccessName('')}>{t(lang, reminderCopy.dismiss)}</button>
        </div>
      ) : null}
      <section className="glass grid gap-3 p-4">
        <h2 className="text-xl">{t(lang, reminderCopy.add)}</h2>
        <form className="grid gap-3" onSubmit={(event) => {
          event.preventDefault()
          if (name.trim().length < 2) {
            setError(t(lang, { en: 'Enter the medicine name from your instructions, at least 2 characters.', kn: 'ಸೂಚನೆಯ ಔಷಧಿ ಹೆಸರನ್ನು ಕನಿಷ್ಠ 2 ಅಕ್ಷರದಲ್ಲಿ ಬರೆಯಿರಿ.', hi: 'निर्देश से दवा का नाम कम से कम 2 अक्षरों में लिखें।' }))
            return
          }
          if (repeat === 'weekly' && weekdays.length === 0) {
            setError(t(lang, { en: 'Choose at least one day for a weekly reminder.', kn: 'ವಾರದ ಜ್ಞಾಪನೆಗೆ ಕನಿಷ್ಠ ಒಂದು ದಿನವನ್ನು ಆಯ್ಕೆಮಾಡಿ.', hi: 'साप्ताहिक रिमाइंडर के लिए कम से कम एक दिन चुनें।' }))
            return
          }
          setError('')
          void addDose({ name: name.trim(), time, period, notes: notes.trim(), repeat, weekdays: repeat === 'weekly' ? weekdays : undefined })
          setName('')
          setNotes('')
        }}>
          <label className="grid gap-1 text-sm font-semibold">{t(lang, { en: 'Medicine name', kn: 'ಔಷಧಿ ಹೆಸರು', hi: 'दवा का नाम', gu: 'દવાનું નામ', mr: 'औषधाचे नाव', ta: 'மருந்தின் பெயர்', te: 'మందు పేరు', bn: 'ওষুধের নাম', ml: 'മരുന്നിന്റെ പേര്', pa: 'ਦਵਾਈ ਦਾ ਨਾਮ', or: 'ଔଷଧ ନାମ', ur: 'دوا کا نام' })}<input className="field" value={name} onChange={(event) => setName(event.target.value)} /></label>
          <div className="flex flex-wrap gap-2">
            {periods.map((item) => (
              <button key={item} type="button" className="chip" aria-pressed={period === item} onClick={() => setPeriod(item)}>{t(lang, periodCopy[item])}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="chip" aria-pressed={repeat === 'daily'} onClick={() => setRepeat('daily')}>{t(lang, reminderCopy.daily)}</button>
            <button type="button" className="chip" aria-pressed={repeat === 'weekly'} onClick={() => setRepeat('weekly')}>{t(lang, reminderCopy.weekly)}</button>
          </div>
          {repeat === 'weekly' ? (
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                const sample = new Date(2026, 5, 7 + day)
                return (
                  <button key={day} type="button" className="chip" aria-pressed={weekdays.includes(day)} onClick={() => setWeekdays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day])}>
                    {new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(sample)}
                  </button>
                )
              })}
            </div>
          ) : null}
          <label className="grid gap-1 text-sm font-semibold">{t(lang, { en: 'Reminder time', kn: 'ಜ್ಞಾಪನೆ ಸಮಯ', hi: 'रिमाइंडर समय', gu: 'રિમાઇન્ડર સમય', mr: 'आठवणीची वेळ', ta: 'நினைவூட்டல் நேரம்', te: 'రిమైండర్ సమయం', bn: 'রিমাইন্ডারের সময়', ml: 'ഓർമ്മപ്പെടുത്തൽ സമയം', pa: 'ਯਾਦ-ਦਹਾਨੀ ਸਮਾਂ', or: 'ସ୍ମାରକ ସମୟ', ur: 'یاددہانی کا وقت' })}<input className="field max-w-xs" type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label>
          <label className="grid gap-1 text-sm font-semibold">{t(lang, { en: 'Instructions from your prescription', kn: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸೂಚನೆ', hi: 'प्रिस्क्रिप्शन के निर्देश', gu: 'પ્રિસ્ક્રિપ્શનની સૂચના', mr: 'प्रिस्क्रिप्शनची सूचना', ta: 'மருந்துச் சீட்டு அறிவுறுத்தல்', te: 'ప్రిస్క్రిప్షన్ సూచన', bn: 'প্রেসক্রিপশনের নির্দেশ', ml: 'കുറിപ്പടി നിർദ്ദേശം', pa: 'ਨੁਸਖ਼ੇ ਦੀ ਹਦਾਇਤ', or: 'ପ୍ରେସକ୍ରିପସନ୍ ନିର୍ଦ୍ଦେଶ', ur: 'نسخے کی ہدایت' })}<input className="field" value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
          {error ? <p className="text-sm text-rose-300" role="alert">{error}</p> : null}
          <button className="btn primary w-fit" type="submit">{t(lang, { en: 'Save reminder', kn: 'ಜ್ಞಾಪನೆ ಉಳಿಸಿ', hi: 'रिमाइंडर सहेजें', gu: 'રિમાઇન્ડર સાચવો', mr: 'आठवण जतन करा', ta: 'நினைவூட்டலைச் சேமி', te: 'రిమైండర్ సేవ్ చేయి', bn: 'রিমাইন্ডার সেভ করুন', ml: 'ഓർമ്മപ്പെടുത്തൽ സേവ് ചെയ്യുക', pa: 'ਯਾਦ-ਦਹਾਨੀ ਸੰਭਾਲੋ', or: 'ସ୍ମାରକ ସଞ୍ଚୟ କରନ୍ତୁ', ur: 'یاددہانی محفوظ کریں' })}</button>
        </form>
        <button type="button" className="btn ghost w-fit" onClick={() => window.dispatchEvent(new Event('sakhi-demo-reminder'))}>{t(lang, reminderCopy.demo)}</button>
      </section>
      <section className="glass grid gap-3 p-4">
        <h2 className="text-xl">{t(lang, { en: 'Reminder preferences', kn: 'ಜ್ಞಾಪನೆ ಆಯ್ಕೆಗಳು', hi: 'रिमाइंडर विकल्प', gu: 'રિમાઇન્ડર પસંદગી', mr: 'आठवण पर्याय', ta: 'நினைவூட்டல் விருப்பங்கள்', te: 'రిమైండర్ అభిరుచులు', bn: 'রিমাইন্ডার পছন্দ', ml: 'ഓർമ്മപ്പെടുത്തൽ മുൻഗണനകൾ', pa: 'ਯਾਦ-ਦਹਾਨੀ ਪਸੰਦ', or: 'ସ୍ମାରକ ପସନ୍ଦ', ur: 'یاددہانی کی ترجیحات' })}</h2>
        <p className="text-sm text-muted">{t(lang, reminderCopy.limit)}</p>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={prefs.sound} onChange={(event) => changePrefs({ sound: event.target.checked })} /> {t(lang, reminderCopy.sound)}</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={prefs.systemDetails} onChange={(event) => changePrefs({ systemDetails: event.target.checked })} /> {t(lang, reminderCopy.system)}</label>
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm">{t(lang, reminderCopy.quiet)}<input className="field" type="time" value={prefs.quietStart} onChange={(event) => changePrefs({ quietStart: event.target.value })} /></label>
          <label className="grid gap-1 text-sm"><span className="sr-only">{t(lang, reminderCopy.quiet)}</span><input className="field" type="time" value={prefs.quietEnd} onChange={(event) => changePrefs({ quietEnd: event.target.value })} /></label>
        </div>
        <button type="button" className="btn ghost w-fit" onClick={() => {
          if (!('Notification' in window)) {
            notify(t(lang, reminderCopy.denied), 'warn')
            return
          }
          void Notification.requestPermission().then((permission) => {
            if (permission !== 'granted') notify(t(lang, reminderCopy.denied), 'warn')
          })
        }}>{t(lang, reminderCopy.allow)}</button>
      </section>
      <section className="glass p-4">
        <h2 className="text-xl">{t(lang, { en: 'History', kn: 'ಇತಿಹಾಸ', hi: 'इतिहास', gu: 'ઇતિહાસ', mr: 'इतिहास', ta: 'வரலாறு', te: 'చరిత్ర', bn: 'ইতিহাস', ml: 'ചരിത്രം', pa: 'ਇਤਿਹਾਸ', or: 'ଇତିହାସ', ur: 'تاریخ' })}</h2>
        {snapshot.doseLogs.length === 0 ? <p className="mt-2 text-muted">{t(lang, reminderCopy.emptyAlert)}</p> : snapshot.doseLogs.map((row) => (
          <p key={row.id} className="mt-2">{formatWhen(row.createdAt, lang)} · {row.name} · {t(lang, row.status === 'taken' ? reminderCopy.taken : row.status === 'snoozed' ? reminderCopy.snoozed : reminderCopy.missed)}</p>
        ))}
      </section>
    </div>
  )
}
