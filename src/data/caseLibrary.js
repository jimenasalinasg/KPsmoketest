// Libreria de casos de uso de la KP. Copia anonimizada (ciudades -> pais, sin usuarios de FullStory) de la libreria viva
// https://claude.ai/artifact/S5fLcxQ53vwipqURY1svag, leida el 9-nov-2026 (documento library/state, version 9).
// Para actualizar: volver a leer esa libreria, anonimizar igual (repo PUBLICO: sin nombres, correos ni ciudades) y reemplazar CASES.
export const SNAPSHOT = { date: "2026-11-09", source: "https://claude.ai/artifact/S5fLcxQ53vwipqURY1svag" };
export const MODES = {
  consulta:    { label: "Consulta",    long: "Consulta — lookup y precisión" , icon: "🔍" },
  analisis:    { label: "Análisis",    long: "Análisis — comparar y entender por qué" , icon: "🔬" },
  integracion: { label: "Integración", long: "Integración — traen su contexto" , icon: "📎" },
  extraccion:  { label: "Extracción",  long: "Extracción — llevárselo a su flujo" , icon: "📤" },
  transversal: { label: "Transversal", long: "Transversal — aún sin encajar" , icon: "🔀" },
};
export const MODE_ORDER = ["consulta", "analisis", "integracion", "extraccion", "transversal"];
export const RECOS = [
 {
  "kind": "Big bet",
  "name": "Conexión MCP a sistemas del Banco, no solo documentos",
  "note": "6 casos confirmados donde el usuario espera que la KP llegue más allá del corpus documental: buscan personas por nombre (directorio implícito), piden archivos de repositorios internos como ezShare, piden cifras de sistemas de datos, quieren indicadores cross-portafolio, mapean stakeholders. Ya en roadmap.",
  "refs": [
   "s30",
   "s32",
   "s3",
   "s34",
   "s39",
   "s50"
  ]
 },
 {
  "kind": "Big bet",
  "name": "Recibir contexto largo (documentos, notas), no solo prompts cortos",
  "note": "10 casos en Integración: pegan bloques de TOR, copian fuentes encontradas, describen objetivos de negocio largos. El usuario trae su contexto: la KP debe recibirlo y trabajar sobre él.",
  "refs": [
   "s22",
   "s29",
   "s40",
   "s44"
  ]
 },
 {
  "kind": "Quick win",
  "name": "Asistente de reformulación cuando la respuesta no satisface",
  "note": "4 casos confirmados: copian parte del query, amplían o acotan, iteran 3+ veces. Oportunidad: sugerir «¿Quisiste decir…?» o variantes más amplias o más acotadas automáticas.",
  "refs": [
   "s47",
   "s19",
   "s35",
   "s46"
  ]
 },
 {
  "kind": "Quick win",
  "name": "Autocompletar códigos de operación (ESW, PN-L1153…)",
  "note": "Ancla de búsqueda más frecuente en Consulta. 3 casos confirmados. No exploran, recuperan directo.",
  "refs": [
   "s36",
   "s45"
  ]
 }
];
export const RECOS_FOOT = "Ya implementado: comparación estructurada (tablas), trazabilidad (enlace a fuente) y exportación como flujo de primera clase (.docx, Excel, listados). A vigilar: «revisor transversal» (2 confirmados) y preferencia por navegación estructurada sobre chat cuando el usuario ya sabe qué proyecto buscar (s48, 1 confirmado).";
export const CASES = [
 {
  "id": "s48",
  "tag": "transversal",
  "title": "Abre el Knowledge Assistant pero lo cierra de inmediato y navega manualmente (por país, división, tabs del proyecto). Prefiere la navegación estructurada cuando ya sabe qué proyecto explorar.",
  "evidence": "Sesión FullStory (oct 2026): abrió Knowledge Assistant → cerró inmediatamente (×) → navegó By Country → exploró AR-L1438 (Similar Projects → Data → Literature) → comparó con AR-L1439 → volvió a Home → navegó By Division. 30 interacciones manuales, 0 queries al asistente.",
  "status": "confirmado",
  "date": "2026-11-09"
 },
 {
  "id": "s47",
  "tag": "transversal",
  "title": "Reformula su pregunta cuando la primera respuesta no satisface: copia parte del query original y lo envuelve en un pedido más amplio o más acotado, iterando hasta encontrar lo que necesita.",
  "evidence": "Sesión FullStory (nov 2026): primera query muy específica → copió texto → nueva query \"Show me anything you have in your documents that [paste]\" → revisó fuentes → intentó \"narrow down what yo...\" → abrió New Chat. Patrón de reformulación copy-paste-broaden-narrow en 3 intentos.",
  "status": "confirmado",
  "date": "2026-11-09"
 },
 {
  "id": "s46",
  "tag": "analisis",
  "title": "Busca en los documentos del Banco evidencia que respalde un argumento o práctica institucional específica — espera que la KP encuentre publicaciones que confirmen o discutan ese punto, no solo información general.",
  "evidence": "Sesión FullStory (nov 2026): query \"I'm looking for a curated lesson learned that discusses the need for executing agencies to have a dedicated legal team to ensure project legal needs are met in an agile way without having to depend on external legal counsel\". Luego reformuló con \"Show me anything you have in your documents that...\" al no obtener coincidencia exacta. La KP respondió que el wording específico \"is not stated exactly in those terms\" pero citó publicaciones relacionadas.",
  "status": "confirmado",
  "date": "2026-11-09"
 },
 {
  "id": "s45",
  "tag": "consulta",
  "title": "Piden la última versión de una plantilla o formato institucional (ej. TOR en Word para consultores PEC) esperando que la KP la entregue directamente, no solo la encuentre.",
  "evidence": "Sesión real (nov 2026, screenshot): prompt \"TOR template in word format for PEC consultants\" — busca obtener el archivo listo para usar, no una explicación sobre dónde encontrarlo.",
  "status": "confirmado",
  "date": "2026-11-09"
 },
 {
  "id": "s44",
  "tag": "integracion",
  "title": "Copian una fuente que encontraron dentro de la KP y le piden explícitamente que responda basándose en esa fuente específica.",
  "evidence": "Sesión real (EE. UU.): busca \"knowledge graphs use in the [Bank]\", resalta y copia el resultado \"Estrategia Institucional de...\", y escribe la siguiente pregunta como \"reply using Estrategia Inst[itucional]...\" — dirige manualmente la fuente de la respuesta en vez de dejar que la KP elija.",
  "status": "confirmado",
  "date": "2026-09-16"
 },
 {
  "id": "s43",
  "tag": "extraccion",
  "title": "Descargan la respuesta generada por la KP directamente como archivo Word (.docx), no solo el documento fuente.",
  "evidence": "Sesión real (Argentina, 104 min): tras pegar contexto propio y preguntar por \"Cooperaciones\", hace clic en \"Descargar en .DOCX\" dos veces distintas sobre la respuesta generada — no descarga un documento existente, descarga la síntesis que armó la KP.",
  "status": "confirmado",
  "date": "2026-09-16"
 },
 {
  "id": "s42",
  "tag": "extraccion",
  "title": "Piden descargar el documento completo (PCR, propuesta de préstamo) directamente desde la respuesta, sin salir de la plataforma.",
  "evidence": "Deck: \"Algunos usuarios solicitan outputs de extracción, ej. descarga de documentos.\" Se menciona trazabilidad de prompts como mejora relacionada (el PCR aparecería al hacer clic en el corchete, sin salir de la plataforma).",
  "status": "confirmado",
  "date": "2026-09-15"
 },
 {
  "id": "s41",
  "tag": "extraccion",
  "title": "Resaltan (highlight) texto de la respuesta y van directo a la fuente original — señal de atención profunda, no de consumo pasivo.",
  "evidence": "Deck: +300 highlights por quincena. \"Cuando un usuario resalta una respuesta y va directo a la fuente, la IA no reemplazó al documento, actuó como mapa eficiente hacia él.\"",
  "status": "confirmado",
  "date": "2026-09-15"
 },
 {
  "id": "s40",
  "tag": "integracion",
  "title": "Pegan bloques largos de texto externo (contextos legales, descripciones institucionales) esperando que la KP los procese con criterio experto, no que los busque.",
  "evidence": "Deck: prompts largos con bloques de texto externo (contextos legales, descripciones institucionales). Reforzado con sesión real (Argentina, 104 min): pega contexto propio tres veces distintas a lo largo de la sesión, alternando con preguntas de seguimiento — no es un pegado puntual, es un patrón sostenido.",
  "status": "confirmado",
  "date": "2026-09-15"
 },
 {
  "id": "s39",
  "tag": "analisis",
  "title": "Buscan mapear el ecosistema de actores/stakeholders y posibles conexiones entre proyectos.",
  "evidence": "Deck, sección de oportunidades de Modo Análisis: mapeo de ecosistema/stakeholders y exploración de conexiones entre proyectos, listado junto a la comparación de matrices aprobación vs. cierre.",
  "status": "confirmado",
  "date": "2026-09-15"
 },
 {
  "id": "s38",
  "tag": "analisis",
  "title": "Buscan entender causalidad: cómo una variable impacta otra, qué cambió entre aprobación y cierre de un proyecto, por qué algo funcionó.",
  "evidence": "Deck: \"No buscan listas; buscan entender relaciones... no quieren datos aislados, sino el 'por qué' detrás.\"",
  "status": "confirmado",
  "date": "2026-09-15"
 },
 {
  "id": "s37",
  "tag": "consulta",
  "title": "Necesitan ver la lista completa de resultados para no perderse información relevante para su decisión, no una selección resumida.",
  "evidence": "Deck: 6% de prompts esperan exhaustividad explícitamente. Riesgo identificado en el mismo deck: \"listas infinitas\" generan parálisis de decisión.",
  "status": "confirmado",
  "date": "2026-09-15"
 },
 {
  "id": "s36",
  "tag": "consulta",
  "title": "Usan códigos y números específicos (ESW, RG, PN-L1153) como ancla de búsqueda — no exploran, recuperan directo.",
  "evidence": "Deck \"Activación, Valor y Adopción en la KP\" (2026): \"La KP como memoria institucional — usuarios buscan códigos y números específicos: no exploran, recuperan. El valor está en la precisión y velocidad, no en la navegación.\"",
  "status": "confirmado",
  "date": "2026-09-15"
 },
 {
  "id": "s34",
  "tag": "analisis",
  "title": "Comparan estrategias de país o indicadores cross-portafolio, alineando con matrices de resultados institucionales — uso de alto nivel, no operativo.",
  "evidence": "Informe mar-abr-may 2026, sección de tendencias: pedidos de comparación de estrategias de país e indicadores cross-portafolio — la plataforma usada para reflexión high-level del Banco.",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s32",
  "tag": "consulta",
  "title": "Necesitan una definición normativa o una fuente oficial para responder su pregunta, aunque el Banco no la tenga documentada internamente.",
  "evidence": "Informe mar-abr-may 2026: ej. \"¿qué fuentes oficiales y públicas hay sobre crimen, delitos, justicia y prisiones en Uruguay?\" — expectativa de cobertura normativa más amplia que el corpus interno.",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s31",
  "tag": "consulta",
  "title": "Preguntan en modo conversacional para aprender sobre un tema técnico (\"tell me more about…\"), no para resolver una tarea puntual.",
  "evidence": "Informe mar-abr-may 2026: ej. \"I'd like to learn about the use of guarantees for bonds and debt swaps\" — la plataforma se usa como herramienta de aprendizaje, no solo de búsqueda transaccional.",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s30",
  "tag": "consulta",
  "title": "Buscan personas por nombre (jefes de equipo, autores) para mapear quién trabajó en qué — un \"directorio implícito\" que no estaba pensado como caso de uso.",
  "evidence": "Informe mar-abr-may 2026, sección de tendencias: búsqueda por nombre propio para mapear redes y autoría — caso de uso no anticipado en el diseño original.",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s29",
  "tag": "integracion",
  "title": "Describen un objetivo de negocio largo y esperan que la KP genere recomendaciones o redacte secciones enteras a partir de ese contexto.",
  "evidence": "Informe mar-abr-may 2026: reformulaciones largas tipo \"identifica iniciativas y operaciones del Banco orientadas al fortalecimiento de la gestión urbana, fiscal y territorial…\" con expectativa de que la KP genere, no solo liste.",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s28",
  "tag": "integracion",
  "title": "Buscan evidencia primero y, sin salir de la conversación, piden que la KP redacte la lección aprendida directamente a partir de esa misma respuesta.",
  "evidence": "Informe mar-abr-may 2026, cita textual: \"can you make the lessons learned directly from your last response?\" — combina modo análisis + integración en una sola sesión.",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s27",
  "tag": "integracion",
  "title": "Piden generación acotada con instrucciones puntuales de formato: resumir en 5 oraciones, ordenar, redactar un statement corto citando operaciones específicas.",
  "evidence": "Informe mar-abr-may 2026, cita textual: \"write a 100 word statement citing specific operations with lessons learned\" — no es generación libre, es generación acotada al corpus con constraints claros.",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s35",
  "tag": "extraccion",
  "title": "Reformulan la búsqueda varias veces hasta lograr un listado puro y exhaustivo (sin narrativa) que puedan llevarse tal cual.",
  "evidence": "Informe mar-abr-may 2026, sección de fricciones: ej. pide \"todas las operaciones de TIN Cono Sur de Brasil…\", recibe una lista parcial, reformula con criterios más precisos o pide agregar proyectos manualmente (\"necesito que incluyas como mis proyectos la operación CO-L1269\").",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s26",
  "tag": "extraccion",
  "title": "Piden listados filtrados por foco temático específico (apoyo a startups, integridad, equidad de género, certificación laboral) para llevárselos, no para leer una síntesis.",
  "evidence": "Informe mar-abr-may 2026, sección de tendencias temáticas — sugiere necesidad de filtros temáticos más finos o categorización por outputs.",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s25",
  "tag": "extraccion",
  "title": "Piden armar una tabla a partir de un listado abierto y después exportarla a Word o Excel.",
  "evidence": "Informe mar-abr-may 2026, cita textual de una sesión de mayo: \"Could you please export this information in Word and Excel\", tras pedir que se organizara la información en tabla por país y tipo de operación.",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s24",
  "tag": "extraccion",
  "title": "Piden los documentos completos de una lista de códigos de operación, uno por uno, sin que la KP los resuma (ej. \"loan proposals de BL-L1038, BL-L1031, BL-L1039…\").",
  "evidence": "Informe mar-abr-may 2026 — es el movimiento más fuerte de los tres identificados ese trimestre: \"Exportación de corpus y listados sin inferencia\". La plataforma responde con síntesis y citación, pero el usuario necesita el listado crudo para su propio flujo (Word, Excel).",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s23",
  "tag": "transversal",
  "title": "Preguntan directamente algo como \"¿qué puedes hacer?\" para calibrar qué tan útil es la herramienta antes de usarla en serio.",
  "evidence": "Confirmado — sesión mobile real (iOS, EE. UU.): tras saltar el tour de bienvenida, la primera pregunta escrita fue literalmente \"what can you do?\", antes de cualquier pregunta de contenido.",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s22",
  "tag": "integracion",
  "title": "Pegan texto de un documento propio (ej. Términos de Referencia) para que la KP lo compare o trabaje sobre ese contenido, en vez de solo buscar algo nuevo.",
  "evidence": "Confirmado — sesión real (~2h con pausas largas): pega dos bloques de texto tipo TOR (\"Design stage – Organizational...\", \"Design stage – Technical-...\") y la respuesta cita \"One TOR calls for the design...\" — usa KP como herramienta de comparación sobre su propio borrador, no de búsqueda desde cero.",
  "status": "confirmado",
  "date": "2026-09-14"
 },
 {
  "id": "s21",
  "tag": "analisis",
  "title": "Recorren, en orden, todas las categorías de una misma operación (documentos, datos, proyectos similares, literatura, lecciones) antes de hacer una búsqueda puntual sobre ella.",
  "evidence": "Confirmado — sesión real de 166s (9 sept, Uruguay, operación PN-L1195): Documentos Institucionales → Data → Proyectos Similares → Literatura → Lecciones Aprendidas, y termina abriendo la búsqueda lateral con \"PN-L1195 documentos aprobados\". Parece un barrido de debida diligencia sobre una operación específica, no exploración libre sin rumbo.",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s1",
  "tag": "analisis",
  "title": "Buscan evidencia académica para sustentar una propuesta de operación.",
  "evidence": "Conecta con el uso de Literature dentro de búsqueda contextual — hipótesis, falta sesión puntual.",
  "status": "hipotesis",
  "date": "2026-09-12"
 },
 {
  "id": "s2",
  "tag": "analisis",
  "title": "Buscan proyectos similares ya ejecutados para justificar el diseño de una operación nueva.",
  "evidence": "Confirmado con sesión real (9 sept, Uruguay, 14 min): tras cerrar el tour de bienvenida, el usuario fue directo desde su reciente \"OA Preparación UR-L1225\" a Proyectos Similares — sin pasar por ninguna otra colección antes.",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s3",
  "tag": "consulta",
  "title": "Buscan cifras o datos oficiales para incluir como sustento en una nota conceptual.",
  "evidence": "Confirmado por el informe cualitativo mar-abr-may 2026: pedidos de evidencia cuantitativa concreta, ej. \"¿qué evidencia hay sobre el crecimiento económico o impacto del turismo por inversión en museos y arte?\".",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s4",
  "tag": "analisis",
  "title": "Buscan lecciones aprendidas de proyectos parecidos para anticipar riesgos en una operación nueva.",
  "evidence": "Confirmado por el informe mar-abr-may 2026: búsquedas explícitas de lecciones aprendidas filtradas por país/sector/instrumento son, según el informe, las que generan las sesiones más extensas y de mayor profundidad.",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s5",
  "tag": "integracion",
  "title": "Quieren redactar la sección de lecciones aprendidas de un informe de cierre de proyecto.",
  "evidence": "Confirmado — es el corazón del LWA, y el informe mar-abr-may 2026 lo documenta con un caso textual: \"necesito redactar una lección aprendida a partir de la siguiente reflexión que surgió en el desarrollo del programa de biodiversidad y equidad urbana en Barranquilla\".",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s6",
  "tag": "integracion",
  "title": "Quieren un primer borrador o estructura para una nota conceptual nueva.",
  "evidence": "Hipótesis, no confirmada con sesión puntual todavía.",
  "status": "hipotesis",
  "date": "2026-09-12"
 },
 {
  "id": "s7",
  "tag": "integracion",
  "title": "Quieren redactar términos de referencia (TDR) basándose en TDRs anteriores similares.",
  "evidence": "Hipótesis — variante de \"buscar precedente\" pero con fin de producir un documento, no solo consultar.",
  "status": "hipotesis",
  "date": "2026-09-12"
 },
 {
  "id": "s9",
  "tag": "consulta",
  "title": "Necesitan profundizar en un tema nuevo para ellos antes de una misión o reunión.",
  "evidence": "Documentado en el roadshow de 4 países — fricción y uso de \"puesta al día\" rápida antes de viajar.",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s10",
  "tag": "consulta",
  "title": "Necesitan entender el contexto sectorial o país antes de asumir un proyecto nuevo.",
  "evidence": "Cercano al patrón de onboarding de campo documentado en el roadshow.",
  "status": "hipotesis",
  "date": "2026-09-12"
 },
 {
  "id": "s11",
  "tag": "consulta",
  "title": "Necesitan ponerse al día rápido sobre un tema técnico fuera de su especialidad.",
  "evidence": "Confirmado — sesión mobile (iOS, EE. UU.) tras saltar el tour: pasa de \"what do you know about poverty...\" a \"give me poverty statistics...\" — de lo general a lo específico, en un tema fuera de su tarea puntual.",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s12",
  "tag": "extraccion",
  "title": "Necesitan verificar de dónde sale un dato antes de citarlo en un documento oficial.",
  "evidence": "Documentado en la exploración de patrones de citación UI para casos fiduciarios.",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s13",
  "tag": "transversal",
  "title": "Necesitan contrastar información de otra división antes de aprobar algo que no armaron ellos.",
  "evidence": "Documentado en la investigación de \"reviewer transversal\".",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s14",
  "tag": "consulta",
  "title": "Necesitan confirmar si una política o lineamiento sigue vigente antes de aplicarlo.",
  "evidence": "Hipótesis.",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s15",
  "tag": "consulta",
  "title": "Necesitan ubicar una plantilla o formato institucional específico sin recordar dónde vive.",
  "evidence": "Confirmado con sesión real (9 sept, Uruguay, operación PN-L1195): el primer clic de toda la sesión fue directo a Documentos Institucionales de esa operación.",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s16",
  "tag": "consulta",
  "title": "Necesitan encontrar un documento mencionado por un colega sin saber el nombre exacto.",
  "evidence": "Hipótesis.",
  "status": "hipotesis",
  "date": "2026-09-12"
 },
 {
  "id": "s17",
  "tag": "analisis",
  "title": "Recorren varias colecciones seguidas sin una tarea puntual, para \"ver qué hay\" sobre un tema.",
  "evidence": "Confirmado — coincide con el patrón \"heavy users\" del deck de research (sesiones +40 min, reformulan prompts, exploran filtros y categorías), frente a \"light users\" con búsquedas puntuales por código.",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s18",
  "tag": "analisis",
  "title": "Cruzan literatura académica y proyectos similares sobre el mismo tema para armar su propio argumento.",
  "evidence": "Confirmado en sesión real, aunque en la práctica el patrón es más amplio de lo pensado: no es solo Literature + Similar Projects — es las 5 colecciones para una misma operación (ver \"Recorren, en orden...\" más abajo).",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s19",
  "tag": "analisis",
  "title": "Encadenan búsquedas siguiendo un hilo de curiosidad, profundizando capa por capa.",
  "evidence": "Confirmado con dos sesiones reales: (1) EE. UU., 19 min, 146 eventos: una sola pregunta sobre \"líneas de apoyo del Banco\" y ~13 min revisando citas/ejemplos de Paraguay, Costa Rica, República Dominicana y BANDESAL dentro de la misma respuesta — profundiza sin volver a escribir. (2) Mobile/iOS: de una pregunta amplia sobre pobreza pasa a pedir estadísticas puntuales.",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s20",
  "tag": "analisis",
  "title": "Vuelven a la misma colección en sesiones distintas, construyendo un caso a lo largo de varios días.",
  "evidence": "Confirmado — mismo patrón de \"heavy users\" del deck: sesiones largas que reformulan y profundizan en vez de resolver con una sola búsqueda.",
  "status": "confirmado",
  "date": "2026-09-12"
 },
 {
  "id": "s49",
  "tag": "consulta",
  "title": "Quieren saber qué evaluaciones independientes de OVE existen sobre un país antes de usarlas como insumo.",
  "evidence": "Confirmado — sesión en Chrome/Windows (EE. UU.): termina el tour, cambia la interfaz a español, prueba el chip \"Por país\" y pasa al Asistente de Conocimiento. Primero pregunta \"¿Tienes acceso a evaluaciones de OVE?\" y después pide \"lista las evaluaciones del programa de país…\". Abre las referencias de cada respuesta y hace clics sin efecto (dead clicks) sobre ellas. La KP sirve para confirmar si hay una evaluación, pero la lista de evaluaciones por país todavía no sale directa.",
  "status": "confirmado",
  "date": "2026-11-11"
 },
 {
  "id": "s50",
  "tag": "consulta",
  "title": "Piden a la KP que busque archivos concretos en las carpetas de proyecto de ezShare, como las versiones firmadas en PDF de un acuerdo de confidencialidad (NDA).",
  "evidence": "Confirmado — sesión en Chrome/Windows (EE. UU.): abre una referencia [1] de la respuesta anterior, escribe \"Please search in the project folders in ezShare\", copia de la referencia el texto \"the signature versions (PDF files) of NDA…\" y lo pega en el prompt para buscarlo. Espera que la KP navegue un repositorio documental del Banco, que hoy no está en su corpus.",
  "status": "confirmado",
  "date": "2026-11-11"
 }
];
