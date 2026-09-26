import type { APIRoute } from 'astro'
import { repoLastCommitISO } from '../lib/git-lastmod'

// humans.txt se genera en el build: `Last update` sale del último commit del repositorio,
// así que no puede quedar desactualizado. Sin repo git cae a la fecha del build, que para
// un sitio estático es igualmente la fecha de la versión publicada.
export const GET: APIRoute = () => {
  const lastUpdate = (repoLastCommitISO() ?? new Date().toISOString()).slice(0, 10)

  const body = `/* TEAM */
Company: zalantos
Contact: contacto@zalantos.com
Location: Padre Mariano 210, Of. 405, Providencia, Santiago, Chile

/* TECHNOLOGY */
Framework: Astro 4
Language: TypeScript
Styling: Tailwind CSS
Deployment: Static Export

/* SITE */
Last update: ${lastUpdate}
Language: Spanish (es-CL)
Doctype: HTML5
Standards: HTML5, CSS3, WCAG 2.1
Software: VS Code, Cursor
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
