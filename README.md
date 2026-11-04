# KP Smoketest

Dashboard de metricas del IDB Knowledge Platform (React + Vite), publicado en GitHub Pages
al hacer push a `main`.

```bash
npm install
npm run dev      # desarrollo
npm run build    # build de produccion (regenera el JSON del ledger antes de compilar)
```

## Ledger mensual y vista "Usability metrics"

`data/kp_ledger.csv` es la fuente de verdad de la vista **Usability metrics**. Todas sus metricas de
evento usan el segmento **Sin DEV (copy)** (`sjHJR3590z6j`), que excluye al equipo interno (DEV).

| Archivo | Que es |
|---|---|
| `data/kp_ledger.csv` | Los datos. Columnas: `month` (`YYYY-MM` o `baseline`), `metric`, `value`, `type` (`additive` \| `snapshot`), `source`, `note`. Solo valores, sin logica. |
| `scripts/ledger-to-json.mjs` | Valida el CSV y genera `src/data/kpLedger.json`. Corre solo antes de cada build (`npm run ledger:build`). |
| `scripts/add-month.mjs` | Agrega (o reemplaza) las filas de un mes en el CSV y regenera el JSON. |
| `src/data/ledgerView.js` | Las unicas lecturas sobre el ledger: sumas, linea base, ultimo snapshot. |
| `src/UsabilityMetrics.jsx` | La vista. Todo numero sale del JSON. |
| `reference/kp_usability_metrics.html` | Referencia de diseno de la vista (no se incrusta). |

`additive` se suma por mes; `snapshot` es un acumulado y se toma la ultima fila de cada metrica (nunca se suma);
`month=baseline` son lineas base sin corte mensual.

### Cada cierre de mes: agregar filas al CSV, correr el script, hacer commit

```bash
node scripts/add-month.mjs 2026-11 os_highlight=412 os_copy=130 os_source_panel=25 \
     cs_queries=90 cs_copy=2 cs_source_link=4 cs_highlight_detail=1 cs_highlight_cards=3 cs_chips=30 cs_search_bar=50
node scripts/add-month.mjs 2026-11 unique_users=2201 sessions=17900 prompters=990   # snapshots
node scripts/add-month.mjs 2026-10 os_copy=131 --replace    # un mes que estaba parcial
npm run build                                               # revisar el diff
```

Commit del CSV **y** de `src/data/kpLedger.json`, juntos. El JSON no se edita a mano. `add-month` valida con las
mismas reglas que el build, avisa de typos en nombres de metrica y no escribe nada si algo falla (`--dry-run` para ensayar).

### Que lee el ledger

- La vista **Usability metrics** (todo).
- Las tarjetas mensuales (abril-septiembre) de `src/App.jsx`: highlights, copias, source clicks, pill pageviews y
  Global Search de Open Search y Contextual, via `L("YYYY-MM", "metrica")`. Para el mes nuevo, su bloque de datos
  usa el mismo patron; no se escriben esos numeros a mano. Los textos de los Signals (porcentajes, splits) si son
  texto y se reescriben con cada cierre.

Lo demas (usuarios, sesiones del mes, paises, LWA, embudos, cualitativo) sigue fuera del ledger.

### Octubre al dia

La pestana **October 2026 · to date** es un mes en curso. Cada dia:

1. `through` = ultimo dia **completo** (ayer, UTC). Con FullStory, rango 1-oct → `through`, segmento Sin DEV, cada metrica
   leida dos veces: usuarios `a30wnMzqgtJk`, sesiones `BhsN9vxRPN7V`, prompters `3GVbGeJsPBCb`, onboarding `iN3brKBr4rlY`,
   pulgares `AtpRWyuThJUq` / `x6Z3q26RMOra`, galeria `lkwqkKIJQ25E`, recientes `nfcBnYjQSAfT`, nueva busqueda `tU5aopeDHc1k`,
   descargas `3EkjBy6jYByB` / `FIw2VjBWkJ6J`.
2. Acumulados con control de resta, **las dos consultas el mismo dia**: usuarios `Q(1-sep-2025 → through) − Q(1-sep-2025 → 30-sep)`
   son los nuevos del mes; acumulado = 2,053 + nuevos. Sesiones = 17,274 + sesiones del mes. Prompters = 923 + la misma resta.
   Cargarlos con `node scripts/add-month.mjs 2026-10 unique_users=… sessions=… prompters=… --replace --source "see note" --note "…"`.
