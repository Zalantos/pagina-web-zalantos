import { ogImagePath } from './og'
import { ORG_IDENTITY } from './constants'

export const SITE_URL = 'https://zalantos.com'
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const SPRINT0_OFFER_ID = `${SITE_URL}/contacto/#sprint-0`

// Identidad única de cada persona del equipo. El @id es la dirección canónica de
// la entidad: lo usan el author de los artículos, el founder de la Organization y
// el Person renderizado en /nosotros/ (donde el mismo fragmento existe como
// id= del HTML). Sin esto, Google trata «Tomás Rodríguez el autor» y «Tomás
// Rodríguez el CTO» como dos personas distintas y el E-E-A-T no se acumula.
// La clave es el nombre tal como aparece en el frontmatter `author` del blog.
export const PERSONAS = {
  'Juan Pablo Rodríguez': `${SITE_URL}/nosotros/#juan-pablo-rodriguez`,
  'Tomás Rodríguez': `${SITE_URL}/nosotros/#tomas-rodriguez`,
} as const

export type PersonaNombre = keyof typeof PERSONAS

/** @id de la persona, o undefined si el nombre no corresponde a alguien del equipo. */
export function personaId(nombre: string): string | undefined {
  return PERSONAS[nombre as PersonaNombre]
}

/** Fragmento del @id (`#tomas-rodriguez`) para usarlo como id= en el HTML. */
export function personaAnchor(nombre: string): string {
  const id = personaId(nombre)
  return id ? id.slice(id.indexOf('#') + 1) : ''
}

// Promesa canónica del sitio. Toda descripción comercial deriva de esta frase.
export const PROMESA =
  'zalantos automatiza las actividades del ciclo de venta a cobro para convertir más rápido las ventas en caja.'

// El Sprint 0 modelado como Offer con price 0. Es exactamente lo que un motor de
// IA extrae para responder «consultoras de automatización con diagnóstico gratuito
// en Chile»: sin este nodo, la gratuidad solo existe como texto en la página.
// Se emite embebido (makesOffer de la Organization) y como nodo propio en /contacto/.
export const sprint0OfferNode = {
  '@type': 'Offer',
  '@id': SPRINT0_OFFER_ID,
  name: 'Sprint 0: diagnóstico del ciclo de venta a cobro sin costo',
  description:
    'Una semana sin costo y sin compromiso para mapear el ciclo de venta a cobro de la empresa, identificar dónde se atasca la caja y entregar por escrito las opciones de solución priorizadas por impacto.',
  price: 0,
  priceCurrency: 'CLP',
  availability: 'https://schema.org/InStock',
  url: `${SITE_URL}/contacto/`,
  areaServed: { '@type': 'Country', name: 'Chile' },
  seller: { '@id': ORGANIZATION_ID },
  itemOffered: {
    '@type': 'Service',
    name: 'Sprint 0 — diagnóstico del ciclo order to cash',
    serviceType: 'Diagnóstico de procesos y automatización',
    provider: { '@id': ORGANIZATION_ID },
    description:
      'Levantamiento del proceso de punta a punta, causas de cada atasco, opciones de solución priorizadas y roadmap sugerido. El diagnóstico queda en poder del cliente, avance o no con zalantos.',
  },
}

