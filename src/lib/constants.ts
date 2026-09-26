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

// Datos de verificación de entidad que consumen el schema Organization
// (src/lib/schemas.ts). Cada campo vacío se OMITE del JSON-LD: nunca se publica
// un valor inventado. Para una empresa chilena, RUT + fecha de constitución son
// las señales de verificación más fuertes que puede leer un motor.
//   - rut: formato 'CL-76.123.456-7' (prefijo ISO + RUT con guión)
//   - telefono: formato E.164, '+56912345678'
//   - fechaConstitucion: ISO 'YYYY-MM-DD'
export const ORG_IDENTITY = {
  rut: '',
  telefono: '',
  fechaConstitucion: '',
} as const

export const LINKS = {
  home: '/',
  solutions: '/soluciones/',
  ai: '/inteligencia-artificial-empresarial/',
  about: '/nosotros/',
  contact: '/contacto/',
  schedule: '/contacto/?agendar=1',
  aiConsultant: '/consultor-ia/',
  blog: '/blog/',
  glossary: '/glosario/',
  privacy: '/privacy/',
} as const

export interface NavItem {
  href: string
  label: string
  /** Texto del atributo title en el pie de página. */
  title: string
  /** Prefijo de ruta que marca la sección como activa en el header. */
  match: string
  /** Contacto se renderiza como botón en el header y como enlace más en el footer. */
  cta?: boolean
}

// Única fuente de las secciones del sitio: header y footer recorren esta lista.
// Agregar una sección aquí la publica en ambos menús — no hay dos listas que sincronizar.
export const NAV_ITEMS: readonly NavItem[] = [
  { href: LINKS.home, label: 'Inicio', title: 'Volver al inicio de zalantos', match: '/' },
  {
    href: LINKS.solutions,
    label: 'Soluciones',
    title: 'Ver las etapas del ciclo order to cash que automatizamos',
    match: '/soluciones',
  },
  {
    href: LINKS.ai,
    label: 'IA empresarial',
    title: 'Cómo aplicamos inteligencia artificial en la operación',
    match: '/inteligencia-artificial-empresarial',
  },
  {
    href: LINKS.about,
    label: 'Nosotros',
    title: 'Conocer al equipo de zalantos',
    match: '/nosotros',
  },
  {
    href: LINKS.blog,
    label: 'Blog',
    title: 'Ver artículos de Insights y Casos de zalantos',
    match: '/blog',
  },
  {
    href: LINKS.contact,
    label: 'Contacto',
    title: 'Contactar a zalantos para agendar un Sprint 0',
    match: '/contacto',
    cta: true,
  },
  {
    href: LINKS.aiConsultant,
    label: 'Consultor IA',
    title: 'Probar el Consultor IA de zalantos',
    match: '/consultor-ia',
  },
]

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
