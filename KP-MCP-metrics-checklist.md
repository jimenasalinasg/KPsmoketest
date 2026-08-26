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
- `dropoff`, `sourceClicksBC`, `openSearchVisits` — meses con schema viejo
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
| Open Search · ago 2026 | `2112175315` | 2026-08-01 → 2026-08-24 |
| Open Search · jul 2026 | `813457909` | 2026-07-01 → 2026-07-31 |
| Contextual (pills) · ago 2026 | `564963308` | 2026-08-01 → 2026-08-24 |
| Contextual (pills) · jul 2026 | `1476024114` | 2026-07-01 → 2026-07-31 |
| LWA inicio → completado | `104484265` | 2025-09-01 → 2026-08-24 |
| Contextual (pills) · abr 2026 | `1661380124` | 2026-04-01 → 2026-04-30 |
| Contextual (pills) · may 2026 | `362258649` | 2026-05-01 → 2026-05-31 |
| Contextual (pills) · jun 2026 | `989040134` | 2026-06-01 → 2026-06-30 |
| Open Search · abr 2026 | `1046945776` | 2026-04-01 → 2026-04-30 |
| Open Search · may 2026 | `1679441265` | 2026-05-01 → 2026-05-31 |
| Open Search · jun 2026 | `1912929132` | 2026-06-01 → 2026-06-30 |

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
| ago (1-24) | 224 | 32 | 8 | 2 |

### Desglose por pill (abr–ago 2026)

Un embudo por pill, mismo primer paso (`visitedUrl` host `knowledgeplatform.iadb.org`),
luego `visitedPage` con **un solo** id de página, luego `highlight any` → `copy any`.

| Pill | id de página | funnel_id |
|---|---|---|
| Similar Projects | 67 | `2002915779` |
| Lessons Learned | 68 | `624894343` |
| Literature | 69 | `461508687` |
| Institutional Documents | 70 | `457977866` |
| Data | 257 | `490149637` |

**Por qué cinco embudos y no un `dimension`:** las pills son *page definitions*
de FullStory, no rutas. `compute_funnel` con `dimension: {property: "url_path"}`
agrupa por proyecto individual (`/knowledge/UR-L1225`, `/knowledge/BO-L1250`…),
no por pill, y además infla el paso 1 multiplicándolo por el número de grupos.
No sirve para este corte.

**Por qué el rango es abr–ago y no un mes:** en agosto hay 32 aperturas de pill
en total; partidas en cinco no dan nada legible. El primer paso (1.251 usuarios)
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
SP 122 vs 109, LL 120 vs 111, Lit 79 vs 76, ID 62 vs 58, Data 45 vs 45. Si
alguna suma mensual diera *menos* que el agrupado, hay un error de rango.

**Ojo con Data (257):** cero usuarios en abril, 3 en mayo, 19 en junio. Es la
pill más nueva, no la más floja. Cualquier comparación agrupada que arranque en
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

### Panel de fuentes en los embudos — decidido, pendiente de datos

Pedido: agregar el click al panel de fuentes a los embudos de Open Search y
contextual.

**Va como derivación, no como paso intermedio.** La forma intuitiva —
`entra KP → busca → click a fuente → highlight → copia` — está mal y repetiría
el error del embudo de LWA, donde forzar el paso de borrador (que solo pasan 2
usuarios) reportó cero lecciones completadas cuando en realidad había 15. Un
paso que poca gente atraviesa no mide el embudo: lo estrangula.

El click a fuente **no está en el camino a copiar**. Es un destino alternativo:
quien abre la fuente se va del KP al documento. Extracción y verificación son
dos salidas distintas del mismo paso.

Forma correcta: dos embudos nuevos de **tres** pasos,

- `entra KP → corre una búsqueda → click al panel de fuentes`
- `entra KP → abre una pill → click al panel de fuentes`

renderizados como una línea debajo de cada embudo existente («de los N que
buscaron, X abrieron una fuente»), sin tocar los pasos actuales. Los datos van
en `FUNNELS.<mes>`, como todo lo demás.

**IDs.** Open Search es `Ge6P9qbIeu3b`, confirmado y en uso. El de contextual
**no existe en este repo**: hay un campo `sourceClicksBC: 0` que aparece solo en
el objeto de julio, no se renderiza en ninguna vista, y no tiene métrico detrás.
Es un cero sin fuente. Al conseguir el ID real: o se llena, o se borra el campo.

### Nota sobre users/sessions
Una versión previa de este checklist decía que `users` y `sessions` no se podían
computar de forma confiable vía MCP. Se verificó contra julio 2026: ambos
coinciden exacto con los valores ya validados. Se computan vía MCP.
