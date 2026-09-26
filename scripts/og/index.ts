// Integración de Astro que genera una imagen Open Graph por página al terminar el
// build, leyendo el HTML ya emitido (H1 real + og:description real). De este modo
// la miniatura que ven WhatsApp, LinkedIn o Slack no puede quedar desfasada del
// copy publicado, y cada página nueva obtiene la suya sin configuración.
//
// Contrato: SEOHead declara og:image bajo la convención /og/<slug>.png
// (src/lib/og.ts). Esta integración satisface exactamente esas rutas; si una
// página declara una imagen propia, se respeta y no se genera nada para ella.

import type { AstroIntegration } from 'astro'
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { extraerPagina } from './extract.ts'
import { renderOgPng } from './template.ts'
import { OG_DIR, ogImagePath } from '../../src/lib/og.ts'

// URL heredada compartida antes de esta convención: se reescribe con la tarjeta de
// la home para que los enlaces ya difundidos se actualicen al expirar su caché.
const OG_HEREDADA = 'og-image.png'

async function htmlsDe(raiz: string): Promise<string[]> {
  const entradas = await readdir(raiz, { withFileTypes: true })
  const archivos = await Promise.all(
    entradas.map(async (entrada) => {
      const completa = path.join(raiz, entrada.name)
      if (entrada.isDirectory()) return htmlsDe(completa)
      return entrada.name.endsWith('.html') ? [completa] : []
    }),
  )
  return archivos.flat()
}

export default function ogImages(): AstroIntegration {
  return {
    name: 'zalantos:og-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const distDir = fileURLToPath(dir)
        const paginas = await htmlsDe(distDir)
        const pendientes = new Map<string, Awaited<ReturnType<typeof extraerPagina>>>()

        for (const archivo of paginas) {
          const html = await readFile(archivo, 'utf-8')
          try {
            const pagina = extraerPagina(html, OG_DIR)
            if (pagina) pendientes.set(pagina.destino, pagina)
          } catch (error) {
            const relativa = path.relative(distDir, archivo)
            throw new Error(
              `No se pudo generar la imagen OG de ${relativa}: ${(error as Error).message}`,
            )
          }
        }

        for (const [destino, pagina] of pendientes) {
          if (!pagina) continue
          const salida = path.join(distDir, destino)
          await mkdir(path.dirname(salida), { recursive: true })
          await writeFile(salida, await renderOgPng(pagina.spec))
        }

        const home = pendientes.get(ogImagePath('/'))
        if (home) {
          await writeFile(path.join(distDir, OG_HEREDADA), await renderOgPng(home.spec))
        }

        logger.info(`${pendientes.size} imágenes OG generadas desde el HTML emitido`)
      },
    },
  }
}
