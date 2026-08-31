# KP Dashboard — FullStory MCP metrics checklist

> Este documento es el **cómo**: qué metric_id usar para cada campo y de dónde sale.
> Para el **por qué** — qué preguntas queremos responder, north star, embudos y qué
> falta construir — ver [`analytics-measurement-plan.md`](analytics-measurement-plan.md).

Referencia de metric IDs para el cierre mensual del dashboard
"IDB Knowledge Platform — Post Go-live Key Metrics" (`src/App.jsx`).

Todos los métricos están definidos sobre el segmento **"Sin DEV"** en FullStory.
Se computan con `mcp__Fullstory__compute_metric` pasando `start_date` / `end_date`.

---

## 1. Métricos automáticos (vía MCP)

Devuelven `{single:{value}}`. Se computan con el rango del mes cerrado
(1º al último día real del mes).

| Campo en App.jsx        | metric_id      | Nota |
|-------------------------|----------------|------|
| `users`                 | `a30wnMzqgtJk` | MAU total del período, **no** usuarios nuevos |
| `sessions`              | `BhsN9vxRPN7V` | |
| `prompters`             | `3GVbGeJsPBCb` | usuarios con ≥1 prompt |
| `tourCompletion`        | `iN3brKBr4rlY` | viene con decimales → `Math.round()` |
| `pillPageviews`         | `2EYT9yOW6odB` | total de las pills (pageviews) |
| `sourceClicks`          | `Ge6P9qbIeu3b` | clicks en source panel (Open Search) |
| `sourceClicksBC`        | `LD4uHOPIDS8l` | clicks en source panel (contextual). **Unique users**, no eventos — no comparar 1:1 con `sourceClicks` |
| `avgTime`               | `vpWvDQswlPB4` | tiempo activo promedio por sesión. Devuelve **milisegundos** → dividir por 1000. **No es latencia** — ver §4 |
| `thumbsUp`              | `AtpRWyuThJUq` | |
| `thumbsDown`            | `x6Z3q26RMOra` | |
| `promptGalleryClicks`   | `lkwqkKIJQ25E` | |
| `recentSearchClicks`    | `nfcBnYjQSAfT` | |
| `newSearchClicks`       | `tU5aopeDHc1k` | |
| `highlighted`           | `cMgaz9YMCSJh` | highlights totales |
| `highlightedOpenSearch` | `RQ6IjtoMbeD5` | |
| `copied`                | `yowGb1tOMe3X` | copias totales |
| `copiedOpenSearch`      | `JOTETVLPeJKh` | |
| `wordDownloads`         | `3EkjBy6jYByB` | |
| `excelDownloads`        | `FIw2VjBWkJ6J` | |

### Pills (cuentan sesiones, no pageviews)

`pillTop` = la de mayor valor, formato `"Nombre (valor)"`.

| Pill              | metric_id      | Estado |
|-------------------|----------------|--------|
| Similar Projects  | `rhTcgj1srgne` | confirmado |
| Lessons Learned   | `PJyiZSAt3EXH` | confirmado |
| Data              | `eCemfOCLh5qU` | confirmado |
| Literature        | `w0ktk3sF3v3I` | confirmado |
| (¿Institutional Documents?) | `RdCIdS4OrJhB` | **SIN CONFIRMAR — ver §4** |

### LWA (Lessons Writing Assistant)

Fuente: dashboard **"NEW - Lessons Writing Assistant"**, armado por
`gabrielare@iadb.org` el 12-ago-2026. IDs **confirmados**.

| Campo                     | metric_id      | Nota |
|---------------------------|----------------|------|
| `lwa.share`               | `IHPlQ1WT1zEz` | feature nueva — baseline |
| `lwa.copyLesson`          | `b46xecCQyFod` | preexistente — ver abajo |
| `lwa.highlightAndCopy`    | `azWUDLxYgaWY` | feature nueva — baseline |
| `lwa.viewLesson`          | `o7uGz8LnXgZY` | feature nueva — baseline |
| `lwa.sharedCatalogueView` | `gEJ1qqiZ2Df9` | feature nueva — baseline |

