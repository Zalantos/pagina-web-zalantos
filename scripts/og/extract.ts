// Lectura del HTML ya emitido por Astro para construir la especificación de la
// imagen OG. Al derivarse del HTML final, la tarjeta no puede quedar desfasada
// del copy publicado: si cambia el H1 o la descripción, cambia la imagen.

import type { OgSpec, TitleSegment } from './template.ts'

const ENTIDADES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  laquo: '«',
  raquo: '»',
}

function decodificar(texto: string): string {
  return texto
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (original, nombre: string) => ENTIDADES[nombre.toLowerCase()] ?? original)
}

function meta(html: string, propiedad: string): string | undefined {
  const patron = new RegExp(
    `<meta[^>]+(?:property|name)=["']${propiedad}["'][^>]*content=["']([^"']*)["']`,
    'i',
  )
  const directo = html.match(patron)
  if (directo) return decodificar(directo[1])

  // Variante con los atributos invertidos (content antes de property)
  const invertido = html.match(
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${propiedad}["']`, 'i'),
  )
  return invertido ? decodificar(invertido[1]) : undefined
}

const esAccent = (tag: string): boolean => /accent|#2fbf71|#1f7f4a/i.test(tag)

/** Convierte el HTML interno del H1 en segmentos, preservando el resalte verde de la página. */
function segmentar(htmlInterno: string): TitleSegment[] {
  const trozos = htmlInterno.split(/(<span\b[^>]*>|<\/span>)/i)
  const pila: boolean[] = []
  const segmentos: TitleSegment[] = []

  for (const trozo of trozos) {
    if (/^<span\b/i.test(trozo)) {
      pila.push(esAccent(trozo))
      continue
    }
    if (/^<\/span>/i.test(trozo)) {
      pila.pop()
      continue
    }
    const texto = decodificar(trozo.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ')
    if (texto === '') continue
    segmentos.push({ text: texto, accent: pila.some(Boolean) })
  }

  if (segmentos.length > 0) {
    segmentos[0].text = segmentos[0].text.replace(/^\s+/, '')
    const ultimo = segmentos[segmentos.length - 1]
    ultimo.text = ultimo.text.replace(/\s+$/, '')
  }
  return segmentos.filter((s) => s.text !== '')
}

/** Categoría del artículo desde el JSON-LD ya presente en la página. */
function categoriaArticulo(html: string): string | undefined {
  const bloques = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )
  for (const bloque of bloques) {
    try {
      const datos = JSON.parse(decodificar(bloque[1])) as Record<string, unknown>
      if (datos['@type'] === 'Article' && typeof datos.articleSection === 'string') {
        return datos.articleSection
      }
    } catch {
      // Un JSON-LD ilegible no debe romper el build de imágenes
    }
  }
  return undefined
}

/** Corte de seguridad: las descripciones SEO reales caben enteras; esto solo evita desbordes. */
function acortar(texto: string, maximo = 185): string {
  if (texto.length <= maximo) return texto
  const corte = texto.slice(0, maximo)
  const ultimoEspacio = corte.lastIndexOf(' ')
  return `${corte.slice(0, ultimoEspacio > 0 ? ultimoEspacio : maximo).replace(/[\s,.;:—-]+$/, '')}…`
}

export interface PaginaOg {
  /** Ruta del og:image declarado por la página, p. ej. "/og/home.png" */
  destino: string
  spec: OgSpec
}

/**
 * Devuelve la especificación de la imagen OG de una página, o `null` si la página
 * declara una imagen propia fuera de la convención /og/ (no se genera nada).
 */
export function extraerPagina(html: string, prefijoOg: string): PaginaOg | null {
  const ogImage = meta(html, 'og:image')
  if (!ogImage) return null

  const destino = ogImage.replace(/^https?:\/\/[^/]+/, '')
  if (!destino.startsWith(`${prefijoOg}/`)) return null

  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
  const titulo = h1 ? segmentar(h1[1]) : []
  const respaldo = meta(html, 'og:title')

  if (titulo.length === 0 && !respaldo) {
    throw new Error('la página no tiene <h1> ni og:title del que derivar el titular')
  }

  const descripcion = meta(html, 'og:description')

  return {
    destino,
    spec: {
      eyebrow: categoriaArticulo(html),
      title: titulo.length > 0 ? titulo : [{ text: respaldo as string, accent: false }],
      description: descripcion ? acortar(descripcion) : undefined,
    },
  }
}
