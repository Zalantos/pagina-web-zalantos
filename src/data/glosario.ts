// Glosario: páginas de definición para los términos que el sitio usa como eje
// de posicionamiento. Responden la consulta definicional («qué es order to cash»),
// que es la captura clásica de los motores generativos: la respuesta es corta,
// autocontenida y no depende del resto de la página.
//
// Regla de cada entrada: `definicion` tiene que poder citarse sola, sin contexto,
// y nombrar a qué se refiere. Todo lo demás es desarrollo.

import type { PreguntaFrecuente, TablaDatos } from './soluciones'

export interface SeccionTermino {
  /** H2 en forma de pregunta: es lo que un motor empareja con la consulta. */
  pregunta: string
  /** Párrafos de la respuesta. El primero debe responder por sí solo. */
  respuesta: string[]
}

/** Misma forma que cualquier tabla del sitio: se define una sola vez en soluciones. */
export type TablaTermino = TablaDatos

export interface TerminoGlosario {
  slug: string
  /** El término tal como se define. */
  termino: string
  /** <title>, máx. 49 caracteres para caber con el sufijo de marca */
  seoTitle: string
  /** H1 de la página */
  titulo: string
  description: string
  /**
   * Definición canónica, 40–60 palabras, autocontenida. Es el bloque de respuesta
   * directa de la página y el `description` del DefinedTerm en el JSON-LD.
   */
  definicion: string
  /** Otras formas en que se nombra el mismo concepto. Alimentan el alternateName. */
  sinonimos: string[]
  /**
   * URLs que identifican EXACTAMENTE el mismo concepto en bases de entidades públicas
   * (Wikidata, Wikipedia). Ancla el término a una entidad ya conocida por los motores,
   * que es lo que les permite resolver la consulta sin ambigüedad.
   * Regla: solo identidad exacta. Un concepto más amplio o vecino va en `relacionadas`,
   * porque `sameAs` afirma «son la misma cosa» y una afirmación falsa aquí desorienta.
   */
  sameAs?: string[]
  /**
   * Entidades públicas vinculadas pero distintas del término. Se emiten como
   * `mentions` de la WebPage, no como `sameAs`: un DTE ocurre dentro de la facturación
   * electrónica y lo valida el SII, pero no ES ninguna de las dos cosas.
   */
  relacionadas?: { nombre: string; url: string; wikidata: string }[]
  secciones: SeccionTermino[]
  tabla?: TablaTermino
  faq: PreguntaFrecuente[]
  /** Slugs de otros términos del glosario. */
  relacionados: string[]
  /** Enlaces a páginas comerciales donde el término se aplica. */
  verTambien: { label: string; href: string }[]
}

