# Mau Loa · Web

Web estática de **Mau Loa** (bar, restaurante y celebraciones · Espartinas, Sevilla).
HTML, CSS y JavaScript sin dependencias ni proceso de compilación.

## Estructura

```
mau-loa-web/
├── index.html            Página única, semántica (header, main, section, footer)
├── css/styles.css        Estilos con variables de diseño y responsive
├── js/main.js            Cabecera, menú móvil, pestañas, carrusel, visor y reservas
├── assets/
│   ├── img/              Imágenes usadas (WebP + JPG de respaldo, versiones de 640 px)
│   ├── icons/            Favicon, icono Apple y PWA
│   └── sin-usar/         Imágenes del proyecto original que la web no utiliza
├── site.webmanifest
├── robots.txt
├── README.md
└── CLAUDE.md         Guía de estilo y reglas para futuras ediciones
```

## Uso en local

Abrir `index.html` en el navegador, o servir la carpeta:

```
python3 -m http.server 8000
```

## Qué incluye

- **SEO:** título y descripción, Open Graph, datos estructurados `Restaurant` (schema.org) con dirección, teléfono y horarios.
- **Rendimiento:** imágenes WebP con `srcset`, carga diferida (`loading="lazy"`), precarga de la portada, dimensiones declaradas para evitar saltos de maquetación. Peso de las fotos servidas reducido de ~2,6 MB a ~0,6 MB (WebP).
- **Accesibilidad:** textos alternativos, enlace «Saltar al contenido», pestañas y carrusel con roles ARIA y teclado (flechas), visor con `<dialog>` nativo (Esc para cerrar), formulario con etiquetas asociadas y validación accesible, respeto a `prefers-reduced-motion`.
- **Responsive:** menú hamburguesa en móvil, rejillas adaptables (escritorio, tableta y móvil).
- **Sin JavaScript:** la carta muestra todas las secciones y la galería se desplaza horizontalmente.

## Pendiente antes de publicar

1. Dominio aún no contratado. Cuando exista: sustituir `DOMINIO` en `index.html` (canonical) y `robots.txt`; convertir `og:image` y la imagen del JSON-LD en URL absolutas.

## Mantenimiento

- **Carta:** se edita directamente en `index.html`, sección `#carta` (un `<li class="menu__item">` por plato).
- **Imágenes nuevas:** nombres en minúsculas, sin espacios ni tildes, separados por guiones (`plato-nuevo.jpg`); añadir versión `.webp`.
- **Colores y tipografías:** variables al inicio de `css/styles.css`.
