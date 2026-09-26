import { ogImagePath } from './og'

export const SITE_URL = 'https://zalantos.com'
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

// Promesa canónica del sitio. Toda descripción comercial deriva de esta frase.
export const PROMESA =
  'zalantos automatiza las actividades del ciclo de venta a cobro para convertir más rápido las ventas en caja.'

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
  author: string
  category?: string
  pubDate: Date
  updatedDate?: Date
  slug: string
  image?: string
}

export function articleSchema(post: ArticleSchemaInput) {
  const url = `${SITE_URL}/blog/${post.slug}/`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Person', name: post.author, url: `${SITE_URL}/nosotros/` },
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