> **`lwa.lessonsGenerated` NO va acá — es manual.** Ver §2.

**Los ceros NO son baseline de features nuevas, y tampoco son desuso.** El
checklist decía lo primero y una versión anterior de esta sección dijo lo
segundo. Las dos estaban mal. Verificado el 31-ago-2026:

- `share` (`IHPlQ1WT1zEz`) y `viewLesson` (`o7uGz8LnXgZY`) se crearon el
  **27-jul**, no el 12-ago, y dan **0 en los doce meses completos**.
- **El catálogo de lecciones sí se usa, y bastante:** abrir el diálogo de
  compartir 148 eventos, editar 37, borrar 35, sobre sep-2025 → ago-2026.

### El catálogo y el compartir, con y sin segmento

| Paso | Elemento | Toda la org | **Sin DEV** |
|---|---|---:|---:|
| Abre el diálogo | `Lessons-Catalogue-Button-Share` (`Bz85xmDxjQg3`) | 148 | **0** |
| Editar | `Lessons-Catalogue-Button-Edit` (`ucHG1MVge21G`) | 37 | **0** |
| Borrar | `Lessons-Catalogue-Button-Delete` (`yFDFrciS4gWp`) | 35 | **0** |
| Busca destinatario | `Share-Dialog-Input-Search-Users` (`LGq1WidWKtc1`) | 61 | **0** |
| Elige destinatario | `Share-Dialog-Option-User` (`rXQu465rWEnH`) | 28 | **0** |
| Cancela | `Share-Dialog-Button-Cancel` (`OmevdrJx0Vwh`) | 8 | — |
| **Confirma** | `Share-Dialog-Button-Share` (`XOTexx0kvoot`) | **0** | **0** |

**Bajo Sin DEV el catálogo entero está en cero absoluto.** Los 148, 61 y 28
vienen íntegramente de cuentas que el segmento excluye. Para la población que
mide el dashboard, `share`, `viewLesson` y `sharedCatalogueView` están en cero
por **alcance**: nadie abre el catálogo, así que la feature ni se intenta. Es un
problema de distribución, no un bug.

Dentro del tráfico excluido igual hay algo raro: **ni un compartir completado en
doce meses**, con 28 selecciones de destinatario y apenas 8 cancelaciones, y con
todos los demás controles del diálogo disparando. Vale descartar a mano un botón
de confirmar roto o inalcanzable — pero **eso no es evidencia sobre usuarios**.

`viewLesson` queda **sin explicación**: sus dos elementos
(`Lessons-Catalogue-Button-View`, `Lesson-Title-Catalog-Clicked`) están en 0
mientras sus hermanos del mismo catálogo disparan. Pendiente de mirar en sesión.

### Regla: `compute_metric` NO acepta segmento

`compute_metric` no tiene parámetro de segmento. El segmento tiene que estar
**dentro de la definición guardada** del métrico.

- Los métricos preexistentes del §1 **sí lo llevan**. Verificado:
  `Open-Search-Button-Response-SourcesOverview` en agosto da **25 en toda la org
  y 21 en Sin DEV**, y `Ge6P9qbIeu3b` devuelve 21. Los números del dashboard
  están bien.
- Un métrico creado al vuelo con `build_metric` **sin** `segment_id` devuelve
  datos de **toda la org**, incluido el equipo de producto y los entornos de
  desarrollo. En el `funnel_definition` se ve la diferencia: con segmento
  aparece `segment: {segmentId: "sjHJR3590z6j", ...}` dentro de `singleNumber`;
  sin él, esa clave no está.

**Siempre pasar `segment_id: "sjHJR3590z6j"` a `build_metric`**, y confirmar en
la definición devuelta que la clave `segment` esté. Una investigación entera de
LWA se hizo sin segmento y dio conclusiones que se cayeron al aplicarlo.

### Regla: un cero no prueba desuso hasta que un hermano dispare