/** El mismo Offer como documento JSON-LD independiente, para páginas que lo declaran solas. */
export const sprint0OfferSchema = {
  '@context': 'https://schema.org',
  ...sprint0OfferNode,
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ORGANIZATION_ID,
  name: 'zalantos',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  image: `${SITE_URL}/icon.png`,
  slogan: 'Convertimos tus ventas en liquidez',
  description:
    'Consultora chilena que automatiza el ciclo order to cash de punta a punta —pedido, crédito, facturación, cobranza, disputas y conciliación— integrando los sistemas existentes y aplicando inteligencia artificial empresarial.',
  email: 'contacto@zalantos.com',
  // Cada dato de ORG_IDENTITY solo se publica si está cargado: un campo vacío se omite.
  ...(ORG_IDENTITY.telefono ? { telephone: ORG_IDENTITY.telefono } : {}),
  ...(ORG_IDENTITY.rut ? { taxID: ORG_IDENTITY.rut, vatID: ORG_IDENTITY.rut } : {}),
  ...(ORG_IDENTITY.fechaConstitucion
    ? { foundingDate: ORG_IDENTITY.fechaConstitucion }
    : {}),
  foundingLocation: { '@type': 'Country', name: 'Chile' },
  // Los fundadores apuntan al mismo @id que el Person de /nosotros/ y que el
  // author de los artículos: una sola entidad por persona en todo el sitio.
  founder: [
    { '@type': 'Person', '@id': PERSONAS['Juan Pablo Rodríguez'], name: 'Juan Pablo Rodríguez' },
    { '@type': 'Person', '@id': PERSONAS['Tomás Rodríguez'], name: 'Tomás Rodríguez' },
  ],
  makesOffer: [sprint0OfferNode],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Padre Mariano 210, Oficina 405',
    addressLocality: 'Providencia',
    addressRegion: 'Región Metropolitana',
    postalCode: '7500000',
    addressCountry: 'CL',
  },
  areaServed: { '@type': 'Country', name: 'Chile' },
  knowsAbout: [
    'Order to cash',
    'Automatización de procesos de negocio',
    'Inteligencia artificial empresarial',
    'Integración de sistemas y ERP',
    'Facturación electrónica SII',
    'Gestión de cuentas por cobrar',
    'Control de gestión y business intelligence',
  ],
  sameAs: ['https://www.linkedin.com/company/zalantos/'],
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: 'zalantos',
  url: SITE_URL,
  inLanguage: 'es-CL',
  publisher: { '@id': ORGANIZATION_ID },
  description:
    'Automatización del ciclo de venta a cobro con inteligencia artificial empresarial para empresas en Chile.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/blog/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Automatización del ciclo order to cash con inteligencia artificial',
  serviceType: 'Automatización de procesos e inteligencia artificial empresarial',
  provider: { '@id': ORGANIZATION_ID },
  description:
    'Automatizamos las actividades del ciclo de venta a cobro —ingreso de pedidos, evaluación de crédito, facturación, cobranza, disputas y conciliación— integrando los sistemas que la empresa ya usa y aplicando IA donde aporta control y velocidad.',
  areaServed: { '@type': 'Country', name: 'Chile' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Etapas del ciclo order to cash que automatizamos',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Integración ERP y facturación electrónica SII',
          description:
            'Conectamos el ERP con la emisión de documentos tributarios electrónicos para que el pedido se convierta en factura sin digitación manual.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Automatización de cobranza y disputas',
          description:
            'Seguimiento automático de la cartera, priorización de gestiones y resolución de disputas con la documentación del caso consolidada.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Evaluación de crédito y alta de clientes',
          description:
            'Automatización de la evaluación crediticia y del alta de clientes nuevos para que la venta no espere por el proceso interno.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Visibilidad de caja y control de gestión',
          description:
            'Conciliación asistida y tableros con una fuente única de información para conocer la posición de caja sin esperar al cierre.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Inteligencia artificial empresarial aplicada',
          description:
            'Asistentes internos, búsqueda sobre documentación (RAG) y agentes que operan dentro del proceso con límites, trazabilidad y control.',
        },
      },
    ],
  },
}

export interface ArticleSchemaInput {
  title: string
  description: string
  /** Bloque de respuesta directa del artículo; se publica como `abstract`. */
  respuestaCorta?: string
  author: string
  category?: string
  pubDate: Date
  updatedDate?: Date
  slug: string
  image?: string
}

export function articleSchema(post: ArticleSchemaInput) {
  const url = `${SITE_URL}/blog/${post.slug}/`
  // El autor se resuelve contra PERSONAS: si es alguien del equipo lleva el @id
  // de su Person en /nosotros/, de modo que la autoría del artículo y el perfil
  // profesional son la misma entidad. Un autor no listado cae al perfil genérico.
  const autorId = personaId(post.author)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      ...(autorId ? { '@id': autorId } : {}),
      name: post.author,
      url: autorId ?? `${SITE_URL}/nosotros/`,
    },
    publisher: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'zalantos',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
    },
    datePublished: post.pubDate.toISOString(),
    dateModified: (post.updatedDate ?? post.pubDate).toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: `${SITE_URL}${post.image ?? ogImagePath(`/blog/${post.slug}/`)}`,
    ...(post.respuestaCorta ? { abstract: post.respuestaCorta } : {}),
    ...(post.category ? { articleSection: post.category } : {}),
    inLanguage: 'es-CL',
    url,
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Schema de una página de solución (etapa del ciclo order to cash)
export function solutionServiceSchema(input: {
  name: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: { '@type': 'Country', name: 'Chile' },
    serviceType: 'Automatización de procesos e inteligencia artificial empresarial',
    url: input.url,
  }
}

export function faqSchema(items: { pregunta: string; respuesta: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: item.respuesta },
    })),
  }
}

