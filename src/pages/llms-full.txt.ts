import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { buildLlmsFullTxt } from '../lib/llms'
import { repoLastCommitISO } from '../lib/git-lastmod'

// Texto completo del sitio en un solo archivo. Es lo que consume el agente que no
// rastrea página por página: sin esto solo puede leer el índice de /llms.txt y
// tiene que ir a buscar cada URL por separado.
export const GET: APIRoute = async () => {
  const posts = await getCollection('blog')
  const generado = repoLastCommitISO() ?? new Date().toISOString()

  return new Response(buildLlmsFullTxt(posts, generado), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
