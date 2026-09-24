export const SITE_URL = 'https://zalantos.com'
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'zalantos',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  image: `${SITE_URL}/icon.png`,
  description:
    'Empresa chilena de tecnología especializada en inteligencia artificial, automatización de procesos y análisis de datos para empresas.',
  email: 'contacto@zalantos.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Padre Mariano 210, Oficina 405',
    addressLocality: 'Providencia',
    addressRegion: 'Región Metropolitana',
    postalCode: '7500000',
    addressCountry: 'CL',
  },
  sameAs: ['https://www.linkedin.com/company/zalantos/'],
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: 'zalantos',
  url: SITE_URL,
  publisher: { '@id': ORGANIZATION_ID },
  description:
    'Soluciones de inteligencia artificial, automatización de procesos y análisis de datos para empresas en Chile.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/blog/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Automatización IA y Análisis de Datos para Empresas',
  serviceType: 'Consultoría en Tecnología e Inteligencia Artificial',
  provider: { '@id': ORGANIZATION_ID },
  description:
    'Diseñamos e implementamos soluciones de inteligencia artificial, automatización de procesos y análisis de datos para empresas en Chile.',
  areaServed: { '@type': 'Country', name: 'Chile' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios zalantos',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Sistemas de Gestión de Información y BI',
          description:
            'Tableros de control con datos consistentes y fuente única de información para tomar mejores decisiones.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Automatización de Procesos',
          description:
            'Integración de sistemas y automatización de flujos operativos para eliminar carga manual y errores.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Soluciones de Inteligencia Artificial',
          description:
            'Asistentes internos, sistemas RAG y automatizaciones inteligentes con IA aplicada al negocio.',
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
    author: { '@type': 'Person', name: post.author },
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
    image: post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/og-image.png`,
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
