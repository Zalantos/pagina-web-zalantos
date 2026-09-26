import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { buildLlmsTxt } from '../lib/llms'

// Índice del sitio para agentes y modelos de lenguaje (convención de llmstxt.org).
// Se genera en el build desde la colección `blog`, SOLUCIONES y GLOSARIO: publicar
// un artículo lo agrega solo, igual que en el sitemap.
export const GET: APIRoute = async () => {
  const posts = await getCollection('blog')

  return new Response(buildLlmsTxt(posts), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
