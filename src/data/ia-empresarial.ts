// Contenido de /inteligencia-artificial-empresarial/ extraído a datos.
// Vive fuera de la página porque lo consumen tres destinos: la página misma,
// el JSON-LD de FAQ y el texto completo de /llms-full.txt. Si el contenido
// estuviera dentro del .astro habría que mantener dos copias sincronizadas.

export interface PreguntaFrecuente {
  pregunta: string
  respuesta: string
}

export interface PatronIA {
  nombre: string
  cuando: string
  como: string
  limite: string
}

/** Los cuatro patrones en que la IA aporta dentro de un proceso operativo. */
export const PATRONES_IA: PatronIA[] = [
  {
    nombre: 'Interpretar documentos sin estructura',
    cuando:
      'Cuando la información entra en un formato que tú no controlas: un pedido en PDF, una factura de proveedor escaneada, un contrato, un correo con condiciones comerciales.',
    como:
      'Modelos de extracción que leen el documento y lo convierten en campos estructurados, con un umbral de confianza explícito. Sobre el umbral el flujo sigue solo; bajo el umbral se deriva a una persona con la duda ya acotada.',
    limite:
      'No sirve si el documento es crítico y no hay tolerancia a error. Ahí la IA propone y una persona confirma siempre.',
  },
  {
    nombre: 'Conciliar y emparejar registros',
    cuando:
      'Cuando hay que cruzar dos fuentes que no comparten identificador: un pago contra las facturas que cubre, una línea de pedido contra el maestro de productos, un movimiento bancario contra un cliente.',
    como:
      'Modelos de similitud que proponen la asignación más probable con su justificación. Cada corrección humana mejora la propuesta siguiente.',
    limite:
      'Requiere volumen histórico para ser útil. Con pocos casos, un conjunto de reglas explícitas funciona mejor y es más fácil de auditar.',
  },
  {
    nombre: 'Anticipar comportamiento',
    cuando:
      'Cuando la decisión mejora si sabes qué va a pasar: qué facturas se van a atrasar, cuándo va a pagar efectivamente un cliente, qué demanda esperar el próximo trimestre.',
    como:
      'Modelos entrenados sobre tu propio historial, que suele ser más predictivo que cualquier fuente externa genérica. Se entrega siempre con el error histórico del modelo a la vista.',
    limite:
      'Una predicción que no puedes cuestionar no sirve para decidir. Si el modelo no explica su supuesto, no lo ponemos en producción.',
  },
  {
    nombre: 'Responder sobre documentación propia',
    cuando:
      'Cuando el conocimiento existe pero está disperso en PDFs, correos, carpetas y procedimientos que nadie encuentra a tiempo.',
    como:
      'Sistemas RAG que responden únicamente con la documentación oficial de la organización, citando de dónde sacaron cada respuesta.',
    limite:
      'La calidad de la respuesta es la calidad de la documentación. Si los procedimientos están desactualizados, la IA va a repetir el error más rápido.',
  },
]

export interface CriterioIA {
  /** La situación operativa concreta, escrita como la describiría quien la vive. */
  situacion: string
  /** Veredicto binario: la columna que un motor de IA extrae como respuesta. */
  veredicto: 'Sí' | 'No'
  /** Por qué ese veredicto. */
  porque: string
  /** Qué corresponde hacer: la solución con IA, o la alternativa más barata sin ella. */
  alternativa: string
}

