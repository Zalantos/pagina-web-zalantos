import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { SOLUCIONES } from '../data/soluciones'
import { GLOSARIO } from '../data/glosario'
import { lastCommitISO } from '../lib/git-lastmod'

const SITE_URL = 'https://zalantos.com'

// Cada ruta estática declara los archivos que determinan su contenido: el <lastmod>
// es la fecha del commit más reciente entre ellos. Si un archivo cambia, la fecha se
// mueve sola — no hay lista de fechas que mantener a mano.
// El layout y el <head> quedan fuera a propósito: un retoque de plantilla no es un cambio
// de contenido y pondría la misma fecha en las 10 rutas.
// Las landings de campaña (/lp/*) quedan fuera: son noindex y solo reciben tráfico pagado.

const staticRoutes: { path: string; sources: string[] }[] = [
  { path: '/', sources: ['src/pages/index.astro', 'src/components/sections'] },
  { path: '/soluciones/', sources: ['src/pages/soluciones/index.astro', 'src/data/soluciones'] },
  ...SOLUCIONES.map((s) => ({
    path: `/soluciones/${s.slug}/`,
    sources: ['src/pages/soluciones/[slug].astro', 'src/data/soluciones'],
  })),
  {
    path: '/inteligencia-artificial-empresarial/',
    sources: ['src/pages/inteligencia-artificial-empresarial.astro'],
  },
  { path: '/nosotros/', sources: ['src/pages/nosotros.astro', 'src/data/equipo.ts'] },
  { path: '/glosario/', sources: ['src/pages/glosario/index.astro', 'src/data/glosario.ts'] },
  ...GLOSARIO.map((t) => ({
    path: `/glosario/${t.slug}/`,
    sources: ['src/pages/glosario/[slug].astro', 'src/data/glosario.ts'],
  })),
  { path: '/blog/', sources: ['src/pages/blog/index.astro', 'src/content/blog'] },
  {
    path: '/contacto/',
    sources: [
      'src/pages/contacto.astro',
      'src/components/sections/ContactSection.astro',
      'src/components/ContactPanel.tsx',
    ],
  },
  {
    path: '/consultor-ia/',
    sources: ['src/pages/consultor-ia.astro', 'src/components/chat'],
  },
  { path: '/privacy/', sources: ['src/pages/privacy.astro'] },
]

function urlEntry(loc: string, lastmod: string | null): string {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
  return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`
}

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog')

  const urls: string[] = staticRoutes.map((route) =>
    urlEntry(`${SITE_URL}${route.path}`, lastCommitISO(route.sources))
  )

  for (const post of posts) {
    const lastmod = (post.data.updatedDate ?? post.data.pubDate).toISOString()
    urls.push(urlEntry(`${SITE_URL}/blog/${post.slug}/`, lastmod))
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
