// Fuente única del equipo de zalantos. La consumen /nosotros/ (tarjetas + schema Person),
// el pie de autoría de cada artículo del blog (AuthorBio) y el `founder` de la Organization
// a través de los @id de src/lib/schemas.ts.
//
// El `linkedin` alimenta el `sameAs` del schema Person y es lo que sostiene el E-E-A-T
// de los artículos: sin un perfil verificable, el nombre del autor no acredita nada.
// NO agregar personas ni credenciales sin confirmar: las bios están redactadas solo con
// datos presentes en los perfiles públicos de LinkedIn.

export interface MiembroEquipo {
  /** Debe coincidir exactamente con el frontmatter `author` de los posts (ver PERSONAS en schemas.ts). */
  nombre: string
  cargo: string
  /** Bio extensa para la tarjeta de /nosotros/. */
  bio: string
  /** Versión de dos líneas para el pie de autoría del blog: la credencial que justifica el artículo. */
  bioCorta: string
  linkedin?: string
}

export const EQUIPO: MiembroEquipo[] = [
  {
    nombre: 'Juan Pablo Rodríguez',
    cargo: 'Co-Founder & CEO',
    bio: 'Ingeniero civil industrial de la Universidad de Santiago de Chile con más de treinta años de experiencia en áreas de control de gestión, riesgo y auditoría interna. Como gerente de Planificación y Control de Gestión de Claro Chile consolidó los procesos de información financiera entre los sistemas después de la fusión, previamente había dirigido el área de auditoría interna de VTR y Liberty Latin America: implementando el estándar SOX, auditando procesos como: order to cash, procure to pay y record to report, entre otros, aplicando analítica de datos para identificar brechas de procesos de negocio.',
    bioCorta:
      'Ingeniero civil industrial (USACH) con más de treinta años en control de gestión, riesgo y auditoría interna. Gerente de Planificación y Control de Gestión en Claro Chile y antes a cargo de la auditoría interna de VTR y Liberty Latin America, donde implementó el estándar SOX y auditó los ciclos order to cash, procure to pay y record to report.',
    linkedin: 'https://www.linkedin.com/in/juanpablorodriguezseco/',
  },
  {
    nombre: 'Tomás Rodríguez',
    cargo: 'Co-Founder & CTO',
    bio: 'Ingeniero civil industrial de la Pontificia Universidad Católica de Chile, especializado en tecnologías de la información e investigación operativa. En Walmart Chile automatizó procesos con Power Automate y Power Apps y desarrolló agentes de IA en Copilot Studio para mejorar la gestión operacional, acompañando la adopción de esas herramientas en distintas áreas del negocio. En zalantos lidera el desarrollo: conectar los sistemas que la empresa ya tiene y aplicar IA solo donde el proceso realmente la necesita.',
    bioCorta:
      'Ingeniero civil industrial de la Pontificia Universidad Católica de Chile, especializado en tecnologías de la información e investigación operativa. En Walmart Chile automatizó procesos con Power Automate y Power Apps y desarrolló agentes de IA en Copilot Studio; en zalantos lidera el desarrollo de las integraciones y la IA aplicada a la operación.',
    linkedin: 'https://www.linkedin.com/in/tomasrodriguezg/',
  },
]

/** Miembro del equipo por nombre, o undefined si el autor no pertenece al equipo. */
export function getMiembro(nombre: string): MiembroEquipo | undefined {
  return EQUIPO.find((persona) => persona.nombre === nombre)
}