Una versión previa de esta sección concluyó «nadie entró nunca al catálogo»
porque `Global-Sidebar-Button-Lessons` daba 0. Era una inferencia inválida: **los
cuatro** elementos `Global-Sidebar-*` (Home, Assistant, Recent-Searches, Lessons)
dan 0 en doce meses. Esa familia entera es instrumentación muerta — de un layout
viejo o nunca liberado. La navegación real usa `Layout-*`, que sí dispara:
`Layout-Button-Transversal-Lesson` 124, `Layout-Button-Contract-Sidebar` 92,
`Layout-Link-Home` 14.

**Antes de reportar un cero como falta de uso, computar un elemento hermano de la
misma familia.** Si el hermano también da 0, es instrumentación muerta y no dice
nada sobre comportamiento. Si dispara, recién ahí el cero significa algo.

### El embudo de LWA no filtra por host

`104484265` y sus clones no ponen restricción de entorno en los pasos de click.
De las 24 sesiones que registran el click de completar, **9 (37,5%) ocurren en
`localhost:4200` o en `polite-dune-05d66c70f.6.azurestaticapps.net`** (staging),
no en producción. El segmento Sin DEV **no** las excluye.

Agregar un primer paso de `visitedUrl` host = `knowledgeplatform.iadb.org` **no
lo arregla**: el embudo es cross-session, así que quien alguna vez entró a
producción sigue calificando aunque después haya trabajado en local. El
resultado con ese paso agregado es idéntico, 102 → 15.

Conclusión: **102 y 15 son cotas superiores, no uso de producción.**

`copyLesson` registró 9 eventos entre sep-2025 y jun-2026 y **ninguno desde
julio**. Esa caída sí es real y vale seguirla.

### Países

`metric_id` **`417063426`** → devuelve `{table:{rows:[{group,value}], total}}`.

Conversión a `{ name, code, users, pct }`:
- `code` = ISO-2.
- `pct` = `Math.round(users / total * 100)`.
- "United States" → `name: "United States (HQ)"`.
- `totalCountries` = filas con país nombrado, **excluyendo la fila `Unknown`**.
- Nombres que difieren de FullStory: `Trinidad and Tobago` → `Trinidad & Tobago`.
- Si aparece un país europeo/asiático alto que **no** sea España (ej. Netherlands),
  incluir el dato pero agregar `// REVISAR` en esa línea y mencionarlo en el PR.

### Acumulados (desde go-live)

Query **única** con `start_date = 2025-09-01`, `end_date` = último día del mes cerrado.
Usa los mismos IDs: `a30wnMzqgtJk` (users), `3GVbGeJsPBCb` (prompters), `BhsN9vxRPN7V` (sessions).

> **NUNCA** sumar los valores mensuales: duplica usuarios recurrentes.

---

## 2. Campos manuales (NO hay métrico FullStory)

Nunca inventar. Si no hay valor, dejar `null` y listarlo como pendiente en el PR.

- `prompts` — prompts enviados
- `first_time` — usuarios nuevos
- `returningUsers` — usuarios recurrentes
- `latency` — latencia de respuesta. No existe métrico. **Ojo:** `avgTime` sí tiene métrico
  (`vpWvDQswlPB4`) pero mide otra cosa — tiempo activo por sesión, no velocidad de respuesta.
  Estaban agrupados en una sola línea de este checklist y era un error
- `csat` — % y promedio de estrellas, con n de respuestas
- `dropoff`, `openSearchVisits` — meses con schema viejo
- `pillBot` — pill menos usada (ver §4)
- `lwa.lessonsGenerated` — **se saca a mano de la consola**, no de FullStory.
  El métrico `ffbLsADU0Swu` NO sirve para este campo: se llama "Lessons Generated
  - Clicks" y cuenta clicks en `Question-Set-Create-Draft-Button`, no lecciones
  producidas. Si se computa ese ID, se pisa el dato bueno con un conteo de clicks.

---

## 2bis. Embudos guardados (FullStory)

Todos con segmento **Sin DEV (copy)** `sjHJR3590z6j`, agregación *unique users*,
pasos en orden y en la misma sesión (salvo LWA, que es cross-session).
Los datos que consume el dashboard viven en el objeto `FUNNELS` de `src/App.jsx`,
no en el JSX. Se recomputan con `compute_funnel(funnel_id, segment_id)`. El rango está guardado
en la definición: para cerrar un mes nuevo hay que **reconstruir** el embudo con
`build_funnel` y fechas nuevas, no basta con recomputar.

