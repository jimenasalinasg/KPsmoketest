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

**Los ceros son baseline, no desuso.** Cuatro de estos cinco corresponden a
features recién lanzadas: sus métricos se definieron el 12-ago-2026 y no
registran eventos previos porque la feature no existía. No confundir con un
problema de instrumentación ni reportarlo como caída de uso.

`copyLesson` es la excepción: registró 9 eventos entre sep-2025 y jun-2026,
y **ninguno desde julio**. Esa caída sí es real y vale seguirla.

> Pendiente menor de reconciliar: julio tiene `copiesCursor: 1` cargado a mano,
> pero `azWUDLxYgaWY` devuelve 0 para julio. Probablemente el valor manual salió
> de otra fuente (consola). No afecta los cierres.

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
- `latency` / `avgTime` — latencia mediana
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
| Open Search · ago 2026 | `1864788303` | 2026-08-01 → 2026-08-28 |
| Open Search · jul 2026 | `813457909` | 2026-07-01 → 2026-07-31 |
| Contextual (pills) · ago 2026 | `1953187048` | 2026-08-01 → 2026-08-28 |
| Contextual (pills) · jul 2026 | `1476024114` | 2026-07-01 → 2026-07-31 |
| LWA inicio → completado | `412097965` | 2025-09-01 → 2026-08-28 |
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
| OS → panel de fuentes · ago 2026 | `1942600641` | 2026-08-01 → 2026-08-28 |
| Contextual → panel de fuentes · abr 2026 | `680145669` | 2026-04-01 → 2026-04-30 |
| Contextual → panel de fuentes · may 2026 | `588957978` | 2026-05-01 → 2026-05-31 |
| Contextual → panel de fuentes · jun 2026 | `118780297` | 2026-06-01 → 2026-06-30 |
| Contextual → panel de fuentes · jul 2026 | `1150323350` | 2026-07-01 → 2026-07-31 |
| Contextual → panel de fuentes · ago 2026 | `1331223100` | 2026-08-01 → 2026-08-28 |

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
| ago (1-28) | 273 | 37 | 9 | 3 |

### Desglose por pill (abr–ago 2026)

Un embudo por pill, mismo primer paso (`visitedUrl` host `knowledgeplatform.iadb.org`),
luego `visitedPage` con **un solo** id de página, luego `highlight any` → `copy any`.

| Pill | id de página | funnel_id |
|---|---|---|
| Similar Projects | 67 | `275636809` |
| Lessons Learned | 68 | `39156859` |
| Literature | 69 | `1091319363` |
| Institutional Documents | 70 | `129020650` |
| Data | 257 | `856060289` |

**Por qué cinco embudos y no un `dimension`:** las pills son *page definitions*
de FullStory, no rutas. `compute_funnel` con `dimension: {property: "url_path"}`
agrupa por proyecto individual (`/knowledge/UR-L1225`, `/knowledge/BO-L1250`…),
no por pill, y además infla el paso 1 multiplicándolo por el número de grupos.
No sirve para este corte.

**Por qué el rango es abr–ago y no un mes:** en agosto hay 37 aperturas de pill
en total; partidas en cinco no dan nada legible. El primer paso (1.281 usuarios)
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
Al corte del 28-ago: SP 123 vs 110, LL 121 vs 112, Lit 80 vs 77, ID 63 vs 59,
Data 48 vs 48. Si alguna suma mensual diera *menos* que el agrupado, hay un
error de rango.

**Ojo con Data (257):** cero usuarios en abril, 3 en mayo, 19 en junio, 14 en
agosto (1-28). Es la pill más nueva, no la más floja. Cualquier comparación agrupada que arranque en
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
| ago (1-28) | 11 / 111 (10%) | 1 / 37 |

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
