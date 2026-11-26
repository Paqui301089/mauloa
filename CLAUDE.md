# CLAUDE.md · Web de Mau Loa

Guía obligatoria para cualquier edición de esta web. Léela entera antes de tocar un archivo.

## 1. Qué es

Web de una sola página de **Mau Loa** («Por siempre»), bar, restaurante y celebraciones en Espartinas (Sevilla).
HTML, CSS y JavaScript puros: **sin frameworks, sin dependencias y sin proceso de compilación**. No añadir React, jQuery, Tailwind, Bootstrap, librerías de carrusel ni similares.

Origen: es la reescritura limpia de `../Mau loa/index.html` / `../Mau loa/Mau Loa.dc.html` (prototipo que dependía de `support.js` + React). Esos archivos originales se conservan sin modificar y **no** son la versión de trabajo; la fuente de verdad es esta carpeta.

## 2. Reglas obligatorias

1. **Mantener el estilo actual:** elegante, oscuro con secciones claras alternas, mucho aire, tipografía fina y detalles en dorado. Nada de bordes redondeados (`border-radius: 0`), sombras llamativas, degradados de colores nuevos ni iconos rellenos.
2. **Solo las tres fuentes definidas** (sección 4). No añadir otras.
3. **Solo la paleta definida** (sección 3). Usar siempre las variables `var(--c-…)`; no escribir hex nuevos en el CSS. Si hiciera falta un color nuevo, se añade primero como variable en `:root` y se justifica.
4. **No inventar datos del restaurante** (precios, platos, horarios, teléfonos, direcciones, redes). Si falta un dato, dejar un `TODO` y preguntar.
5. **Nada de estilos en línea** (`style="…"`) ni `<style>` en el HTML. Todo va en `css/styles.css`; todo el comportamiento en `js/main.js`.
6. **Accesibilidad y SEO no se rompen:** toda imagen con `alt` (o `alt=""` si es decorativa), `width`/`height` declarados, un solo `<h1>`, jerarquía de títulos correcta, foco visible, controles con `aria-label` cuando no tienen texto.
7. **Todo cambio de contenido** (horarios, teléfono, dirección, redes) se replica en el **JSON-LD** del `<head>` y en el pie de página.
8. Idioma del contenido: español de España. Precios con coma decimal y espacio antes del euro: `12,00 €`.

## 3. Paleta de colores (`:root` en `css/styles.css`)

| Variable | Hex | Uso |
|---|---|---|
| `--c-gold` | `#c9956a` | Color de marca: acentos, botones, precios, títulos pequeños, líneas divisorias |
| `--c-gold-light` | `#e0ac7e` | Hover del botón principal |
| `--c-ink` | `#0a0305` | Fondo base, texto sobre botón dorado |
| `--c-ink-deep` | `#050203` | Fondo del pie de página |
| `--c-night` | `#0d0507` | Fondo de secciones oscuras (Carta, Contacto) |
| `--c-wine` | `#160810` | Fondo de Eventos |
| `--c-wine-dark` | `#1e0c0e` | Títulos sobre fondo claro, diapositiva de marca |
| `--c-cream` | `#f5f0e8` | Texto sobre oscuro; fondo de Nosotros y Reservas |
| `--c-sand` | `#f2ece4` | Fondo de Galería |
| `--c-brown` | `#5c3a3c` | Texto de párrafo sobre fondo claro |
| `--c-muted` | `#8c6060` | Etiquetas secundarias sobre fondo claro |
| `--c-white` | `#fff` | Fondo del formulario |

Transparencias derivadas: `--gold-a10/15/30/55` (dorado al 10/15/30/55 %) y `--cream-a45/60/75` (crema al 45/60/75 %). El texto secundario sobre oscuro es siempre crema con opacidad, nunca gris.

Alternancia de fondos de sección (respetarla si se añade una sección nueva):
Portada (foto) → Nosotros `cream` → Carta `night` → Galería `sand` → Eventos `wine` → Reservas `cream` → Contacto `night` → Pie `ink-deep`.

## 4. Tipografía

Cargadas desde Google Fonts con `display=swap`:

| Variable | Fuente | Uso |
|---|---|---|
| `--f-serif` | **Cormorant Garamond** (300, 400, 500, cursiva 300) | Títulos, nombre de marca, nombres de platos, precios, cifras |
| `--f-script` | **Great Vibes** | Solo el lema «Por siempre» |
| `--f-sans` | **Lato** (300, 400, 700) | Texto de cuerpo, menú, botones, formularios, etiquetas |

Escala y estilo establecidos:
- `h1` portada: serif 300, `clamp(52px, 10vw, 96px)`, mayúsculas, `letter-spacing: 10px`.
- Títulos de sección `.section-title`: serif 300, 60px (46px ≤900px, 40px ≤600px).
- Antetítulo `.eyebrow`: sans 700, 10px, mayúsculas, `letter-spacing: 5px`, dorado.
- Botones y navegación: sans, 11px, mayúsculas, `letter-spacing` 2,5–3px.
- Párrafos: sans 300, 14–15px, `line-height` 1,85–1,9.
- Los títulos usan peso **300** (fino); el énfasis se hace con `<em>` en cursiva, no con negrita.