| Embudo | ID | Rango guardado |
|---|---|---|
| Open Search · ago 2026 | `380466231` | 2026-08-01 → 2026-08-31 |
| Open Search · jul 2026 | `813457909` | 2026-07-01 → 2026-07-31 |
| Contextual (pills) · ago 2026 | `1692594896` | 2026-08-01 → 2026-08-31 |
| Contextual (pills) · jul 2026 | `1476024114` | 2026-07-01 → 2026-07-31 |
| LWA inicio → completado | `2037187131` | 2025-09-01 → 2026-08-31 |
| Contextual (pills) · abr 2026 | `1661380124` | 2026-04-01 → 2026-04-30 |
| Contextual (pills) · may 2026 | `362258649` | 2026-05-01 → 2026-05-31 |
| Contextual (pills) · jun 2026 | `989040134` | 2026-06-01 → 2026-06-30 |
| Open Search · abr 2026 | `1046945776` | 2026-04-01 → 2026-04-30 |
| Open Search · may 2026 | `1679441265` | 2026-05-01 → 2026-05-31 |
| Open Search · jun 2026 | `1912929132` | 2026-06-01 → 2026-06-30 |
| OS → panel de fuentes · abr 2026 | `1884525824` | 2026-04-01 → 2026-04-30 |
| OS → panel de fuentes · may 2026 | `820021151` | 2026-05-01 → 2026-05-31 |
| OS → panel de fuentes · jun 2026 | `1188737148` | 2026-06-01 → 2026-06-30 |
| OS → panel de fuentes · jul 2026 | `124232475` | 2026-07-01 → 2026-07-31 |
| OS → panel de fuentes · ago 2026 | `1923821785` | 2026-08-01 → 2026-08-31 |
| Contextual → panel de fuentes · abr 2026 | `680145669` | 2026-04-01 → 2026-04-30 |
| Contextual → panel de fuentes · may 2026 | `588957978` | 2026-05-01 → 2026-05-31 |
| Contextual → panel de fuentes · jun 2026 | `118780297` | 2026-06-01 → 2026-06-30 |
| Contextual → panel de fuentes · jul 2026 | `1150323350` | 2026-07-01 → 2026-07-31 |
| Contextual → panel de fuentes · ago 2026 | `716477612` | 2026-08-01 → 2026-08-31 |

Los tres de Open Search se clonaron del de agosto con
`update_funnel(2112175315, start_date, end_date)`: copia los pasos exactos
—incluido `withElementId: ["A3vpsKJZw0X8"]`— y solo cambia el rango. **Es la
forma segura de reconstruir**, porque no vuelve a pasar por el intérprete de
lenguaje natural. `update_funnel` no arrastra el segmento a `funnelSettings`;
no importa, el segmento va siempre en `compute_funnel`.

Embudo contextual mes a mes (Sin DEV), para saber si un corte aguanta:

| Mes | Entra KP | Abre pill | Highlight | Copia |
|---|---:|---:|---:|---:|
| abr | 588 | 62 | 7 | 4 |
| may | 360 | 28 | 11 | 6 |
| jun | 378 | 69 | 18 | 10 |
| jul | 248 | 37 | 5 | 2 |
| ago | 275 | 37 | 9 | 3 |

### Desglose por pill (abr–ago 2026)

Un embudo por pill, mismo primer paso (`visitedUrl` host `knowledgeplatform.iadb.org`),
luego `visitedPage` con **un solo** id de página, luego `highlight any` → `copy any`.

| Pill | id de página | funnel_id |
|---|---|---|
| Similar Projects | 67 | `1062050449` |
| Lessons Learned | 68 | `819699251` |
| Literature | 69 | `575216123` |
| Institutional Documents | 70 | `643955550` |
| Data | 257 | `1243443095` |

