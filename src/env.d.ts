interface SpeechResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}

interface SpeechRec extends EventTarget {
  lang: string
  interimResults: boolean
  onresult: ((event: SpeechResultEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

interface SpeechRecCtor {
  new (): SpeechRec
}

interface Window {
  SpeechRecognition?: SpeechRecCtor
  webkitSpeechRecognition?: SpeechRecCtor
  webkitAudioContext?: typeof AudioContext
}

interface ImportMetaEnv {
  readonly BASE_URL: string
}
