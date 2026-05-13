export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  authorRole: string
  date: string
  readTime: number
  imageGradient: string
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'analisis-articulo-21-lir-aplicacion-vida-real',
    title: 'Analisis: Articulo 21 de la LIR y como se aplica en la vida real',
    excerpt:
      'El articulo 21 de la Ley de la Renta es uno de los mas relevantes para contribuyentes chilenos. En este analisis desglosamos su aplicacion practica con casos reales.',
    content: `## Introduccion

El articulo 21 de la Ley sobre Impuesto a la Renta (LIR) regula las **rentas de fuente chilena** y es fundamental para entender las obligaciones tributarias de personas y empresas en Chile.

## Que dice el Articulo 21

El articulo establece que son rentas de fuente chilena:

- Las provenientes de bienes situados en Chile
- Las provenientes de actividades economicas realizadas en territorio nacional
- Las rentas por servicios prestados en el pais
- Las regalias y demas rentas de propiedad intelectual explotadas en Chile

## Caso practico: Empresa de servicios tecnologicos

Supongamos una empresa que presta servicios de desarrollo de software desde Santiago para clientes locales y extranjeros.

### Situacion A: Cliente chileno

> Los ingresos por servicios prestados a un cliente con domicilio o residencia en Chile son **renta de fuente chilena** segun el articulo 21, letra a).

### Situacion B: Cliente extranjero

Aqui surge la complejidad. Si el servicio se presta **desde Chile**, aunque el cliente este en el extranjero, la renta sigue siendo de fuente chilena porque la actividad economica se realiza en territorio nacional.

## Tabla resumen

| Tipo de renta | Fuente | Tributacion en Chile |
|---|---|---|
| Servicios a cliente chileno | Chile | Si |
| Servicios prestados desde Chile | Chile | Si |
| Servicios prestados desde el extranjero | Extranjero | No |
| Venta de bienes en Chile | Chile | Si |

## Conclusiones

1. El articulo 21 es amplio en su cobertura
2. Lo determinante es **donde se realiza la actividad**, no donde esta el cliente
3. Es fundamental documentar correctamente la prestacion de servicios

## Recomendaciones

- Manten registros detallados de donde se prestan los servicios
- Consulta con un asesor tributario para casos complejos
- Revisa periodicamente las actualizaciones normativas del SII

## Referencias

- [Ley sobre Impuesto a la Renta - Biblioteca del Congreso](https://www.bcn.cl)
- [Instrucciones SII sobre renta de fuente chilena](https://www.sii.cl)`,
    category: 'analisis normativo',
    tags: ['LIR', 'articulo 21', 'renta de fuente chilena', 'SII'],
    author: 'contacto@impuestia.cl',
    authorRole: 'Asesor Tributario',
    date: '2026-01-30',
    readTime: 8,
    imageGradient: 'from-blue-900 to-purple-900',
  },
  {
    id: '2',
    slug: 'que-hacer-si-te-cita-el-sii-guia-practica',
    title: 'Que hacer si te cita el SII: Guia practica de 4 pasos',
    excerpt:
      'Recibir una citacion del SII puede ser estresante. Te presentamos una guia clara y practica para manejar la situacion con calma y profesionalismo.',
    content: `## Paso 1: Revisa tu correo y buzon

El SII comunica las citaciones principalmente por:

- **Correo electronico** registrado en el RUT
- **Buzon tributario electronico**
- Correo postal certificado

> Es fundamental mantener actualizados tus datos de contacto en el SII para recibir las notificaciones a tiempo.

## Paso 2: Identifica el tipo de notificacion

No todas las citaciones son iguales. Identifica si se trata de:

1. **Citacion simple**: Solicitud de informacion o documentacion
2. **Citacion con emplazamiento**: Requiere una respuesta formal en plazo determinado
3. **Citacion a audiencia**: Reunion presencial o virtual con el fiscalizador

## Paso 3: Prepara la documentacion

Reune toda la documentacion relacionada:

- Libros de compra y venta
- Comprobantes de pago
- Contratos y acuerdos
- Estados financieros
- Respaldo de gastos deducidos

## Paso 4: Busca asesoria profesional

Aunque puedas manejar una citacion simple por tu cuenta, es **altamente recomendable** contar con un asesor tributario para:

- Interpretar correctamente lo que solicita el SII
- Preparar respuestas formales y completas
- Representarte en audiencias
- Gestionar recursos si es necesario

## Consejos adicionales

### No ignores la citacion

El incumplimiento puede llevar a:

- Multas por inasistencia
- Multas por no entregar documentacion
- Resoluciones en rebeldia (en contra tuya)

### Plazos comunes

| Tipo | Plazo tipico |
|---|---|
| Entrega de documentacion | 10-20 dias habiles |
| Respuesta a emplazamiento | 15-30 dias habiles |
| Audiencia | Fecha fijada por el SII |

## Conclusion

Recibir una citacion del SII no es el fin del mundo. Con preparacion, organizacion y buena asesoria, puedes manejar el proceso de manera efectiva y proteger tus derechos como contribuyente.`,
    category: 'guias',
    tags: ['SII', 'citacion', 'fiscalizacion', 'guia practica'],
    author: 'contacto@impuestia.cl',
    authorRole: 'Asesor Tributario',
    date: '2026-02-15',
    readTime: 6,
    imageGradient: 'from-red-900 to-orange-900',
  },
  {
    id: '3',
    slug: 'planificacion-tributaria-empresas-chile-2026',
    title: 'Planificacion tributaria para empresas en Chile 2026',
    excerpt:
      'Descubre las estrategias legales mas efectivas para optimizar tu carga tributaria este ano. Desde la eleccion del regimen tributario hasta la utilizacion de beneficios especiales.',
    content: `## Introduccion

La planificacion tributaria es el conjunto de estrategias legales que permite a las empresas **optimizar su carga fiscal** sin incurrir en evasion o elusion tributaria.

## Regimenes tributarios disponibles

### 1. Regimen 14 ter (PEQ)

Para empresas con ventas anuales hasta **UF 25,000**:

- Tasa efectiva reducida
- Contabilidad simplificada
- No se aplica IPC al patrimonio

### 2. Regimen 14 quater (Propyme)

Para empresas con ventas hasta **UF 100,000**:

- Tasa de primera categoria del 25%
- Beneficios de depreciacion acelerada
- Incentivo a la inversion

### 3. Regimen general (Articulo 20)

Para empresas grandes:

- Tasa de primera categoria del 27%
- Acceso a todos los beneficios legales
- Mayor complejidad contable

## Estrategias clave para 2026

### Depreciacion acelerada

Si estas en el regimen 14 quater, puedes depreciar bienes nuevos a una tasa tres veces mayor a la normal durante los primeros anos.

### Fondo de utilidades tributarias (FUT)

Mantener un **FUT ordenado** es esencial para:

- Evitar retiros excesivos
- Planificar dividendos
- Optimizar el credito por impuesto de primera categoria

### Gastos deducibles poco conocidos

1. Capacitacion de personal
2. Donaciones a fundaciones sin fines de lucro
3. Gastos de investigacion y desarrollo
4. Seguros contra incendios y robos
5. Cuotas de gremios y asociaciones

## Calendario tributario 2026

| Mes | Obligacion |
|---|---|
| Enero | Declaracion Jurada 1905 (rentas del ano anterior) |
| Febrero | Pago de IVA (enero) |
| Marzo | Declaracion de renta anual |
| Abril | Pago de IVA (marzo) + primera PPM |
| Mayo-Diciembre | IVA mensual + PPM |

## Conclusion

Una buena planificacion tributaria puede significar **ahorros significativos** para tu empresa. La clave es anticiparse, conocer las normas y asesorarte con profesionales especializados.

## Proximos pasos

1. Revisa tu regimen tributario actual
2. Evalua si un cambio de regimen te beneficiaria
3. Programa una consulta con un asesor tributario`,
    category: 'planificacion',
    tags: ['planificacion tributaria', 'empresas', '14 ter', '14 quater', '2026'],
    author: 'contacto@impuestia.cl',
    authorRole: 'Asesor Tributario',
    date: '2026-03-05',
    readTime: 10,
    imageGradient: 'from-emerald-900 to-teal-900',
  },
  {
    id: '4',
    slug: 'reforma-tributaria-2026-lo-que-debes-saber',
    title: 'Reforma Tributaria 2026: Lo que debes saber como contribuyente',
    excerpt:
      'El gobierno ha anunciado cambios significativos en el sistema tributario chileno. Analizamos los puntos clave y como te afectan como persona o empresa.',
    content: `## Contexto de la reforma

La reforma tributaria 2026 busca aumentar la recaudacion fiscal para financiar programas sociales mientras mantiene la competitividad economica del pais.

## Cambios principales

### 1. Incremento en la tasa de IVA

La tasa de IVA pasaria del **19% al 20%** para ciertos bienes y servicios considerados suntuarios.

### 2. Nuevo impuesto a las fortunas

Se crea un impuesto progresivo sobre el patrimonio neto que exceda ciertos umbrales:

| Patrimonio | Tasa propuesta |
|---|---|
| Hasta 5,000 UF | 0% |
| 5,000 - 15,000 UF | 0.5% |
| 15,000 - 50,000 UF | 1.0% |
| Sobre 50,000 UF | 1.5% |

### 3. Modificaciones al impuesto a la renta

- Subida de la tasa maxima del IGC del **35% al 37%**
- Nueva escala progresiva con mas tramos
- Limitaciones a las deducciones por donaciones

### 4. Beneficios para pymes

A pesar de los aumentos generales, la reforma incluye beneficios para pymes:

- Credito tributario por contratacion de nuevos empleados
- Aceleracion de la depreciacion de bienes nuevos
- Exencion temporal del pago de patentes municipales

## Como prepararte

1. **Revisa tu situacion actual**: Haz una proyeccion de como te afectan los cambios
2. **Consulta con un asesor**: Cada caso es particular y requiere analisis profesional
3. **Aprovecha los beneficios transitorios**: Algunos beneficios actuales tienen plazo limitado
4. **Mantente informado**: Los proyectos de ley pueden cambiar durante la tramitacion

## Cronograma esperado

- **Marzo 2026**: Presentacion del proyecto
- **Junio 2026**: Aprobacion en el Congreso
- **Enero 2027**: Entrada en vigencia

## Conclusion

La reforma tributaria 2026 traera cambios significativos. La clave esta en la preparacion anticipada y el asesoramiento profesional para adaptarse a las nuevas reglas de la mejor manera posible.`,
    category: 'normativa',
    tags: ['reforma tributaria', '2026', 'IVA', 'IGC', 'pymes'],
    author: 'contacto@impuestia.cl',
    authorRole: 'Asesor Tributario',
    date: '2026-03-20',
    readTime: 7,
    imageGradient: 'from-indigo-900 to-blue-900',
  },
  {
    id: '5',
    slug: 'iva-mensual-errores-comunes-como-evitarlos',
    title: 'IVA Mensual: Errores comunes y como evitarlos',
    excerpt:
      'La declaracion del IVA mensual es una de las obligaciones tributarias mas frecuentes. Conoce los errores mas comunes que cometen los contribuyentes y como evitarlos.',
    content: `## Introduccion

La declaracion del Impuesto al Valor Agregado (IVA) es una obligacion mensual que afecta a la mayoria de los contribuyentes chilenos. A pesar de su frecuencia, es comun cometer errores que pueden generar multas o problemas con el SII.

## Error 1: No declarar operaciones exentas

Muchos contribuyentes creen que solo deben declarar operaciones gravadas. **Esto es incorrecto.**

Todas las operaciones deben declararse:

- Ventas y servicios gravados (19%)
- Ventas y servicios exentos
- Exportaciones (con derecho a credito)
- Compras y gastos (tanto gravados como exentos)

## Error 2: Errores en la fecha de la operacion

La fecha del documento debe coincidir con el periodo en que se declara:

| Situacion | Fecha correcta |
|---|---|
| Venta de bienes | Fecha de entrega del bien |
| Prestacion de servicios | Fecha de termino del servicio |
| Documentos de exportacion | Fecha de emision del DUS |

## Error 3: No mantener el factor de proporcionalidad

Si realizas operaciones gravadas y exentas, debes calcular el factor de proporcionalidad para determinar el credito fiscal al que tienes derecho.

> El factor de proporcionalidad = Ventas gravadas / Ventas totales

## Error 4: Omitir ajustes al IVA

Algunas operaciones requieren ajustes especiales:

1. **Ventas anuladas**: Deben restarse del periodo original
2. **Notas de credito**: Afectan el IVA del periodo que se emite
3. **Cambio de precio**: Generan ajuste proporcional

## Error 5: Presentar la declaracion fuera de plazo

El plazo para declarar el IVA es hasta el **dia 20 de cada mes** (o el siguiente habil si cae en fin de semana o feriado).

### Consecuencias del atraso:

- Multa por declaracion extemporanea
- Intereses por el pago tardio
- Posibles problemas en futuras fiscalizaciones

## Consejos practicos

1. **Usa software de contabilidad**: Reduce los errores manuales
2. **Revisa antes de enviar**: Haz una revision final de todos los montos
3. **Guarda respaldo**: Conserva copias de todas las declaraciones
4. **Mantente al dia**: Revisa periodicamente si hay cambios en las normas

## Conclusion

Evitar estos errores comunes te ahorrara tiempo, dinero y problemas con el SII. La clave esta en la organizacion, el uso de herramientas adecuadas y, cuando sea necesario, el asesoramiento profesional.`,
    category: 'guias',
    tags: ['IVA', 'SII', 'declaracion mensual', 'errores comunes'],
    author: 'contacto@impuestia.cl',
    authorRole: 'Asesor Tributario',
    date: '2026-04-01',
    readTime: 6,
    imageGradient: 'from-amber-900 to-yellow-900',
  },
  {
    id: '6',
    slug: 'caso-exito-defensa-sii-empresa-constructora',
    title: 'Caso de exito: Como defendimos una empresa constructora ante el SII',
    excerpt:
      'Te contamos el caso real de una empresa constructora mediana que recibio una fiscalizacion del SII y como logramos una resolucion favorable.',
    content: `## El cliente

Una empresa constructora con 15 anos de trayectoria, especializada en proyectos residenciales en la Region Metropolitana.

## La situacion

En octubre de 2025, la empresa recibio una **citacion del SII** para una fiscalizacion integral de los ejercicios 2023 y 2024.

### Puntos de fiscalizacion:

- Costos de construccion declarados
- Subcontratos pagados
- Remuneraciones y cotizaciones previsionales
- Utilidades presumtas vs. reales

## El problema principal

El SII cuestionaba que los costos de construccion estaban **sobrevalorados**, lo que habria resultado en:

- Un reajuste del impuesto de primera categoria
- Multas por infracciones tributarias
- Intereses moratorios
- **Monto estimado de la deuda: $280 millones de pesos**

## Nuestra estrategia

### Fase 1: Auditoria interna

Revisamos toda la documentacion contable y tributaria de los dos anos fiscalizados:

- Conciliamos los estados financieros con las declaraciones tributarias
- Verificamos la trazabilidad de cada costo de construccion
- Revisamos los contratos de subcontratacion

### Fase 2: Preparacion de la defensa

Documentamos cada uno de los costos cuestionados:

| Concepto | Documentacion respaldo |
|---|---|
| Materiales de construccion | Facturas de compra, guias de despacho, actas de recepcion |
| Mano de obra directa | Contratos, liquidaciones de sueldo, cotizaciones |
| Subcontratos | Contratos, informes de avance, certificados de trabajo |
| Gastos generales | Planillas, recibos, autorizaciones |

### Fase 3: Negociacion con el SII

Presentamos la defensa durante la audiencia:

1. **Demostramos la razonabilidad** de los costos con documentacion de terceros
2. **Aceptamos ajustes menores** por $12 millones en concepto de gastos no documentados
3. **Negociamos una condonacion parcial** de las multas

## El resultado

| Concepto | Monto original | Monto final |
|---|---|---|
| Reajuste de impuestos | $180 millones | $8 millones |
| Multas | $75 millones | $15 millones (condonado el resto) |
| Intereses | $25 millones | $3 millones |
| **Total** | **$280 millones** | **$26 millones** |

## Lecciones aprendidas

1. **La documentacion es todo**: Sin respaldo documental, la defensa es casi imposible
2. **La buena fe ayuda**: Reconocer errores menores facilita la negociacion
3. **El asesoramiento especializado marca la diferencia**: Un abogado tributario conoce los procedimientos y precedentes

## Conclusion

Este caso demuestra que una fiscalizacion del SII, por intimidante que parezca, puede manejarse exitosamente con preparacion, documentacion y estrategia profesional.`,
    category: 'casos',
    tags: ['caso de exito', 'SII', 'fiscalizacion', 'constructora', 'defensa'],
    author: 'contacto@impuestia.cl',
    authorRole: 'Asesor Tributario',
    date: '2026-04-10',
    readTime: 9,
    imageGradient: 'from-slate-800 to-slate-700',
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === 'all') return blogPosts
  return blogPosts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase(),
  )
}

export function getRelatedPosts(
  currentSlug: string,
  limit: number = 3,
): BlogPost[] {
  const current = getPostBySlug(currentSlug)
  if (!current) return blogPosts.slice(0, limit)

  return blogPosts
    .filter(
      (p) =>
        p.slug !== currentSlug &&
        (p.category === current.category ||
          p.tags.some((t) => current.tags.includes(t))),
    )
    .slice(0, limit)
}

export function getAllCategories(): string[] {
  const categories = new Set(blogPosts.map((p) => p.category))
  return ['all', ...Array.from(categories)]
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ]
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}