export const GLOSARIO: TerminoGlosario[] = [
  {
    slug: 'order-to-cash',
    termino: 'Order to cash',
    seoTitle: 'Qué es order to cash (O2C)',
    titulo: 'Order to cash (O2C): qué es y cómo se mide',
    description:
      'Order to cash es el proceso que va desde el pedido de un cliente hasta que el dinero está en caja. Definición, etapas, cómo se mide y dónde se pierden días.',
    definicion:
      'Order to cash (O2C) es el proceso de negocio que va desde que un cliente emite un pedido hasta que el dinero de esa venta está disponible en la caja de la empresa. Comprende el ingreso del pedido, la evaluación de crédito, la facturación, la cobranza, la gestión de disputas y la conciliación del pago.',
    sinonimos: ['O2C', 'OTC', 'Ciclo de venta a cobro', 'Pedido a cobro', 'Orden a efectivo'],
    sameAs: [
      'https://www.wikidata.org/wiki/Q1232984',
      'https://en.wikipedia.org/wiki/Order_to_cash',
    ],
    secciones: [
      {
        pregunta: '¿Qué etapas componen el ciclo order to cash?',
        respuesta: [
          'El ciclo order to cash tiene seis etapas encadenadas: ingreso del pedido, evaluación de crédito y alta del cliente, cumplimiento y facturación, cobranza, gestión de disputas y conciliación del pago. Cada una entrega a la siguiente, y el retraso de cualquiera se arrastra hasta el final.',
          'La secuencia importa más que las etapas por separado. El tiempo total que el dinero pasa fuera de la caja es la suma de los seis tramos, no el peor de ellos: adelantar la cobranza sirve de poco si la factura se emitió tres semanas tarde.',
        ],
      },
      {
        pregunta: '¿Cómo se mide el ciclo order to cash?',
        respuesta: [
          'El indicador principal es el DSO (days sales outstanding): los días promedio que transcurren entre la venta y el cobro efectivo. Se calcula dividiendo las cuentas por cobrar del período por las ventas a crédito del mismo período, multiplicado por los días del período.',
          'El DSO mide el resultado, no la causa. Para saber dónde se pierden los días hay que medir cada tramo por separado: días entre pedido y factura emitida, días entre factura y primera gestión de cobro, días que una disputa mantiene el monto inmovilizado y días de rezago de la conciliación.',
          'Un DSO alto con facturación rápida indica un problema de cobranza. Un DSO alto con cobranza disciplinada casi siempre indica que la factura se emite tarde, y esa es una fuga que ningún esfuerzo del área de cobranza puede compensar.',
        ],
      },
      {
        pregunta: '¿Por qué importa acortar el ciclo order to cash?',
        respuesta: [
          'Cada día que el ciclo se alarga es capital de trabajo que la empresa financia por su cuenta. Sobre una cartera de mil millones de pesos, reducir el ciclo de 60 a 42 días libera del orden de 300 millones de forma permanente: no es un ingreso extraordinario, es dinero propio que deja de estar en la calle.',
          'El efecto secundario es de riesgo. Una factura que envejece pierde probabilidad de cobro y gana probabilidad de disputa, porque los antecedentes se dispersan y la contraparte que la originó ya no está disponible para aclararla.',
        ],
      },
      {
        pregunta: '¿Dónde se pierden los días en el order to cash?',
        respuesta: [
          'En los traspasos entre etapas, no dentro de ellas. Los pasos individuales suelen ser cortos; lo que demora es el tiempo en que una solicitud espera en la bandeja de entrada de alguien, el pedido en PDF esperando digitación o la factura esperando el cierre de mes para emitirse por lote.',
          'Las causas más frecuentes son cuatro: digitación manual del pedido, facturación por lote en vez de por hito, cobranza que arranca recién cuando la factura ya venció, y conciliación bancaria manual que retrasa el conocimiento de qué se pagó.',
        ],
      },
      {
        pregunta: '¿Qué se puede automatizar del ciclo order to cash?',
        respuesta: [
          'Prácticamente todas las etapas admiten automatización, pero con mecanismos distintos. El ingreso del pedido y la conciliación exigen interpretar información sin estructura, y ahí aporta la inteligencia artificial. La facturación, la emisión de documentos tributarios electrónicos y el calendario de cobranza son reglas explícitas, y se resuelven mejor con automatización determinística.',
          'zalantos automatiza estas actividades sobre los sistemas que la empresa ya usa —ERP, facturador electrónico, banco— en vez de reemplazarlos, y aplica IA solo en los puntos donde el proceso depende de interpretar o de anticipar.',
        ],
      },
    ],
    tabla: {
      titulo: 'Las etapas del ciclo, su indicador y su fuga habitual',
      caption:
        'Etapas del ciclo order to cash, el indicador que mide cada una y la causa más frecuente de retraso.',
      columnas: ['Etapa', 'Qué ocurre', 'Indicador', 'Fuga habitual'],
      filas: [
        [
          'Ingreso del pedido',
          'El pedido del cliente entra al sistema y queda validado contra precios y condiciones.',
          'Días entre pedido recibido y pedido cargado',
          'Digitación manual de pedidos que llegan en PDF o correo.',
        ],
        [
          'Crédito y alta de cliente',
          'Se verifican antecedentes, se asigna cupo y condición de pago, y el cliente queda creado.',
          'Días entre solicitud y cliente operativo',
          'La solicitud espera en la bandeja de entrada de cada aprobador.',
        ],
        [
          'Cumplimiento y facturación',
          'Se despacha o se presta el servicio y se emite el documento tributario electrónico.',
          'Días entre hito cumplido y factura emitida',
          'Facturación por lote en el cierre en vez de por hito cumplido.',
        ],
        [
          'Cobranza',
          'Se hace seguimiento del cobro según el vencimiento y el riesgo de cada cliente.',
          'DSO y % de cartera vencida',
          'La primera gestión ocurre cuando la factura ya venció.',
        ],
        [
          'Disputas',
          'Se resuelve la discrepancia entre lo pactado, lo entregado y lo facturado.',
          'Días de resolución y monto inmovilizado',
          'Reconstruir el caso a mano cruzando correos, ERP y guías de despacho.',
        ],
        [
          'Conciliación',
          'El pago recibido se asigna a las facturas que cubre y se actualiza la posición de caja.',
          'Días de rezago de la conciliación',
          'Cruce manual de cartolas y pagos que llegan sin referencia.',
        ],
      ],
    },
    faq: [
      {
        pregunta: '¿Order to cash es lo mismo que cuentas por cobrar?',
        respuesta:
          'No. Cuentas por cobrar es una de las etapas del order to cash —la gestión del cobro de facturas ya emitidas— mientras que el order to cash abarca el proceso completo, desde que entra el pedido. La distinción es práctica: muchas empresas intentan mejorar el DSO trabajando solo sobre cuentas por cobrar, cuando el retraso se originó antes de que la factura existiera.',
      },
      {
        pregunta: '¿Cuál es la diferencia entre order to cash y procure to pay?',
        respuesta:
          'Son los dos ciclos espejo del capital de trabajo. Order to cash es el lado del ingreso: del pedido del cliente al dinero en caja. Procure to pay (P2P) es el lado del egreso: de la solicitud de compra al pago al proveedor. Un ciclo mide cuánto demoras en cobrar; el otro, cuánto demoras en pagar.',
      },
      {
        pregunta: '¿Qué rol cumple la inteligencia artificial en el order to cash?',
        respuesta:
          'Interviene donde el proceso depende de interpretar información sin estructura o de anticipar un comportamiento: leer un pedido que llega en PDF, identificar a qué factura corresponde un pago sin referencia, estimar qué facturas se van a atrasar o reconstruir el origen de una disputa. Las decisiones con consecuencia comercial —aprobar un crédito, condonar, escalar— las sigue tomando una persona.',
      },
      {
        pregunta: '¿Se puede automatizar una sola etapa del order to cash?',
        respuesta:
          'Sí, y suele ser la forma correcta de partir. Cada etapa se puede abordar por separado y rinde por sí sola. Lo que no rinde es automatizar una etapa e ignorar que su resultado entra a la siguiente todavía a mano: ahí el tiempo ganado se pierde en el traspaso.',
      },
      {
        pregunta: '¿Cómo se sabe qué etapa conviene atacar primero?',
        respuesta:
          'Midiendo los días de cada tramo por separado, no el DSO total. zalantos lo hace en el Sprint 0: una semana sin costo en la que se mapea el ciclo de punta a punta, se identifica dónde se pierden los días y se proponen las opciones priorizadas por impacto en caja.',
      },
    ],
    relacionados: ['dso', 'dte', 'sprint-0'],
    verTambien: [
      { label: 'Automatización order to cash, etapa por etapa', href: '/soluciones/' },
      { label: 'Inteligencia artificial empresarial', href: '/inteligencia-artificial-empresarial/' },
    ],
  },
  {
    slug: 'dso',
    termino: 'DSO',
    seoTitle: 'Qué es el DSO y cómo se calcula',
    titulo: 'DSO (days sales outstanding): qué es y cómo se calcula',
    description:
      'El DSO mide los días promedio que una empresa tarda en cobrar sus ventas a crédito. Fórmula, cómo interpretarlo y cuándo un DSO alto no es de cobranza.',
    definicion:
      'El DSO (days sales outstanding, o días de venta pendientes de cobro) mide los días promedio que una empresa demora en convertir una venta a crédito en dinero efectivo. Es el indicador principal del ciclo order to cash y se expresa en días: cuanto más alto, más tiempo el capital de trabajo financia al cliente.',
    sinonimos: [
      'Days sales outstanding',
      'Días de venta pendientes de cobro',
      'Período medio de cobro',
      'PMC',
    ],
    sameAs: [
      'https://www.wikidata.org/wiki/Q1179136',
      'https://en.wikipedia.org/wiki/Days_sales_outstanding',
    ],
    secciones: [
      {
        pregunta: '¿Cómo se calcula el DSO?',
        respuesta: [
          'El DSO se calcula dividiendo el saldo de cuentas por cobrar al cierre del período por las ventas a crédito del mismo período, y multiplicando el resultado por el número de días del período. Con cuentas por cobrar de 500 millones, ventas a crédito de 3.000 millones y un período de 360 días, el DSO es de 60 días.',
          'La fórmula admite variantes. El DSO por antigüedad (countback) recorre la cartera factura por factura hacia atrás y refleja mejor a las empresas con ventas estacionales, donde el promedio simple distorsiona.',
        ],
      },
      {
        pregunta: '¿Qué significa un DSO alto?',
        respuesta: [
          'Un DSO alto significa que el dinero de las ventas permanece más tiempo fuera de la caja, y ese tiempo lo financia la empresa. Pero no indica por sí solo dónde está la causa: puede originarse en condiciones de pago pactadas largas, en una cobranza que arranca tarde o en facturas que se emiten semanas después del hito comercial.',
          'Por eso conviene comparar el DSO contra la condición de pago promedio pactada. Si vendes a 30 días y tu DSO es 60, la brecha de 30 días es el problema real; si vendes a 60 y tu DSO es 63, el ciclo está sano y lo que hay que revisar es la política comercial.',
        ],
      },
      {
        pregunta: '¿Cómo se reduce el DSO?',
        respuesta: [
          'Acortando cada tramo del ciclo order to cash, no solo la cobranza. Emitir la factura el día en que se cumple el hito en vez de esperar el cierre de mes, hacer la primera gestión antes del vencimiento, resolver disputas con el expediente ya armado y conciliar los pagos sin rezago.',
          'Las mejoras de cobranza tienen techo: si la factura salió tres semanas tarde, ninguna gestión recupera esas tres semanas. Por eso el orden de ataque se define midiendo los días de cada tramo por separado.',
        ],
      },
    ],
    faq: [
      {
        pregunta: '¿Cuál es un buen DSO?',
        respuesta:
          'No existe un valor bueno universal: depende de la industria y de las condiciones de pago que la empresa pacta. La referencia útil es la propia: el DSO comparado con la condición de pago promedio acordada, y la evolución del indicador en el tiempo.',
      },
      {
        pregunta: '¿El DSO incluye las ventas al contado?',
        respuesta:
          'No. El denominador son las ventas a crédito del período. Incluir las ventas al contado diluye el indicador y hace parecer que la empresa cobra más rápido de lo que realmente cobra a sus clientes con crédito.',
      },
      {
        pregunta: '¿Qué diferencia hay entre DSO y cartera vencida?',
        respuesta:
          'El DSO mide el tiempo promedio de cobro de toda la cartera, vencida o no. La cartera vencida mide solo el monto que ya pasó su fecha de vencimiento. Una empresa puede tener poca cartera vencida y un DSO alto si sus condiciones de pago pactadas son largas.',
      },
    ],
    relacionados: ['order-to-cash', 'sprint-0'],
    verTambien: [
      { label: 'Automatización de cobranza', href: '/soluciones/automatizacion-de-cobranza/' },
      { label: 'Conciliación bancaria automatizada', href: '/soluciones/visibilidad-de-caja-y-conciliacion/' },
    ],
  },
  {
    slug: 'dte',
    termino: 'DTE',
    seoTitle: 'Qué es un DTE en Chile',
    titulo: 'DTE (documento tributario electrónico): qué es en Chile',
    description:
      'Un DTE es el documento tributario electrónico que el SII valida en Chile: factura, nota de crédito, guía de despacho o boleta. Tipos y cómo se integra.',
    definicion:
      'Un DTE (documento tributario electrónico) es el documento de respaldo de una operación comercial emitido en formato electrónico y validado por el Servicio de Impuestos Internos de Chile. Incluye la factura electrónica, la nota de crédito y de débito, la guía de despacho electrónica y la boleta electrónica.',
    sinonimos: ['Documento tributario electrónico', 'Factura electrónica', 'Facturación electrónica SII'],
    relacionadas: [
      {
        nombre: 'Facturación electrónica',
        url: 'https://en.wikipedia.org/wiki/Electronic_invoicing',
        wikidata: 'https://www.wikidata.org/wiki/Q10481245',
      },
      {
        nombre: 'Servicio de Impuestos Internos',
        url: 'https://es.wikipedia.org/wiki/Servicio_de_Impuestos_Internos',
        wikidata: 'https://www.wikidata.org/wiki/Q6126114',
      },
    ],
    secciones: [
      {
        pregunta: '¿Qué tipos de DTE existen?',
        respuesta: [
          'Los tipos de uso más frecuente en una operación B2B son la factura electrónica (tipo 33) y la factura exenta (34), la nota de crédito electrónica (61), la nota de débito electrónica (56) y la guía de despacho electrónica (52). La boleta electrónica (39 y 41) corresponde a la venta a consumidor final.',
          'Cada tipo se identifica por un código y consume folios de un rango autorizado por el SII, que se solicita por anticipado y se controla por tipo de documento.',
        ],
      },
      {
        pregunta: '¿Cómo se emite un DTE de forma automatizada?',
        respuesta: [
          'La emisión automatizada conecta el sistema donde ocurre el hecho comercial —el ERP— con el proveedor de facturación electrónica que firma y envía el documento al SII. El disparador deja de ser una persona en el cierre de mes y pasa a ser la condición de negocio: despacho, conformidad de recepción o hito cumplido.',
          'La parte que no se puede omitir es el control del retorno: acuse de recibo, aceptación o rechazo del SII y del receptor, y el reintento ante error. Un DTE rechazado que nadie detecta es una venta que no está cobrada y que nadie está gestionando.',
        ],
      },
    ],
    faq: [
      {
        pregunta: '¿Necesito cambiar de proveedor de facturación electrónica para automatizar?',
        respuesta:
          'No. Lo habitual es mantener al proveedor de DTE y automatizar lo que ocurre antes —que el pedido llegue completo y validado al ERP— y lo que ocurre después, como el control de rechazos y el registro en cuentas por cobrar.',
      },
      {
        pregunta: '¿Qué pasa si el SII rechaza un DTE?',
        respuesta:
          'El documento no tiene validez tributaria y el plazo de pago no empieza a correr. Por eso el control de rechazos y el reintento automático forman parte del diseño: el caso tiene que llegar a una persona identificado, no descubrirse semanas después al revisar la cartera.',
      },
    ],
    relacionados: ['order-to-cash', 'dso'],
    verTambien: [
      {
        label: 'Integración ERP y facturación electrónica',
        href: '/soluciones/integracion-erp-facturacion-electronica/',
      },
    ],
  },
  {
    slug: 'sprint-0',
    termino: 'Sprint 0',
    seoTitle: 'Qué es el Sprint 0 de zalantos',
    titulo: 'Sprint 0: el diagnóstico previo a automatizar',
    description:
      'El Sprint 0 de zalantos es un diagnóstico de una semana, sin costo, que mapea el ciclo de venta a cobro y prioriza qué automatizar según impacto en caja.',
    definicion:
      'El Sprint 0 es el diagnóstico que zalantos realiza antes de automatizar nada: una semana de trabajo conjunto, sin costo y sin compromiso posterior, en la que se mapea el proceso de punta a punta, se identifica dónde se pierden los días y se entregan por escrito las opciones priorizadas por impacto en caja.',
    sinonimos: ['Sprint cero', 'Diagnóstico de procesos', 'Discovery'],
    secciones: [
      {
        pregunta: '¿Qué se hace durante el Sprint 0?',
        respuesta: [
          'Se levanta el proceso tal como opera hoy, con las personas que lo ejecutan; se mide cuántos días consume cada tramo; se revisa el estado real de los datos que alimentarían cualquier automatización; y se identifican las causas concretas de cada atasco, separando las que son de sistema de las que son de diseño del proceso.',
          'El entregable es un documento con el mapa del proceso, los días perdidos por tramo, las opciones de solución ordenadas por impacto en caja y el roadmap sugerido. Queda en poder de la empresa, avance o no con zalantos.',
        ],
      },
      {
        pregunta: '¿Por qué un diagnóstico antes de automatizar?',
        respuesta: [
          'Porque la causa más común de proyectos que no llegan a producción no es la tecnología: es haber elegido la herramienta antes de entender qué fricción se estaba resolviendo, o haber asumido que los datos estaban en condiciones de alimentarla.',
          'El diagnóstico también sirve para descartar. En varios casos la conclusión honesta es que el problema se resuelve con integración y reglas explícitas, sin IA, o comprando un producto del mercado en vez de desarrollar.',
        ],
      },
    ],
    faq: [
      {
        pregunta: '¿El Sprint 0 tiene costo?',
        respuesta:
          'No. El Sprint 0 no tiene costo para la empresa y no obliga a contratar nada después. El diagnóstico queda en poder del cliente, avance o no con zalantos.',
      },
      {
        pregunta: '¿Cuánto dura el Sprint 0?',
        respuesta:
          'Una semana de trabajo conjunto. La duración es acotada a propósito: el objetivo es entregar una decisión fundamentada, no un estudio extenso que retrase la acción.',
      },
    ],
    relacionados: ['order-to-cash', 'dso'],
    verTambien: [
      { label: 'Agendar un Sprint 0', href: '/contacto/?agendar=1' },
      { label: 'Automatización order to cash, etapa por etapa', href: '/soluciones/' },
    ],
  },
]

export function getTermino(slug: string): TerminoGlosario | undefined {
  return GLOSARIO.find((t) => t.slug === slug)
}
