---
name: kp-monthly-close
description: Cierra el mes anterior en el dashboard KP (src/App.jsx) con datos de FullStory MCP, valida el build, y mergea a main. Usar cuando se pida cerrar un mes del dashboard KP, actualizar métricos mensuales del Knowledge Platform, o cuando dispare el Routine de cierre mensual del día 1.
---

# Cierre mensual del dashboard KP

Cierra el **mes anterior** en `src/App.jsx` del repo KPsmoketest usando FullStory MCP.

Los metric IDs, reglas de conversión y el baseline de validación están en
`KP-MCP-metrics-checklist.md` en la raíz del repo. **Leerlo primero** — es la
fuente de verdad, no repetir IDs de memoria.

## Regla que manda sobre todas

**Nunca inventar un número.** Si un valor no se puede computar, va `null` y se
lista como pendiente en el PR. Un campo vacío es un resultado correcto; un
campo inventado corrompe el dashboard y no se nota hasta que alguien lo presenta.

Esto aplica especialmente a `prompts`, `first_time`, `returningUsers`,
`latency`/`avgTime` y `csat`, que **no tienen métrico FullStory**.

## Contexto de ejecución

Puede correr desatendido (disparado por el Routine del día 1). **No hacer
preguntas** — no hay nadie para responderlas. Ante una ambigüedad: tomar el
camino conservador (dejar `null`, marcar pendiente) y documentarlo en el PR.

## Pasos

### 1. Determinar el mes
Calcular el mes anterior a hoy y su rango completo, usando el último día real
del mes (28/29/30/31). Ej: si hoy es 1-sep-2026 → agosto 2026, `2026-08-01` a
`2026-08-31`.

### 2. Validar contra el baseline
Antes de escribir nada, recomputar 2–3 métricos de julio 2026 (rango
`2026-07-01`→`2026-07-31`) y comparar contra la tabla de baseline del checklist.

Si no coinciden, la definición cambió en FullStory: **parar, no escribir datos,
abrir el PR solo con una nota explicando la discrepancia.**

### 3. Computar
Todos los métricos automáticos del §1 del checklist, con el rango del mes.
Llamadas en paralelo, ~6 por bloque.

Después los acumulados: query única `2025-09-01` → último día del mes cerrado.
Nunca sumar meses.

### 4. Escribir en src/App.jsx
Buscar el `const <MES>` correspondiente.

- **Si existe** (venía como preliminar): actualizar solo los campos automáticos.
  No tocar los manuales — dejarlos exactamente como están.
- **Si no existe**: crearlo copiando la estructura del mes más reciente, más su
  función `<Mes>Monthly` y su entrada en el array `MONTHS` y en el router.

Actualizar también los textos con fecha del componente (encabezado del mes,
"through <fecha>", "Signals — early read (N days in)") y el recuadro
"Cumulative totals". El bloque narrativo de Signals se reescribe con los
números nuevos y los deltas recalculados contra el mes previo.

Cambiar el comentario de encabezado a:
`// Final — full month, segmento Sin DEV (vía Fullstory MCP, cerrado <YYYY-MM-DD>)`

### 5. Reconstruir los embudos

**Esto no se recomputa, se reconstruye.** Un embudo de FullStory tiene el rango
**congelado en su definición**: `compute_funnel` devuelve siempre el rango viejo,
sin fallar ni avisar. Si te salteás este paso, el dashboard va a mostrar los
embudos del mes pasado con cara de actuales. Los ids guardados están en el
§2bis del checklist.

**La forma segura de reconstruir es `update_funnel`, no `build_funnel`.**
`update_funnel(funnel_id, start_date, end_date)` sobre el embudo del mes anterior
devuelve un **id nuevo** con los pasos copiados exactamente y el rango cambiado.
El original queda intacto. Así no se pasa por el intérprete de lenguaje natural,
que es donde aparecen los `withElementId: {}` vacíos y los ids de página perdidos.

