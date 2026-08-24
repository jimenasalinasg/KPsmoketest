# Plan de medición — IDB Knowledge Platform

Cómo pasar de un dashboard que **reporta** a uno que permite **decidir**.

Complementa `KP-MCP-metrics-checklist.md`: ese documento dice *qué métrico usar y
de dónde sale*; este dice *qué preguntas queremos responder y qué falta para poder
responderlas*.

---

## 1. El problema

Hoy el dashboard cumple bien un objetivo (monitorear y reportar) y no cumple los
otros tres.

| Objetivo | Estado | Por qué |
|---|---|---|
| Monitorear y reportar | ✅ | Totales mensuales, comparación vs mes anterior, benchmark |
| Saber qué features andan bien | ⚠️ Parcial | Hay volumen, no hay denominador |
| Validar hipótesis y experimentos | ❌ | La unidad mínima es "el mes" |
| Tomar decisiones de producto | ⚠️ Débil | Responde "cuánto", no "dónde se cae" |

**Diagnóstico:** cada número del dashboard es un total de período. Eso sirve para
reportar y no para decidir.

### Los tres bloqueos

**Sin denominadores.** `promptGalleryClicks: 42` no dice si la galería anda bien —
dice que existe. Salud de feature es una tasa (usó / pudo usar), no un conteo.

**Sin granularidad temporal.** Los roadshows aparecen 12 veces en la narrativa del
dashboard pero nunca atados a una fecha en un eje. No se puede ver si la sesión del
17 de julio movió algo, porque julio es un solo punto. Sin esto ninguna hipótesis
es falsable.

**Sin vínculo a nivel usuario.** No se puede preguntar "de los que usaron Open
Search, cuántos copiaron algo". Los métricos son agregados independientes:
`first_time` + `returningUsers` = 146 contra 127 usuarios totales en agosto. No
particionan el mismo conjunto.

---

## 2. North star

**Actual (implícito):** penetración acumulada, hoy 53,1% (1.910 de 3.600).

Es alcance, no valor. Alguien que abrió KP una vez en doce meses pesa igual que
quien la usa todas las semanas. Sirve para comunicar despliegue; no sirve para
decidir sobre el producto.

**Propuesto: Extractores mensuales de conocimiento (MKE)**

> Usuarios únicos que en el mes realizaron al menos una **acción de extracción**:
> copiar contenido, descargar (Word/Excel), o completar una lección en LWA.

Por qué:
- Captura el momento de valor real — alguien vino con una pregunta y se llevó algo.
- No es alcance: exige una acción deliberada, no una visita.
- Es accionable: si baja, hay un embudo concreto donde mirar.
- Antecede al resultado institucional (conocimiento reutilizado) sin ser inmedible.

**No se puede computar hoy.** Los métricos de copia cuentan *eventos*, no usuarios
únicos. Hace falta crear las versiones "unique users" — ver §5.

---

## 3. Jerarquía de KPIs

Adaptada a plataforma interna: no hay monetización, la reemplaza impacto.

```
MKE — Extractores mensuales de conocimiento
├── Alcance      usuarios únicos del mes
├── Activación   % de usuarios que llegan a promptear
├── Extracción   % de prompters que copian o descargan
├── Retención    % de extractores del mes anterior que vuelven a extraer
└── Impacto      lecciones completadas · contenido reutilizado
```

### Línea de base con datos verificados

| Indicador | Julio (completo) | Agosto (al 24) |
|---|---|---|
| Usuarios | 250 | 226 |
| Activación (prompters/usuarios) | **44%** | **38%** |
| Copias por prompter | 1,68 | 1,36 |
| Highlights por prompter | 4,49 | 3,14 |
| Descargas | 9 | 1 |
| LWA: iniciadas → completadas | 16 → 2 (**12%**) | 7 → 0 (**0%**) |

Esta tabla ya dice más que la mayoría del dashboard actual, y sale de datos que ya
teníamos. La caída de activación de 44% a 38% y el desplome de descargas (9 → 1)
son preguntas de producto que hoy nadie está haciendo porque los conteos absolutos
las tapan.

---

## 4. Los dos embudos

### Embudo principal — extracción de conocimiento

| # | Paso | Métrico hoy | Estado |
|---|---|---|---|
| 1 | Inicia sesión en KP | `BhsN9vxRPN7V` | ✅ |
| 2 | Envía un prompt | `3GVbGeJsPBCb` | ✅ |
| 3 | Highlightea contenido | `cMgaz9YMCSJh` | ✅ (eventos, no usuarios) |
| 4 | Copia o descarga | `yowGb1tOMe3X` + descargas | ✅ (eventos, no usuarios) |

