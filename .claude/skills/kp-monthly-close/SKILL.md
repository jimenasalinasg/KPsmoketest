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

### 5. Validar
`npm install && npm run build`. Debe compilar sin errores.
**Si falla el build, no commitear** — abrir el PR con el error.

### 6. Commit, PR y merge
Rama `cierre-<mes>-<anio>`, commit, push, PR.

El cuerpo del PR debe incluir:
- Tabla de valores del cierre, con comparación vs el mes anterior
- Penetración (`users/3600*100`, 1 decimal)
- Países marcados `// REVISAR`
- **Lista explícita de campos manuales pendientes**
- Nota de que el build pasó

Mergear a `main` (dispara el deploy a GitHub Pages).

### 7. Reportar
Resumen en español: mes cerrado, movimientos relevantes vs el mes anterior,
países anómalos, campos manuales pendientes.

## Nunca

- Inventar valores para campos sin métrico.
- Sumar meses para obtener acumulados (duplica recurrentes).
- Confiar en un metric_id nuevo sin validarlo contra un mes conocido.
- Mergear con el build roto.