3. Filas de evento (`os_*`, `cs_*`): se recalculan con la receta del ledger y se cargan con `--replace`.
3b. **Frecuentes y power users** (`frequent_users`, `power_users`): receta por MCP en `KP-MCP-metrics-checklist.md` (§ «Usuarios frecuentes y power users»); ventana de 28 días que termina en `through`.
4. Editar el bloque `OCTOBER` de `src/App.jsx` (`through`, valores, `first_time`), `npm run build`, revisar, deploy.

5. **CSAT** (a mano, de la lista de encuestas «Surveys by month» de FullStory): `csat`, `csatResponses` y `csatAvg` del bloque `OCTOBER`. Top-2 box = respuestas ≥ 4 ÷ total. Con n tan chico no es una tasa: se dice en la tarjeta.

**La vista Usability metrics se actualiza siempre a la par**, en la misma corrida y el mismo deploy. Las dos leen el mismo ledger,
asi que cargar los pasos 2 y 3 ya la actualiza; no se deploya una sin la otra. Antes de publicar, comprobar que los usuarios acumulados
de la pestana de octubre y los de Usability coinciden, y que el mes mas reciente de Usability es el de la pestana.

Al cerrar octubre: el bloque `OCTOBER` pasa a ser el cierre y se agrega el de noviembre.

### Noviembre al dia

Misma receta que octubre con el bloque `NOVEMBER` y la vista `NovemberMonthly` de `src/App.jsx`, y el mes `2026-11` en el ledger. Los acumulados se anclan en el cierre de octubre (2,132 usuarios, 18,358 sesiones, 950 prompters, 440 en categoria). La pestana empieza corta (sin LWA, paises, embudos, otros eventos de Contextual, consola, retencion, CSAT ni cualitativo) y va ganando secciones; al cierre de noviembre pasa a ser el cierre y se agrega diciembre.

### Usuarios, prompters y sesiones del mes (regla desde el 4-nov-2026)

- **Usuarios** y **prompters** del mes van sobre Sin DEV: `compute_metric` con `metric_definition` (usuarios: `event {}`, unicos;
  prompters: click `A3vpsKJZw0X8`, unicos) y `segment.segmentId = sjHJR3590z6j`, `SCOPE_SESSION`. Hasta el 4-nov se publicaban sin segmento
  (`compute_metric(a30wnMzqgtJk | 3GVbGeJsPBCb)` con fechas, que ignora el segmento). Reexpresado abr-nov: usuarios 584/344/360/237/271/267/209/31,
  prompters 218/123/151/97/110/124/53/7.
- **Sesiones** siguen con `BhsN9vxRPN7V` sin segmento (todos los entornos, equipo incluido): el segmento Sin DEV en modo sesion solo deja
  las sesiones que cargan `/home` exacto y bajaria las sesiones a un tercio (oct: 343 contra 1,083).
- Los **acumulados** (usuarios, prompters) ya eran Sin DEV: la consulta Sin DEV desde 2025-11-05 da 1,876 al 31-oct, como el control 1,888.

### KP Wrapped 2026

Tab narrativo (`src/KPWrapped.jsx`, calculos en `src/data/wrapped.js`). Lee los bloques mensuales de `App.jsx` (`WRAPPED_MONTHS`),
el ledger y constantes de FullStory documentadas en `wrapped.js` (vistas por pill, usuarios organicos ene-mar, hitos). Al cerrar un mes:
agregar el mes a `WRAPPED_MONTHS` y su columna a `PILL_SESSIONS` (metricas guardadas de cada pill + segmento Sin DEV).
Umbrales de frecuencia en `SEGMENT_RULES` (se aplican en FullStory; NN/g no publica un umbral de power users).

### Pendiente

- **Benchmarks "vs monthly avg".** `BENCH.monthly` en `src/App.jsx` se recalculo el 4-nov-2026 sobre Sin DEV (copy):
  promedio dic-2025 a mar-2026 (users 170, sessions 441, prompters 84, pill views 80; detalle en el comentario del codigo).
  Quedan con el valor viejo `prompts`, `tourCompletion`, `retention` y `pillTop`/`pillBot`: no hay fuente Sin DEV para ese periodo.
