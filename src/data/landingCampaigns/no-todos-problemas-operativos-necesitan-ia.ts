import type { LinkedInCampaignContent } from '../../types/linkedinCampaignLanding'

export const landingContent: LinkedInCampaignContent = {
  meta: {
    title: 'Sprint 0 — Diagnóstico operativo | zalantos',
    description:
      'Sprint 0 de bajo riesgo: entendemos el proceso, clarificamos los datos y proponemos la solución correcta antes de automatizar o aplicar IA.',
  },
  eyebrow: 'No necesitas IA si no resuelve tu dolor',
  headline: 'No todos los problemas operativos necesitan IA',
  subheadline:
    'Hoy muchas empresas sienten presión por "subirse a la IA" y parten por la herramienta en lugar de entender el problema operativo. En zalantos arrancamos por el diagnóstico, definimos qué fricción duele y luego proponemos la solución correcta.',
  bullets: [
    'Integrar sistemas que hoy no se hablan',
    'Ordenar datos dispersos para tomar decisiones claras',
    'Eliminar carga manual y fricción operativa',
  ],
  primaryCta: {
    label: 'Agendar Sprint 0',
    href: '/contacto/?agendar=1',
  },
  secondaryCta: {
    label: 'Hablar con el Consultor IA',
    href: '/consultor-ia/',
  },
  chips: [
    'Diagnóstico en 1 semana',
    'Sin costo inicial',
    'Tecnología a la medida',
    'IA solo si suma',
  ],
  trustLine:
    'La mejor tecnología no es la más sofisticada; es la que resuelve el problema con menor costo, menor fricción y mayor control.',
  visual: {
    title: 'Sprint 0 — Plan claro y concreto',
    subtitle: 'Del dolor operativo al plan de acción',
    badge: '1 semana',
    steps: [
      { label: 'Contexto', detail: 'Entrevista, datos y criterios de éxito' },
      { label: 'Diagnóstico', detail: 'Mapa de proceso, gap de datos y riesgos' },
      { label: 'Plan', detail: 'Quick wins priorizados y siguiente fase' },
    ],
  },
  links: {
    siteUrl: '/',
    backToSiteLabel: 'volver al sitio',
  },
  footerLine: '© zalantos',
}
