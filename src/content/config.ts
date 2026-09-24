import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Título para <title> y og:title (≤ 49 caracteres para llegar a 60 con el sufijo de marca)
    seoTitle: z.string().max(49).optional(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('zalantos'),
    category: z.string(),
    excerpt: z.string(),
    // Imagen OG 1200x630 (también usada en el JSON-LD del artículo)
    image: z.string().optional(),
    // Slug de /soluciones/<slug>/ con la que el artículo se relaciona. Alimenta el
    // bloque de enlace comercial al final del post (cluster temático).
    solucion: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
})

export const collections = { blog }