## 5. Medidas y componentes

- Contenedor: `--container: 1200px`; estrecho 860px (Carta), formulario 760px.
- Márgenes laterales `--gutter`: 60px → 40px (≤1100px) → 24px (≤900px).
- Espaciado vertical de sección `--section-y`: 110px (80px ≤900px).
- Altura de cabecera `--header-h`: 80px (72px ≤900px).
- Puntos de corte: **1100px, 900px, 600px**. Diseño pensado primero para escritorio con reglas `max-width`.
- Transición estándar `--t-fast: 0.25s`; curva `--ease-out`.

Componentes reutilizables (usar estas clases, no crear variantes nuevas sin necesidad):
- Cabecera de sección: `.section-head` > `.eyebrow` + `.section-title` + `.divider` (línea dorada 48×1px) [+ `.section-lead`].
- Botones: `.btn` + `.btn--primary` (dorado macizo) o `.btn--outline` (borde dorado); modificadores `--sm`, `--block`, `--icon`.
- Pantalla modal: `<dialog class="modal">` a pantalla completa, con fondo `wine`, marco dorado fino y animación de entrada escalonada. Estructura: `.modal__panel` > `.modal__bar` (marca `.brand--modal` + botón `.modal__close` «Cerrar ×») + `.modal__body` (`.modal__head`, `.menu-switch`, `.set-menus`, `.modal__actions`, `.modal__note`). Se abre con cualquier botón `data-dialog="id-del-dialog"` y se cierra con `[data-dialog-close]` o Escape.
- **Sin scroll:** las medidas internas usan `calc(clamp(…vh…) * var(--fit))`. Al abrir y al redimensionar, `fitToScreen()` en `js/main.js` reduce `--fit` de 1 a 0,6 hasta que todo cabe. Los textos tienen tamaño mínimo legible (`max(12px, …)`). Si se añaden elementos al modal, usar el mismo patrón para sus medidas verticales. Solo en pantallas por debajo de unos 600px de alto puede aparecer scroll como último recurso.
- Selector de menús `.menu-switch` (patrón ARIA tabs, `role="tab"` → `aria-controls` del `<article>`): solo se ve ≤900px, donde se muestra un menú cada vez (`.is-active`). Los menús se apilan en la misma celda para que la altura no cambie, y se cambian con las pestañas, con las flechas del teclado o deslizando el dedo. ≤600px y ≤700px de alto se oculta el antetítulo.
- Menú cerrado de eventos: `.set-menus` (rejilla de 3, una columna ≤900px) > `.set-menu` (`--pending` + `.set-menu__soon` para un menú aún sin datos, «Próximamente»).
- Acciones del modal: `.modal__actions` (botón centrado, a ancho completo ≤600px) + `.modal__hint` (aviso discreto). Un `.btn` con `aria-disabled="true"` se muestra atenuado y sin hover.
- Iconos: SVG en línea de trazo (`stroke-width: 1.5`, sin relleno), con `aria-hidden="true"`.
- Nomenclatura CSS: **BEM** (`bloque__elemento--modificador`). Estados con `.is-…` (`is-scrolled`, `is-open`, `is-locked`).

## 6. Estructura de la página (`index.html`)

| Ancla | Sección | Contenido |
|---|---|---|
| `#cabecera` | Cabecera fija | Logo corona + «Mau Loa / Por siempre», menú y botón «Reservar»; menú hamburguesa en móvil; fondo oscuro al hacer scroll |
| `#inicio` | Portada | Foto del salón, «Espartinas · Sevilla», `h1` Mau Loa, lema, «Bar · Restaurante · Celebraciones», botones Carta / Reservar |
| `#nosotros` | Quiénes somos | Dos párrafos, cifras «100 % Casero» y «Sevilla · Tradición», foto del salón |
| `#carta` | Carta | 4 pestañas: Para abrir el apetito · Del huerto a tu mesa · Para compartir o no · Al fuego. Nota de alérgenos e IVA |
| `#galeria` | Galería | Carrusel de 8 fotos con flechas, puntos, contador, gesto táctil, teclado y visor ampliado |
| `#eventos` | Eventos y celebraciones | 4 tarjetas (I–IV) y bloque «¿Tienes un evento especial?» con enlace a WhatsApp. La tarjeta III (Eventos corporativos) abre la ventana de menús |
| `#reservas` | Reservas | Formulario (nombre, comensales, fecha, hora, notas) que abre WhatsApp con el mensaje; enlaces a teléfono y WhatsApp |
| `#contacto` | Contacto | Dirección, teléfono, horarios, redes, mapa de Google |
| — | Pie | Logo, enlaces de sección, datos y «Hecho con amor en Andalucía» |
| `#menus-corporativos` | Menús de eventos corporativos | `<dialog class="modal">` con los Menús 1 (39,00 €), 2 (42,00 €) y 3 (43,00 €) y el botón «Menú personalizado» (desactivado, acción pendiente) |
| `#lightbox` | Visor | `<dialog>` nativo para ampliar fotos |

