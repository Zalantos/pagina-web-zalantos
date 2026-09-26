// Etapas del ciclo order to cash que zalantos automatiza.
// Cada solución nace de una tarjeta de UseCases (home) y la desarrolla en página propia.
// Las cifras son las mismas del home y provienen de casos públicos de UiPath, ScienceSoft
// y McKinsey: NO son resultados de proyectos de zalantos y deben citarse como tales.

export interface PreguntaFrecuente {
  pregunta: string
  respuesta: string
}

/**
 * Tabla de datos de una página. La usan las soluciones y el glosario: los motores
 * generativos extraen tablas con prioridad sobre la prosa, así que cada bloque que
 * se pueda expresar como filas se expresa como filas.
 * `filas[i][0]` se renderiza como <th scope="row">.
 */
export interface TablaDatos {
  titulo: string
  /** <caption> accesible: describe qué contiene la tabla, no la repite. */
  caption: string
  columnas: string[]
  filas: string[][]
}

export interface Solucion {
  slug: string
  etapa: string
  fase: string
  /** H1 de la página */
  titulo: string
  /** <title>, máx. 49 caracteres para caber con el sufijo de marca */
  seoTitle: string
  description: string
  /** Keyword principal declarada, para revisar el foco de la página */
  keyword: string
  entradilla: string
  problema: string[]
  queHacemos: { titulo: string; detalle: string }[]
  ia: string
  impacto: { dato: string; detalle: string }
  /**
   * Diagnóstico de la etapa en formato tabla: el síntoma por el que se reconoce
   * desde fuera y los días de ciclo que se recuperan al resolverla. `base` deja
   * por escrito de dónde sale la cifra — ninguna es un resultado de zalantos.
   */
  diagnostico: { sintoma: string; dias: string; base: string }
  /**
   * Desglose síntoma → qué cambia → en cuánto. Solo la fila que corresponde a la
   * cifra de `impacto` o `diagnostico` lleva número: el resto expresa la magnitud en
   * términos del proceso. Ninguna cifra es un resultado de zalantos (ver `caption`).
   */
  tabla: TablaDatos
  paraTi: string[]
  faq: PreguntaFrecuente[]
  relacionadas: string[]
}