**Por qué cinco embudos y no un `dimension`:** las pills son *page definitions*
de FullStory, no rutas. `compute_funnel` con `dimension: {property: "url_path"}`
agrupa por proyecto individual (`/knowledge/UR-L1225`, `/knowledge/BO-L1250`…),
no por pill, y además infla el paso 1 multiplicándolo por el número de grupos.
No sirve para este corte.

**Por qué el rango es abr–ago y no un mes:** en agosto hay 37 aperturas de pill
en total; partidas en cinco no dan nada legible. El primer paso (1.283 usuarios)
es común a los cinco, así que las filas sí son comparables entre sí.

### Aperturas por pill y por mes

Métricos `single_number`, usuarios únicos, segmento `sjHJR3590z6j`. Se recomputan
con `compute_metric(metric_id, start_date, end_date)` — **no hace falta
reconstruirlos** para un mes nuevo, a diferencia de los embudos.

| Pill | id de página | metric_id |
|---|---|---|
| Similar Projects | 67 | `1945200689` |
| Lessons Learned | 68 | `751235530` |
| Literature | 69 | `2120083561` |
| Institutional Documents | 70 | `1828644569` |
| Data | 257 | `1294509165` |

**Solo el primer paso se desagrega por mes.** El mejor mes de toda la superficie
contextual (junio) tiene 10 copias en total; partidas en cinco pills darían 2 por
celda. La tasa de conversión por pill se queda agrupada abr–ago.

**Chequeo de consistencia:** la suma de los cinco meses de cada pill tiene que
quedar por encima del total agrupado del embudo y cerca de él — quien abre una
pill en dos meses cuenta una vez agrupado y dos veces en la suma mensual.
Al cierre de agosto: SP 123 vs 110, LL 121 vs 112, Lit 80 vs 77, ID 63 vs 59,
Data 48 vs 48. Si alguna suma mensual diera *menos* que el agrupado, hay un
error de rango.

**Ojo con Data (257):** cero usuarios en abril, 3 en mayo, 19 en junio, 14 en
agosto. Es la pill más nueva, no la más floja. Cualquier comparación agrupada que arranque en
abril la castiga por un mes en el que no existía.

**Limitación conocida:** `highlight` y `copy` son *any*, no están acotados a la
pill. El orden garantiza que ocurren después de abrirla en la misma sesión, pero
la atribución es por secuencia, no por ubicación en la página. Direccional.

## 3. Reglas de cálculo

- **Content engagement total** = highlights + copies + source clicks + downloads.
- **Penetración** = `users / 3600 * 100`, 1 decimal. Denominador: 3.600 staff+consultores del BID.
- Validar cualquier metric_id nuevo contra un mes conocido antes de confiar en él (§4).

---

## 4. Pendientes de confirmación

### `RdCIdS4OrJhB` — quinta pill, sin confirmar
Computado contra julio 2026 → **40**. Pero `pillBot` en `App.jsx` dice
"Institutional Documents (10)". No coinciden, así que **no** se puede asumir que
ese ID sea la pill de Institutional Documents.

Dato que refuerza la duda: **no existe métrico de pageviews para la pill
Institutional Documents** — solo uno de usuarios (`vsM08vl8PUdv`). Así que
`RdCIdS4OrJhB` casi seguro NO es esa pill.

Hasta confirmarlo: no usar para `pillTop` ni `pillBot`; `pillBot` sigue manual.

### Candidatos evaluados y **rechazados** (auditoría del 31-ago-2026)

Barrido completo de los métricos existentes buscando fuente para los campos que
estaban en `null`. Tres de cuatro no sirven. **No volver a intentarlos.**

| Campo | Candidato | Por qué se rechazó |
|---|---|---|
| `prompts` | `1fbmp2OI4wee` "Prompts por usuario" | Devuelve **108** para julio contra los **415** cargados. Cuenta clicks en `Open-Search-Button-textarea-Search`, un solo botón de envío — la app tiene otras vías (Enter, prompt items). Además devuelve una **tabla agrupada por email**, no un escalar. Sigue manual |
| `first_time` | `S1jFS95lirbO` "Usuarios nuevos" | Su definición es `count of unique users / any activity`. Computado contra julio devuelve **250**, exactamente igual a `users`. Es MAU con otro nombre — la misma trampa que `a30wnMzqgtJk`. Sigue manual |
| `dropoff` | `AtJncWUJj6rl` y `Olm71xPRX3cU` | Ninguno reconcilia: para julio dan **87.3%** y **48.7%** contra el **85** cargado. Dos definiciones distintas y ninguna es la buena |
| `returningUsers`, `latency`, `csat` | — | No existe ningún métrico en la org. Siguen manuales |

