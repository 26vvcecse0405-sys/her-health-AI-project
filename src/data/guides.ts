import type { Copy } from '../types'

export type GuideSection = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

export type GuideTopic = {
  id: string
  keywords: string[]
  href: string
  link: Copy
  sections: GuideSection[]
  followUp: string
}

function block(sections: GuideSection[], followUp: string) {
  const parts = sections.map((section) => {
    const lines = [`# ${section.heading}`]
    if (section.paragraphs) lines.push(...section.paragraphs)
    if (section.bullets) lines.push(...section.bullets.map((item) => `- ${item}`))
    return lines.join('\n')
  })
  parts.push(`# Let's understand your symptoms better\n${followUp}`)
  return parts.join('\n\n')
}

export function renderGuide(topic: GuideTopic) {
  return block(topic.sections, topic.followUp)
}

export const GUIDES: GuideTopic[] = [
  {
    id: 'bleeding-urgent',
    keywords: ['bleeding heavily', 'heavy bleeding', 'feeling faint', 'feel faint', 'soaking through', 'soaking a pad', 'soaking pads'],
    href: '/hospitals?need=emergency',
    link: { en: 'See fictional emergency-listed hospitals', kn: 'ತುರ್ತು ಸೇವೆ ನಮೂದಿಸಿದ ಕಾಲ್ಪನಿಕ ಆಸ್ಪತ್ರೆಗಳನ್ನು ನೋಡಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Heavy bleeding together with feeling faint needs urgent care now. Lie down, ask someone to stay with you, and do not drive. In India, call 112 or 108. This chat cannot examine you or stop the bleeding.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'A very heavy period.',
          'A pregnancy-related bleed, including a pregnancy outside the uterus.',
          'A bleeding tendency, fibroids, or another condition a clinician must check.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Lie flat and keep warm while help is arranged.',
          'Note the time the bleeding became heavy and how many pads you have soaked.',
          'Say whether pregnancy is possible, and list medicines you take.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['At a hospital, staff may check your pulse, a pregnancy test, and a blood count, and may give fluids or medicines. Which treatment is used depends on the cause. Do not start hormonal pills or someone else’s prescription while you are faint.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['Seek urgent care now for fainting, dizziness, a pad soaked every hour, severe pain, or shoulder-tip pain. Do not wait for a routine clinic appointment.'],
      },
    ],
    followUp: 'If you are already with a clinician, tell them when the bleeding started and whether pregnancy is possible.',
  },
  {
    id: 'irregular-periods',
    keywords: ['irregular period', 'irregular cycle', 'periods are irregular', 'cycle is irregular', 'uneven period'],
    href: '/health/endo',
    link: { en: 'Open the cycle journal', kn: 'ಋತುಚಕ್ರ ದಿನಚರಿ ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Irregular periods can happen for several reasons. How much it matters depends on your age, what your cycle was like before, and any other symptoms. A short message cannot name one cause.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'Hormonal changes, especially in the first few years after periods begin, or in the years before menopause.',
          'Stress, poor sleep, a big change in meals, exercise, or body weight.',
          'Thyroid problems, or a pattern sometimes called PCOS.',
          'Pregnancy, if pregnancy is possible.',
          'Some medicines, or another health condition.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Write the first day of each period, how many days bleeding lasts, and any pain or mood change.',
          'Keep regular meals, sleep, and a steady daily routine where you can.',
          'If pregnancy is possible, do a pregnancy test before considering any hormonal medicine.',
          'Arrange a visit if the irregularity is new, periods stop, or the pattern is unusual for you.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['Treatment depends on the cause. A clinician may suggest watching the cycle, blood tests, or a hormonal medicine when it fits your situation. Do not start hormonal pills or other prescription medicines from this chat.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['Book a routine visit if irregularity continues for a few months. Seek urgent care the same day for very heavy bleeding with dizziness or fainting, severe abdominal or pelvic pain, or possible pregnancy with pain or bleeding.'],
      },
    ],
    followUp: 'When did your last period start, and have your periods always been irregular or did this begin recently?',
  },
  {
    id: 'painful-periods',
    keywords: ['period cramp', 'cramps', 'cramp', 'painful period', 'menstrual pain', 'dysmenorrhea', 'severe period'],
    href: '/health/endo',
    link: { en: 'Open the pain journal', kn: 'ನೋವಿನ ದಿನಚರಿ ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Period cramps are common. The uterus tightens because of natural chemicals called prostaglandins. Pain that stops you walking, working, or sleeping still deserves a proper look, even though many people have cramps.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'Ordinary period contractions, which often ease after the first day or two.',
          'A heavier bleed, which can make cramps stronger.',
          'Conditions such as endometriosis or fibroids, which a clinician would need to assess. Pain alone does not prove either one.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Rest with a warm pack or warm bath on the lower abdomen.',
          'Gentle walking can help some people. Stop if pain suddenly worsens.',
          'Sip water and eat something small so an empty stomach does not add to the discomfort.',
          'Write down which day of the bleed is worst and whether the pain is getting worse over months.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['Paracetamol and ibuprofen are commonly used for period pain. Ibuprofen is an anti-inflammatory. It is not suitable for everyone, including some people who are pregnant, have a stomach ulcer, kidney disease, or asthma triggered by similar medicines. A pharmacist can help you choose. This chat will not pick a dose. If pain returns every cycle and limits daily life, a clinician may discuss hormonal treatment or tests. Do not start those on your own.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['See a clinician if cramps are new, worsening, or paired with pain during sex or when opening the bowels. Seek urgent care for fainting, fever, pain on one side with dizziness, or bleeding that soaks a pad every hour.'],
      },
    ],
    followUp: 'Is the pain only on the first days of bleeding, and does it stop you from your usual activities?',
  },
  {
    id: 'missed-period',
    keywords: ['missed period', 'late period', 'periods stopped', 'no period', 'period is late', 'amenorrhea'],
    href: '/health/mama',
    link: { en: 'Open pregnancy notes', kn: 'ಗರ್ಭಧಾರಣೆ ಟಿಪ್ಪಣಿಗಳನ್ನು ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['A missed or late period has many explanations. If pregnancy is possible, that is the first question to settle, because it changes which medicines are safe.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'Pregnancy.',
          'Stress, illness, travel, weight change, or hard exercise.',
          'Thyroid problems, PCOS, or the transition toward menopause.',
          'Hormonal contraception or another medicine.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'If pregnancy is possible, use a urine pregnancy test. Follow the timing on the pack, often from the first day of a missed period.',
          'Note the first day of the last bleed and any new medicine.',
          'Do not start hormonal pills to “bring on” a period without an assessment.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['There is no single medicine for a late period. A clinician chooses tests, and treatment only after a likely cause is clearer. A negative pregnancy test with months of no bleeding still deserves a visit.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['Seek urgent care for severe one-sided pain, fainting, or bleeding with dizziness. Book a visit if you have missed three cycles, or if a pregnancy test is positive.'],
      },
    ],
    followUp: 'Is pregnancy possible, and when did your last period start?',
  },
  {
    id: 'heavy-period',
    keywords: ['heavy period', 'heavy periods', 'flooding', 'clots', 'changing a pad'],
    href: '/health/endo',
    link: { en: 'Open the bleeding journal', kn: 'ರಕ್ತಸ್ರಾವ ದಿನಚರಿ ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['A heavy period means different things to different people. Soaking through protection often, passing large clots, or bleeding that leaves you dizzy is more than an inconvenience.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'Hormonal change, fibroids, or a polyp.',
          'A bleeding tendency, thyroid problems, or a copper intrauterine device.',
          'Pregnancy-related bleeding, which should not be treated as an ordinary period.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Count pads or cups and note clots and the number of days.',
          'Keep iron-rich meals such as leafy greens and lentils, with a fruit rich in vitamin C. This supports the body. It does not replace a blood test.',
          'Avoid aspirin unless a clinician has asked you to take it, because it can increase bleeding.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['Clinicians sometimes use anti-inflammatory pain relief, hormonal methods, iron treatment, or procedures for fibroids. The choice depends on whether you want to become pregnant, the blood count, and the cause. This chat will not choose one for you.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['Arrange a visit if every period is heavy. Seek urgent care the same day if you feel faint, soak a pad every hour, or have severe pain.'],
      },
    ],
    followUp: 'How often are you changing protection, and do you feel dizzy during the bleed?',
  },
  {
    id: 'period-hygiene',
    keywords: ['menstrual hygiene', 'period hygiene', 'period tracking', 'how do i track', 'track my period', 'pad or tampon', 'menstrual cup'],
    href: '/health/endo',
    link: { en: 'Open the cycle journal', kn: 'ಋತುಚಕ್ರ ದಿನಚರಿ ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Clean period care and a simple record make both comfort and clinic visits easier. Products differ. The right one is the one you can change regularly and use safely.'],
      },
      {
        heading: 'Possible causes',
        paragraphs: ['Irritation, odor, or worry about leaks is often about how long a product stays in place, sensitivity to a material, or a normal change in discharge. It is not, by itself, an infection.'],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Change a pad or tampon every 4 to 8 hours, and empty a cup on the schedule you were shown. Wash your hands before and after.',
          'Wash the vulva with water. Internal washing and scented products often irritate the area.',
          'Track the first day of bleeding, the number of days, and pain or mood on those days.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['Most hygiene problems settle with a product change and gentle washing. A clinician looks for infection only if there is itch, an unusual smell, sores, or pain. No antibiotic is needed for ordinary period care.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['Seek urgent care for fever, a rash, vomiting, and dizziness while using a tampon. Those can be signs of a rare reaction. See a clinician for sores, a new strong smell, or bleeding between periods.'],
      },
    ],
    followUp: 'Are you trying to choose a product, or trying to keep a record of your cycle?',
  },
  {
    id: 'pcos',
    keywords: ['pcos', 'polycystic', 'polycystic ovary'],
    href: '/health/reproductive',
    link: { en: 'Open reproductive health notes', kn: 'ಸಂತಾನೋತ್ಪತ್ತಿ ಆರೋಗ್ಯ ಟಿಪ್ಪಣಿಗಳನ್ನು ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['PCOS is a hormonal pattern some clinicians diagnose using periods, symptoms, and sometimes blood tests or an ultrasound. Reading a list of symptoms does not mean you have it. Irregular periods have other causes too.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'People who are assessed for PCOS often describe irregular periods.',
          'Acne, hair growth on the face or body, or thinning hair on the scalp can be part of the pattern.',
          'Weight change and a family history sometimes appear alongside it. They do not prove it.',
          'Insulin and hormone signals are involved. The exact mix differs from person to person.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Track period dates and the symptoms you notice.',
          'Regular meals, movement you can sustain, and sleep support overall health whether or not PCOS is later confirmed.',
          'Ask a clinician which tests, if any, fit your history. Do not order or interpret scans on your own.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['If a clinician confirms the pattern, options can include cycle tracking, support for glucose and cholesterol, and sometimes hormonal or other medicines. The choice depends on whether pregnancy is a goal and on other health conditions. Do not start those medicines from this chat.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['Book a visit for irregular periods plus acne or unusual hair growth, or if you have been trying for pregnancy. Seek urgent care for severe pain, fainting, or very heavy bleeding.'],
      },
    ],
    followUp: 'Are your periods irregular, and have you noticed acne or a change in hair growth?',
  },
  {
    id: 'endometriosis',
    keywords: ['endometriosis', 'endo pain', 'painful sex', 'pain opening bowels'],
    href: '/health/endo',
    link: { en: 'Open the symptom journal', kn: 'ಲಕ್ಷಣ ದಿನಚರಿ ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Endometriosis means tissue similar to the uterine lining grows outside the uterus. It can cause pain, but pain has many other causes. Only a clinician can assess it. Surgery is sometimes used to confirm it, and it is not the first step for everyone.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'Painful periods that limit school or work.',
          'Pain during sex, or when opening the bowels, especially around a period.',
          'Trouble becoming pregnant is sometimes part of the story. It is not proof.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Keep a pain diary: day of the cycle, what you were doing, and what eased it.',
          'Warmth and ordinary period-pain self-care can help while you wait for a visit.',
          'Bring the diary. It helps a clinician more than a single bad day remembered later.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['Care may include pain relief, hormonal treatment, physiotherapy for pelvic pain, or surgery. None of these is right for every person. This chat will not choose a prescription or an operation.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['See a clinician if period pain is worsening or sex is painful. Seek urgent care for fainting, fever, or sudden severe one-sided pain.'],
      },
    ],
    followUp: 'Is the pain mainly during periods, or does it also happen between periods or during sex?',
  },
  {
    id: 'discharge',
    keywords: ['vaginal discharge', 'unusual discharge', 'discharge', 'yeast', 'thrush', 'fishy smell', 'itchy vagina'],
    href: '/health/reproductive',
    link: { en: 'Open reproductive health notes', kn: 'ಸಂತಾನೋತ್ಪತ್ತಿ ಆರೋಗ್ಯ ಟಿಪ್ಪಣಿಗಳನ್ನು ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Some vaginal discharge is normal. It often changes from clear and stretchy to thicker and white across the cycle. A new color, smell, itch, or pain is a reason to look more carefully. This description cannot name an infection.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'Normal hormonal change through the cycle or pregnancy.',
          'Thrush, which often itches and looks thick and white.',
          'Bacterial vaginosis, which can smell fishy and look thin and grey.',
          'A sexually transmitted infection, a forgotten tampon, or irritation from soap or douching.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Wash the outside with water only. Do not douche or use scented washes.',
          'Wear cotton underwear and change out of damp clothes.',
          'Note the color, smell, itch, and whether sex was recently unprotected.',
          'Do not start a leftover antibiotic or a partner’s medicine.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['A pharmacist can sometimes advise an antifungal for a typical itchy thrush in someone who is not pregnant and has had it before. Other causes need a test. Antibiotics, when they are needed, depend on the germ. Do not guess an antibiotic.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['See a clinician for a new smell, green or bloody discharge, sores, pelvic pain, fever, or discharge in pregnancy. Seek urgent care for severe pain or fainting.'],
      },
    ],
    followUp: 'What color is the discharge, and is there itch, a strong smell, or pelvic pain?',
  },
  {
    id: 'urinary',
    keywords: ['urinary', 'urine', 'when i pee', 'burning when', 'uti', 'cystitis', 'peeing often'],
    href: '/health',
    link: { en: 'Open the women’s health hub', kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯ ಕೇಂದ್ರ ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Burning, urgency, or needing to pass urine often can be a bladder infection. The same feelings can come from irritation, a sexually transmitted infection, or lower estrogen after menopause. A message cannot tell these apart.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'A bladder infection.',
          'Irritation from soap, dehydration, or holding urine for a long time.',
          'An infection passed during sex, or vaginal dryness.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Drink water through the day and do not delay passing urine.',
          'Pass urine after sex if that has helped you before.',
          'Avoid leftover antibiotics. The wrong one can hide a problem that needs a urine test.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['A clinician may check the urine before choosing an antibiotic. Pain relief such as paracetamol can ease discomfort while you are assessed. The antibiotic, if one is needed, depends on pregnancy, allergies, and local resistance. This chat will not name a course for you.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['See a clinician today for burning that lasts, blood in the urine, or symptoms in pregnancy. Seek urgent care for fever, pain in the side or back, vomiting, or confusion.'],
      },
    ],
    followUp: 'Do you have fever or pain in your back, and is pregnancy possible?',
  },
  {
    id: 'pregnancy',
    keywords: ['pregnancy', 'pregnant', 'morning sickness', 'pregnancy test', 'missed my period', 'antenatal'],
    href: '/health/mama',
    link: { en: 'Open MamaSignal', kn: 'MamaSignal ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Questions about pregnancy deserve a clear next step, not a guess from symptoms. Nausea, tender breasts, and tiredness can happen in early pregnancy and also for other reasons.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'A positive test means pregnancy is likely. The test does not show where the pregnancy is or how it is progressing.',
          'A late period with a negative test can still be stress, thyroid change, or a test taken too early.',
          'Bleeding in pregnancy is not always an emergency, but pain with bleeding needs urgent care.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Use a urine test if your period is late and pregnancy is possible. Repeat it in a few days if it is negative and the period does not start.',
          'Avoid alcohol and smoking. Ask a pharmacist before taking any medicine, including pain relief.',
          'A clinician or pharmacist can advise on folic acid, which is commonly suggested when pregnancy is possible. This chat will not set a dose.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['Antenatal care checks blood pressure, blood count, and how the pregnancy is growing. Medicines for nausea or other symptoms are chosen for pregnancy safety. Do not use a medicine labelled for someone else.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['Book antenatal care after a positive test. Seek urgent care for bleeding with pain, fainting, severe headache, visual change, or a sudden swell of the face or hands later in pregnancy.'],
      },
    ],
    followUp: 'Is your period late, and have you already taken a pregnancy test?',
  },
  {
    id: 'menopause',
    keywords: ['menopause', 'perimenopause', 'hot flush', 'hot flash', 'night sweat', 'vaginal dryness'],
    href: '/health/meno',
    link: { en: 'Open MenoMap', kn: 'MenoMap ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Menopause is the point when periods have stopped for twelve months, not because of another cause. The years before that, called perimenopause, can bring uneven periods, flushes, sleep change, and mood change. Those symptoms are common. They still deserve care if they disrupt your life.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'Changing estrogen and progesterone levels.',
          'Thyroid problems can look similar, so a clinician may check that.',
          'Medicines and mood conditions can also disturb sleep and temperature.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Keep the room cool, layer clothing, and limit caffeine and alcohol in the evening if flushes wake you.',
          'Regular movement and a consistent bedtime help sleep.',
          'A plain vaginal moisturiser can ease dryness. Ask before using a hormonal cream.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['Menopausal hormone therapy helps some people with flushes and dryness. It is not suitable for everyone, including some people with a history of clots, stroke, or certain breast conditions. Non-hormonal options also exist. A clinician matches the choice to your history. Do not start or stop hormones from this chat.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['See a clinician for bleeding after twelve months without a period, bleeding after sex, or a new breast lump. Book a visit if flushes or mood changes are hard to live with.'],
      },
    ],
    followUp: 'Are your periods still happening, and what bothers you most: flushes, sleep, mood, or dryness?',
  },
  {
    id: 'breast',
    keywords: ['breast lump', 'breast pain', 'breast health', 'nipple discharge', 'lump in my breast', 'dimple'],
    href: '/health/screening',
    link: { en: 'Open screening notes', kn: 'ತಪಾಸಣೆ ಟಿಪ್ಪಣಿಗಳನ್ನು ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Many breast lumps and painful areas are not cancer. A new change still needs a clinician, because looking and, when appropriate, imaging are what sort harmless change from something that needs treatment. This chat cannot do that.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'Hormonal tenderness that comes and goes with the cycle.',
          'A cyst or a benign fibrous area.',
          'Less often, cancer. Skin dimpling, a newly inverted nipple, or bloody nipple discharge need a prompt check.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Note which breast, where the change is, and whether it varies with your period.',
          'Do not try to squeeze a nipple to test discharge.',
          'A supportive bra can ease cyclical pain while you wait for the appointment.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['Care depends on the examination and, if needed, an ultrasound or mammogram. The test and the age to start screening depend on local programmes and your family history. Pain relief may be suggested for cyclical pain. Do not start a hormone medicine to treat a lump.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['See a clinician promptly for a new lump, skin puckering, nipple change, or bloody discharge. Seek urgent care for a red, hot, swollen breast with fever.'],
      },
    ],
    followUp: 'Is this a new lump, cyclical pain, or a change in the nipple or skin?',
  },
  {
    id: 'anemia',
    keywords: ['anemia', 'anaemia', 'iron deficiency', 'low iron', 'low haemoglobin', 'low hemoglobin'],
    href: '/health/iron',
    link: { en: 'Open IronWise', kn: 'IronWise ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['People use the word anemia when a blood test shows fewer healthy red cells, or less hemoglobin, than expected. Tiredness, pale skin, shortness of breath, headaches, or craving ice are reasons to ask for that test. They do not prove the cause, and this chat cannot confirm it from a description.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'Low iron from heavy periods, pregnancy, or too little iron in meals.',
          'Low vitamin B12 or folate.',
          'Long-term illness, or blood loss from the gut. Black stools need a prompt check.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Ask a clinician or a primary health centre for a blood count if tiredness or heavy periods persist.',
          'Leafy greens, lentils, beans, and, if you eat them, eggs, meat, or fish are common iron-rich foods. Fruit with vitamin C at the meal helps the body take up iron from plants.',
          'Tea and coffee with the meal can reduce that uptake. Separate them from the meal when you can.',
          'Bring any earlier blood report to the visit.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['If a test shows low iron, a clinician may suggest food changes and sometimes an iron supplement. The product and the amount depend on the result, pregnancy, and other medicines. Do not copy another person’s iron tablets. This chat will not choose a dose.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['Book a test if tiredness lasts more than a couple of weeks or periods are heavy. Seek urgent care for chest pain, fainting, breathlessness at rest, black stools, or heavy bleeding with dizziness.'],
      },
    ],
    followUp: 'Have you had a blood count, and are your periods heavy or is pregnancy possible?',
  },
  {
    id: 'period-medicine',
    keywords: ['medicine for period', 'taking medicine', 'painkiller', 'ibuprofen', 'paracetamol', 'prescribed medicine', 'my medicine', 'before taking'],
    href: '/health',
    link: { en: 'Open the women’s health hub', kn: 'ಮಹಿಳಾ ಆರೋಗ್ಯ ಕೇಂದ್ರ ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Medicines can ease period pain. They are not all the same, and the safe choice depends on pregnancy, other medicines, and conditions such as stomach ulcers, kidney disease, or asthma. This chat can explain common options. It will not write a prescription or choose a dose.'],
      },
      {
        heading: 'Possible causes',
        paragraphs: ['Period pain is often from uterine contractions. If pain is new or much worse than your usual cramps, the cause may be different, and a painkiller alone is not an assessment.'],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'A warm pack, rest, and a small meal help some people before any tablet.',
          'Read the label of anything already in the house, including combination cold remedies, so you do not double the same ingredient.',
          'Tell a pharmacist if you are pregnant, trying to become pregnant, or taking a blood thinner.',
        ],
      },
      {
        heading: 'Treatment options',
        bullets: [
          'Paracetamol is commonly used for pain. Follow the pack and a pharmacist’s advice. Do not take extra because the pain is strong.',
          'Ibuprofen is an anti-inflammatory commonly used for period pain. Avoid it if you have a stomach ulcer, kidney disease, asthma triggered by similar medicines, or you are later in pregnancy, unless a clinician has said otherwise.',
          'Do not take two anti-inflammatory medicines together.',
          'Hormonal treatment is sometimes used for severe cycle pain. Antibiotics do not treat ordinary cramps. Neither should be started without an assessment.',
          'Do not stop a medicine a clinician has already prescribed because of something you read here.',
        ],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['Ask a pharmacist before the first dose if you have another illness or take regular medicines. See a clinician if you need pain relief every cycle and still cannot manage daily activities. Seek urgent care for fainting, fever, or bleeding that soaks a pad every hour.'],
      },
    ],
    followUp: 'Are you pregnant or trying to become pregnant, and do you already take any regular medicine?',
  },
  {
    id: 'mental-hormones',
    keywords: ['mood', 'pms', 'feeling low', 'anxious before', 'hormonal mood', 'irritable before my period', 'depressed'],
    href: '/health/wellness',
    link: { en: 'Open wellness notes', kn: 'ಯೋಗಕ್ಷೇಮ ಟಿಪ್ಪಣಿಗಳನ್ನು ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Mood can shift before a period, after a birth, or around menopause. That is common, and it is still worth taking seriously when it affects sleep, work, or relationships. A chat cannot tell hormone change from depression or another condition.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'Cycle-related hormone change, including premenstrual symptoms.',
          'Sleep loss, pain, anemia, or thyroid problems.',
          'Depression or anxiety, which can happen at the same time as a cycle change.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Keep a two-week note of sleep, mood, and period days.',
          'Regular meals and a steady bedtime reduce one source of strain.',
          'Tell someone you trust how you feel.',
          'Do not stop a mood medicine suddenly.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['Support can include counselling, cycle-related strategies, and sometimes a medicine chosen by a clinician. Hormonal and antidepressant medicines are not interchangeable, and neither should be started from this chat. In India, Tele-MANAS on 14416 can listen if you need to talk.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['See a clinician if low mood lasts most days for two weeks, or if you cannot function. If you may harm yourself, contact local emergency services now, or 14416 in India, and stay with someone.'],
      },
    ],
    followUp: 'Does the low mood lift after the period starts, or is it present most days?',
  },
  {
    id: 'sexual-health',
    keywords: ['sexual health', 'contraception', 'birth control', 'condom', 'sexually transmitted', 'reproductive health'],
    href: '/health/reproductive',
    link: { en: 'Open reproductive health notes', kn: 'ಸಂತಾನೋತ್ಪತ್ತಿ ಆರೋಗ್ಯ ಟಿಪ್ಪಣಿಗಳನ್ನು ತೆರೆಯಿರಿ' },
    sections: [
      {
        heading: 'Understanding your concern',
        paragraphs: ['Sexual and reproductive health covers contraception, infections, and comfort during sex. A method or a test that suits one person can be wrong for another. This is education, not a choice made for you.'],
      },
      {
        heading: 'Possible causes',
        bullets: [
          'Pregnancy risk depends on the method used and whether it was used every time.',
          'Sores, unusual discharge, or bleeding after sex can be infection or another cause.',
          'Pain with sex can be dryness, infection, or pelvic conditions such as endometriosis.',
        ],
      },
      {
        heading: 'What you can do now',
        bullets: [
          'Condoms reduce the risk of both pregnancy and many infections. They do not remove the risk completely.',
          'If a condom broke and pregnancy is possible, ask a pharmacist or clinician promptly about emergency contraception. Sooner is better. This chat will not choose the product.',
          'Do not douche after sex. It does not prevent infection.',
        ],
      },
      {
        heading: 'Treatment options',
        paragraphs: ['Pills, implants, injections, and intrauterine devices are established options. A family-planning clinician matches one to your blood pressure, migraines, smoking, and whether you want a future pregnancy. Infections, when present, need the right test and sometimes an antibiotic. Do not use a leftover antibiotic.'],
      },
      {
        heading: 'When to seek medical care',
        paragraphs: ['See a clinician for sores, pelvic pain, bleeding after sex, or a missed period after unprotected sex. Seek urgent care for severe one-sided pain or fainting.'],
      },
    ],
    followUp: 'Are you asking about preventing pregnancy, an infection worry, or pain during sex?',
  },
]

