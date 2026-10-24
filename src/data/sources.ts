export type HealthSource = {
  id: string
  title: string
  org: string
  url: string
  /** Date this URL was confirmed to respond. A live check can refresh it. */
  listedOn: string
}

/** Public pages checked on 24 Oct 2026. Do not add a URL that has not been requested. */
export const HEALTH_SOURCES: HealthSource[] = [
  { id: 'nhs-period-pain', title: 'Period pain', org: 'NHS', url: 'https://www.nhs.uk/conditions/period-pain/', listedOn: '2026-10-24' },
  { id: 'nhs-heavy', title: 'Heavy periods', org: 'NHS', url: 'https://www.nhs.uk/conditions/heavy-periods/', listedOn: '2026-10-24' },
  { id: 'nhs-pcos', title: 'Polycystic ovary syndrome', org: 'NHS', url: 'https://www.nhs.uk/conditions/polycystic-ovary-syndrome-pcos/', listedOn: '2026-10-24' },
  { id: 'nhs-endo', title: 'Endometriosis', org: 'NHS', url: 'https://www.nhs.uk/conditions/endometriosis/', listedOn: '2026-10-24' },
  { id: 'nhs-discharge', title: 'Vaginal discharge', org: 'NHS', url: 'https://www.nhs.uk/conditions/vaginal-discharge/', listedOn: '2026-10-24' },
  { id: 'nhs-iron', title: 'Iron deficiency anaemia', org: 'NHS', url: 'https://www.nhs.uk/conditions/iron-deficiency-anaemia/', listedOn: '2026-10-24' },
  { id: 'nhs-uti', title: 'Urinary tract infections', org: 'NHS', url: 'https://www.nhs.uk/conditions/urinary-tract-infections-utis/', listedOn: '2026-10-24' },
  { id: 'nhs-menopause', title: 'Menopause', org: 'NHS', url: 'https://www.nhs.uk/conditions/menopause/', listedOn: '2026-10-24' },
  { id: 'nhs-breast', title: 'Breast lump', org: 'NHS', url: 'https://www.nhs.uk/conditions/breast-lump/', listedOn: '2026-10-24' },
  { id: 'nhs-eczema', title: 'Atopic eczema', org: 'NHS', url: 'https://www.nhs.uk/conditions/atopic-eczema/', listedOn: '2026-10-24' },
  { id: 'nhs-itchy', title: 'Itchy skin', org: 'NHS', url: 'https://www.nhs.uk/conditions/itchy-skin/', listedOn: '2026-10-24' },
  { id: 'nhs-missed', title: 'Missed or late periods', org: 'NHS', url: 'https://www.nhs.uk/symptoms/missed-or-late-periods/', listedOn: '2026-10-24' },
  { id: 'nhs-preg-bleed', title: 'Vaginal bleeding in pregnancy', org: 'NHS', url: 'https://www.nhs.uk/pregnancy/related-conditions/common-symptoms/vaginal-bleeding/', listedOn: '2026-10-24' },
  { id: 'nhs-mood', title: 'Low mood, sadness and depression', org: 'NHS', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/low-mood-sadness-depression/', listedOn: '2026-10-24' },
  { id: 'who-anaemia', title: 'Anaemia fact sheet', org: 'World Health Organization', url: 'https://www.who.int/news-room/fact-sheets/detail/anaemia', listedOn: '2026-10-24' },
  { id: 'who-endo', title: 'Endometriosis fact sheet', org: 'World Health Organization', url: 'https://www.who.int/news-room/fact-sheets/detail/endometriosis', listedOn: '2026-10-24' },
  { id: 'who-pcos', title: 'Polycystic ovary syndrome fact sheet', org: 'World Health Organization', url: 'https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome', listedOn: '2026-10-24' },
  { id: 'who-menopause', title: 'Menopause fact sheet', org: 'World Health Organization', url: 'https://www.who.int/news-room/fact-sheets/detail/menopause', listedOn: '2026-10-24' },
  { id: 'who-depression', title: 'Depression fact sheet', org: 'World Health Organization', url: 'https://www.who.int/news-room/fact-sheets/detail/depression', listedOn: '2026-10-24' },
  { id: 'medline-anemia', title: 'Anemia', org: 'MedlinePlus', url: 'https://medlineplus.gov/anemia.html', listedOn: '2026-10-24' },
  { id: 'medline-vaginitis', title: 'Vaginitis', org: 'MedlinePlus', url: 'https://medlineplus.gov/vaginitis.html', listedOn: '2026-10-24' },
  { id: 'medline-rashes', title: 'Rashes', org: 'MedlinePlus', url: 'https://medlineplus.gov/rashes.html', listedOn: '2026-10-24' },
  { id: 'amb', title: 'Anemia Mukt Bharat', org: 'Ministry of Health and Family Welfare, India', url: 'https://anemiamuktbharat.info/', listedOn: '2026-10-24' },
]

export function sourceById(id: string) {
  return HEALTH_SOURCES.find((source) => source.id === id) ?? null
}