Usar `build_funnel` desde cero solo si el embudo no existe todavía.

Ojo: `update_funnel` **no** copia el segmento a `funnelSettings`. Da igual —
el segmento se pasa siempre en `compute_funnel(funnel_id, segment_id)`, nunca se
confía en el guardado.

Los cuatro embudos, computados con `compute_funnel(funnel_id, segment_id)`:

1. **Open Search** — `visitedUrl` host `knowledgeplatform.iadb.org` → click en
   `Open-Search-Input-Search` → `highlight any` → `copy any`.
2. **Contextual (pills)** — mismo paso 1 → `visitedPage` en `[67, 68, 69, 70, 257]`
   → `highlight any` → `copy any`.
3. **Los mismos dos para el mes anterior**, que van en `compare` para los deltas.
4. **LWA** — extender el rango hasta el último día del mes cerrado. Es
   cross-session: `in_same_session: false`.

Verificar en el `funnel_definition` que devuelve `build_funnel` que los ids de
página y de elemento quedaron explícitos. Si aparece `withElementId: {}` vacío,
el embudo está midiendo "cualquier click" y el número no sirve.

**Las pills son distintas: esas sí se recomputan.** Los cinco métricos
`single_number` del checklist se computan con `compute_metric(metric_id,
start_date, end_date)` sin reconstruir nada. Agregar una columna al mes nuevo en
`pillMonthly.months` y en cada fila de `pillMonthly.rows`.

Los embudos agrupados por pill (`pills.rows`) se reconstruyen extendiendo el
rango hasta el mes cerrado, y hay que actualizar el conteo de entrada que
aparece en `pills.intro`.

**Chequeo obligatorio:** la suma de las columnas mensuales de cada pill tiene que
quedar **por encima** del total agrupado y cerca de él. Si diera menos, hay un
error de rango: parar y reportarlo.

### Dónde se escribe

Todo va al objeto `FUNNELS` de `src/App.jsx`, nunca al JSX. Agregar la clave del
mes nuevo copiando la estructura de la anterior, y en la función `<Mes>Monthly`
poner `<FunnelSection f={FUNNELS.<mes>} />`.

Los textos (`intro`, `note`, `synthesis`, `takeaways`) son strings planos y se
reescriben con los números nuevos. `takeaways` es una lista de `{lead, body}`:
`lead` va en negrita, `body` sigue en la misma línea. No meter JSX en los datos.

**Si un embudo no se puede reconstruir**, no copiar los números del mes anterior:
sacar `<FunnelSection>` de la vista del mes nuevo y listarlo como pendiente en el
PR. Una sección ausente es honesta; una con datos viejos, no.

### 6. Validar
`npm install && npm run build`. Debe compilar sin errores.
**Si falla el build, no commitear** — abrir el PR con el error.

### 7. Commit, PR y merge
Rama `cierre-<mes>-<anio>`, commit, push, PR.

El cuerpo del PR debe incluir:
- Tabla de valores del cierre, con comparación vs el mes anterior
- Penetración (`users/3600*100`, 1 decimal)
- Países marcados `// REVISAR`
- **Lista explícita de campos manuales pendientes**
- Embudos reconstruidos, con los `funnel_id` nuevos, o los que no se pudieron
- Nota de que el build pasó

Mergear a `main` (dispara el deploy a GitHub Pages).

### 8. Reportar
Resumen en español: mes cerrado, movimientos relevantes vs el mes anterior,
países anómalos, campos manuales pendientes.

## Nunca

- Inventar valores para campos sin métrico.
- Sumar meses para obtener acumulados (duplica recurrentes).
- Confiar en un metric_id nuevo sin validarlo contra un mes conocido.
- Mergear con el build roto.
- Recomputar un embudo esperando que cambie de rango. Hay que reconstruirlo.
- Copiar los embudos del mes anterior sin reconstruirlos, o dejarlos como están:
  no fallan, mienten.
- Escribir números de embudo en el JSX. Van en `FUNNELS`.
