// Generación de /llms.txt y /llms-full.txt en el build.
//
// Estos dos archivos estaban antes en public/ como texto fijo, y se desfasaban con
// cada artículo nuevo: publicar un post no los tocaba. Ahora se arman desde las
// mismas fuentes que el sitemap —la colección `blog`, SOLUCIONES y GLOSARIO—, así
// que publicar contenido los actualiza solo.
//
// - llms.txt:      índice navegable del sitio (convención de llmstxt.org).
// - llms-full.txt: el texto completo concatenado, para el agente que no rastrea
//                  página por página y consume el sitio de una sola vez.

import type { CollectionEntry } from 'astro:content'
import { SOLUCIONES, FAQ_ORDER_TO_CASH } from '../data/soluciones'
import { GLOSARIO } from '../data/glosario'
import { PATRONES_IA, CRITERIOS_IA, FAQ_IA } from '../data/ia-empresarial'
import { SITE_URL } from './schemas'

type Post = CollectionEntry<'blog'>

/** Nota de atribución: se repite en ambos archivos porque cada uno se lee solo. */
const NOTA_ATRIBUCION = `Nota sobre atribución: las cifras y casos de Entel, McKinsey y Johnson Controls que aparecen
en el sitio son casos públicos de terceros, documentados por UiPath, ScienceSoft y McKinsey.
NO son resultados de proyectos de zalantos. Los proyectos propios están identificados como
tales en la sección "Casos de éxito" de la portada y en /blog/.`

const CABECERA = `# zalantos

> Consultora chilena que automatiza las actividades del ciclo de venta a cobro (order to cash)
> para convertir más rápido las ventas en caja. Integra los sistemas que la empresa ya usa y
> aplica inteligencia artificial empresarial donde el proceso depende de interpretar
> información sin estructura o de anticipar un comportamiento.

Ubicación: Padre Mariano 210, Oficina 405, Providencia, Región Metropolitana, Chile.
Contacto: contacto@zalantos.com
Idioma del sitio: español de Chile (es-CL).

${NOTA_ATRIBUCION}`

/** Artículos ordenados del más reciente al más antiguo. */
function ordenarPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
}

/**
 * Convierte el cuerpo de un post —markdown con HTML embebido— en texto plano
 * legible. No es un parser: los artículos usan un subconjunto acotado de etiquetas
 * y basta con mapearlo. Si algún día se usa una etiqueta nueva, cae en el `strip`
 * genérico y el texto sigue siendo correcto, solo pierde su marca de estructura.
 */