export const SOLUCIONES: Solucion[] = [
  {
    slug: 'integracion-erp-facturacion-electronica',
    etapa: '01',
    fase: 'Pedido y facturación',
    titulo: 'Integración ERP y facturación electrónica: facturar el mismo día que vendes',
    seoTitle: 'Integración ERP y facturación electrónica',
    description:
      'Conectamos tu ERP con la emisión de DTE para que el pedido se convierta en factura sin digitación manual ni esperar al cierre de mes.',
    keyword: 'integración ERP facturación electrónica SII',
    entradilla:
      'Entre que el cliente confirma el pedido y que existe una factura exigible hay un tramo que casi siempre se recorre a mano. Ese tramo es plazo de cobro que se agrega antes de que el reloj siquiera empiece a correr.',
    problema: [
      'El pedido llega en PDF, en un correo o en una planilla que el cliente arma a su manera. Alguien lo lee, lo interpreta y lo teclea en el ERP. Cada hora de tipeo es una hora en que la factura todavía no existe y, por lo tanto, el plazo de pago todavía no empezó a correr.',
      'Después viene el segundo tramo: si la empresa factura por lote en el cierre, la venta del día 2 espera casi un mes antes de convertirse en un cobro exigible. No hay nada en el proceso que lo justifique salvo la costumbre de agrupar el trabajo administrativo.',
      'A eso se suma el costo de los errores. Un DTE rechazado por el SII, una nota de crédito por un precio mal digitado o una factura emitida a la razón social equivocada no solo cuestan el retrabajo: reinician la cuenta del plazo de pago y, muchas veces, abren una disputa.',
    ],
    queHacemos: [
      {
        titulo: 'Captura del pedido sin digitación',
        detalle:
          'Leemos el pedido en el formato en que llega —PDF, correo, planilla o portal del cliente— y lo estructuramos con los campos que tu ERP necesita, con validación contra maestro de productos, lista de precios y condiciones comerciales vigentes.',
      },
      {
        titulo: 'Integración con el ERP',
        detalle:
          'Conectamos vía API o el mecanismo que exponga tu sistema, sin reemplazarlo. El pedido queda cargado con su trazabilidad: qué llegó, qué se interpretó, qué se cargó y quién lo validó.',
      },
      {
        titulo: 'Emisión del DTE',
        detalle:
          'Si tu ERP no está conectado con tu facturador electrónico, zalantos conecta los sistemas para que el DTE se emita con tu proveedor, con control de folios, certificados y reintentos ante rechazo.',
      },
      {
        titulo: 'Facturación continua en vez de por lote',
        detalle:
          'Rediseñamos el disparador: la factura se emite cuando se cumple la condición del negocio —despacho, conformidad de recepción, hito— y no cuando llega la fecha de cierre.',
      },
    ],
    ia: 'La IA entra donde el documento no tiene estructura. Un pedido que llega como PDF escaneado, con la nomenclatura del cliente y no la tuya, es un problema de interpretación, no de integración: hay que reconocer qué producto del catálogo corresponde a cada línea aunque esté escrito distinto. Ahí usamos modelos de extracción y de matching, siempre con un umbral de confianza explícito: sobre el umbral el pedido sigue solo, bajo el umbral se deriva a una persona con la duda ya acotada. La IA no reemplaza la validación, la concentra en los casos que de verdad la necesitan.',
    impacto: {
      dato: 'Digitación: de 10 a 3 minutos por pedido',
      detalle:
        'El pedido queda facturable el mismo día que llega, no cuando alguien alcanza a digitarlo. Y si además dejas de facturar por lote, cada semana que adelantas la emisión es una semana menos de tu dinero financiando al cliente.',
    },
    diagnostico: {
      sintoma:
        'El pedido llega en PDF o correo y alguien lo teclea en el ERP; la factura se emite en el cierre de mes y no cuando se cumple el hito comercial.',
      dias: 'Hasta 15 días',
      base:
        'Diferencia aritmética entre emitir la factura el día del hito y esperar al cierre mensual: en promedio, medio mes de facturación.',
    },
    tabla: {
      titulo: 'Qué cambia en la etapa de pedido y facturación',
      caption:
        'Síntomas de la etapa de pedido y facturación, qué cambia al automatizar cada uno y la magnitud del cambio. Las cifras provienen de casos públicos de terceros, no de proyectos de zalantos.',
      columnas: ['Síntoma que reconoces', 'Qué cambia al automatizarlo', 'En cuánto'],
      filas: [
        [
          'Los pedidos llegan en PDF, correo o planilla y alguien los transcribe al ERP',
          'El pedido se lee en el formato en que llega y se carga validado contra maestro de productos, lista de precios y condiciones vigentes',
          'De 10 a 3 minutos de digitación por pedido',
        ],
        [
          'Facturas por lote en el cierre de mes',
          'El disparador pasa a ser el hito comercial —despacho, conformidad de recepción, hito— y no la fecha de cierre',
          'Hasta 15 días de ciclo: medio mes de facturación',
        ],
        [
          'Tu ERP funciona pero no conversa con el resto de los sistemas',
          'Se integra por la interfaz que el ERP exponga, sin reemplazarlo, con trazabilidad de qué llegó y qué se cargó',
          'Sin cambiar de ERP ni sumar una plataforma',
        ],
        [
          'Las notas de crédito por errores de digitación son un tema recurrente',
          'La validación ocurre antes de emitir, y el DTE rechazado se reintenta con control de folios y certificados',
          'El error se ve antes del DTE, no después',
        ],
      ],
    },
    paraTi: [
      'Recibes pedidos en formatos que no controlas y alguien los transcribe',
      'Facturas por lote en el cierre de mes, no cuando se cumple el hito comercial',
      'Tienes un ERP que funciona pero no conversa con el resto de tus sistemas',
      'Las notas de crédito por errores de digitación son un tema recurrente',
    ],
    faq: [
      {
        pregunta: '¿Tengo que cambiar de ERP?',
        respuesta:
          'No. Trabajamos sobre el ERP que ya tienes. La integración se hace por las interfaces que el sistema exponga —API, web services, base de datos o archivos— y el objetivo explícito es no agregar un sistema más, sino conectar los que ya existen.',
      },
      {
        pregunta: '¿Sirve si ya tengo un proveedor de facturación electrónica?',
        respuesta:
          'Sí, y de hecho es el caso más común. No reemplazamos a tu proveedor de DTE: automatizamos lo que ocurre antes —que el pedido llegue completo y validado— y lo que ocurre después, como el control de rechazos y el registro en cuentas por cobrar.',
      },
      {
        pregunta: '¿Cómo manejan los pedidos que llegan mal o incompletos?',
        respuesta:
          'Se derivan a revisión humana con el problema ya identificado: qué línea no calzó, contra qué registro del maestro y con qué nivel de confianza. El objetivo no es que el 100% pase solo, sino que las personas solo vean las excepciones reales.',
      },
      {
        pregunta: '¿Cuánto demora una implementación?',
        respuesta:
          'Depende del número de formatos de entrada y de qué tan accesible sea el ERP. La etapa de Discovery en nuestra metodología permite dimensionar y responder esta pregunta con tu caso concreto.',
      },
      {
        pregunta: '¿Qué pasa con la trazabilidad para auditoría?',
        respuesta:
          'Cada paso queda registrado: el documento original como llegó, la interpretación, las validaciones aplicadas, quién intervino y cuándo. Automatizar no puede significar perder el rastro; si no es auditable, no lo damos por terminado.',
      },
    ],
    relacionadas: ['evaluacion-de-credito-y-alta-de-clientes', 'automatizacion-de-cobranza'],
  },
  {
    slug: 'automatizacion-de-cobranza',
    etapa: '02',
    fase: 'Cobranza y disputas',
    titulo: 'Automatización de cobranza: cobrar antes de que la factura envejezca',
    seoTitle: 'Automatización de cobranza para empresas',
    description:
      'Seguimiento automático de la cartera, priorización por riesgo y disputas con el expediente consolidado, para reducir tus días de cobro.',
    keyword: 'automatización de cobranza empresas',
    entradilla:
      'La mayoría de las empresas no tiene un problema de cobranza: tiene un problema de oportunidad. Nadie hace seguimiento hasta que la factura ya está vencida, y para entonces la conversación es otra.',
    problema: [
      'La gestión de cobranza suele arrancar cuando la factura ya venció. Hasta ese momento nadie la mira, porque el equipo está ocupado con las que ya están en problemas. Es una carrera que siempre se corre desde atrás.',
      'La cartera se prioriza por monto o por antigüedad, que son los dos criterios más fáciles de calcular y no necesariamente los que más caja liberan. Un cliente grande que siempre paga al día no necesita la misma atención que uno mediano que ya se atrasó dos veces.',
      'Y cuando aparece una disputa, la factura deja de ser cobrable hasta que alguien reconstruye a mano qué se pactó, qué se entregó y qué se facturó. Esa reconstrucción cruza correos, el ERP, la guía de despacho y a veces la memoria de un vendedor. Mientras tanto, el monto sigue en la cartera sin moverse.',
    ],
    queHacemos: [
      {
        titulo: 'Seguimiento que empieza antes del vencimiento',
        detalle:
          'Definimos el calendario de contacto desde la emisión: confirmación de recepción, recordatorio previo al vencimiento y escalamiento posterior. El objetivo es que la factura no llegue vencida a la primera conversación.',
      },
      {
        titulo: 'Priorización por riesgo, no por monto',
        detalle:
          'Ordenamos la cartera combinando comportamiento histórico de pago, antigüedad, monto y señales de riesgo, para que el equipo dedique su tiempo donde la gestión cambia el resultado.',
      },
      {
        titulo: 'Expediente de disputa consolidado',
        detalle:
          'Cuando se levanta una disputa, el sistema arma automáticamente el expediente: orden de compra, factura, guía de despacho y conformidad de recepción, todo en un solo lugar.',
      },
      {
        titulo: 'Registro único de la gestión',
        detalle:
          'Cada contacto, compromiso de pago y acuerdo queda registrado contra la factura. Se acaba la cobranza que vive en la bandeja de entrada de una persona.',
      },
    ],
    ia: 'En cobranza la IA aporta en dos frentes concretos. El primero es anticipar: con el historial de pago de cada cliente se puede estimar qué facturas tienen mayor probabilidad de atrasarse antes de que se atrasen, lo que permite gestionar sobre una lista corta en vez de sobre toda la cartera. El segundo es la disputa: el pedido, la orden de compra y la guía de despacho para identificar dónde está la discrepancia —cantidad, precio, condición comercial— y presentarla resuelta a quien va a decidir. Lo que hoy toma horas de reconstrucción manual se convierte en una revisión. En ambos casos la decisión de cobrar, condonar o escalar sigue siendo de una persona: la IA prepara el caso, no lo cierra.',
    impacto: {
      dato: 'Ciclo de cobro: 30% menos',
      detalle:
        'Si hoy cobras en 60 días, pasas a 42. Ese diferencial es capital de trabajo que dejas de financiar: sobre una cartera de mil millones, son cerca de 300 millones que vuelven a tu caja de forma permanente.',
    },
    diagnostico: {
      sintoma:
        'La primera gestión ocurre cuando la factura ya venció, y la cartera se prioriza por monto o antigüedad porque es lo único que se puede calcular rápido.',
      dias: '18 días sobre un ciclo de 60',
      base:
        'Reducción del 30% del ciclo de cobro reportada en casos públicos de UiPath, ScienceSoft y McKinsey.',
    },
    tabla: {
      titulo: 'Qué cambia en la etapa de cobranza',
      caption:
        'Síntomas de la etapa de cobranza y disputas, qué cambia al automatizar cada uno y la magnitud del cambio. Las cifras provienen de casos públicos de terceros, no de proyectos de zalantos.',
      columnas: ['Síntoma que reconoces', 'Qué cambia al automatizarlo', 'En cuánto'],
      filas: [
        [
          'La primera gestión ocurre cuando la factura ya venció',
          'El seguimiento arranca antes del vencimiento, sobre la cartera que todavía está en plazo',
          '18 días sobre un ciclo de 60 (−30%)',
        ],
        [
          'Priorizas la cartera por monto o antigüedad porque es lo único calculable rápido',
          'La cartera se ordena por riesgo de no pago y comportamiento del cliente, no por tamaño de la factura',
          'La gestión del día queda definida sin reunión',
        ],
        [
          'Cada disputa obliga a reconstruir el caso revisando correos y documentos sueltos',
          'El expediente queda consolidado: factura, respaldo de entrega, comunicaciones y estado del caso',
          'El caso está armado cuando se abre',
        ],
        [
          'No sabes con certeza qué compromisos de pago hay vigentes ni quién los tomó',
          'Cada gestión y cada compromiso quedan en un registro único, con responsable y fecha',
          'Compromisos visibles el mismo día',
        ],
      ],
    },
    paraTi: [
      'La gestión de cobranza parte cuando la factura ya venció',
      'Priorizas la cartera por monto o antigüedad porque es lo único que puedes calcular rápido',
      'Cada disputa obliga a reconstruir el caso revisando correos y documentos sueltos',
      'No sabes con certeza qué compromisos de pago hay vigentes ni quién los tomó',
    ],
    faq: [
      {
        pregunta: '¿Esto reemplaza a mi equipo de cobranza?',
        respuesta:
          'No. Reemplaza el trabajo de rastrear información y decidir a quién llamar primero. La conversación con el cliente, la negociación y el criterio sobre cuándo escalar siguen siendo humanos, y funcionan mejor cuando la persona llega con el caso completo.',
      },
      {
        pregunta: '¿Es lo mismo que un software de cobranza?',
        respuesta:
          'No. Un software de cobranza es un producto que compras y al que adaptas tu proceso. Nosotros trabajamos sobre los sistemas que ya tienes y conectamos las etapas que hoy están sueltas. Si tu problema se resuelve comprando un producto, te lo vamos a decir en el diagnóstico.',
      },
      {
        pregunta: '¿Cómo evitan que la automatización moleste a los clientes?',
        respuesta:
          'Definiendo reglas de contacto por segmento antes de automatizar nada: frecuencia máxima, canal, tono y qué clientes quedan siempre fuera del flujo automático. La cobranza mal calibrada cuesta más que la factura que recupera.',
      },
      {
        pregunta: '¿Necesito tener los datos ordenados para empezar?',
        respuesta:
          'No para empezar, sí para escalar. Parte del diagnóstico es justamente establecer qué tan confiables son los datos de cartera y comportamiento de pago, porque la priorización por riesgo depende de eso.',
      },
      {
        pregunta: '¿Funciona con cobranza B2B de pocos clientes grandes?',
        respuesta:
          'Sí, y el foco cambia: con pocos clientes grandes el valor está mucho más en la gestión de disputas y en la trazabilidad del acuerdo que en el volumen de recordatorios automáticos.',
      },
    ],
    relacionadas: ['integracion-erp-facturacion-electronica', 'visibilidad-de-caja-y-conciliacion'],
  },
  {
    slug: 'evaluacion-de-credito-y-alta-de-clientes',
    etapa: '03',
    fase: 'Crédito',
    titulo: 'Evaluación de crédito automatizada: aprobar al cliente sin frenar la venta',
    seoTitle: 'Evaluación de crédito automatizada',
    description:
      'Automatizamos la evaluación crediticia y el alta de clientes para que tu proceso interno no frene la venta ni retrase la primera factura.',
    keyword: 'evaluación de crédito automatizada empresas',
    entradilla:
      'El cliente ya decidió comprarte. Lo que lo hace esperar no es su decisión, es tu proceso interno de evaluación y alta.',
    problema: [
      'La evaluación de crédito y el alta del cliente demoran días o semanas porque son un recorrido por varias manos: comercial reúne antecedentes, finanzas los evalúa, alguien consulta fuentes externas, otro carga los datos en el ERP y un cuarto define el cupo y la condición de pago.',
      'Cada uno de esos pasos es corto. Lo que demora es el tiempo entre pasos: la solicitud esperando en una bandeja de entrada a que alguien la mire.',
      'El costo no es solo el retraso. Un cliente que espera tres semanas para operar es un cliente que tuvo tres semanas para reconsiderar, y un mes menos de relación comercial antes de su primera factura.',
    ],
    queHacemos: [
      {
        titulo: 'Solicitud estructurada desde el origen',
        detalle:
          'Un único punto de entrada que pide exactamente los antecedentes necesarios y valida en el momento que estén completos, para que la solicitud no rebote tres veces antes de poder evaluarse.',
      },
      {
        titulo: 'Consulta automática de antecedentes',
        detalle:
          'Integramos las fuentes que ya usas para verificar existencia, situación tributaria y comportamiento comercial, sin que nadie tenga que entrar a cada portal a copiar y pegar.',
      },
      {
        titulo: 'Política de crédito ejecutable',
        detalle:
          'Traducimos tu política a reglas explícitas. Los casos que caen claramente dentro de ella se aprueban solos con su cupo y condición; los que están en el borde se derivan con el análisis ya hecho y la recomendación justificada.',
      },
      {
        titulo: 'Alta automática en los sistemas',
        detalle:
          'Aprobado el crédito, el cliente queda creado en el ERP y en los sistemas que corresponda, con su cupo, condición de pago y responsable comercial, sin recarga manual.',
      },
    ],
    ia: 'La IA aquí no decide el crédito: ordena la evidencia para decidirlo. Sirve para leer estados financieros, cartolas o documentos societarios que llegan en formatos distintos y extraer los indicadores comparables; y sirve para construir un score de comportamiento con el historial real de pago de clientes similares en tu propia cartera, que suele ser más predictivo que cualquier fuente externa genérica. La política de crédito sigue siendo tuya y las excepciones las aprueba una persona con atribuciones. Lo que cambia es que esa persona ve tres casos al día en vez de treinta.',
    impacto: {
      dato: 'Alta de cliente: de 30 días a 1 día',
      detalle:
        'El cliente nuevo queda operativo en 24 horas. Es un mes menos de espera antes de su primera factura, y un mes menos de riesgo de que reconsidere la compra.',
    },
    diagnostico: {
      sintoma:
        'El alta de un cliente nuevo recorre varias manos, nadie sabe en qué paso está y la venta ya cerrada espera por el proceso interno.',
      dias: '29 días',
      base:
        'Alta de cliente de 30 días a 1 día reportada en casos públicos de UiPath, ScienceSoft y McKinsey.',
    },
    tabla: {
      titulo: 'Qué cambia en la etapa de crédito y alta de clientes',
      caption:
        'Síntomas de la etapa de evaluación de crédito y alta de clientes, qué cambia al automatizar cada uno y la magnitud del cambio. Las cifras provienen de casos públicos de terceros, no de proyectos de zalantos.',
      columnas: ['Síntoma que reconoces', 'Qué cambia al automatizarlo', 'En cuánto'],
      filas: [
        [
          'El alta de un cliente nuevo demora semanas y nadie sabe en qué paso está',
          'La solicitud entra estructurada desde el origen y cada paso queda con estado visible',
          'De 30 días a 1 día de alta',
        ],
        [
          'La política de crédito existe en un documento pero se aplica con criterio variable',
          'La política queda ejecutable: los mismos antecedentes producen la misma decisión',
          'Criterio uniforme, con la excepción explícita',
        ],
        [
          'Consultar antecedentes implica entrar a varios portales y copiar datos a mano',
          'Los antecedentes se consultan automáticamente y se adjuntan a la solicitud',
          'Sin copiar datos entre portales',
        ],
        [
          'El equipo comercial persigue internamente sus propias solicitudes',
          'El estado es consultable y, al aprobarse, el alta se ejecuta en los sistemas',
          '29 días que la venta deja de esperar',
        ],
      ],
    },
    paraTi: [
      'El alta de un cliente nuevo demora semanas y nadie sabe bien en qué paso está',
      'La política de crédito existe en un documento pero se aplica con criterio variable',
      'Consultar antecedentes implica entrar a varios portales y copiar datos a mano',
      'El equipo comercial persigue internamente sus propias solicitudes',
    ],
    faq: [
      {
        pregunta: '¿La IA va a decidir a quién le damos crédito?',
        respuesta:
          'No. Las reglas de aprobación son tu política de crédito, escrita de forma explícita y ejecutable. La IA ordena la información y, en los casos de borde, propone una recomendación fundamentada que una persona con atribuciones aprueba o rechaza.',
      },
      {
        pregunta: '¿Qué pasa con los clientes que no califican automáticamente?',
        respuesta:
          'Se derivan a evaluación humana con el expediente completo y el motivo del quiebre identificado. El objetivo no es aprobar todo solo, es que el analista dedique su tiempo a los casos que requieren criterio.',
      },
      {
        pregunta: '¿Se integra con las fuentes de información comercial que ya usamos?',
        respuesta:
          'Sí, siempre que expongan una interfaz de consulta. Parte del diagnóstico es revisar qué fuentes usas hoy, cuáles aportan de verdad a la decisión y cuáles se consultan por inercia.',
      },
      {
        pregunta: '¿Cómo queda registrada la decisión para auditoría?',
        respuesta:
          'Cada aprobación guarda los antecedentes consultados, la regla que se aplicó, el cupo asignado y quién intervino. Una decisión de crédito sin rastro no es auditable y eso es un riesgo, no una eficiencia.',
      },
      {
        pregunta: '¿Sirve si damos crédito a pocos clientes al año?',
        respuesta:
          'Si son muy pocos, probablemente no justifica automatizar la evaluación completa. Puede justificarse el alta y la consulta de antecedentes. Te lo vamos a decir derechamente en el Sprint 0 en vez de venderte el proyecto entero.',
      },
    ],
    relacionadas: ['integracion-erp-facturacion-electronica', 'automatizacion-de-cobranza'],
  },
  {
    slug: 'visibilidad-de-caja-y-conciliacion',
    etapa: '04',
    fase: 'Caja y control',
    titulo: 'Conciliación bancaria automatizada: saber hoy qué entró, no a fin de mes',
    seoTitle: 'Conciliación bancaria automatizada',
    description:
      'Automatizamos la conciliación bancaria y unificamos la información para conocer tu posición de caja real durante el mes, no cuando cierra la contabilidad.',
    keyword: 'conciliación bancaria automatizada empresas',
    entradilla:
      'Operar la semana sin saber la posición real de caja es tomar decisiones con información de hace tres semanas. Y las decisiones financieras no admiten ese desfase.',
    problema: [
      'La conciliación bancaria se hace a mano, cruzando cartolas contra el registro contable, y tarda días. Mientras tanto la empresa opera con una estimación.',
      'Los pagos llegan sin identificar: una transferencia por un monto que no calza con ninguna factura, un pago que cubre cinco documentos parciales, un abono sin referencia. Cada uno de esos casos es un rato de alguien reconstruyendo a qué corresponde.',
      'Y el resultado de todo ese trabajo llega tarde. La posición de caja se conoce cuando cierra el mes, que es exactamente cuando ya no sirve para decidir nada del mes.',
    ],
    queHacemos: [
      {
        titulo: 'Captura automática de movimientos',
        detalle:
          'Los movimientos bancarios ingresan sin carga manual, con la periodicidad que tu banco permita, y quedan normalizados en un formato único independiente del origen.',
      },
      {
        titulo: 'Cruce automático contra cuentas por cobrar',
        detalle:
          'El sistema concilia lo que calza de forma inequívoca y marca el resto en tres estados: coincidencia, pendiente de identificar e incidencia. Las personas ven solo los dos últimos.',
      },
      {
        titulo: 'Posición de caja durante el mes',
        detalle:
          'Un tablero con la posición real y la proyección de los próximos días, construido sobre la cartera vigente y el comportamiento de pago efectivo de cada cliente.',
      },
      {
        titulo: 'Fuente única de información',
        detalle:
          'Se acaba la discusión sobre qué planilla tiene el número correcto. Un solo origen, con la definición de cada indicador documentada y accesible.',
      },
    ],
    ia: 'El trabajo duro de la conciliación no son los pagos que calzan, son los que no. Un abono que cubre parcialmente tres facturas, una transferencia cuyo glosa trae el nombre de fantasía en vez de la razón social, un pago con descuento por pronto pago no informado. Ahí la IA propone la asignación más probable con su justificación y su nivel de confianza, y una persona confirma o corrige. Cada corrección mejora la propuesta siguiente. Sobre la proyección de caja, los modelos aportan al estimar cuándo va a pagar efectivamente cada cliente según su comportamiento real, que casi nunca coincide con la condición de pago pactada.',
    impacto: {
      dato: 'Conciliación: de 15 a 3 días',
      detalle:
        'Conoces tu posición de caja el lunes, no a fin de mes. Decides con el saldo que existe hoy y no con el que existía hace tres semanas.',
    },
    diagnostico: {
      sintoma:
        'La conciliación bancaria se hace a mano cruzando cartolas, hay pagos que nadie logra identificar y la posición de caja se conoce recién al cerrar la contabilidad.',
      dias: '12 días',
      base:
        'Conciliación de 15 a 3 días reportada en casos públicos de UiPath, ScienceSoft y McKinsey.',
    },
    tabla: {
      titulo: 'Qué cambia en la etapa de caja y control',
      caption:
        'Síntomas de la etapa de conciliación y visibilidad de caja, qué cambia al automatizar cada uno y la magnitud del cambio. Las cifras provienen de casos públicos de terceros, no de proyectos de zalantos.',
      columnas: ['Síntoma que reconoces', 'Qué cambia al automatizarlo', 'En cuánto'],
      filas: [
        [
          'La conciliación bancaria ocupa varios días al mes de trabajo manual',
          'Los movimientos se capturan solos y se cruzan automáticamente contra cuentas por cobrar',
          'De 15 a 3 días de conciliación',
        ],
        [
          'Hay pagos recibidos que nadie logra identificar a qué factura corresponden',
          'El cruce propone la correspondencia y deriva a revisión únicamente lo que no calza',
          'Solo las excepciones llegan a una persona',
        ],
        [
          'La posición de caja se conoce recién cuando cierra la contabilidad',
          'La posición se actualiza durante el mes, con los movimientos ya conciliados',
          '12 días antes: el lunes, no a fin de mes',
        ],
        [
          'Las áreas manejan cifras distintas para el mismo indicador',
          'Una fuente única de información alimenta los tableros de todas las áreas',
          'Una sola cifra por indicador',
        ],
      ],
    },
    paraTi: [
      'La conciliación bancaria ocupa varios días al mes de trabajo manual',
      'Hay pagos recibidos que nadie logra identificar a qué factura corresponden',
      'La posición de caja se conoce recién cuando cierra la contabilidad',
      'Las áreas manejan cifras distintas para el mismo indicador',
    ],
    faq: [
      {
        pregunta: '¿Esto es un software de conciliación bancaria?',
        respuesta:
          'No. Hay muy buenos productos de conciliación en el mercado chileno y si tu caso se resuelve con uno, corresponde comprarlo. Nosotros intervenimos cuando el problema es de integración: cuando el banco, el ERP y la cartera no conversan, o cuando la lógica de negocio es específica y ningún producto estándar la cubre.',
      },
      {
        pregunta: '¿Cómo obtienen los movimientos del banco?',
        respuesta:
          'Por el mecanismo que tu banco ofrezca: convenio de transmisión, archivo de cartola o integración disponible. Parte del diagnóstico es revisar qué alternativas tienes con los bancos con que operas.',
      },
      {
        pregunta: '¿Qué pasa con los pagos que la IA no logra asignar?',
        respuesta:
          'Quedan en estado pendiente con las candidatas más probables ordenadas y el motivo de la duda. Nadie parte de cero: se revisa una propuesta, no un misterio.',
      },
      {
        pregunta: '¿Puedo confiar en una proyección de caja hecha con modelos?',
        respuesta:
          'En la medida en que puedas auditarla. Entregamos la proyección con el supuesto explícito detrás de cada monto y el error histórico del modelo. Una proyección que no puedes cuestionar no sirve para tomar decisiones de tesorería.',
      },
      {
        pregunta: '¿Reemplaza a mi sistema contable?',
        respuesta:
          'No. La contabilidad sigue donde está. Lo que construimos es la capa de información que permite operar durante el mes sin esperar el cierre.',
      },
    ],
    relacionadas: ['automatizacion-de-cobranza', 'integracion-erp-facturacion-electronica'],
  },
]

