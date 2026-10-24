import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Bell, BookOpen, FileHeart, HeartPulse, Hospital, MessageCircle, Pill, Receipt, ScanLine, Settings as SettingsIcon, Shield, Siren, Sparkles, Stethoscope, Wifi, WifiOff } from 'lucide-react'
import { useHealth } from '../context/HealthContext'
import { chrome, t } from '../i18n'
import { DoseCompanion } from './DoseCompanion'
import { LanguageSelect } from './LanguageSelect'
import { Modal } from './ui'
import { SakhiMark } from './SakhiMark'

const links = [
  { to: '/', label: chrome.nav.home, icon: HeartPulse, end: true },
  { to: '/assistant', label: chrome.nav.assistant, icon: MessageCircle, end: false },
  { to: '/health', label: chrome.nav.health, icon: Sparkles, end: false },
  { to: '/symptoms', label: chrome.nav.symptoms, icon: Stethoscope, end: false },
  { to: '/scan', label: chrome.nav.scan, icon: ScanLine, end: false },
  { to: '/medicines', label: chrome.nav.medicine, icon: Pill, end: false },
  { to: '/reminders', label: chrome.nav.reminders, icon: Bell, end: false },
  { to: '/bills', label: chrome.nav.bills, icon: Receipt, end: false },
  { to: '/hospitals', label: chrome.nav.hospitals, icon: Hospital, end: false },
  { to: '/offline', label: chrome.nav.offline, icon: WifiOff, end: false },
  { to: '/library', label: chrome.nav.library, icon: BookOpen, end: false },
  { to: '/passport', label: chrome.nav.passport, icon: FileHeart, end: false },
  { to: '/settings', label: chrome.nav.settings, icon: SettingsIcon, end: false },
  { to: '/privacy', label: chrome.nav.privacy, icon: Shield, end: false },
]

