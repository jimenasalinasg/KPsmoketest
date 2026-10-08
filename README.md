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
4. Editar el bloque `OCTOBER` de `src/App.jsx` (`through`, valores, `first_time`), `npm run build`, revisar, deploy.

**La vista Usability metrics se actualiza siempre a la par**, en la misma corrida y el mismo deploy. Las dos leen el mismo ledger,
asi que cargar los pasos 2 y 3 ya la actualiza; no se deploya una sin la otra. Antes de publicar, comprobar que los usuarios acumulados
de la pestana de octubre y los de Usability coinciden, y que el mes mas reciente de Usability es el de la pestana.

Al cerrar octubre: el bloque `OCTOBER` pasa a ser el cierre y se agrega el de noviembre.

### Pendiente

- **Benchmarks "vs monthly avg".** Las tarjetas de las vistas mensuales comparan contra `BENCH.monthly` en
  `src/App.jsx`: un promedio fijo de periodos quincenales sep-2025 a mar-2026 (por ejemplo `pillPageviews: 87`,
  `highlights: 380`, `copies: 158`, `sourceClicks: 142`). No sale del ledger ni usa la base Sin DEV (copy), asi que
  esas comparaciones no son comparables con los valores nuevos. El ledger ya tiene oct-2025 a mar-2026 para
  recalcularlo. Decision tomada el 8-oct-2026: no se cambia todavia.
