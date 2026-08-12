# Soundify (Frontend)

Clon visual simple inspirado en la interfaz de Spotify. Proyecto frontend educativo con HTML, CSS y JavaScript.

Estructura del proyecto

- `index.html` — Página principal (feed)
- `explorar.html` — Página de búsqueda y géneros
- `contacto.html` — Formulario de inicio de sesión / registro (estático)
- `css/styles.css` — Estilos (mobile-first, responsive)
- `js/player.js` — Lógica del reproductor de audio (play/pause, progreso, volumen)
- `img/` — Recursos locales (logo, portadas y SVGs)

Cómo ejecutar (rápido)

Usa un servidor estático simple en el directorio del proyecto:

```bash
# con Python 3
python -m http.server 8000

# o con Node.js (http-server)
npx http-server -c-1
```

Luego abre `http://localhost:8000` en tu navegador.

Notas importantes

- `js/player.js` controla el elemento `<audio id="audioPlayer">` y enlaza las tarjetas con los archivos remotos de ejemplo.
- Las imágenes de ejemplo provienen de Unsplash (URLs públicas) y algunas imágenes locales están en `img/`.
- El diseño es mobile-first; la hoja de estilos incluye puntos de quiebre para tablets y escritorio.

Contribuciones y sugerencias

- Si quieres mejorar el proyecto, crea una rama y abre un pull request con cambios pequeños (HTML limpio, accesibilidad, mejoras en CSS o en `player.js`).

Licencia

- Código y assets: uso educativo. Añade una licencia si vas a compartir públicamente.
