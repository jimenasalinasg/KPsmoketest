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

Esto aplica especialmente a `prompts`, `latency` y `csat`, que **no tienen
métrico FullStory**. `first_time` y `returningUsers` **sí se computan** desde
sep-2026 — ver §3bis.

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

### 3bis. Nuevos y recurrentes

**No son métricos: son un segmento.** `compute_metric` no puede expresar «first
seen», así que hay que armarlo con `build_segment` y leer el conteo con
`get_sessions`.

```
build_segment(
  query = "users whose first seen date is in the range starting <inicio> and "
          "ending <fin> inclusive, who visited url entire URL is "
          "https://knowledgeplatform.iadb.org/home",
  start_date = <inicio>, end_date = <fin>)

get_sessions(segment_id, limit=1)   ->  matching_users  =  first_time
```

`returningUsers` = `users` − `first_time`. Son los que **ya conocían KP antes
del mes**.

**El segmento es `sjHJR3590z6j`, que se llama «Sin DEV (copy)»** — con el
«(copy)». Es el único con ese nombre en la org, verificado el 1-sep-2026, y es el
que usan tanto los métricos guardados como `compute_funnel`. La receta de arriba
replica sus dos condiciones a mano (los 28 mails excluidos y la visita al `/home`
de producción) porque `build_segment` no puede anidar un segmento existente. Si
algún día aparece un segundo «Sin DEV», confirmar cuál está dentro de la
definición de los métricos antes de usarlo.

**Verificar la definición que vuelve, siempre.** El intérprete corre el rango de
`firstSeen` un día, y **de forma inconsistente**: pidiendo «ending 2026-07-30»
devolvió 07-31, pero pidiendo «ending 2026-06-29» devolvió 06-29. No hay regla
que valga — hay que **leer `userProperties.firstSeen.range` en la respuesta y
confirmar que termina el último día del mes**, y rehacerlo si no. Con la frase
«in the range starting X and ending Y inclusive» y la fecha exacta que se quiere
sale bien casi siempre; la versión corta «between X and Y» falla más.

**No intentar excluir los mails del equipo.** `get_sessions` devuelve
`unspecified error` si el segmento lleva `excludeUserProperties`. Se verifica al
revés: construir el mismo segmento *incluyendo* solo los 28 mails y confirmar
que da **0**. Comprobado para abr–ago 2026; el equipo no tiene altas nuevas.

**`returningUsers` va por resta, y es a propósito.** Se puede medir directo —
`firstSeen` **antes** del mes + actividad **en** el mes — pero esa medición
**arrastra al equipo de producto**: son usuarios viejos, así que caen dentro, y
no se pueden sacar porque `get_sessions` falla con `excludeUserProperties`. La
resta, en cambio, hereda la exclusión de `users`, que sí es Sin DEV.

Contrastado para los cinco meses de 2026 (medido vs resta): abr 186 vs 177,
may 181 vs 188, jun 174 vs 177, jul 164 vs 164, ago 161 vs 162. Julio da
idéntico y el resto queda entre −7 y +9.

**Abril desarma la diferencia en sus dos causas**, y las dos aplican a todos los
meses:

- **+13, el equipo de producto.** Trece cuentas de la lista de exclusión
  estuvieron activas en abril con `firstSeen` anterior, así que la medición
  directa las cuenta. Verificado.
- **−4, la condición de `/home`.** El segmento exige visita a `/home` **dentro
  del mes**, pero `users` solo exige haberla hecho **alguna vez desde
  2025-09-01**. Quien estuvo activo en el mes por otra página, con su visita a
  `/home` en un mes anterior, entra en `users` y no en la medición.

186 − 13 = 173, contra los 177 de la resta: los 4 que faltan son ese segundo
efecto. Neto +9, que es lo que hacía que 411 + 186 diera 597 contra 588.

La resta no tiene ninguno de los dos problemas: hereda la población de `users`
tal cual.

Sirve como control de cordura una vez al año, no como fuente. Si algún mes la
diferencia se va de ±10, mirarlo.

**Ojo:** el chequeo de que `first_time + returningUsers` dé `users` es
**tautológico** mientras se use la resta. No prueba nada. Lo que sí hay que
verificar es `first_time`, que es el único de los dos que se mide.