**El único que sí sirvió:** `vpWvDQswlPB4` para `avgTime`. Reproduce julio
**exacto** (20425.6 ms = 20.43s contra el `"20.43s"` cargado). Mayo queda cerca
(20.05 vs 20.2) pero **junio no coincide** (18.93 vs el 20.37 cargado). Como el
mes de baseline da exacto se adopta el métrico, pero la diferencia de junio queda
abierta: puede ser que el valor guardado de junio esté mal. Revisar si aparece
una tercera discrepancia.

### Baseline de validación — julio 2026 (rango 2026-07-01 → 2026-07-31)

Recomputar estos valores debe devolver exactamente:

| Campo | Valor | | Campo | Valor |
|---|---|---|---|---|
| users | 250 | | highlighted | 489 |
| sessions | 1226 | | highlightedOpenSearch | 411 |
| prompters | 109 | | copied | 183 |
| tourCompletion | 44.44 → 44 | | copiedOpenSearch | 135 |
| pillPageviews | 134 | | wordDownloads | 6 |
| sourceClicks | 30 | | excelDownloads | 3 |
| thumbsUp / thumbsDown | 3 / 1 | | totalCountries | 31 |
| promptGalleryClicks | 11 | | pillTop | Lessons Learned (46) |
| recentSearchClicks | 26 | | Similar Projects | 23 |
| newSearchClicks | 0 | | Data / Literature | 12 / 11 |

Si algún valor no coincide, la definición del métrico cambió en FullStory:
**parar y avisar**, no escribir el dato.

### Gotchas de definición (confirmados)

- **`a30wnMzqgtJk` se llama "First time visitors" en la UI de FullStory pero NO
  son usuarios nuevos.** Su definición real es "count of unique users / any
  activity" = MAU total. Usarlo para `users`, **nunca** para `first_time`.
- **Las pills individuales cuentan SESIONES; `pillPageviews` cuenta EVENTOS.**
  No suman entre sí — no intentar reconciliarlos.
- **`BhsN9vxRPN7V` (sessions) no filtra tráfico interno ni bots.** Criterio a
  confirmar; puede inflar el número.

### Panel de fuentes en los embudos — hecho (ago 2026)

Dos embudos de **tres** pasos por mes, renderizados como una **línea de derivación**
debajo de cada embudo existente, sin tocar los pasos actuales. Los datos viven en
`FUNNELS.<mes>.<openSearch|contextual>.derived`, con la forma
`{ label, n, from, time, note }`; `from` es el índice del paso del que deriva.

Va como derivación y no como paso intermedio porque el click a fuente **no está en
el camino a copiar**: es un destino alternativo. Quien abre la fuente se va del KP al
documento. Forzarlo como paso repetiría el error del embudo de LWA, donde un paso que
solo atraviesan 2 usuarios reportó cero lecciones completadas habiendo 15.

| Mes | OS: busca → fuente | Contextual: pill → fuente |
|---|---:|---:|
| abr | 21 / 226 (9%) | 0 / 62 |
| may | 13 / 132 (10%) | 1 / 28 |
| jun | 12 / 160 (8%) | 1 / 69 |
| jul | 11 / 109 (10%) | 0 / 37 |
| ago | 11 / 112 (10%) | 1 / 37 |

Los pasos 1 y 2 de los diez embudos coinciden **exacto** con los embudos ya validados
del dashboard (588/226, 360/132, 378/160, 248/109, 224/86 y 588/62, 360/28, 378/69,
248/37, 224/32). Es la verificación de que el clonado no corrompió nada.

