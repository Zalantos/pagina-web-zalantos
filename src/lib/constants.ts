export const BRAND = 'zalantos'

export const COLORS = {
  primary: '#0B2A3C',
  value: '#2FBF71',
  neutral: '#6F7A83',
  white: '#FFFFFF',
} as const

export const CONTACT_EMAIL = 'contacto@zalantos.com'

// NAP visible: debe coincidir con el PostalAddress del schema (src/lib/schemas.ts)
export const CONTACT_ADDRESS = {
  street: 'Padre Mariano 210, Oficina 405',
  locality: 'Providencia',
  region: 'Región Metropolitana',
  country: 'Chile',
} as const

export const SITE_URL = 'https://zalantos.com'

export const LINKS = {
  home: '/',
  solutions: '/soluciones/',
  ai: '/inteligencia-artificial-empresarial/',
  about: '/nosotros/',
  contact: '/contacto/',
  schedule: '/contacto/?agendar=1',
  aiConsultant: '/consultor-ia/',
  blog: '/blog/',
  privacy: '/privacy/',
} as const

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/zalantos/',
} as const

export const WORKER_BASE_URL =
  'https://silent-union-0457.tom-s-account-3d0.workers.dev'
export const LEAD_REGISTER_URL = `${WORKER_BASE_URL}/lead/register`
export const CHAT_API_URL = `${WORKER_BASE_URL}/chat`

export const CONTACT_WEBHOOK_URL =
  'https://n8n.venturanalytic.com/webhook/95513fc5-bf2c-4d4f-b5d8-e5ab229e8629'

export const CONSENT_VERSION = '2026-01-07'

export const STORAGE_KEYS = {
  SESSION_ID: 'zalantos_session_id',
  LEAD_ID: 'zalantos_lead_id',
  LEAD_SESSION_ID: 'zalantos_lead_session_id',
  CONSENT_VERSION: 'zalantos_consent_version',
  CONSENTED_AT: 'zalantos_consented_at',
} as const
