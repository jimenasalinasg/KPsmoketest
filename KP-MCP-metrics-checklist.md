# KP Dashboard — FullStory MCP metrics checklist

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

| Campo                  | metric_id      |
|------------------------|----------------|
| `lwa.lessonsGenerated` | `ffbLsADU0Swu` |
| `lwa.share`            | `IHPlQ1WT1zEz` |
| `lwa.copyLesson`       | `b46xecCQyFod` |
| `lwa.highlightAndCopy` | `azWUDLxYgaWY` |

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

---

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

### Nota sobre users/sessions
Una versión previa de este checklist decía que `users` y `sessions` no se podían
computar de forma confiable vía MCP. Se verificó contra julio 2026: ambos
coinciden exacto con los valores ya validados. Se computan vía MCP.
