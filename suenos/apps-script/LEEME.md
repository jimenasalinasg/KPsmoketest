# Conectar el formulario a Google Sheets y Drive

Tarda unos 10 minutos. Hazlo con la cuenta de Google donde quieres guardar las historias.

1. Crea una hoja de cálculo nueva en Google Sheets. Ponle un nombre, por ejemplo "Archivo de sueños".
2. En la hoja, abre **Extensiones → Apps Script**.
3. Borra lo que haya en `Code.gs` y pega el contenido de `Code.gs` de esta carpeta. Guarda.
4. Pulsa **Implementar → Nueva implementación**.
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier persona**. Hace falta para que el formulario pueda enviar, y solo permite escribir. Nadie puede leer la hoja ni la carpeta con esa URL.
5. Google te pedirá autorizar el acceso a Sheets y Drive. Acepta. Si aparece "app no verificada", elige **Avanzado → Ir a (nombre del proyecto)**. Es tu propio script.
6. Copia la **URL de la aplicación web** (termina en `/exec`).
7. En `suenos/index.html`, pega esa URL en la constante `ENDPOINT`:
   `const ENDPOINT = "https://script.google.com/macros/s/.../exec";`
8. Prueba el formulario con un sueño inventado. Debe aparecer una fila nueva en la pestaña **Historias** y, si adjuntas una imagen, una carpeta nueva **Archivo de sueños - imágenes** en tu Drive.

## Si cambias el script
Cada vez que edites `Code.gs`, hay que publicar de nuevo: **Implementar → Administrar implementaciones → editar → Versión nueva → Implementar**. La URL se mantiene.

## Privacidad
- La hoja y la carpeta son privadas. No las compartas por enlace público.
- La columna `anonima` indica `si` o `no`. Por defecto el formulario la envía como `si`.
- La columna `correo` es opcional y solo sirve para avisar a la persona.
- `estado` y `notas` son para ti (por ejemplo: nuevo, elegida, descartada).
