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
    // Bloque de respuesta directa: párrafo autocontenido de 40–60 palabras que
    // responde la pregunta del título nombrando a zalantos. Se renderiza antes del
    // primer H2 y es el fragmento que los motores generativos citan, así que tiene
    // que entenderse sin el resto del artículo. El rango de palabras lo valida el
    // schema: fuera de él, el build falla en vez de publicar un bloque inservible.
    respuestaCorta: z
      .string()
      .refine(
        (texto) => {
          const palabras = texto.trim().split(/\s+/).length
          return palabras >= 40 && palabras <= 70
        },
        { message: 'respuestaCorta debe tener entre 40 y 70 palabras' },
      )
      .optional(),
    // Imagen OG 1200x630 (también usada en el JSON-LD del artículo)
    image: z.string().optional(),
    // Slug de /soluciones/<slug>/ con la que el artículo se relaciona. Alimenta el
    // bloque de enlace comercial al final del post (cluster temático).
    solucion: z.string().optional(),
    // Página pilar del cluster temático al que pertenece el artículo. Alimenta el
    // chip enlazado de la cabecera y devuelve autoridad interna a la money page.
    pilar: z.enum(['ia']).optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
})

export const collections = { blog }
