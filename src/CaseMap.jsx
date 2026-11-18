// Mapa de la librería de casos: dónde están hoy los usuarios vs. hacia dónde puede crecer la KP.
// Cada punto es un caso real de src/data/caseLibrary.js (se lee su título al pasar el mouse).
import { CASES } from "./data/caseLibrary.js";
import { SURF, BG, BDR, INK, INK2, INK3, BLUE, BLUE_D, RED, T, R, SHADOW } from "./theme.js";

const W = 960, H = 440;
// Curva de "dónde están los usuarios": casi plana.
const users = (x) => 380 - 0.00011 * x * x - 0.04 * x;
// Curva de "lo que la KP podría hacer": despega.
const reach = (x) => 380 - 0.035 * x - 120 * Math.exp((x - 620) / 140);

const path = (f, from, to) => {
  const pts = [];
  for (let x = from; x <= to; x += 6) { const y = f(x); if (y < 20) break; pts.push(`${x},${y.toFixed(1)}`); }
  return `M${pts.join(" L")}`;
};

// x = cuánto le pide la tarea a la KP (buscar → llevarse → producir → razonar y conectar).
const POINTS = [
  { id: "s36", x: 150, curve: "users", label: ["Buscar por código", "de operación"], below: true },
  { id: "s52", x: 330, curve: "users", label: ["Ver la cartera", "de su país"], below: true },
  { id: "s45", x: 530, curve: "users", label: ["Pedir una plantilla", "(TOR en Word)"], below: true },
  { id: "s25", x: 760, curve: "users", label: ["Llevarse una tabla", "a Excel"], below: true },
  { id: "s22", x: 450, curve: "reach", label: ["Trabajar sobre", "su propio TOR"] },
  { id: "s28", x: 560, curve: "reach", label: ["Redactar la lección", "desde la respuesta"] },
  { id: "s34", x: 660, curve: "reach", label: ["Comparar estrategias", "de país"] },
  { id: "s50", x: 708, curve: "reach", label: ["Conectarse a sistemas", "del Banco (ezShare)"] },
];

const titleOf = (id) => CASES.find((c) => c.id === id)?.title ?? id;

export default function CaseMap() {
  const shown = POINTS.filter((p) => CASES.some((c) => c.id === p.id));
  return (
    <section aria-labelledby="kpl-map" style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: R.lg, boxShadow: SHADOW, padding: "16px 18px" }}>
      <h2 id="kpl-map" style={{ fontSize: T.md, fontWeight: 600, color: INK, margin: "0 0 4px" }}>Dónde están hoy los usuarios y hacia dónde puede crecer la KP</h2>
      <p style={{ fontSize: T.sm, color: INK2, lineHeight: 1.5, margin: "0 0 10px", maxWidth: 720 }}>
        Cada punto es un caso de la librería. Hacia la derecha, la tarea le pide más a la KP: de buscar algo puntual a llevárselo, producir con ello y razonar o conectarse con otros sistemas. La mayoría de las sesiones están en la curva azul; los casos rojos ya aparecen, pero son pocos y piden capacidades que la KP todavía no resuelve bien.
      </p>
      <div style={{ overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Dos curvas: los usuarios avanzan despacio en tareas de búsqueda; la capacidad de la KP podría subir rápido hacia redacción, comparación y conexión con sistemas" style={{ width: "100%", minWidth: 640, height: "auto", display: "block", background: BG, borderRadius: R.md }}>
          <path d={path(reach, 20, 760)} fill="none" stroke={INK} strokeWidth="1.6" />
          <path d={path(users, 20, 940)} fill="none" stroke={INK} strokeWidth="1.6" />
          <g>
            <rect x="450" y="36" width="258" height="40" rx="4" fill={SURF} stroke={INK} />
            <text x="579" y="62" textAnchor="middle" fontSize="19" fontWeight="700" fill={INK}>Lo que la KP podría hacer</text>
          </g>
          <g>
            <rect x="770" y="200" width="176" height="40" rx="4" fill={SURF} stroke={INK} />
            <text x="858" y="226" textAnchor="middle" fontSize="19" fontWeight="700" fill={INK}>Dónde están hoy</text>
          </g>
          {shown.map((p) => {
            const y = (p.curve === "users" ? users : reach)(p.x);
            const fill = p.curve === "users" ? BLUE : RED;
            const lx = p.curve === "users" ? p.x : p.x - 14;
            const anchor = p.curve === "users" ? "middle" : "end";
            const ly = p.below ? y + 28 : y - 22;
            return (
              <g key={p.id}>
                <title>{`${p.id} · ${titleOf(p.id)}`}</title>
                <circle cx={p.x} cy={y} r="8" fill={fill} stroke={INK} strokeWidth="1.2" />
                <text x={lx} y={ly} textAnchor={anchor} fontSize="14" fill={INK}>
                  {p.label.map((l, i) => <tspan key={i} x={lx} dy={i ? 17 : 0}>{l}</tspan>)}
                </text>
                <text x={lx} y={ly + (p.below ? 34 : -18)} textAnchor={anchor} fontSize="11" fill={INK3}>{p.id}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: T.xs, color: INK2, marginTop: 10 }}>
        <span><span aria-hidden="true" style={{ display: "inline-block", width: 10, height: 10, borderRadius: R.pill, background: BLUE, marginRight: 6 }} />Lo que ya hacen la mayoría: buscar y llevarse</span>
        <span><span aria-hidden="true" style={{ display: "inline-block", width: 10, height: 10, borderRadius: R.pill, background: RED, marginRight: 6 }} />Lo que piden pocos, y la KP aún no resuelve bien</span>
        <span style={{ color: INK3 }}>Pasa el mouse sobre un punto para leer el caso. Las curvas muestran la forma, no una medición.</span>
      </div>
    </section>
  );
}
