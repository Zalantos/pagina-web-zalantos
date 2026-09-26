// Convención única de rutas para las imágenes Open Graph generadas en build.
// La ruta se deriva del pathname canónico, de modo que cada página tiene su propia
// imagen sin necesidad de declararla: /nosotros/ -> /og/nosotros.png
//
// La integración de build (scripts/og) recorre el HTML emitido, detecta las páginas
// cuyo og:image apunta a esta convención y renderiza el PNG con el H1 y la
// descripción reales de esa página. Si una página declara su propia `ogImage`,
// la integración la respeta y no genera nada.

export const OG_DIR = '/og'

/** Slug de la imagen OG a partir del pathname: '/' -> 'home', '/blog/x/' -> 'blog-x' */
export function ogSlug(pathname: string): string {
  const limpio = pathname
    .replace(/\.html$/i, '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\//g, '-')
  return limpio === '' ? 'home' : limpio
}

/** Ruta absoluta-de-sitio de la imagen OG de una página. */
export function ogImagePath(pathname: string): string {
  return `${OG_DIR}/${ogSlug(pathname)}.png`
}

/** Igual que ogImagePath pero tolerando una URL canónica completa. */
export function ogImagePathFromCanonical(canonical: string): string {
  try {
    return ogImagePath(new URL(canonical).pathname)
  } catch {
    return ogImagePath(canonical)
  }
}
