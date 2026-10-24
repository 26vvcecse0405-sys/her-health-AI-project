import type { Copy } from '../types'

export type Faq = {
  id: string
  keywords: string[]
  title: Copy
  body: Copy
  href: string
  link: Copy
}

export const FAQS: Faq[] = [
  {
    id: 'phc',
    keywords: ['phc', 'primary health', 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ', 'ಆರೋಗ್ಯ ಕೇಂದ್ರ'],
    title: { en: 'What is a primary health centre?', kn: 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಎಂದರೇನು?' },
    body: {
      en: 'In India, a primary health centre is often the first government clinic for a rural area. What is offered changes by place and by who is on duty that day. Common work can include antenatal checks, immunisation, basic illness care, and referral to a larger hospital when the centre cannot provide the service. The Malenahalli centre in this demo is fictional. If someone is in danger, call 112 or 108 instead of waiting for the clinic.',
      kn: 'ಭಾರತದಲ್ಲಿ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಹಲವು ಗ್ರಾಮಗಳ ಮೊದಲ ಸರ್ಕಾರಿ ಚಿಕಿತ್ಸಾಲಯ. ಅಲ್ಲಿ ಏನು ಸಿಗುತ್ತದೆ ಎಂಬುದು ಊರು ಮತ್ತು ಆ ದಿನದ ಸಿಬ್ಬಂದಿಯನ್ನು ಅವಲಂಬಿಸಿದೆ. ಗರ್ಭಾವಸ್ಥೆ ಪರೀಕ್ಷೆ, ಲಸಿಕೆ, ಸಾಮಾನ್ಯ ಅಸ್ವಸ್ಥತೆ, ಮತ್ತು ಕೇಂದ್ರಕ್ಕೆ ಸಾಧ್ಯವಾಗದಾಗ ದೊಡ್ಡ ಆಸ್ಪತ್ರೆಗೆ ರೆಫರಲ್ ಸಾಮಾನ್ಯ ಕೆಲಸಗಳು. ಈ ಮಾದರಿಯ ಮಾಲೇನಹಳ್ಳಿ ಕೇಂದ್ರ ಕಾಲ್ಪನಿಕ. ಅಪಾಯವಿದ್ದರೆ ಚಿಕಿತ್ಸಾಲಯಕ್ಕಾಗಿ ಕಾಯದೆ 112 ಅಥವಾ 108 ಕರೆ ಮಾಡಿ.',
    },
    href: '/offline',
    link: { en: 'Open cached demo hospitals', kn: 'ಉಳಿಸಿದ ಮಾದರಿ ಆಸ್ಪತ್ರೆಗಳನ್ನು ತೆರೆಯಿರಿ' },
  },
  {
    id: 'period',
    keywords: ['heavy period', 'period bleeding', 'soaking', 'ಮುಟ್ಟಿನ ರಕ್ತ', 'ಋತುಚಕ್ರ'],
    title: { en: 'When is period bleeding urgent?', kn: 'ಮುಟ್ಟಿನ ರಕ್ತ ಯಾವಾಗ ತುರ್ತು?' },
    body: {
      en: 'Soaking through a pad every hour for several hours, fainting, or severe pain needs emergency care now. Other heavy or painful periods should be written down — dates, clots, and how many pads — and shown to a clinician. A log cannot tell the cause, including endometriosis.',
      kn: 'ಹಲವು ಗಂಟೆಗಳ ಕಾಲ ಪ್ರತಿ ಗಂಟೆಗೆ ಪ್ಯಾಡ್ ನೆನೆಯುವುದು, ಮೂರ್ಛೆ, ಅಥವಾ ತೀವ್ರ ನೋವು ಇದ್ದರೆ ಈಗಲೇ ತುರ್ತು ಆರೈಕೆ. ಬೇರೆ ಭಾರಿ ಅಥವಾ ನೋವಿನ ಮುಟ್ಟನ್ನು ದಿನಾಂಕ ಸಹಿತ ಬರೆದು ವೈದ್ಯರಿಗೆ ತೋರಿಸಿ. ದಾಖಲೆ ಕಾರಣವನ್ನು ಹೇಳಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    },
    href: '/health/endo',
    link: { en: 'Open the symptom journal', kn: 'ಲಕ್ಷಣ ದಿನಚರಿ ತೆರೆಯಿರಿ' },
  },
  {
    id: 'bag',
    keywords: ['what to carry', 'what should i carry', 'what should i bring', 'carry to a visit', 'visit bag', 'ಭೇಟಿಗೆ', 'ಏನು ತೆಗೆದುಕೊಳ್ಳ'],
    title: { en: 'What should I carry to a visit?', kn: 'ಭೇಟಿಗೆ ಏನು ತೆಗೆದುಕೊಳ್ಳಬಹುದು?' },
    body: {
      en: 'Bring old reports, the names of medicines you take, a list of symptoms with dates, your questions, and a water bottle. A Care Passport from this demo is a memory aid for a fictional profile. It is not a referral.',
      kn: 'ಹಳೆಯ ವರದಿಗಳು, ಔಷಧಿಗಳ ಹೆಸರು, ದಿನಾಂಕಗಳೊಂದಿಗೆ ಲಕ್ಷಣಗಳು, ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ನೀರಿನ ಬಾಟಲಿ ತನ್ನಿ. ಈ ಮಾದರಿಯ ಕೇರ್ ಪಾಸ್‌ಪೋರ್ಟ್ ನೆನಪಿನ ಸಹಾಯ. ಅದು ರೆಫರಲ್ ಅಲ್ಲ.',
    },
    href: '/passport',
    link: { en: 'Prepare a Care Passport', kn: 'ಕೇರ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಸಿದ್ಧಪಡಿಸಿ' },
  },
  {
    id: 'foods',
    keywords: ['iron-rich', 'iron rich', 'leafy', 'foods with iron', 'discussed for iron', 'ಕಬ್ಬಿಣದ ಆಹಾರ', 'ಸೊಪ್ಪು'],
    title: { en: 'Which foods are often discussed for iron?', kn: 'ಕಬ್ಬಿಣದ ಬಗ್ಗೆ ಯಾವ ಆಹಾರಗಳನ್ನು ಹೇಳುತ್ತಾರೆ?' },
    body: {
      en: 'Leafy greens, lentils, beans, and, for people who eat them, eggs, meat, and fish are common examples. Guava, amla, or citrus with a meal is often mentioned because vitamin C helps the body take up iron from plants. Tea and coffee with the meal can reduce that uptake. This is general education. It is not a treatment and it is not a dose.',
      kn: 'ಸೊಪ್ಪು, ಬೇಳೆ, ಮತ್ತು ತಿನ್ನುವವರಿಗೆ ಮೊಟ್ಟೆ ಅಥವಾ ಮಾಂಸ ಸಾಮಾನ್ಯ ಉದಾಹರಣೆಗಳು. ನೆಲ್ಲಿಕಾಯಿ ಅಥವಾ ನಿಂಬೆ ಜಾತಿಯ ಹಣ್ಣನ್ನು ಊಟದೊಂದಿಗೆ ಹೇಳುವುದುಂಟು. ಊಟದೊಂದಿಗೆ ಚಹಾ ಅಥವಾ ಕಾಫಿ ಹೀರಿಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಬಹುದು. ಇದು ಸಾಮಾನ್ಯ ಶಿಕ್ಷಣ. ಚಿಕಿತ್ಸೆ ಅಥವಾ ಡೋಸ್ ಅಲ್ಲ.',
    },
    href: '/health/nutrition',
    link: { en: 'Open nutrition notes', kn: 'ಆಹಾರ ಟಿಪ್ಪಣಿಗಳನ್ನು ತೆರೆಯಿರಿ' },
  },
  {
    id: 'womens-health',
    keywords: ["women's health", 'women’s health', 'womens health', 'understand women', 'ಮಹಿಳಾ ಆರೋಗ್ಯ'],
    title: { en: 'Help me understand women’s health.', kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡಿ.' },
    body: {
      en: 'Women’s health covers preventive care, menstrual health, reproductive health, and mental well-being. Preventive care can include vaccinations, blood pressure checks, and screening a local programme offers. The test and the timing depend on age, history, and where you live. Changes in periods, pain, or bleeding are worth writing down to show a clinician. Questions about pregnancy or contraception need a clinician or pharmacist, because this app will not choose a product or a dose. If you feel unsafe or may harm yourself, contact local emergency services. In India, Tele-MANAS is 14416. This is education, not a diagnosis.',
      kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯದಲ್ಲಿ ತಡೆಗಟ್ಟುವ ಆರೈಕೆ, ಋತುಚಕ್ರ, ಸಂತಾನೋತ್ಪತ್ತಿ ಆರೋಗ್ಯ ಮತ್ತು ಮಾನಸಿಕ ಯೋಗಕ್ಷೇಮ ಸೇರಿವೆ. ಲಸಿಕೆ, ರಕ್ತದೊತ್ತಡ ಮತ್ತು ಸ್ಥಳೀಯ ಕಾರ್ಯಕ್ರಮದ ತಪಾಸಣೆ ತಡೆಗಟ್ಟುವ ಆರೈಕೆಯ ಭಾಗವಾಗಬಹುದು. ಪರೀಕ್ಷೆ ಮತ್ತು ಸಮಯ ವಯಸ್ಸು, ಇತಿಹಾಸ ಮತ್ತು ನೀವು ವಾಸಿಸುವ ಊರನ್ನು ಅವಲಂಬಿಸಿದೆ. ಮುಟ್ಟಿನ ಬದಲಾವಣೆ, ನೋವು ಅಥವಾ ರಕ್ತಸ್ರಾವವನ್ನು ಬರೆದು ವೈದ್ಯರಿಗೆ ತೋರಿಸಿ. ಗರ್ಭಧಾರಣೆ ಅಥವಾ ಗರ್ಭನಿರೋಧಕ ಪ್ರಶ್ನೆಗಳಿಗೆ ವೈದ್ಯರು ಅಥವಾ ಔಷಧಿಕಾರರು ಬೇಕು. ಈ ಅಪ್ಲಿಕೇಶನ್ ಉತ್ಪನ್ನ ಅಥವಾ ಡೋಸ್ ಆಯ್ಕೆಮಾಡುವುದಿಲ್ಲ. ನೀವು ಅಪಾಯದಲ್ಲಿದ್ದರೆ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ. ಭಾರತದಲ್ಲಿ Tele-MANAS ಸಂಖ್ಯೆ 14416. ಇದು ಶಿಕ್ಷಣ, ರೋಗ ನಿರ್ಣಯವಲ್ಲ.',
    },
    href: '/health',
    link: { en: 'Open the women’s health hub', kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯ ಕೇಂದ್ರ ತೆರೆಯಿರಿ' },
  },
  {
    id: 'appointment',
    keywords: ['prepare for', 'health appointment', 'doctor', 'appointment', 'ವೈದ್ಯರ ಭೇಟಿ', 'ಭೇಟಿಗೆ ಸಿದ್ಧ'],
    title: { en: 'Help me prepare for a health appointment.', kn: 'ವೈದ್ಯರ ಭೇಟಿಗೆ ಸಿದ್ಧವಾಗಲು ಸಹಾಯ ಮಾಡಿ.' },
    body: {
      en: 'A useful note for a visit includes what you feel, when it started, and how it has changed. Also list medicines and supplements, allergies, past illnesses and surgeries, and the questions you want answered. Bring earlier reports if you have them, and a way to contact the person who came with you. This checklist does not replace a clinician’s questions, and it does not decide which test you need.',
      kn: 'ಭೇಟಿಗೆ ಉಪಯುಕ್ತ ಟಿಪ್ಪಣಿಯಲ್ಲಿ ನೀವು ಅನುಭವಿಸುವುದು, ಯಾವಾಗ ಶುರುವಾಯಿತು, ಹೇಗೆ ಬದಲಾಯಿತು ಎಂಬುದು ಇರುತ್ತದೆ. ಔಷಧಿಗಳು ಮತ್ತು ಪೂರಕಗಳು, ಅಲರ್ಜಿ, ಹಳೆಯ ಅಸ್ವಸ್ಥತೆ ಮತ್ತು ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಮತ್ತು ನೀವು ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳನ್ನು ಬರೆಯಿರಿ. ಹಳೆಯ ವರದಿಗಳಿದ್ದರೆ ತನ್ನಿ. ಈ ಪಟ್ಟಿ ವೈದ್ಯರ ಪ್ರಶ್ನೆಗಳ ಸ್ಥಾನ ತೆಗೆದುಕೊಳ್ಳುವುದಿಲ್ಲ ಮತ್ತು ಯಾವ ಪರೀಕ್ಷೆ ಬೇಕು ಎಂದು ನಿರ್ಧರಿಸುವುದಿಲ್ಲ.',
    },
    href: '/passport',
    link: { en: 'Prepare a Care Passport', kn: 'ಕೇರ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಸಿದ್ಧಪಡಿಸಿ' },
  },
  {
    id: 'find-hospital',
    keywords: ['find a hospital', 'service i need', 'hospital with the service', 'ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ'],
    title: { en: 'Find a hospital with the service I need.', kn: 'ನನಗೆ ಬೇಕಾದ ಸೇವೆ ಇರುವ ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ.' },
    body: {
      en: 'I do not have your city or the service yet, and this demo cannot search live hospitals, beds, or traffic. The directory in Find hospital is a fictional list saved on this device. Tell me your area and the service you need, such as maternity, emergency, or a general clinic, then open that finder to compare the sample rows. If someone is in immediate danger, use 112 or 108 instead of this list.',
      kn: 'ನಿಮ್ಮ ಊರು ಅಥವಾ ಬೇಕಾದ ಸೇವೆ ಇನ್ನೂ ನನ್ನ ಬಳಿ ಇಲ್ಲ. ಈ ಮಾದರಿ ನೇರ ಆಸ್ಪತ್ರೆ, ಹಾಸಿಗೆ ಅಥವಾ ಸಂಚಾರವನ್ನು ಹುಡುಕಲು ಸಾಧ್ಯವಿಲ್ಲ. ಆಸ್ಪತ್ರೆ ಹುಡುಕಾಟದ ಪಟ್ಟಿ ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಕಾಲ್ಪನಿಕ ಪಟ್ಟಿ. ನಿಮ್ಮ ಪ್ರದೇಶ ಮತ್ತು ಬೇಕಾದ ಸೇವೆಯನ್ನು ಹೇಳಿ — ಉದಾಹರಣೆಗೆ ಪ್ರಸೂತಿ, ತುರ್ತು, ಅಥವಾ ಸಾಮಾನ್ಯ ಚಿಕಿತ್ಸಾಲಯ — ನಂತರ ಆ ಹುಡುಕಾಟದಲ್ಲಿ ಮಾದರಿ ಸಾಲುಗಳನ್ನು ಹೋಲಿಸಿ. ತಕ್ಷಣದ ಅಪಾಯವಿದ್ದರೆ ಈ ಪಟ್ಟಿಗಾಗಿ ಕಾಯದೆ 112 ಅಥವಾ 108 ಬಳಸಿ.',
    },
    href: '/hospitals',
    link: { en: 'Open the fictional hospital finder', kn: 'ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆ ಹುಡುಕಾಟ ತೆರೆಯಿರಿ' },
  },
  {
    id: 'pelvic-screening',
    keywords: ['pelvic health screening', 'pelvic screening', 'pelvic health', 'ಶ್ರೋಣಿ'],
    title: { en: 'When is pelvic health screening required?', kn: 'ಶ್ರೋಣಿ ಆರೋಗ್ಯ ತಪಾಸಣೆ ಯಾವಾಗ ಬೇಕು?' },
    body: {
      en: 'Whether a pelvic examination or screening is appropriate depends on symptoms, age, medical history, and individual risk. There is not one schedule for every person. A clinician can explain what a local programme offers and whether an examination is needed for you. Bleeding that soaks a pad every hour, fainting, or severe pain needs emergency care now. This app does not book a test and does not read a result as a diagnosis.',
      kn: 'ಶ್ರೋಣಿ ಪರೀಕ್ಷೆ ಅಥವಾ ತಪಾಸಣೆ ಸೂಕ್ತವೇ ಎಂಬುದು ಲಕ್ಷಣ, ವಯಸ್ಸು, ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ ಮತ್ತು ವ್ಯಕ್ತಿಯ ಅಪಾಯವನ್ನು ಅವಲಂಬಿಸಿದೆ. ಎಲ್ಲರಿಗೂ ಒಂದೇ ವೇಳಾಪಟ್ಟಿ ಇಲ್ಲ. ಸ್ಥಳೀಯ ಕಾರ್ಯಕ್ರಮ ಏನು ನೀಡುತ್ತದೆ ಮತ್ತು ನಿಮಗೆ ಪರೀಕ್ಷೆ ಬೇಕೇ ಎಂದು ವೈದ್ಯರು ಹೇಳಬಹುದು. ಪ್ರತಿ ಗಂಟೆಗೆ ಪ್ಯಾಡ್ ನೆನೆಯುವ ರಕ್ತಸ್ರಾವ, ಮೂರ್ಛೆ, ಅಥವಾ ತೀವ್ರ ನೋವು ಇದ್ದರೆ ಈಗಲೇ ತುರ್ತು ಆರೈಕೆ. ಈ ಅಪ್ಲಿಕೇಶನ್ ಪರೀಕ್ಷೆ ಬುಕ್ ಮಾಡುವುದಿಲ್ಲ ಮತ್ತು ಫಲಿತಾಂಶವನ್ನು ರೋಗ ನಿರ್ಣಯವಾಗಿ ಓದುವುದಿಲ್ಲ.',
    },
    href: '/health/screening',
    link: { en: 'Open screening notes', kn: 'ತಪಾಸಣೆ ಟಿಪ್ಪಣಿಗಳನ್ನು ತೆರೆಯಿರಿ' },
  },
  {
    id: 'limits',
    keywords: ['what can you', 'what can this', 'cannot do', 'ನೀವು ಏನು', 'ಮಿತಿ'],
    title: { en: 'What can this assistant not do?', kn: 'ಈ ಸಹಾಯಕಿ ಏನು ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ?' },
    body: {
      en: 'It cannot diagnose, exclude a disease, read a photo as proof, prescribe, choose a dose, or change a clinician’s plan. Urgent rules on this device override any generated sentence. If you may be in danger, contact local emergency services.',
      kn: 'ಇದು ರೋಗ ನಿರ್ಣಯ ಮಾಡಲು, ರೋಗವನ್ನು ತಳ್ಳಿಹಾಕಲು, ಫೋಟೋವನ್ನು ಸಾಬೀತಾಗಿ ಓದಲು, ಔಷಧಿ ಬರೆಯಲು, ಡೋಸ್ ಆಯ್ಕೆಮಾಡಲು, ಅಥವಾ ವೈದ್ಯರ ಯೋಜನೆ ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ಅಪಾಯವಿದ್ದರೆ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    },
    href: '/privacy',
    link: { en: 'Open privacy controls', kn: 'ಗೌಪ್ಯತೆ ನಿಯಂತ್ರಣ ತೆರೆಯಿರಿ' },
  },
  {
    id: 'offline-hospital',
    keywords: ['cached hospital', 'offline hospital', 'saved hospital', 'without internet', 'search hospitals', 'ಆಫ್‌ಲೈನ್ ಆಸ್ಪತ್ರೆ', 'ಉಳಿಸಿದ ಆಸ್ಪತ್ರೆ'],
    title: { en: 'Can I search hospitals without internet?', kn: 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಆಸ್ಪತ್ರೆ ಹುಡುಕಬಹುದೇ?' },
    body: {
      en: 'You can search the fictional directory that was last saved on this device. Phone numbers in that list are fake demo numbers. Bed counts, doctors, and traffic cannot be refreshed while you are offline. Read the last sync time before you rely on a number.',
      kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಕೊನೆಯದಾಗಿ ಉಳಿಸಿದ ಕಾಲ್ಪನಿಕ ಪಟ್ಟಿಯನ್ನು ಹುಡುಕಬಹುದು. ಆ ಸಂಖ್ಯೆಗಳು ನಕಲಿ ಮಾದರಿ ಸಂಖ್ಯೆಗಳು. ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಹಾಸಿಗೆ, ವೈದ್ಯರು, ಅಥವಾ ಸಂಚಾರವನ್ನು ನವೀಕರಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ಸಂಖ್ಯೆಯನ್ನು ನಂಬುವ ಮೊದಲು ಕೊನೆಯ ಸಿಂಕ್ ಸಮಯವನ್ನು ಓದಿ.',
    },
    href: '/offline',
    link: { en: 'Search the offline directory', kn: 'ಆಫ್‌ಲೈನ್ ಡೈರೆಕ್ಟರಿ ಹುಡುಕಿ' },
  },
  {
    id: 'anemia-word',
    keywords: ['what is anemia', 'what is anaemia', 'anemia mean', 'anaemia mean', 'ರಕ್ತಹೀನತೆ ಎಂದರೇನು', 'ಅನೀಮಿಯಾ'],
    title: { en: 'What does anemia mean, in plain words?', kn: 'ರಕ್ತಹೀನತೆ ಎಂದರೆ ಸರಳವಾಗಿ ಏನು?' },
    body: {
      en: 'People use the word anemia when there are fewer healthy red blood cells, or less hemoglobin, than a reference expects. Only a clinician can say whether that word fits you. Symptoms such as tiredness overlap with many other conditions. A fingernail photo cannot decide it.',
      kn: 'ಉಲ್ಲೇಖಕ್ಕಿಂತ ಆರೋಗ್ಯಕರ ಕೆಂಪು ರಕ್ತ ಕಣಗಳು ಅಥವಾ ಹಿಮೋಗ್ಲೋಬಿನ್ ಕಡಿಮೆ ಇದ್ದಾಗ ರಕ್ತಹೀನತೆ ಎಂಬ ಪದವನ್ನು ಬಳಸುತ್ತಾರೆ. ಆ ಪದ ನಿಮಗೆ ಹೊಂದುತ್ತದೆಯೇ ಎಂದು ವೈದ್ಯರು ಮಾತ್ರ ಹೇಳಬಹುದು. ಆಯಾಸ ಬೇರೆ ಹಲವು ಸ್ಥಿತಿಗಳಲ್ಲಿಯೂ ಇರುತ್ತದೆ. ಉಗುರಿನ ಫೋಟೋ ಇದನ್ನು ನಿರ್ಧರಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    },
    href: '/health/iron',
    link: { en: 'Open IronWise', kn: 'IronWise ತೆರೆಯಿರಿ' },
  },
  {
    id: 'flush',
    keywords: ['hot flash', 'hot flush', 'menopause', 'perimenopause', 'ಬಿಸಿ ಉಕ್ಕು', 'ರಜೋನಿವೃತ್ತಿ'],
    title: { en: 'What is a hot flush note for?', kn: 'ಬಿಸಿ ಉಕ್ಕುವಿಕೆಯ ಟಿಪ್ಪಣಿ ಯಾವುದಕ್ಕೆ?' },
    body: {
      en: 'Writing down sleep, mood, and flushes gives a clinician a timeline. It does not prove menopause. Bleeding after periods have stopped for a year should be assessed by a clinician, even if flushes are your main concern.',
      kn: 'ನಿದ್ರೆ, ಮನಸ್ಸು ಮತ್ತು ಬಿಸಿ ಉಕ್ಕುವಿಕೆಯನ್ನು ಬರೆದಿಡುವುದು ವೈದ್ಯರಿಗೆ ಕಾಲರೇಖೆ ಕೊಡುತ್ತದೆ. ಅದು ರಜೋನಿವೃತ್ತಿ ಎಂದು ಸಾಬೀತುಪಡಿಸುವುದಿಲ್ಲ. ಮುಟ್ಟು ಒಂದು ವರ್ಷ ನಿಂತ ನಂತರ ರಕ್ತಸ್ರಾವವಿದ್ದರೆ ವೈದ್ಯರ ಪರೀಕ್ಷೆ ಬೇಕು.',
    },
    href: '/health/meno',
    link: { en: 'Open MenoMap', kn: 'MenoMap ತೆರೆಯಿರಿ' },
  },
]

export function matchFaq(message: string) {
  const text = message.toLowerCase()
  let best: { faq: Faq; score: number } | null = null
  for (const faq of FAQS) {
    const score = faq.keywords.reduce((count, word) => count + (text.includes(word.toLowerCase()) ? 1 : 0), 0)
    if (score > 0 && (!best || score > best.score)) best = { faq, score }
  }
  return best?.faq ?? null
}

export function suggestLinks(message: string) {
  const text = message.toLowerCase()
  const links: { href: string; label: Copy }[] = []
  if (/hospital|ಆಸ್ಪತ್ರೆ|bed|traffic/.test(text)) links.push({ href: '/hospitals', label: { en: 'Open hospital finder', kn: 'ಆಸ್ಪತ್ರೆ ಹುಡುಕಾಟ ತೆರೆಯಿರಿ' } })
  if (/pregnan|ಗರ್ಭ|trimester/.test(text)) links.push({ href: '/health/mama', label: { en: 'Open MamaSignal', kn: 'MamaSignal ತೆರೆಯಿರಿ' } })
  if (/iron|anemia|anaemia|ಕಬ್ಬಿಣ|ರಕ್ತಹೀನ/.test(text)) links.push({ href: '/health/iron', label: { en: 'Open IronWise', kn: 'IronWise ತೆರೆಯಿರಿ' } })
  if (/report|hemoglobin|ಹಿಮೋಗ್ಲೋಬಿನ್|scan/.test(text)) links.push({ href: '/scan', label: { en: 'Open the report scanner', kn: 'ವರದಿ ಸ್ಕ್ಯಾನರ್ ತೆರೆಯಿರಿ' } })
  return links.slice(0, 3)
}

export const defaultFaqBody: Copy = {
  en: 'I can explain the health topics saved on this device, such as iron-rich foods, what to carry to a visit, or how the fictional hospital list works. I cannot diagnose or prescribe. If you feel very unwell, contact local emergency services.',
  kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ವಿಷಯಗಳನ್ನು ನಾನು ವಿವರಿಸಬಲ್ಲೆ — ಕಬ್ಬಿಣದ ಆಹಾರ, ಭೇಟಿಗೆ ಏನು ತೆಗೆದುಕೊಳ್ಳಬಹುದು, ಅಥವಾ ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆ ಪಟ್ಟಿ. ನಾನು ರೋಗ ನಿರ್ಣಯ ಮಾಡಲು ಅಥವಾ ಔಷಧಿ ಬರೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ. ತುಂಬಾ ಅಸ್ವಸ್ಥರಾಗಿದ್ದರೆ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
}