export function Shell() {
  const health = useHealth()
  const [emergency, setEmergency] = useState(false)
  const lang = health.snapshot?.profile.language ?? 'en'
  const simulated = Boolean(health.snapshot?.meta.simulatedOffline)

  if (!health.ready || !health.snapshot) {
    return <div className="skeleton mx-auto mt-16 h-64 max-w-3xl" aria-label="Loading HerHealth and SAKHI" />
  }

  return (
    <div className="app-shell">
      <a className="skip" href="#main">{t(lang, chrome.skip)}</a>
      <aside className="side">
        <div className="brand mb-5 flex items-center gap-3 px-2">
          <SakhiMark />
          <span>
            <strong className="block text-lg leading-5">HerHealth AI</strong>
            <span className="text-sm text-muted">SAKHI AI</span>
          </span>
        </div>
        <nav className="grid gap-1" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <link.icon size={18} aria-hidden="true" />
              {t(lang, link.label)}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="btn ghost side-toggle mt-4 w-full"
          aria-pressed={simulated}
          onClick={() => void health.setSimulatedOffline(!simulated)}
        >
          <WifiOff size={16} aria-hidden="true" />
          {t(lang, chrome.simulate)}
        </button>
      </aside>
      <div>
        <header className="topbar flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <div className="flex flex-wrap gap-2">
            <span className={health.browserOnline ? 'pill good' : 'pill warn'}>
              {health.browserOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              {t(lang, health.browserOnline ? chrome.online : chrome.browserOffline)}
            </span>
            {simulated ? <span className="pill warn">{t(lang, chrome.simulated)}</span> : null}
            {lang !== 'en' ? <span className="pill info" title={t(lang, chrome.demoDraft)}>{t(lang, chrome.draftBadge)}</span> : null}
            <span className="pill info">{t(lang, chrome.sampleData)}</span>
          </div>
          <div className="header-actions">
            <LanguageSelect lang={lang} label={t(lang, chrome.language)} onChange={(next) => void health.setLanguage(next)} />
            <div className="header-tools">
              <DoseCompanion />
              <button type="button" className="btn danger header-emergency" onClick={() => setEmergency(true)}>
                <Siren size={16} aria-hidden="true" />
                {t(lang, chrome.emergency)}
              </button>
            </div>
          </div>
        </header>
        {simulated ? (
          <div className="px-4 sm:px-8">
            <p className="banner sim">
              {t(lang, {
                en: 'Simulated offline mode is on. This is a demonstration switch. Your browser may still have internet. Live traffic, live beds, and online models are paused. Cached demo records stay available.',
                kn: 'ಆಫ್‌ಲೈನ್ ಅನುಕರಣೆ ಆನ್ ಆಗಿದೆ. ಇದು ಪ್ರದರ್ಶನ ಸ್ವಿಚ್. ನಿಮ್ಮ ಬ್ರೌಸರ್‌ಗೆ ಇನ್ನೂ ಇಂಟರ್ನೆಟ್ ಇರಬಹುದು. ನೇರ ಸಂಚಾರ, ನೇರ ಹಾಸಿಗೆಗಳು ಮತ್ತು ಆನ್‌ಲೈನ್ ಮಾದರಿಗಳನ್ನು ನಿಲ್ಲಿಸಲಾಗಿದೆ. ಉಳಿಸಿದ ಮಾದರಿ ದಾಖಲೆಗಳು ಲಭ್ಯ.',
              })}
            </p>
          </div>
        ) : null}
        {!health.browserOnline ? (
          <div className="px-4 pt-3 sm:px-8">
            <p className="banner offline">
              {t(lang, {
                en: 'This browser reports it is offline. That is separate from the simulation switch. Cached demo records stay available. Live traffic and bed counts cannot be refreshed.',
                kn: 'ಈ ಬ್ರೌಸರ್ ಆಫ್‌ಲೈನ್ ಎಂದು ಹೇಳುತ್ತದೆ. ಇದು ಅನುಕರಣೆ ಸ್ವಿಚ್‌ಗಿಂತ ಬೇರೆ. ಉಳಿಸಿದ ಮಾದರಿ ದಾಖಲೆಗಳು ಲಭ್ಯ. ನೇರ ಸಂಚಾರ ಮತ್ತು ಹಾಸಿಗೆಗಳನ್ನು ನವೀಕರಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
              })}
            </p>
          </div>
        ) : null}
        {!health.persistent ? (
          <div className="px-4 pt-3 sm:px-8">
            <p className="banner prompt">{t(lang, { en: 'This browser did not open IndexedDB. Notes last only while this tab stays open.', kn: 'ಈ ಬ್ರೌಸರ್ IndexedDB ತೆರೆಯಲಿಲ್ಲ. ಟ್ಯಾಬ್ ತೆರೆದಿರುವವರೆಗೆ ಮಾತ್ರ ಟಿಪ್ಪಣಿಗಳು ಉಳಿಯುತ್ತವೆ.' })}</p>
          </div>
        ) : null}
        <main id="main" className="px-4 py-6 pb-24 sm:px-8">
          <Outlet />
        </main>
        <footer className="px-4 pb-8 text-sm leading-6 text-muted sm:px-8">{t(lang, chrome.safety)}</footer>
      </div>
      <div className="toasts" aria-live="polite">
        {health.notices.map((notice) => (
          <button key={notice.id} type="button" className="toast text-left" onClick={() => health.dismissNotice(notice.id)}>
            {notice.text}
          </button>
        ))}
      </div>
      {emergency ? (
        <Modal title={t(lang, chrome.emergency)} onClose={() => setEmergency(false)}>
          <p className="leading-7">
            {t(lang, {
              en: 'If someone is in immediate danger, contact local emergency services before using this app. In India, 112 and 108 are widely published public emergency numbers. Say the place, what happened, and whether the person is conscious and breathing.',
              kn: 'ಯಾರಾದರೂ ತಕ್ಷಣದ ಅಪಾಯದಲ್ಲಿದ್ದರೆ ಈ ಅಪ್ಲಿಕೇಶನ್ ಬಳಸುವ ಮೊದಲು ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ. ಭಾರತದಲ್ಲಿ 112 ಮತ್ತು 108 ವ್ಯಾಪಕವಾಗಿ ಪ್ರಕಟಿತ ಸಾರ್ವಜನಿಕ ತುರ್ತು ಸಂಖ್ಯೆಗಳು. ಸ್ಥಳ, ಏನಾಯಿತು, ವ್ಯಕ್ತಿ ಪ್ರಜ್ಞೆಯಲ್ಲಿದ್ದಾರೆಯೇ ಮತ್ತು ಉಸಿರಾಡುತ್ತಿದ್ದಾರೆಯೇ ಎಂದು ಹೇಳಿ.',
            })}
          </p>
          <p className="mt-3 leading-7">
            {t(lang, {
              en: 'For mental health distress in India, Tele-MANAS is 14416. This demo cannot dispatch an ambulance.',
              kn: 'ಭಾರತದಲ್ಲಿ ಮಾನಸಿಕ ಒತ್ತಡಕ್ಕೆ Tele-MANAS ಸಂಖ್ಯೆ 14416. ಈ ಮಾದರಿ ಆಂಬ್ಯುಲೆನ್ಸ್ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
            })}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="btn danger" href="tel:112">112</a>
            <a className="btn danger" href="tel:108">108</a>
            <a className="btn ghost" href="tel:14416">Tele-MANAS 14416</a>
            <button type="button" className="btn ghost" onClick={() => setEmergency(false)}>{t(lang, { en: 'Close', kn: 'ಮುಚ್ಚಿ' })}</button>
          </div>
        </Modal>
      ) : null}
      <Link className="ask-fab btn primary" to="/assistant" aria-label={t(lang, chrome.ask)}><SakhiMark small /> {t(lang, chrome.ask)}</Link>
    </div>
  )
}