#### Por qué esto importa

Hasta ago-2026 estos campos se cargaban **org-wide**, sin segmento y sin la
condición de `/home`, mientras `users` sí era Sin DEV. Medían otra población y
por eso la resta nunca cerraba, hasta que se retiraron. Los valores viejos eran
reproducibles org-wide: julio daba 156 y agosto 215.

**Mirar siempre el denominador.** Si el panel de FullStory dice «X Users of
395», ese 395 es org-wide. El de Sin DEV en agosto es 287. Si el total no
coincide, el número no es del segmento.

#### No confundir con «2+ sesiones en el mes»

`returningUsers` es **quien ya conocía KP antes del mes**, no quien volvió varias
veces dentro del mes. Las dos definiciones convivieron en el mismo panel hasta
sep-2026. Para referencia, agosto tiene 158 usuarios con 2+ visitas a `/home`,
parecido de tamaño a los 162 recurrentes pero midiendo otra cosa.

#### Serie cargada (Sin DEV)

| Mes | users | nuevos | recurrentes |
|---|---:|---:|---:|
| abr 2026 | 588 | 411 | 177 |
| may 2026 | 363 | 175 | 188 |
| jun 2026 | 379 | 202 | 177 |
| jul 2026 | 250 | 86 | 164 |
| ago 2026 | 287 | 125 | 162 |

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

### 5ter. Cohortes de retención

La tabla de `COHORTS` en `src/App.jsx` se **extiende**, no se recalcula entera.
Receta y tabla vigente en el checklist, sección «Cohortes de retención».

Dos escrituras por cierre:

1. Una **celda nueva** en cada cohorte anterior: la retención de esa cohorte en
   el mes que se acaba de cerrar. Son tantas llamadas como filas haya.
2. Una **fila nueva** para la cohorte del mes cerrado, con `size` = su
   `first_time` y todas las columnas en `null`. Todavía no tiene M+1.

Agregar `"M+<k>"` a `cols` cuando la cohorte más vieja alcance una columna nueva.

**Control obligatorio:** recomputar el tamaño de una cohorte vieja (mismo
segmento, rango = su propio mes) y ver que da el `first_time` publicado. Si no
da, la definición se corrompió al pasar por el intérprete: parar y rehacerla,
no cargar el número.

Las celdas sin dato van `null`, nunca `0`: son cosas distintas y un cero dice
que nadie volvió.

### 5bis. Barrido cualitativo de sesiones

Responde lo que ningún métrico contesta: **para qué usan la plataforma, qué se
llevan y qué se los impide.** Va al final de la vista del mes, en el objeto
`QUALITATIVE` de `src/App.jsx` — mismo criterio que `FUNNELS`: datos afuera del JSX.

**Muestreo estratificado, nunca aleatorio.** A este volumen (≈220 usuarios/mes)
una muestra al azar da mayoría de rebotes de 30 segundos. Sacar ~8 sesiones de
los embudos que ya se reconstruyeron, con `get_funnel_sessions`:

| Estrato | Cómo | Para qué |
|---|---|---|
| Completaron hasta copiar | `completed_step: 3` sobre el embudo de Open Search | qué extraen y para qué |
| Buscaron y se cayeron | `completed_step: 2, did_not_complete: true` | dónde se pierde la conversión |
| Abrieron el panel de fuentes | `completed_step: 2` sobre el embudo de fuentes | verificación vs extracción |
| Abrieron pill y no extrajeron | `completed_step: 2, did_not_complete: true` sobre el contextual | por qué la superficie contextual no convierte |

Después `get_session_events(session_id)` para leer el transcript de cada una.
**No hay video**: lo que se lee son navegaciones, clicks, texto tipeado,
`dead-click`, `mouse-thrash`, errores de consola y los tiempos entre acciones.
Para estos fines alcanza y sobra — es buscable y comparable entre meses.

**Excluir al equipo de producto.** El segmento Sin DEV no filtra al PM. Si en la
muestra aparece `jimenasa@iadb.org` u otra cuenta del equipo, descartarla y sacar
otra: con n=8 una sesión propia contamina el resultado.

