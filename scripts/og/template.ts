// Plantilla visual de las imágenes Open Graph (1200x630).
// Replica la dirección digital v2.2: gradiente oscuro, isotipo, Space Grotesk
// para el titular e Inter para la bajada. Los tokens de color son los mismos de
// src/styles/global.css (fuente única de verdad de la paleta).

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

const PRIMARY = '#0B2A3C'
const VERDE_BOSQUE = '#163B2C'
const ACCENT = '#2FBF71'

/** Fragmento de titular; `accent` marca las palabras resaltadas en verde en la página. */
export interface TitleSegment {
  text: string
  accent: boolean
}

export interface OgSpec {
  eyebrow?: string
  title: TitleSegment[]
  description?: string
}

type Element = {
  type: string
  props: Record<string, unknown>
}

const fontUrl = (nombre: string): URL => new URL(`./fonts/${nombre}`, import.meta.url)
const leerFuente = (nombre: string): Buffer =>
  readFileSync(fileURLToPath(fontUrl(nombre)))

const FONTS = [
  { name: 'Space Grotesk', data: leerFuente('SpaceGrotesk-Bold.ttf'), weight: 700 as const, style: 'normal' as const },
  { name: 'Inter', data: leerFuente('Inter-Regular.ttf'), weight: 400 as const, style: 'normal' as const },
  { name: 'Inter', data: leerFuente('Inter-SemiBold.ttf'), weight: 600 as const, style: 'normal' as const },
]

// Isotipo del kit digital (public/logos/isotipo-*.svg) en versión para fondo oscuro:
// cinta blanca + cinta verde de marca. El stroke refuerza el trazo, igual que en LogoLockup.
const ISOTIPO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="99 1 901 854" width="901" height="854"><path fill="#FFFFFF" stroke="#FFFFFF" stroke-width="36" stroke-linejoin="round" d="M693 184 702 186 706 192 705 201 697 211 523 404 129 825 662 216 661 211 643 212 248 263Z"/><path fill="${ACCENT}" stroke="${ACCENT}" stroke-width="36" stroke-linejoin="round" d="M970 31 572 482 390 680 391 685 400 685 819 626 454 697 358 714 350 712 346 706 346 699 351 691 496 527 786 219Z"/></svg>`

const ISOTIPO_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(ISOTIPO_SVG).toString('base64')}`

/** El titular baja de cuerpo a medida que crece, para no desbordar la tarjeta. */
function tamanoTitular(largo: number): number {
  if (largo <= 42) return 68
  if (largo <= 72) return 60
  if (largo <= 104) return 52
  return 44
}

function bloqueTitular(segmentos: TitleSegment[]): Element {
  const largo = segmentos.reduce((total, s) => total + s.text.length, 0)
  const cuerpo = tamanoTitular(largo)
  // Satori no reparte texto entre nodos hermanos: cada palabra va en su propio
  // span para que la línea quiebre donde corresponde y conserve su color.
  const palabras = segmentos.flatMap((segmento) =>
    segmento.text
      .split(/\s+/)
      .filter((palabra) => palabra !== '')
      .map((palabra) => ({ text: palabra, accent: segmento.accent })),
  )

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: Math.round(cuerpo * 0.26),
        fontFamily: 'Space Grotesk',
        fontWeight: 700,
        fontSize: cuerpo,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        color: '#FFFFFF',
        maxWidth: 940,
      },
      children: palabras.map((palabra) => ({
        type: 'span',
        props: {
          style: { color: palabra.accent ? ACCENT : '#FFFFFF' },
          children: palabra.text,
        },
      })),
    },
  }
}

function construirTarjeta(spec: OgSpec): Element {
  const hijosCentro: Element[] = []

  if (spec.eyebrow) {
    hijosCentro.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: 18,
          letterSpacing: '0.12em',
          color: ACCENT,
          marginBottom: 20,
        },
        children: spec.eyebrow.toUpperCase(),
      },
    })
  }

  hijosCentro.push(bloqueTitular(spec.title))

  if (spec.description) {
    hijosCentro.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: spec.description.length <= 120 ? 24 : 21,
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.72)',
          marginTop: 24,
          maxWidth: 860,
        },
        children: spec.description,
      },
    })
  }

  return {
    type: 'div',
    props: {
      style: {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px',
        backgroundColor: PRIMARY,
        backgroundImage: `radial-gradient(55% 80% at 92% 4%, rgba(47,191,113,0.16) 0%, rgba(47,191,113,0) 60%), linear-gradient(160deg, ${PRIMARY} 0%, ${PRIMARY} 48%, ${VERDE_BOSQUE} 100%)`,
      },
      children: [
        {
          type: 'img',
          props: { src: ISOTIPO_DATA_URI, width: 76, height: 72 },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'center',
              paddingBottom: 24,
            },
            children: hijosCentro,
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'baseline', gap: 10 },
            children: [
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Space Grotesk',
                    fontWeight: 700,
                    fontSize: 28,
                    letterSpacing: '-0.035em',
                    color: '#FFFFFF',
                  },
                  children: 'zalantos',
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: 17,
                    color: 'rgba(255,255,255,0.55)',
                  },
                  children: '· zalantos.com',
                },
              },
            ],
          },
        },
      ],
    },
  }
}

/** Renderiza la tarjeta OG a PNG 1200x630. */
export async function renderOgPng(spec: OgSpec): Promise<Buffer> {
  const svg = await satori(construirTarjeta(spec) as never, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: FONTS,
  })
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } })
  return Buffer.from(resvg.render().asPng())
}