// Tabla «cuándo sí IA / cuándo no / alternativa». Es la respuesta a la consulta
// más frecuente que llega a esta página —«¿necesito IA para esto?»— en el formato
// que los motores generativos extraen con prioridad: una fila por situación,
// veredicto binario y alternativa explícita.
export const CRITERIOS_IA: CriterioIA[] = [
  {
    situacion: 'El proceso está definido y sus reglas son explícitas y estables',
    veredicto: 'No',
    porque: 'No hay ambigüedad que interpretar: un motor de reglas acierta el 100% y es auditable línea por línea.',
    alternativa: 'Automatización determinística sobre los sistemas actuales (integración, workflow, RPA).',
  },
  {
    situacion: 'La información entra sin estructura y en formatos que no controlas',
    veredicto: 'Sí',
    porque: 'Un PDF, un correo o una planilla con la nomenclatura del cliente exigen interpretar, no solo transcribir.',
    alternativa: 'Extracción con umbral de confianza. Bajo el umbral, revisión humana con la duda acotada.',
  },
  {
    situacion: 'Hay que cruzar dos fuentes sin identificador común y con volumen histórico',
    veredicto: 'Sí',
    porque: 'El emparejamiento probabilístico aprende de cada corrección; las reglas fijas no cubren los casos de borde.',
    alternativa: 'Modelos de similitud que proponen la asignación con su justificación y nivel de confianza.',
  },
  {
    situacion: 'Hay que cruzar dos fuentes pero los casos son pocos y repetitivos',
    veredicto: 'No',
    porque: 'Sin volumen histórico el modelo no tiene de qué aprender y el resultado es peor que una tabla de equivalencias.',
    alternativa: 'Reglas explícitas de mapeo, mantenidas por el equipo que conoce el negocio.',
  },
  {
    situacion: 'La decisión mejora si sabes qué va a pasar antes de que pase',
    veredicto: 'Sí',
    porque: 'Anticipar atrasos, pagos o demanda es un problema estadístico, y tu propio historial suele ser el mejor predictor.',
    alternativa: 'Modelo entrenado sobre datos propios, entregado con su error histórico a la vista.',
  },
  {
    situacion: 'El conocimiento existe documentado pero nadie lo encuentra a tiempo',
    veredicto: 'Sí',
    porque: 'La búsqueda por palabra clave falla cuando la pregunta y el documento no usan las mismas palabras.',
    alternativa: 'Sistema RAG que responde solo con la documentación oficial y cita la fuente de cada respuesta.',
  },
  {
    situacion: 'El conocimiento está desactualizado, disperso o nunca se escribió',
    veredicto: 'No',
    porque: 'La IA amplifica lo que hay debajo: sobre procedimientos obsoletos propaga el error más rápido.',
    alternativa: 'Ordenar y versionar la documentación primero. Recién después tiene sentido la capa de IA.',
  },
  {
    situacion: 'El error no tiene tolerancia y la decisión compromete dinero o contrato',
    veredicto: 'No',
    porque: 'Ninguna automatización, con IA o sin ella, debe cerrar sola una decisión con consecuencia comercial.',
    alternativa: 'La IA prepara y ordena el caso; una persona con atribuciones aprueba, y queda el registro.',
  },
  {
    situacion: 'Los datos que alimentarían el modelo están incompletos o no son confiables',
    veredicto: 'No',
    porque: 'Es la causa más común de proyectos que funcionan en la demostración y fallan en producción.',
    alternativa: 'Saneamiento y trazabilidad de los datos como paso previo. El Sprint 0 mide en qué estado están.',
  },
]

export const FAQ_IA: PreguntaFrecuente[] = [
  {
    pregunta: '¿Qué es la inteligencia artificial empresarial?',
    respuesta:
      'Es la aplicación de modelos de IA dentro de procesos de negocio existentes, con objetivos operativos medibles y con los controles que exige una operación auditable. Se distingue del uso general de herramientas de IA en que está integrada al flujo de trabajo, opera sobre los datos de la organización y su resultado tiene consecuencias sobre el proceso.',
  },
  {
    pregunta: '¿Cuándo un problema operativo NO necesita IA?',
    respuesta:
      'Cuando el proceso está claramente definido y sus reglas son explícitas: ahí una automatización determinista es más barata, más rápida y más fácil de auditar. También cuando los casos son pocos, cuando los datos no son confiables o cuando la decisión no admite error. La IA aporta cuando hay ambigüedad, información sin estructura o necesidad de anticipar. Si tu problema se resuelve con reglas, te vamos a recomendar reglas.',
  },
  {
    pregunta: '¿Cómo se controla que la IA no se equivoque?',
    respuesta:
      'Con tres mecanismos: umbrales de confianza que definen qué pasa solo y qué se deriva a revisión, trazabilidad completa de cada decisión —qué entró, qué se propuso, quién confirmó— y límites explícitos sobre lo que el sistema puede y no puede hacer. Una automatización que no se puede auditar es un riesgo, no una eficiencia.',
  },
  {
    pregunta: '¿Los datos de mi empresa entrenan modelos de terceros?',
    respuesta:
      'No en las implementaciones que diseñamos. La configuración del proveedor y el tratamiento de los datos es parte explícita del diseño de la solución, y se define antes de mover información. Es una de las primeras preguntas que respondemos en el Sprint 0.',
  },
  {
    pregunta: '¿Necesito tener mis datos ordenados antes de aplicar IA?',
    respuesta:
      'Para la mayoría de los casos, sí. Es la causa más común de proyectos de IA que no llegan a producción: el modelo funciona en la demostración y falla con los datos reales. Por eso el diagnóstico parte por revisar qué tan confiable es la información que alimentaría la solución. Y si los datos no están listos, también te ayudamos a ordenarlos antes de automatizar.',
  },
]
