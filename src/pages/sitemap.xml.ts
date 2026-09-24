import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

const SITE_URL = 'https://zalantos.com'

// Solo se declara <lastmod> cuando existe una fecha real de modificación (posts).
// Las landings de campaña (/lp/*) quedan fuera: son noindex y solo reciben tráfico pagado.
const staticPaths = [
  '/',
  '/blog/',
  '/contacto/',
  '/consultor-ia/',
  '/privacy/',
]

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog')

  const urls: string[] = staticPaths.map(
    (path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n  </url>`
  )

  for (const post of posts) {
    const lastmod = (post.data.updatedDate ?? post.data.pubDate).toISOString()
    urls.push(
      `  <url>\n    <loc>${SITE_URL}/blog/${post.slug}/</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
    )
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