Datos del restaurante vigentes:
- Dirección: C/ Mártires de la Iglesia, 41807 Espartinas, Sevilla.
- Teléfono y WhatsApp: 633 55 49 99 (`+34633554999`). El número de WhatsApp está en la constante `WHATSAPP_NUMBER` de `js/main.js` y en los enlaces `wa.me`.
- Horario: L–M 08:30–13:00 · 20:30–00:00; X–V 08:30–16:00 · 20:30–00:00; S–D 09:00–16:00 · 20:30–00:00.
- Instagram: https://www.instagram.com/mau_loa_1023/ (@mau_loa_1023).
- Facebook: https://www.facebook.com/share/1GJgmVsUgK/

## 7. Cómo editar

- **Plato nuevo:** añadir en el panel correcto de `#carta`:
  `<li class="menu__item"><div><p class="menu__name">Nombre</p><p class="menu__desc">Descripción</p></div><p class="menu__price">0,00 €</p></li>`
  (omitir `menu__desc` si no hay descripción; varios formatos: `Tapa 3,50 € · Ración 9,00 €`).
- **Foto nueva en la galería:** copiar un `<li class="carousel__slide">` existente; usar `carousel__slide--contain` para fotos verticales. Los puntos, el contador y la etiqueta se generan solos a partir del `alt`. Actualizar los `aria-label` «N de 8».
- **Menú de evento:** editar el `<article class="set-menu">` correspondiente dentro de `#menus-corporativos` (comentario guía en el HTML). Estructura: `<article class="set-menu" id="menu-corp-N-card" role="tabpanel" aria-labelledby="menu-corp-N">` > `.set-menu__title` (Menú + número; en móvil solo para lectores de pantalla) → un `<section class="set-menu__course">` por tiempo (`h4.set-menu__course-title` + `ul.set-menu__dishes`) → `footer.set-menu__foot` con `.set-menu__price` (`39,00 €`) y `.set-menu__note` (qué incluye). Los menús no llevan botón propio. Para añadir uno, copiar un `<article>` completo con sus `id` propios y añadir su pestaña en `.menu-switch`. Los textos de los platos se copian literalmente de la carta del restaurante (p. ej. «Carrillá», «siracha»).
- **Botón «Menú personalizado»:** `<button data-accion="menu-personalizado" aria-disabled="true">` en `.modal__actions`, con el aviso «Próximamente» (`#menu-personalizado-aviso`). Para activarlo: quitar `aria-disabled` y `aria-describedby`, borrar el aviso y programar la acción en `initCustomMenu()` de `js/main.js` (marcado con `TODO`).
- **Modal en otra tarjeta de eventos:** añadir `event-card--action` al `<li>`, envolver el título en `<button type="button" class="event-card__trigger" data-dialog="ID" aria-haspopup="dialog" aria-controls="ID">`, añadir `<span class="event-card__more" aria-hidden="true">Ver menús</span>` y crear un `<dialog class="modal" id="ID" aria-labelledby="…">` copiando `#menus-corporativos` (cambiar todos los `id`). No hace falta tocar el JavaScript: apertura, ajuste a pantalla y selector de menús se activan solos.
- **JavaScript:** un módulo `init…()` por funcionalidad dentro de la IIFE de `js/main.js`, sin variables globales, eventos táctiles `passive`. Todo `<dialog>` nuevo usa `setupDialog()` (foco, Tab cíclico, cierre y bloqueo de scroll).

## 8. Archivos e imágenes

```
mau-loa-web/
├── index.html · css/styles.css · js/main.js
├── assets/img/       imágenes en uso
├── assets/icons/     favicon e iconos
├── assets/sin-usar/  imágenes disponibles no utilizadas
├── site.webmanifest · robots.txt · README.md · CLAUDE.md
```

- Nombres en **minúsculas, sin espacios ni tildes, separados por guiones** (`ensaladilla-gambas-ajillo.jpg`). Nunca `.jfif`; la extensión debe coincidir con el formato real.
- Cada foto se entrega como `nombre.jpg` (respaldo, calidad 80, progresivo) + `nombre.webp` (calidad 78) + `nombre-640.webp` si mide más de 700px de ancho; ancho máximo 1600px.
- En el HTML siempre con `<picture>` (WebP + JPG), `width`/`height` reales, `loading="lazy"` y `decoding="async"` salvo la imagen de portada.
- Los originales del proyecto (`../Mau loa/assets`, `../Mau loa/uploads`) no se modifican.

## 9. Pendiente

- **Dominio (aún no contratado):** cuando exista, completar el `canonical` (comentado), `og:url`, `og:image` y la imagen del JSON-LD con URL absolutas, y el `Sitemap` de `robots.txt`. Buscar los marcadores `TODO` y `DOMINIO`.
- **Carta:** el contenido actual es provisional; no modificarlo salvo petición expresa.
- **Menú personalizado:** falta definir qué hace el botón (buscar `TODO` en `index.html` y `js/main.js`).
- **Eventos:** las tarjetas I, II y IV aún no abren ventana.
