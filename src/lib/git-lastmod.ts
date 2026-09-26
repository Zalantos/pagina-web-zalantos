import { execFileSync } from 'node:child_process'

/**
 * Fecha de última modificación real de un archivo o carpeta, leída del historial de git
 * durante el build. Se usa para el <lastmod> del sitemap y para humans.txt.
 *
 * Por qué git y no el mtime del archivo: tras un clone limpio todos los archivos quedan
 * con la fecha del clone y el sitemap declararía que el sitio entero cambió el día del
 * build. Si el build corre fuera de un repo git no se inventa una fecha: devuelve null y
 * el consumidor omite el dato.
 */

// El resultado es estable durante todo el build: una consulta por ruta basta.
const cache = new Map<string, string | null>()

let gitDisponible: boolean | null = null

function hayGit(): boolean {
  if (gitDisponible !== null) return gitDisponible
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { stdio: 'pipe' })
    gitDisponible = true
  } catch {
    gitDisponible = false
    console.warn('[git-lastmod] Sin repositorio git en el build: se omite <lastmod>.')
  }
  return gitDisponible
}

/** Fecha ISO del último commit que tocó `ruta` (archivo o carpeta), o null. */
function commitISO(ruta: string): string | null {
  const enCache = cache.get(ruta)
  if (enCache !== undefined) return enCache

  let iso: string | null = null
  if (hayGit()) {
    try {
      const salida = execFileSync('git', ['log', '-1', '--format=%cI', '--', ruta], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }).trim()
      // Ruta sin historial (archivo nuevo sin commitear): salida vacía.
      // Se conserva el ISO estricto de git, con su offset local: pasarlo a UTC correría
      // de día los commits nocturnos (22:33 -03 aparecería como el día siguiente).
      iso = salida || null
    } catch {
      iso = null
    }
  }

  cache.set(ruta, iso)
  return iso
}

/** Fecha ISO del commit más reciente entre todas las rutas dadas, o null si ninguna la tiene. */
export function lastCommitISO(rutas: string[]): string | null {
  const fechas = rutas.map(commitISO).filter((f): f is string => f !== null)
  if (fechas.length === 0) return null
  // Comparación por instante, no por texto: las fechas pueden traer offsets distintos.
  return fechas.reduce((max, f) => (Date.parse(f) > Date.parse(max) ? f : max))
}

/** Fecha ISO del último commit del repositorio completo. */
export function repoLastCommitISO(): string | null {
  return commitISO('.')
}