export function htmlToText(html: string): string {
  return (
    html
      // Bloques que no aportan texto
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
      .replace(/<img[^>]*>/gi, '')
      // Encabezados → markdown
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_m, t) => `\n\n## ${clean(t)}\n`)
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_m, t) => `\n\n### ${clean(t)}\n`)
      .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_m, t) => `\n\n#### ${clean(t)}\n`)
      // Listas y párrafos
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, t) => `\n- ${clean(t)}`)
      .replace(/<\/(p|ul|ol|div|blockquote|table|tr)>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      // Celdas de tabla: separadas por ` | ` para no perder la relación de la fila
      .replace(/<\/(td|th)>/gi, ' | ')
      // Resto de etiquetas
      .replace(/<[^>]+>/g, '')
      // Entidades de uso frecuente
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&hellip;/g, '…')
      // Espaciado
      .replace(/[ \t]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

/**
 * Baja un nivel los encabezados de un texto ya convertido. Dentro de
 * /llms-full.txt cada artículo se titula con `##`, así que sus H2 originales
 * tienen que pasar a `###` para no quedar al mismo nivel que el título del post.
 */
function bajarNivelEncabezados(texto: string): string {
  return texto.replace(/^(#{2,5}) /gm, '#$1 ')
}

function clean(texto: string): string {
  return texto
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function fecha(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// ── /llms.txt ───────────────────────────────────────────────────────────────

export function buildLlmsTxt(posts: Post[]): string {
  const bloques: string[] = [CABECERA]

  bloques.push(
    [
      '## Soluciones',
      '',
      `- [Automatizar el ciclo de venta a cobro (order to cash)](${SITE_URL}/soluciones/): el ciclo completo, etapa por etapa, con el síntoma y los días recuperables de cada una.`,
      ...SOLUCIONES.map(
        (s) => `- [${s.seoTitle}](${SITE_URL}/soluciones/${s.slug}/): ${s.description}`,
      ),
    ].join('\n'),
  )

  bloques.push(
    [
      '## Enfoque',
      '',
      `- [Inteligencia artificial empresarial](${SITE_URL}/inteligencia-artificial-empresarial/): los cuatro patrones donde la IA aporta dentro de un proceso, cuándo NO corresponde usarla y los controles de trazabilidad.`,
      `- [Nosotros](${SITE_URL}/nosotros/): quiénes somos y cómo trabajamos.`,
    ].join('\n'),
  )

  bloques.push(
    [
      '## Glosario',
      '',
      ...GLOSARIO.map((t) => `- [${t.termino}](${SITE_URL}/glosario/${t.slug}/): ${t.definicion}`),
    ].join('\n'),
  )

  bloques.push(
    [
      '## Artículos',
      '',
      `Índice completo en ${SITE_URL}/blog/.`,
      '',
      ...ordenarPosts(posts).map(
        (p) =>
          `- [${p.data.title}](${SITE_URL}/blog/${p.slug}/) (${fecha(p.data.updatedDate ?? p.data.pubDate)}): ${p.data.description}`,
      ),
    ].join('\n'),
  )

  bloques.push(
    [
      '## Contacto',
      '',
      `- [Contacto y Sprint 0](${SITE_URL}/contacto/): el Sprint 0 es un diagnóstico de una semana, sin costo y sin compromiso posterior.`,
      `- [Consultor IA](${SITE_URL}/consultor-ia/): asistente que responde dudas sobre automatización, IA y datos aplicados al negocio.`,
      `- [Política de privacidad](${SITE_URL}/privacy/)`,
    ].join('\n'),
  )

  bloques.push(
    [
      '## Opcional',
      '',
      `- [Texto completo del sitio](${SITE_URL}/llms-full.txt): todas las páginas y artículos concatenados en un solo archivo.`,
      `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    ].join('\n'),
  )

  return `${bloques.join('\n\n')}\n`
}

// ── /llms-full.txt ──────────────────────────────────────────────────────────

export function buildLlmsFullTxt(posts: Post[], generadoISO: string): string {
  const partes: string[] = [
    `# zalantos — texto completo del sitio`,
    '',
    `Generado el ${generadoISO.slice(0, 10)} desde ${SITE_URL}.`,
    `Índice navegable en ${SITE_URL}/llms.txt.`,
    '',
    NOTA_ATRIBUCION,
    '',
    '---',
  ]

  // ── Glosario: primero, porque define los términos que usa todo lo demás ──
  partes.push('\n# Glosario\n')
  for (const t of GLOSARIO) {
    partes.push(`## ${t.termino}`)
    partes.push(`URL: ${SITE_URL}/glosario/${t.slug}/`)
    if (t.sinonimos.length) partes.push(`También se le llama: ${t.sinonimos.join(', ')}.`)
    if (t.sameAs?.length) partes.push(`Misma entidad que: ${t.sameAs.join(' , ')}`)
    if (t.relacionadas?.length)
      partes.push(
        `Conceptos relacionados (distintos de este término): ${t.relacionadas
          .map((e) => `${e.nombre} (${e.wikidata})`)
          .join(', ')}.`,
      )
    partes.push('')
    partes.push(`Definición: ${t.definicion}`)
    for (const sec of t.secciones) {
      partes.push('')
      partes.push(`### ${sec.pregunta}`)
      partes.push(sec.respuesta.join('\n\n'))
    }
    if (t.tabla) {
      partes.push('')
      partes.push(`### ${t.tabla.titulo}`)
      partes.push(t.tabla.columnas.join(' | '))
      for (const fila of t.tabla.filas) partes.push(fila.join(' | '))
    }
    partes.push('')
    partes.push('### Preguntas frecuentes')
    for (const f of t.faq) partes.push(`P: ${f.pregunta}\nR: ${f.respuesta}`)
    partes.push('\n---')
  }

  // ── Soluciones ──
  partes.push('\n# Soluciones: el ciclo order to cash, etapa por etapa\n')
  partes.push(`URL: ${SITE_URL}/soluciones/`)
  partes.push('')
  partes.push(
    'El ciclo de venta a cobro es el recorrido que va desde que el cliente pide hasta que el dinero está en la caja. Cada día que ese recorrido se alarga es capital de trabajo que financia la propia empresa.',
  )
  partes.push('')
  partes.push('## Diagnóstico por etapa: síntoma y días recuperables')
  partes.push('Etapa | Síntoma que la delata | Días recuperables | Base de la cifra')
  for (const s of SOLUCIONES) {
    partes.push(
      `${s.etapa} ${s.fase} — ${s.seoTitle} | ${s.diagnostico.sintoma} | ${s.diagnostico.dias} | ${s.diagnostico.base}`,
    )
  }
  partes.push('')
  partes.push('## Preguntas frecuentes del ciclo order to cash')
  for (const f of FAQ_ORDER_TO_CASH) partes.push(`P: ${f.pregunta}\nR: ${f.respuesta}`)
  partes.push('\n---')

  for (const s of SOLUCIONES) {
    partes.push(`\n# ${s.titulo}\n`)
    partes.push(`URL: ${SITE_URL}/soluciones/${s.slug}/`)
    partes.push(`Etapa ${s.etapa} — ${s.fase}. Keyword: ${s.keyword}.`)
    partes.push('')
    partes.push(s.entradilla)
    partes.push('')
    partes.push('## El problema')
    partes.push(s.problema.join('\n\n'))
    partes.push('')
    partes.push('## Qué hacemos')
    for (const q of s.queHacemos) partes.push(`- ${q.titulo}: ${q.detalle}`)
    partes.push('')
    partes.push('## Dónde entra la IA')
    partes.push(s.ia)
    partes.push('')
    partes.push(`## Impacto: ${s.impacto.dato}`)
    partes.push(s.impacto.detalle)
    partes.push('')
    partes.push(`## ${s.tabla.titulo}`)
    partes.push(s.tabla.caption)
    partes.push(s.tabla.columnas.join(' | '))
    for (const fila of s.tabla.filas) partes.push(fila.join(' | '))
    partes.push('')
    partes.push('## Esta solución es para ti si')
    for (const p of s.paraTi) partes.push(`- ${p}`)
    partes.push('')
    partes.push('## Preguntas frecuentes')
    for (const f of s.faq) partes.push(`P: ${f.pregunta}\nR: ${f.respuesta}`)
    partes.push('\n---')
  }

  // ── IA empresarial ──
  partes.push('\n# Inteligencia artificial empresarial\n')
  partes.push(`URL: ${SITE_URL}/inteligencia-artificial-empresarial/`)
  partes.push('')
  partes.push(
    'zalantos diseña e implementa IA dentro de procesos que ya están operando —principalmente el ciclo de venta a cobro—, con umbrales de confianza que define el negocio y trazabilidad completa de cada decisión. Primero el proceso y los datos, después el modelo: si el problema se resuelve con reglas explícitas, no se implementa IA.',
  )
  partes.push('')
  partes.push('## Los cuatro patrones donde la IA aporta')
  for (const p of PATRONES_IA) {
    partes.push('')
    partes.push(`### ${p.nombre}`)
    partes.push(`Cuándo: ${p.cuando}`)
    partes.push(`Cómo: ${p.como}`)
    partes.push(`Su límite: ${p.limite}`)
  }
  partes.push('')
  partes.push('## ¿Cuándo conviene usar IA y cuándo no?')
  partes.push('Situación operativa | ¿IA? | Por qué | Qué corresponde hacer')
  for (const c of CRITERIOS_IA) {
    partes.push(`${c.situacion} | ${c.veredicto} | ${c.porque} | ${c.alternativa}`)
  }
  partes.push('')
  partes.push('## Preguntas frecuentes sobre IA empresarial')
  for (const f of FAQ_IA) partes.push(`P: ${f.pregunta}\nR: ${f.respuesta}`)
  partes.push('\n---')

  // ── Artículos ──
  partes.push('\n# Artículos\n')
  for (const post of ordenarPosts(posts)) {
    partes.push(`\n## ${post.data.title}\n`)
    partes.push(`URL: ${SITE_URL}/blog/${post.slug}/`)
    partes.push(
      `Autor: ${post.data.author}. Publicado: ${fecha(post.data.pubDate)}.` +
        (post.data.updatedDate ? ` Actualizado: ${fecha(post.data.updatedDate)}.` : ''),
    )
    partes.push(`Categoría: ${post.data.category}.`)
    partes.push('')
    if (post.data.respuestaCorta) {
      partes.push(`Respuesta directa: ${post.data.respuestaCorta}`)
      partes.push('')
    }
    partes.push(bajarNivelEncabezados(htmlToText(post.body)))
    partes.push('\n---')
  }

  // ── Contacto ──
  partes.push('\n# Contacto\n')
  partes.push(`URL: ${SITE_URL}/contacto/`)
  partes.push('Email: contacto@zalantos.com')
  partes.push('Dirección: Padre Mariano 210, Oficina 405, Providencia, Región Metropolitana, Chile.')
  partes.push('')
  partes.push(
    'Sprint 0: diagnóstico de una semana, sin costo y sin compromiso posterior. Se mapea el proceso de punta a punta, se identifica dónde se pierden los días y se entregan por escrito las opciones priorizadas por impacto en caja. El diagnóstico queda en poder del cliente, avance o no con zalantos.',
  )

  return `${partes.join('\n')}\n`
}
