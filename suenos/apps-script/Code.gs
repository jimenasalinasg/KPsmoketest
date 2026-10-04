/**
 * Recibe los sueños del formulario y los guarda en una hoja de Google Sheets.
 * Las imágenes de referencia van a una carpeta privada de Drive.
 * Instrucciones de despliegue en LEEME.md.
 */

const SHEET_NAME = "Historias";
const FOLDER_NAME = "Archivo de sueños - imágenes";

// Orden de las columnas. "estado" y "notas" son para tu trabajo editorial.
const COLUMNS = [
  "enviado", "anonima", "consentimiento", "correo",
  "quien", "edad", "escena", "dijo",
  "objeto", "ropa", "luz", "sonido", "olor",
  "durante", "despertar", "frase", "imagenes",
  "estado", "notas",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const d = JSON.parse(e.postData.contents);

    if (d.consentimiento !== "si") return json_({ ok: false, error: "sin consentimiento" });

    const sheet = getSheet_();
    const links = (d.imagenes || []).slice(0, 2).map((img, i) => saveImage_(img, i, d.enviado));
    const row = COLUMNS.map(c => {
      if (c === "imagenes") return links.join("\n");
      if (c === "estado") return "nuevo";
      if (c === "notas") return "";
      return clean_(d[c]);
    });
    sheet.appendRow(row);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Evita que un texto que empiece con = + - @ se ejecute como fórmula, y limita el largo.
function clean_(v) {
  v = (v == null ? "" : String(v)).slice(0, 4000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
  }
  return sheet;
}

function getFolder_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty("FOLDER_ID");
  if (id) { try { return DriveApp.getFolderById(id); } catch (_) {} }
  const folder = DriveApp.createFolder(FOLDER_NAME); // privada por defecto
  props.setProperty("FOLDER_ID", folder.getId());
  return folder;
}

function saveImage_(img, i, stamp) {
  const bytes = Utilities.base64Decode(img.base64);
  if (bytes.length > 8 * 1024 * 1024) return "(imagen demasiado grande)";
  const name = String(stamp || new Date().toISOString()).replace(/[:.]/g, "-") + "_" + (i + 1) + ".jpg";
  const file = getFolder_().createFile(Utilities.newBlob(bytes, "image/jpeg", name));
  return file.getUrl();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
