# Zalantos - Sitio corporativo (Astro 4)

Sitio estático de [zalantos.com](https://zalantos.com) construido con **Astro 4 + React + Tailwind CSS**, optimizado para SEO (HTML puro indexable por Google y bots de IA) y desplegable por FTP a cPanel.

## Stack

- **Framework**: [Astro 4](https://astro.build) (output estático)
- **React**: únicamente para la isla interactiva del Consultor IA (`client:load`)
- **Estilos**: Tailwind CSS 3
- **Blog**: [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) (Markdown + HTML embebido)
- **Lenguaje**: TypeScript
- **Tipografías**: Inter, Space Grotesk e IBM Plex Mono autohospedadas en woff2 (sin Google Fonts)

## Estructura

```
src/
├── content/blog/        Artículos del blog (.md con frontmatter)
├── layouts/             BaseLayout, BlogLayout
├── components/
│   ├── sections/        Secciones de la home (.astro)
│   ├── chat/            Isla React del Consultor IA (.tsx)
│   ├── landing/         Landing de campañas LinkedIn (.astro)
│   └── ui/              Componentes reutilizables
├── data/                Contenido estructurado: soluciones, glosario, IA empresarial, equipo
├── lib/                 schemas JSON-LD, constants, api, generador de llms.txt
├── services/            chatService (webhook del consultor IA)
├── types/               Tipos compartidos
├── styles/global.css    Variables --z-* y utilidades globales
└── pages/
    ├── index.astro                                           → /
    ├── blog/index.astro                                      → /blog/
    ├── blog/[slug].astro                                     → /blog/<slug>/
    ├── consultor-ia.astro                                    → /consultor-ia/
    ├── soluciones/index.astro                                → /soluciones/
    ├── soluciones/[slug].astro                                → /soluciones/<slug>/
    ├── glosario/index.astro                                   → /glosario/
    ├── glosario/[slug].astro                                  → /glosario/<termino>/
    ├── inteligencia-artificial-empresarial.astro              → /inteligencia-artificial-empresarial/
    ├── lp/no-todos-problemas-operativos-necesitan-ia.astro   → /lp/.../
    ├── privacy.astro                                         → /privacy/
    ├── humans.txt.ts                                         → /humans.txt (fecha desde git)
    ├── llms.txt.ts                                            → /llms.txt (índice para agentes)
    ├── llms-full.txt.ts                                       → /llms-full.txt (texto completo)
    └── sitemap.xml.ts                                        → /sitemap.xml (<lastmod> desde git)

scripts/og/
├── index.ts             Integración Astro que genera las imágenes Open Graph
├── extract.ts           Lee el HTML emitido (H1 + og:description) de cada página
├── template.ts          Tarjeta 1200x630 con satori + resvg
└── fonts/*.ttf          Space Grotesk e Inter estáticas (satori no lee WOFF2)

public/
├── .htaccess            Reescrituras + HTTPS + MIME y cache para Apache/cPanel
├── fonts/*.woff2        Tipografías autohospedadas (subset latin)
├── robots.txt           Sitemap + permisos declarados uno a uno por agente de IA
├── site.webmanifest, icon.png
└── images/*             Assets estáticos
```

## Scripts

```bash
npm install        # instalar dependencias
npm run dev        # dev server http://localhost:4321
npm run build      # genera /dist estático
npm run preview    # previsualiza /dist
```

## Tipografías

Autohospedadas en `public/fonts/`, sin Google Fonts: cero conexiones a terceros,
sin CSS bloqueante y sin enviar la IP del visitante a Google.

| Archivo | Uso | Peso |
|---|---|---|
| `inter-v20-latin-var.woff2` | Cuerpo de texto (variable 100–900) | 48 KB |
| `space-grotesk-v22-latin-var.woff2` | Titulares y botones (variable 300–700) | 22 KB |
| `ibm-plex-mono-v20-500-latin.woff2` | Eyebrows (`.eyebrow`) | 10 KB |

- Los `@font-face` viven en `src/styles/fonts.css`; las cadenas `font-family` están
  en `tailwind.config.mjs` y `src/styles/global.css`.
- Inter y Space Grotesk se precargan en `BaseLayout.astro` (`rel="preload"` con
  `crossorigin`, obligatorio aunque sean del mismo origen).
- `Inter Fallback` y `Space Grotesk Fallback` reescalan Arial con `size-adjust` y
  `ascent-override` para que el intercambio de `font-display: swap` no mueva el
  texto. Los valores se calcularon con fontTools sobre los propios `.woff2`
  (`size-adjust = xHeight(webfont) / xHeight(Arial)`).
- El nombre incluye la versión de Google (`v20`, `v22`) porque `.htaccess` sirve
  woff2 con `Cache-Control: immutable` a 1 año: al actualizar una fuente cambia el
  nombre y se invalida la caché sola.

**Actualizar una fuente**: pedir el CSS a `fonts.googleapis.com` con un User-Agent
de Chrome, descargar el `.woff2` del bloque `/* latin */`, guardarlo con la nueva
versión en el nombre y ajustar la `url()` de `fonts.css` y los `preload`.

## Imágenes Open Graph

Se generan en cada build, no se versionan. `scripts/og` es una integración de Astro
que corre en `astro:build:done`: recorre el HTML ya emitido, toma el **H1 real** y la
`og:description` real de cada página y renderiza `dist/og/<slug>.png` (1200x630) con
satori + resvg. La miniatura que muestran WhatsApp, LinkedIn o Slack no puede quedar
desfasada del copy publicado.

- La ruta la fija `src/lib/og.ts` (`/` → `/og/home.png`, `/blog/x/` → `/og/blog-x.png`)
  y `SEOHead.astro` la declara como `og:image` por defecto.
- Una página con `ogImage` propio se respeta y no genera nada.
- El eyebrow verde de los artículos sale del `articleSection` del JSON-LD (la categoría
  del frontmatter), así que tampoco se duplica el dato.
- Si una página no tiene `<h1>` ni `og:title`, **el build falla**: es la señal de que
  hay que arreglar la página, no la imagen.
- `dist/og-image.png` se sigue emitiendo (copia de la tarjeta de home) para que los
  enlaces difundidos antes de esta convención se actualicen al expirar su caché.

Cambiar de URL implica que WhatsApp vuelva a leer el preview: cachea por URL, no por
contenido. Para forzarlo antes de tiempo, compartir el enlace con `?v=2`.

## Adaptación a motores de IA (AEO/GEO)

El sitio está pensado para que un motor generativo pueda **citarlo**, no solo rastrearlo.
Cuatro decisiones sostienen eso y hay que respetarlas al escribir contenido nuevo:

**1. Los H2 son preguntas.** Un motor empareja la consulta del usuario con un encabezado.
`El problema: tener dashboards no significa claridad` no empareja con nada;
`¿Por qué tener dashboards no significa tener claridad?` sí. Todo H2 del blog y de las
páginas de glosario termina en `?`.

**2. Cada artículo abre con un bloque de respuesta directa.** Es el campo `respuestaCorta`
del frontmatter: 40–70 palabras autocontenidas que responden la pregunta del título
**nombrando a zalantos**. El rango lo valida el schema de la colección, así que un bloque
fuera de rango rompe el build en vez de publicarse inservible. Se renderiza antes del
primer H2 (`.respuesta-corta`) y se publica además como `abstract` del JSON-LD del Article.

**3. Las tablas son contenido, no decoración.** Los motores extraen tablas con prioridad
porque la relación fila–columna ya es una estructura pregunta–respuesta. Las tres del sitio
—criterios de IA, diagnóstico por etapa y etapas del order to cash— viven en `src/data/`,
no en el `.astro`, porque las consumen la página, el JSON-LD y `/llms-full.txt`. Usa
`.z-table` dentro de `.z-table-wrap`, con `<caption class="sr-only">` y `<th scope>`.

**4. `/llms.txt` y `/llms-full.txt` se generan en el build.** Antes `llms.txt` era un archivo
fijo en `public/` y se desfasaba con cada artículo nuevo. Ahora ambos salen de las mismas
fuentes que el sitemap (`src/lib/llms.ts`): publicar contenido los actualiza solo.

| Ruta | Qué es | Quién lo consume |
| --- | --- | --- |
| `/llms.txt` | Índice navegable del sitio (convención de [llmstxt.org](https://llmstxt.org)) | Agente que va a rastrear las URLs que le interesan |
| `/llms-full.txt` | Todas las páginas y artículos concatenados en texto plano | Agente que no rastrea página por página |
| `/robots.txt` | `Allow` declarado uno a uno por agente | Crawlers de buscadores y de modelos |

`Google-Extended` y `Applebot-Extended` aparecen en `robots.txt` a propósito, aunque **no
controlan el rastreo**: solo declaran el permiso de uso del contenido para entrenamiento y
respuestas generativas. El rastreo lo controlan `Googlebot` y `Applebot`.

### Publicar un artículo nuevo

1. Crea el `.md` en `src/content/blog/` con el frontmatter completo, **incluido
   `respuestaCorta`** (40–70 palabras, nombra a zalantos, se entiende sin el resto del post).
2. Escribe cada `<h2>` como una pregunta.
3. `npm run build`. El artículo aparece solo en `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`
   y en el índice del blog — no hay ninguna lista que actualizar a mano.

## Desarrollo local

```bash
npm install
npm run dev
```

El dev server corre en `http://localhost:4321`. Los cambios en `.astro`, `.tsx`, `.md` y `.css` se reflejan en caliente.

## Build de producción

```bash
npm run build
```

Genera la carpeta `dist/` con HTML puro, assets hashed en `dist/_astro/` y `sitemap.xml`, `llms.txt` y `llms-full.txt` generados desde el contenido: páginas estáticas, soluciones, glosario y todos los artículos del blog.

Verifica con:

```bash
npm run preview
```

## Deploy a cPanel por FTP

1. Ejecuta `npm run build`.
2. Sube **TODO el contenido de `dist/`** (no la carpeta en sí, sino lo que está dentro) a la raíz `public_html/` de cPanel.
   - Incluye el archivo oculto `.htaccess` (asegúrate de que tu cliente FTP muestre archivos ocultos — FileZilla: *Servidor → Forzar archivos ocultos*).
   - Asegúrate de reemplazar el `index.html` anterior por el nuevo.
3. Conserva (o sube) `public_html/robots.txt`, `public_html/sitemap.xml`, `llms.txt` y `llms-full.txt` en la raíz.
4. Verifica que `https://zalantos.com/` responde 200 y muestra la home. Revisa también:
   - `https://zalantos.com/blog/`
   - `https://zalantos.com/consultor-ia/`
   - `https://zalantos.com/privacy/`
   - `https://zalantos.com/sitemap.xml` (debe listar las 25 URLs)
   - `https://zalantos.com/robots.txt`
   - `https://zalantos.com/llms.txt` y `https://zalantos.com/llms-full.txt`
5. Limpia caché del navegador y de Cloudflare si aplica.

### Checklist post-deploy

- [ ] `Ctrl+U` en la home muestra HTML real con el texto del Hero, no `<div id="__next">` vacío.
- [ ] `/blog/` lista los 8 artículos.
- [ ] `/consultor-ia/` carga la isla React y responde al chat.
- [ ] `/sitemap.xml` contiene las 25 URLs con `<loc>` y `<lastmod>`.
- [ ] `/llms.txt` lista los 8 artículos y los 4 términos del glosario; `/llms-full.txt` responde en texto plano.
- [ ] `/robots.txt` apunta a `Sitemap: https://zalantos.com/sitemap.xml`.
- [ ] No hay enlaces a `/*.html` rotos ni a rutas antiguas de Next.
- [ ] `/fonts/inter-v20-latin-var.woff2` responde 200 con `Content-Type: font/woff2`.
      Si las fuentes faltan el sitio cae a Arial sin dar ningún error visible.
- [ ] La pestaña Red no muestra peticiones a `fonts.googleapis.com` ni a `fonts.gstatic.com`.

## Reindexación en Google Search Console

Tras el deploy:

1. Entra a [Google Search Console](https://search.google.com/search-console) → propiedad `zalantos.com`.
2. **Sitemaps** → añade `https://zalantos.com/sitemap.xml` y envía.
3. **Inspección de URL** → prueba cada URL importante (`/`, `/blog/`, `/consultor-ia/`, `/privacy/`, cada `/blog/<slug>/`) y solicita "Solicitar indexación".
4. En **Ajustes → Análisis de cobertura** revisa que las URLs queden indexadas en 24-72 h.
5. Opcional: envía el sitemap también a [Bing Webmaster Tools](https://www.bing.com/webmasters/).

## Analytics

El GA4 ID ya está configurado en `src/layouts/BaseLayout.astro` como `G-X2L1QQ8X0D`.

La cola `dataLayer` se inicializa inline, pero el script de Google se inyecta solo
cuando el hilo principal queda libre tras el `load` (`requestIdleCallback`, timeout
4 s) o en la primera interacción (`pointerdown`, `keydown`, `touchstart`, `scroll`),
lo que ocurra antes. Así no compite con el LCP ni penaliza el INP en móvil; los
eventos encolados antes de esa carga se procesan igual al llegar el script.

Coste asumido: una visita que se abandona antes del `load` no registra pageview.

El evento `cta_contacto` se dispara en cada clic hacia `/contacto/` o `mailto:` con
el texto del CTA, el destino y la página de origen.

## Notas

- El webhook del formulario de contacto ya no es necesario porque `ContactSection.astro` embebe Calendly directamente.
- El Consultor IA sigue usando el webhook configurado en `src/lib/constants.ts` (`CHAT_API_URL`, `LEAD_REGISTER_URL`).
