# GOD DIAMONDS — versión organizada para GitHub

## Estructura

- `index.html`: estructura y contenido de la página.
- `css/style.css`: todos los estilos visuales.
- `js/app.js`: paquetes, selección, formulario, cupones aplicados, resumen y envío de pedidos por WhatsApp.
- `js/cupones.js`: configuración editable de los códigos de influencer y sus porcentajes.
- `js/music.js`: control de la música de fondo.
- `assets/`: banner, QR de Yape, imágenes de paquetes y fondos.
- `god-diamonds.png`, `favicon-48.png`, `favicon.ico`, `apple-touch-icon.png`: icono pequeño de la marca para pestañas, favoritos y dispositivos.

## Cómo probarlo

Abre `index.html` en tu navegador. Para una prueba más fiel, usa la extensión Live Server de Visual Studio Code.

## Cómo subirlo a GitHub

1. Crea un repositorio nuevo en GitHub.
2. Sube el contenido de esta carpeta manteniendo las carpetas `css`, `js` y `assets`.
3. En GitHub Pages, selecciona la rama principal (`main`) y la carpeta raíz (`/root`).
4. Guarda los cambios y espera a que GitHub Pages publique el sitio.

## Icono de la página

El icono pequeño de GOD DIAMONDS ya está incluido y enlazado en `index.html`. Se usa para la pestaña del navegador, favoritos y como favicon que Google puede mostrar junto al resultado de búsqueda. El banner grande de la tienda se conserva sin cambios. Google decide cuándo actualizar y mostrar el favicon; no se puede garantizar que aparezca inmediatamente ni que muestre una miniatura grande en los resultados.

## Cupones de influencers

Los cupones están configurados en `js/cupones.js`:

- `GODSCK`: 10 % de descuento.
- `REDFIRE`: 25 % de descuento.

Para editar un porcentaje, cambia el número de `descuento`. Para desactivar un cupón, cambia `activo: true` por `activo: false`. Puedes agregar otros códigos siguiendo el mismo formato. Los precios se recalculan en el formulario, el resumen, el monto de Yape y el mensaje de WhatsApp.

**Nota:** como el sitio estático se publica en GitHub Pages, los códigos y porcentajes del archivo JavaScript son visibles para los visitantes. La validación no es adecuada para cupones secretos o de un solo uso; para eso se necesita un servidor.

La música de fondo ya está incluida en la raíz del proyecto como `musica-god-diamonds.mp3`. El navegador puede bloquear la reproducción automática; en ese caso, comenzará después del primer clic o toque del visitante. Asegúrate de tener permiso para publicar y utilizar esta canción en tu sitio web.

## Importante

Se eliminó la opción de Pase Booyah Premium. Se conservaron los demás paquetes, precios, banner, iconos, QR, música y datos de contacto del archivo recibido. Revisa los precios comerciales antes de publicar.


## Cupones de influencer
Los cupones se configuran en `js/cupones.js`. El elemento `#couponMessage` de
`index.html` debe permanecer en el documento aunque esté vacío: `js/app.js`
lo utiliza para mostrar mensajes de validación al aplicar un código.