#### Limitación dura del MCP: un paso de click = un solo elemento

`compute_funnel` **falla** (`failed to compute funnel`) si un paso de click referencia
más de un elemento. El intérprete de lenguaje natural escribe esos pasos de dos formas
y las dos son inservibles:

- `click.css.value: ["[data-fs-element=\"A\"], [data-fs-element=\"B\"]"]`
- `click.withElementId.value: ["idA,idB,idC"]` — los tres ids unidos en **un** string

Solo computa `click.withElementId.value: ["<un id>"]`. No hay forma de expresar la
unión de varios elementos en un embudo por este MCP.

Consecuencias, y cómo se resolvió cada una:

- **Open Search**: el paso usa `Open-Search-Button-Response-SourcesOverview`
  (`g1977jmWRJk0`), que es literalmente el click que **abre** el panel. Los otros dos
  elementos de `Ge6P9qbIeu3b` (`Open-Search-Fonts-Item-Source`, `...-Item-Document`)
  son clicks *dentro* del panel, o sea una acción posterior. El embudo mide apertura
  del panel, y por eso su número **no** tiene que coincidir con `sourceClicks`, que
  además cuenta eventos y no usuarios.
- **Contextual**: se computaron los tres elementos de `LD4uHOPIDS8l` por separado
  sobre abr–ago. `POD-Card-Literature-Button-SourceLink` (`hUhFMRkuJ9Ov`) → **0**
  usuarios; `POD-Card-InstitutionalDocuments-Button-SourceLink` (`SZtrmukH8HV9`) →
  **0**. Solo `POD-Card-LessonsLearned-Button-SourceLink` (`Xd0D5Mqm3TU8`) registra
  usuarios (3 en cinco meses). Por lo tanto el embudo de un solo elemento **es** la
  unión exacta en este período, y el número es correcto, no una aproximación.

  > **Revalidar esto antes de reusarlo.** En cuanto Literature o Institutional
  > Documents registren un click, el embudo de un elemento deja de ser la unión y
  > empieza a subestimar. Recomputar los tres por separado en cada cierre.
  > Revalidado el 28-ago-2026 sobre abr 1 – ago 28: Literature y Institutional
  > Documents siguen en **0**, así que la unión sigue siendo exacta.

#### El intérprete de lenguaje natural corrompe pasos — verificar siempre

Refinando por lenguaje natural, en la misma sesión, pidiendo cambiar **solo** el
paso 3, el intérprete devolvió:

- el paso 2 colapsado de `["67","68","69","70","257"]` a `["67"]` (una sola pill)
- el paso 2 colapsado a `visitedPage: {any:{}}` (cualquier página)
- `click: {any:{}}` y `withElementId: {}` vacío al construir desde cero

Ninguna de las tres falla ni avisa: devuelven un embudo válido que mide otra cosa.
**Después de cada `update_funnel` con `refinement`, leer el `funnel_definition` que
vuelve y confirmar los ids paso por paso**, antes de computar. Los clones que solo
cambian `start_date`/`end_date` no pasan por el intérprete y son seguros.

Nota operativa: `update_funnel` con `refinement` tarda >60s y **cae por timeout con
frecuencia**. Conviene espaciar las llamadas y reintentar; los clones por fecha son
rápidos y se pueden hacer en paralelo.

#### `sourceClicksBC`

Resuelto: el métrico real es **`LD4uHOPIDS8l`**. Julio 2026 → **0**, así que el `0`
que estaba cargado era correcto, pero por casualidad. El campo queda en `JULY` con el
id anotado. Sigue sin renderizarse en ninguna vista.

Valores por mes (unique users, org, sin segmento): abr 1 · may 1 · jun 1 · jul 0 ·
ago 1 · acumulado sep-2025→ago-2026 **5**. Desde el corte del 28-ago el campo
también existe en `AUGUST` (`sourceClicksBC: 1`).

### Nota sobre users/sessions
Una versión previa de este checklist decía que `users` y `sessions` no se podían
computar de forma confiable vía MCP. Se verificó contra julio 2026: ambos
coinciden exacto con los valores ya validados. Se computan vía MCP.
