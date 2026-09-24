import type { LinkedInCampaignContent } from '../../types/linkedinCampaignLanding'

export const landingContent: LinkedInCampaignContent = {
  meta: {
    title: 'Datos en orden: la base de cualquier proyecto de IA o automatización | zalantos',
    description:
      'Antes de implementar IA o automatizar procesos, su organización necesita una arquitectura de datos confiable. Diagnóstico gratuito en 1 semana con Sprint 0.',
  },
  eyebrow: 'ARQUITECTURA DE DATOS',
  headline: 'La IA y la automatización funcionan solo si los datos que las alimentan están en orden',
  subheadline:
    'La mayoría de los proyectos de automatización e inteligencia artificial no fracasan por la tecnología elegida. Fracasan porque la información que debe alimentarlos no está lo suficientemente ordenada para que funcione. En zalantos evaluamos el estado real de sus datos antes de proponer cualquier solución.',
  bullets: [
    'Diagnóstico del estado real de sus fuentes y arquitectura de datos',
    'Identificación de brechas antes de comprometer presupuesto en tecnología',
    'Roadmap de implementación con prioridades técnicas y financieras claras',
  ],
  primaryCta: {
    label: 'Agenda un diagnóstico sin costo',
    href: '/contacto/?agendar=1',
  },
  secondaryCta: {
    label: 'Hablar con un consultor',
    href: '/consultor-ia/',
  },
  chips: [
    'Sin costo inicial',
    '1 semana de análisis',
    'Diagnóstico + Roadmap',
    'Prototipo incluido',
  ],
  trustLine:
    'Sin compromiso comercial. El Sprint 0 existe para entregar claridad técnica antes de cualquier decisión de inversión.',
  visual: {
    title: 'Qué recibes en 1 semana',
    subtitle: 'Lo que recibe al final de la primera semana',
    badge: '1 semana',
    steps: [
      {
        label: 'Sesión de levantamiento',
        detail:
          'Entendemos el proceso, las fuentes de datos, los sistemas actuales y el objetivo de negocio que quiere alcanzar.',
      },
      {
        label: 'Diagnóstico técnico y operativo',
        detail:
          'Identificamos brechas de datos, problemas de integración, criterios inconsistentes, procesos manuales y oportunidades de automatización.',
      },
      {
        label: 'Roadmap inicial',
        detail:
          'Priorizamos qué ordenar primero, qué automatizar y qué inversión tendría sentido según su contexto.',
      },
    ],
  },
  links: {
    siteUrl: '/',
    backToSiteLabel: 'volver al sitio',
  },
  footerLine: '© zalantos',
}