function keywordHits(text: string, word: string) {
  if (word.length > 4) return text.includes(word)
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?:^|[^a-z])${escaped}(?:$|[^a-z])`, 'i').test(text)
}

const BLEED = /bleeding heavily|heavy bleeding|soaking through|soaking a pad|soaking pads/
const COLLAPSE = /faint|dizzy|dizziness|light-?headed/

export function isBleedingEmergency(message: string) {
  const text = message.toLowerCase()
  if (/soaking through|soaking a pad|soaking pads/.test(text)) return true
  return BLEED.test(text) && COLLAPSE.test(text)
}

export function matchGuide(message: string): GuideTopic | null {
  const text = message.toLowerCase()
  if (isBleedingEmergency(text)) return GUIDES.find((topic) => topic.id === 'bleeding-urgent') ?? null
  let best: { topic: GuideTopic; score: number } | null = null
  for (const topic of GUIDES) {
    if (topic.id === 'bleeding-urgent') continue
    const score = topic.keywords.reduce((total, word) => total + (keywordHits(text, word) ? word.length : 0), 0)
    if (score > 0 && (!best || score > best.score)) best = { topic, score }
  }
  return best?.topic ?? null
}

export function guideSpeech(text: string) {
  return text.replace(/^# /gm, '').replace(/^- /gm, '')
}

const CONTINUED: Record<string, (note: string) => GuideSection[]> = {
  'irregular-periods': (note) => [
    {
      heading: 'Understanding your concern',
      paragraphs: [`Thank you for adding that: “${note}”. A pattern that is new for you is more useful to a clinician than one you have always had. A short reply still cannot name the cause.`],
    },
    {
      heading: 'What you can do now',
      bullets: [
        'Write the first day of the last period and how many days the bleeding lasted.',
        'If pregnancy is possible, do a pregnancy test before any hormonal medicine.',
        'Bring notes about acne, hair growth, weight change, or a new medicine.',
      ],
    },
    {
      heading: 'When to seek medical care',
      paragraphs: ['Arrange a visit if this change continues. Seek urgent care the same day for fainting, severe pain, or a pad soaked every hour.'],
    },
  ],
  'painful-periods': (note) => [
    {
      heading: 'Understanding your concern',
      paragraphs: [`Thank you. “${note}” helps narrow what to try while you decide on a visit. It does not identify a disease.`],
    },
    {
      heading: 'What you can do now',
      bullets: [
        'Use warmth and rest on the worst hours, and note whether that is enough.',
        'Ask a pharmacist before ibuprofen if you are pregnant or have stomach, kidney, or asthma problems.',
        'Keep a three-cycle pain note if the pain returns.',
      ],
    },
    {
      heading: 'When to seek medical care',
      paragraphs: ['See a clinician if pain stops usual activities. Seek urgent care for fainting, fever, or sudden one-sided pain.'],
    },
  ],
  'bleeding-urgent': () => [
    {
      heading: 'Understanding your concern',
      paragraphs: ['If you still feel faint or the bleeding is still soaking through, stay with urgent care. More detail can wait until you are safe.'],
    },
    {
      heading: 'What you can do now',
      bullets: [
        'Tell the clinician the time the bleeding worsened and whether pregnancy is possible.',
        'List medicines and allergies.',
      ],
    },
    {
      heading: 'When to seek medical care',
      paragraphs: ['Call 112 or 108 in India if you have not reached care yet. Do not travel alone while you feel faint.'],
    },
  ],
}

export function continueGuide(topicId: string, message: string): string | null {
  const build = CONTINUED[topicId] ?? ((note: string) => [
    {
      heading: 'Understanding your concern',
      paragraphs: [`Thank you for adding “${note}”. I will stay with the same concern. This still cannot confirm a cause.`],
    },
    {
      heading: 'What you can do now',
      bullets: [
        'Keep the new detail with the dates and symptoms you already noted.',
        'Take that record to a clinician or pharmacist if you are deciding on a medicine or a test.',
      ],
    },
    {
      heading: 'When to seek medical care',
      paragraphs: ['Seek urgent care for fainting, severe pain, a pad soaked every hour, chest pain, or trouble breathing.'],
    },
  ])
  const note = message.trim().slice(0, 180)
  const follow = GUIDES.find((topic) => topic.id === topicId)?.followUp
    ?? 'Is there a date, a new symptom, or a medicine you want to add?'
  return block(build(note), follow)
}