Los cuatro números existen. Lo que **no** existe es la conversión entre pasos —
para eso hace falta `build_funnel`, no cuatro `compute_metric` sueltos.

### Embudo LWA

| # | Paso | Métrico |
|---|---|---|
| 1 | Inicia una lección | `jDQuiB0c5EYi` |
| 2 | Edita | `1Ycz3dnUUHFS` |
| 3 | Completa | `znQU12fxaRzp` |
| 4 | Comparte | `IHPlQ1WT1zEz` |

**Agosto: 7 iniciadas, 0 completadas.** Julio: 16 → 2. Este embudo se cae entero
antes del final y es, de lejos, el hallazgo más accionable de todo el dashboard —
y hoy no está visible en ninguna vista.

---

## 5. Qué falta construir

Ordenado por relación valor/esfuerzo. Nada de esto requiere instrumentación nueva
en el producto: **el MCP de FullStory ya expone todo lo necesario y el dashboard
usa alrededor de un quinto.**

### P1 — Embudos (desbloquea los 3 objetivos)
`build_funnel` / `compute_funnel` ya están disponibles. Definir los dos embudos de
§4 y guardarlos. Convierte "cuánto" en "dónde se cae".

### P2 — Series diarias con anotaciones (desbloquea validar hipótesis)
`compute_metric` devuelve forma **`trend`** — series diarias. El checklist solo
documenta `single` y `table`; nadie usó `trend`. Con eso más una capa de
anotaciones (roadshows, lanzamientos, la sesión del 17-jul, el inicio de la
anomalía de Netherlands) recién se puede atribuir un cambio a una intervención.

### P3 — Métricos de usuarios únicos (habilita el north star)
Crear con `build_metric` las versiones "count of unique users" de: copiar,
descargar, y highlightear. Hoy solo existen como conteo de eventos, y el MKE
necesita usuarios.

### P4 — Denominadores por feature
Cada feature necesita su tasa de adopción, no su conteo. Requiere definir el
denominador correcto por feature (usuarios que la vieron, no usuarios totales).

### P5 — Segmentos
Existe `build_segment`. Hoy solo se usa "Sin DEV". Segmentos útiles: por país/región,
por primera vez vs recurrente, por sector (si está disponible como user property).

---

## 6. Qué cambiaría en el dashboard

| Hoy | Propuesto |
|---|---|
| Titular = penetración 53,1% | Titular = MKE del mes + su tendencia |
| Conteos absolutos por feature | Tasa de adopción con denominador explícito |
| Sección LWA con conteos sueltos | Embudo LWA con la caída visible |
| Narrativa "Signals" escrita a mano | Signals derivados del embudo y las series |
| Un dashboard para todos | Vista ejecutiva (north star + 3 KPIs) y vista de producto (embudos, features) |

El punto de la última fila: hoy el mismo tablero intenta servir a quien presenta en
un comité y a quien decide qué construir. Son dos preguntas distintas con dos
cadencias distintas.

---

## 7. Riesgos y límites conocidos

- **CSAT n=3.** No es un indicador, es una anécdota. Cada respuesta mueve 33 puntos.
  No debería aparecer como número grande hasta tener volumen.
- **`first_time` / `returningUsers` no reconcilian** con el total de usuarios.
  Retirados en `9c5b6b1`. La retención del §3 necesita una fuente que sí particione.
- **Netherlands.** Tres cortes seguidos con participación diluyéndose (11% → 9% → 8%)
  mientras el volumen absoluto casi no se mueve. Patrón de fuente automatizada.
  Cualquier métrico de alcance está inflado hasta que se resuelva.
- **`prompts` y `latency`** siguen sin métrico. La activación del §3 usa prompters
  (usuarios), no prompts (volumen), justamente para no depender de ellos.
- **Cuatro métricos de LWA son baseline**, no desuso: miden features recién
  lanzadas. No leerlos como caída.

---

## 8. Cadencia

| Revisión | Quién | Cuándo | Pregunta |
|---|---|---|---|
| Cierre mensual | Rutina automática | Día 1 | ¿Qué pasó el mes pasado? |
| Revisión de producto | Equipo de producto | Semanal | ¿Dónde se cae el embudo? |
| Revisión de KPIs | Liderazgo | Mensual | ¿Se mueve el north star? |
| Revisión de estrategia | — | Trimestral | ¿Seguimos midiendo lo correcto? |

---

## 9. Próximo paso concreto

Construir el embudo principal (§4) con `build_funnel` y computarlo para julio y
agosto. Es una tarde de trabajo, no requiere tocar el producto, y responde la
primera pregunta real: **de cada 100 personas que entran a KP, ¿cuántas se llevan
algo?**

Si ese número resulta bajo, todo lo demás del plan se justifica solo.