export function getSolucion(slug: string): Solucion | undefined {
  return SOLUCIONES.find((s) => s.slug === slug)
}

// FAQ del índice /soluciones/. Vive aquí y no dentro de la página porque la
// consumen tres destinos: el HTML visible, el JSON-LD de FAQPage y el texto
// completo de /llms-full.txt.
export const FAQ_ORDER_TO_CASH: PreguntaFrecuente[] = [
  {
    pregunta: '¿Qué es el ciclo order to cash?',
    respuesta:
      'Es el recorrido completo que va desde que un cliente hace un pedido hasta que el dinero de esa venta está disponible en la caja de la empresa. Incluye el ingreso del pedido, la evaluación de crédito, la facturación, la cobranza, la gestión de disputas y la conciliación del pago. Se le llama order to cash o ciclo de venta a cobro.',
  },
  {
    pregunta: '¿Por qué automatizar el ciclo completo y no solo una etapa?',
    respuesta:
      'Porque el tiempo total que tu dinero pasa en la calle es la suma de todas las etapas. Automatizar la cobranza sirve de poco si la factura se emitió tres semanas tarde, y facturar rápido sirve de poco si después nadie hace seguimiento. Las mejoras de una etapa se pierden en la siguiente si el proceso sigue cortado.',
  },
  {
    pregunta: '¿Necesito cambiar mi ERP o comprar una plataforma nueva?',
    respuesta:
      'No. Trabajamos sobre los sistemas que la empresa ya tiene y conectamos las etapas que hoy están sueltas. Si tu problema puntual se resuelve mejor comprando un producto del mercado, te lo decimos en el diagnóstico en vez de venderte un desarrollo.',
  },
  {
    pregunta: '¿Dónde interviene la inteligencia artificial?',
    respuesta:
      'En los puntos donde el proceso depende de interpretar información sin estructura o de anticipar un comportamiento: leer un pedido que llega en PDF, identificar a qué factura corresponde un pago sin referencia, estimar qué facturas se van a atrasar o reconstruir el origen de una disputa. La IA prepara y ordena; las decisiones con consecuencia comercial las sigue tomando una persona.',
  },
  {
    pregunta: '¿Por dónde se parte?',
    respuesta:
      'Por el Sprint 0: una actividad sin costo para ti en la que mapeamos el proceso o actividad de tu ciclo actual, identificamos dónde se pierden los días y proponemos qué automatizar primero según impacto en caja. No requiere compromiso posterior.',
  },
]