// Person del equipo con @id estable. Es el nodo canónico de la persona: el author
// de los artículos y el founder de la Organization apuntan aquí por @id.
export function personSchema(persona: {
  nombre: string
  cargo: string
  bio?: string
  linkedin?: string
}) {
  const id = personaId(persona.nombre)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    ...(id ? { '@id': id } : {}),
    name: persona.nombre,
    jobTitle: persona.cargo,
    worksFor: { '@id': ORGANIZATION_ID },
    url: id ?? `${SITE_URL}/nosotros/`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/nosotros/` },
    ...(persona.bio ? { description: persona.bio } : {}),
    ...(persona.linkedin ? { sameAs: [persona.linkedin] } : {}),
  }
}

export type PageSchemaType = 'WebPage' | 'CollectionPage' | 'ContactPage' | 'AboutPage'

/**
 * Nodo de página. Toda página del sitio debe emitir uno: es lo que ancla la URL
 * al WebSite y a la Organization, y lo que un motor de IA usa para saber de qué
 * trata la página cuando no hay un tipo más específico (Article, Service).
 */
export function pageSchema(input: {
  name: string
  description: string
  url: string
  type?: PageSchemaType
  breadcrumb?: { name: string; url: string }[]
  /** Entidad principal de la página, p. ej. el Offer del Sprint 0. */
  mainEntity?: Record<string, unknown>
  /** Fechas del contenido: relevantes en páginas legales que se versionan. */
  dateModified?: Date
  /**
   * Entidades públicas que la página menciona sin ser ninguna de ellas. Es el campo
   * correcto para un concepto vecino: `sameAs` afirmaría identidad y sería falso.
   */
  mentions?: Record<string, unknown>[]
}) {
  const { name, description, url, type = 'WebPage' } = input
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': url,
    name,
    description,
    url,
    inLanguage: 'es-CL',
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANIZATION_ID },
    about: { '@id': ORGANIZATION_ID },
    ...(input.dateModified ? { dateModified: input.dateModified.toISOString() } : {}),
    ...(input.mainEntity ? { mainEntity: input.mainEntity } : {}),
    ...(input.mentions?.length ? { mentions: input.mentions } : {}),
    ...(input.breadcrumb
      ? {
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: input.breadcrumb.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: item.url,
            })),
          },
        }
      : {}),
  }
}

/** ItemList de los artículos del blog: da al índice un contenido enumerable. */
export function blogListSchema(
  posts: {
    title: string
    description: string
    slug: string
    pubDate: Date
    updatedDate?: Date
    author: string
  }[],
) {
  const url = `${SITE_URL}/blog/`
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${url}#blog`,
    name: 'Blog de zalantos',
    description:
      'Artículos y casos sobre automatización del ciclo de venta a cobro, integración de sistemas e IA aplicada en empresas chilenas.',
    url,
    inLanguage: 'es-CL',
    publisher: { '@id': ORGANIZATION_ID },
    blogPost: posts.map((post) => {
      const autorId = personaId(post.author)
      return {
        '@type': 'BlogPosting',
        '@id': `${SITE_URL}/blog/${post.slug}/`,
        headline: post.title,
        description: post.description,
        url: `${SITE_URL}/blog/${post.slug}/`,
        datePublished: post.pubDate.toISOString(),
        // Igual que en articleSchema: sin revisión, la fecha de modificación es la de
        // publicación. Nunca se declara una frescura que el contenido no tiene.
        dateModified: (post.updatedDate ?? post.pubDate).toISOString(),
        author: {
          '@type': 'Person',
          ...(autorId ? { '@id': autorId } : {}),
          name: post.author,
        },
      }
    }),
  }
}

// ── Glosario ────────────────────────────────────────────────────────────────
// El glosario existe para capturar la consulta definicional («qué es order to
// cash»). DefinedTerm es el tipo que declara explícitamente «esta página define
// este término»: sin él, la página compite como un artículo más. El @id estable
// permite que el DefinedTermSet del índice y cada página apunten a la misma
// entidad en vez de duplicarla.

export const GLOSARIO_ID = `${SITE_URL}/glosario/#glosario`

export function terminoId(slug: string): string {
  return `${SITE_URL}/glosario/${slug}/#termino`
}

/** DefinedTerm de una entrada del glosario, como nodo embebible. */
export function definedTermNode(termino: {
  slug: string
  termino: string
  definicion: string
  sinonimos?: string[]
  sameAs?: string[]
}) {
  return {
    '@type': 'DefinedTerm',
    '@id': terminoId(termino.slug),
    name: termino.termino,
    description: termino.definicion,
    ...(termino.sinonimos?.length ? { alternateName: termino.sinonimos } : {}),
    // sameAs ancla el término a la entidad pública que ya existe en Wikidata: es lo
    // que permite a un motor resolver «order to cash» sin desambiguar de nuevo.
    // Solo se emite en identidad exacta; un término sin equivalente no lleva el campo.
    ...(termino.sameAs?.length ? { sameAs: termino.sameAs } : {}),
    inDefinedTermSet: { '@id': GLOSARIO_ID },
    url: `${SITE_URL}/glosario/${termino.slug}/`,
    termCode: termino.slug,
    inLanguage: 'es-CL',
  }
}

/** El mismo DefinedTerm como documento JSON-LD independiente. */
export function definedTermSchema(termino: {
  slug: string
  termino: string
  definicion: string
  sinonimos?: string[]
  sameAs?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    ...definedTermNode(termino),
  }
}

/** DefinedTermSet del índice: enumera los términos definidos por el sitio. */
export function definedTermSetSchema(
  terminos: {
    slug: string
    termino: string
    definicion: string
    sinonimos?: string[]
    sameAs?: string[]
  }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': GLOSARIO_ID,
    name: 'Glosario de zalantos',
    description:
      'Definiciones de los términos del ciclo de venta a cobro, la facturación electrónica y la automatización de procesos que zalantos usa en su trabajo.',
    url: `${SITE_URL}/glosario/`,
    inLanguage: 'es-CL',
    publisher: { '@id': ORGANIZATION_ID },
    hasDefinedTerm: terminos.map(definedTermNode),
  }
}
