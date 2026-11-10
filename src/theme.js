// Tokens de color de smoketest. Fuente unica: los usan src/App.jsx y las vistas en archivos propios.
// Ningun color literal fuera de este archivo (KP Wrapped tiene su propia paleta editorial en KPWrapped.jsx).
//
// Contraste WCAG 2.1 AA verificado el 9-nov-2026 (texto normal >= 4.5:1):
//   INK3 sobre SURF 5.9 · BG 5.5 · BLUE_L 5.2      BLUE sobre SURF 5.6 · BLUE_L 5.0 · blanco sobre BLUE 5.6
//   BLUE_D sobre BLUE_L 6.3 · BLUE_M 4.9            GREEN sobre GREEN_L 5.0 · RED sobre RED_L 5.2 · AMBER sobre AMBER_L 5.6
//   ON_DARK_2 sobre NAVY 12.1 · BLUE_DEEP 4.8 · INK 12.7
// No hay dark mode: el dashboard es solo claro, asi que cada token tiene un unico valor.

// Superficies y texto
export const BG = "#f7f8fb";
export const SURF = "#ffffff";
export const BDR = "#e4e7f2";
export const BDR_2 = "#cbd5e1";
export const INK = "#1a1e2e";
export const INK2 = "#3d4460";
export const INK3 = "#5c6386";       // texto secundario y labels (antes #8b93b8: 3.0:1, no pasaba AA)
export const ON_ACCENT = "#ffffff";  // texto sobre BLUE, GREEN, RED, NAVY, BLUE_DEEP
export const ON_DARK = "#e8edf5";    // texto principal sobre fondos oscuros
export const ON_DARK_2 = "#d3e3f3";  // texto secundario sobre fondos oscuros (antes #a8c4e0 / #8fa9c4 / #c8d8ea)

// Azules
export const BLUE = "#2667bd";       // acento y texto de enlace (antes #4a90e2: 3.3:1)
export const BLUE_D = "#1f5a96";     // texto azul sobre BLUE_L / BLUE_M
export const BLUE_L = "#eaf2fc";
export const BLUE_M = "#c2d9f7";
export const BLUE_PALE = "#c7ddf0";  // barras de comparacion (no texto)
export const BLUE_SOFT = "#7ab3e0";  // relleno de barras de nivel bajo (no texto sobre claro)
export const BLUE_SOFT_2 = "#9ec4e8";
export const BLUE_DEEP = "#1464A0";  // barras de nivel alto y bloques destacados
export const NAVY = "#0A2342";       // bloque de totales acumulados
export const NAVY_2 = "#0C447C";

// Estados (texto sobre su fondo _L pasa AA)
export const GREEN = "#157a43";
export const GREEN_L = "#edfaf4";
export const GREEN_M = "#a7f3d0";
export const GREEN_INK = "#065f46";
export const GREEN_2 = "#3d8f6e";
export const RED = "#b8392a";
export const RED_L = "#fef0ee";
export const RED_M = "#fca5a5";      // solo bordes
export const RED_M_2 = "#fecaca";    // solo bordes
export const RED_INK = "#7f1d1d";
export const RED_INK_2 = "#991b1b";
export const AMBER = "#9a5300";
export const AMBER_L = "#fffbeb";
export const AMBER_M = "#fde68a";
export const AMBER_PALE = "#f5c58a";
export const AMBER_INK = "#92400e";

// Categorias (bordes de tarjetas de señales; no texto)
export const PURPLE = "#6a4bb3";
export const PURPLE_L = "#9b7cc7";
export const BROWN = "#b06e2f";

// ── Mini design system: tipografía, escala y radios (compartidos por todas las pestañas salvo KP Wrapped) ──
export const FONT = "'Inter Tight', system-ui, -apple-system, 'Segoe UI', sans-serif"; // texto de lectura y UI
export const FONT_MONO = "'DM Mono', ui-monospace, monospace";                          // solo cifras/código puntuales
// Escala tipográfica (px). Mínimo legible 11.
export const T = { micro: 11, xs: 12, sm: 13, md: 14, base: 15, lg: 16, xl: 18, h3: 20, h2: 22, h1: 26, kpi: 28, display: 34 };
// Radios: chip (pastilla), sm (badges), md (controles), lg (tarjetas/paneles)
export const R = { sm: 4, md: 8, lg: 10, pill: 99 };
export const PAGE_W = 1000;                                                  // ancho máximo de contenido en todas las pestañas