**Esquema de codificación fijo** — es lo que hace que diciembre sea comparable
con agosto. Cada tema se clasifica en una sola de estas etiquetas:

`New use case` · `Coverage gap` · `Friction` · `Bug` · `Opportunity`

y cada uno lleva: `title` (la observación, no la categoría), `body` (qué se vio,
2–3 oraciones, en pasado y concreto), `quote` opcional (verbatim, en el idioma
original), `soWhat` (qué decisión de producto habilita) y `sessions` (los links).

**Anonimizar siempre.** En el dashboard no va nombre, ni mail, ni ciudad. Las
sesiones se etiquetan `S-01`, `S-02`… más el país y, si aporta, el idioma. El
link a FullStory sí va: pide login, así que la identidad solo la ve quien ya
tiene acceso. **El dashboard es público en GitHub Pages** — antes de pegar un
verbatim, chequear que no nombre una operación concreta ni a una persona;
si la nombra, parafrasear.

**Nunca convertir esto en porcentajes.** Con 8 sesiones son patrones para
verificar, no medición. Conteos crudos («tres de ocho») y ejemplos, o nada.
La regla de no inventar números aplica igual: cada afirmación tiene que quedar
atada a sesiones concretas, y si no hay sesión que la respalde, no se escribe.

Renderiza `<QualitativeSection q={QUALITATIVE.<mes>} />` al final de la vista.

**Una captura, la sesión más representativa.** Sirve para que quien lee entienda
en dos segundos cómo se ve el producto en uso; el texto solo no lo transmite.

`session_open(session_id)` → elegir el instante que muestra el producto haciendo
su trabajo (no una pantalla vacía, no un modal) → `session_screenshot(client_id,
page_id, timestamp)`. Devuelve la imagen inline **y una URL firmada que caduca a
las 168h**: la imagen hay que bajarla y commitearla en `src/assets/`, nunca
linkear la URL. Se importa arriba de `src/App.jsx` y el dato va en la clave
`shot` de `QUALITATIVE.<mes>`, como todo lo demás.

**Antes de commitear la imagen, revisarla pixel por pixel.** El dashboard es
público y una captura filtra mucho más que un verbatim:

- **FullStory NO enmascara la foto de perfil del bubble del chat.** El avatar de
  la barra superior sí sale enmascarado, el del mensaje no. Comprobado en agosto
  2026: era una foto de cara reconocible. **Siempre hay que taparla a mano** (un
  disco gris neutro) antes de que la imagen entre al repo.
- Recortar y ampliar las zonas dudosas para mirarlas de verdad —barra superior,
  sidebar, encabezados— en vez de confiar en la vista completa.
- Nada de nombre, mail ni ciudad. Códigos de operación del banco: pasan, son
  documentos publicados, pero decirlo en el pie.
- El pie de la captura declara **qué se retocó**. Una imagen editada sin avisar
  es peor que no ponerla.

Se muestra con `maxWidth: 620` y enlace a tamaño completo: en móvil queda
miniatura y se lee por el pie, que es el compromiso correcto.

### 6. Validar

`npm install && npm run build`. Debe compilar sin errores.
**Si falla el build, no commitear** — abrir el PR con el error.

**El build no alcanza.** Un valor mal puesto en un objeto de mes es JS válido y
compila igual; en sep-2026 una definición de `META` cayó dentro de `APRIL` y
dejó la vista de abril en pantalla en blanco con el build en verde.

Después de construir, **recorrer las cinco vistas mensuales en Playwright** y
verificar en cada una:

- que el `textContent` del body supere unos miles de caracteres — si queda en
  decenas, la vista crasheó;
- que no haya `pageerror`;
- que no aparezca `[object Object]` renderizado;
- que `first_time + returningUsers` dé `users`.

Probar solo el mes nuevo no alcanza: el bug de abril pasó por eso.

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
- Muestrear sesiones al azar para el barrido cualitativo. Va estratificado.
- Publicar nombre, mail o ciudad en la sección cualitativa. El dashboard es público.
- Sacar porcentajes de una muestra de 8 sesiones.
- Cargar `first_time` desde el panel de FullStory sin el segmento. Va org-wide y
  no cierra contra `users`.
- Dar por buena una vista solo porque el build paso. Hay que abrirla.
