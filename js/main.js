/**
 * Mau Loa · Interacción de la web
 * Módulos: cabecera, menú móvil, pestañas de la carta, carrusel,
 * visor de imagen, pantallas modales de eventos, selector de menús, botón «Menú personalizado»
 * y formulario de reserva por WhatsApp.
 * Sin dependencias. Se carga con `defer`, por lo que el DOM ya está listo.
 */
(() => {
  'use strict';

  const WHATSAPP_NUMBER = '34633554999';
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Cabecera: fondo al hacer scroll (sin listener de scroll) ---------- */
  function initHeader() {
    const header = $('#cabecera');
    const hero = $('#inicio');
    if (!header || !hero || !('IntersectionObserver' in window)) return;

    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:70px;height:1px;width:1px;pointer-events:none';
    sentinel.setAttribute('aria-hidden', 'true');
    hero.prepend(sentinel);

    new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-scrolled', !entry.isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- Menú móvil ---------- */
  function initMobileNav() {
    const toggle = $('.nav-toggle');
    const nav = $('#menu-principal');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  /* ---------- Pestañas de la carta (patrón ARIA tabs) ---------- */
  function initTabs() {
    const tabs = $$('.tabs__tab');
    if (!tabs.length) return;
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));

    const select = (index, focus = false) => {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
      });
      if (focus) tabs[index].focus();
    };

    tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)));
    $('.tabs').addEventListener('keydown', (e) => {
      const current = tabs.indexOf(document.activeElement);
      if (current < 0) return;
      const keys = { ArrowRight: 1, ArrowLeft: -1, Home: -current, End: tabs.length - 1 - current };
      if (!(e.key in keys)) return;
      e.preventDefault();
      select((current + keys[e.key] + tabs.length) % tabs.length, true);
    });

    select(0);
  }

  /* ---------- Base común de <dialog> modal ----------
   * showModal() ya aporta: página de fondo inerte, cierre con Escape y capa superior.
   * Aquí se añade: foco inicial en el botón de cerrar, Tab cíclico dentro del diálogo,
   * cierre con [data-dialog-close] y con clic en el fondo, bloqueo del scroll
   * y devolución del foco al disparador.
   * Devuelve la función que abre el diálogo, o null si el navegador no lo soporta. */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function setupDialog(dialog, onClose) {
    if (!dialog || typeof dialog.showModal !== 'function') return null;
    let opener = null;
    let pressedOnBackdrop = false;

    // Tab y Mayús+Tab recorren solo los controles del diálogo, en bucle
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const items = $$(FOCUSABLE, dialog).filter((el) => el.getClientRects().length);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialog.contains(active))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !dialog.contains(active))) { e.preventDefault(); first.focus(); }
    });

    // Solo cierra si el clic empieza y acaba en el fondo (evita cierres al seleccionar texto)
    dialog.addEventListener('pointerdown', (e) => { pressedOnBackdrop = e.target === dialog; });
    dialog.addEventListener('click', (e) => {
      if ((e.target === dialog && pressedOnBackdrop) || e.target.closest('[data-dialog-close]')) dialog.close();
      pressedOnBackdrop = false;
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('is-locked');
      if (onClose) onClose();
      if (opener && opener.isConnected) opener.focus();
      opener = null;
    });

    return () => {
      if (dialog.open) return;
      opener = document.activeElement;
      dialog.showModal();
      document.body.classList.add('is-locked');
      const initial = $('[autofocus], [data-dialog-close]', dialog);
      if (initial) initial.focus({ preventScroll: true });
    };
  }

  /* ---------- Visor de imagen ---------- */
  function initLightbox() {
    const dialog = $('#lightbox');
    if (!dialog) return null;
    const img = $('.lightbox__img', dialog);
    const open = setupDialog(dialog, () => img.removeAttribute('src'));
    if (!open) return null;

    return (src, alt) => {
      img.src = src;
      img.alt = alt;
      open();
    };
  }

  /* ---------- Pantallas modales de eventos ----------
   * Cualquier botón con data-dialog="id" abre el <dialog class="modal" id="id">.
   * Para otra tarjeta de eventos basta con añadir su botón y su <dialog> en el HTML. */

  // Reduce la variable CSS --fit (1 → 0,6) hasta que el contenido quepa sin scroll.
  // Se mide con offsetHeight, que no incluye las transformaciones de la animación de entrada.
  function fitToScreen(dialog) {
    const panel = $('.modal__panel', dialog);
    if (!panel) return;
    let fit = 1;
    dialog.style.setProperty('--fit', '1');
    while (panel.offsetHeight > dialog.clientHeight && fit > 0.6) {
      fit = Math.round((fit - 0.04) * 100) / 100;
      dialog.style.setProperty('--fit', String(fit));
    }
  }

  function initEventDialogs() {
    const openers = new Map();

    $$('[data-dialog]').forEach((trigger) => {
      const dialog = document.getElementById(trigger.dataset.dialog);
      if (!dialog) return;

      if (!openers.has(dialog)) {
        const triggers = $$(`[data-dialog="${dialog.id}"]`);
        const setExpanded = (value) => triggers.forEach((t) => t.setAttribute('aria-expanded', String(value)));
        const open = setupDialog(dialog, () => setExpanded(false));
        openers.set(dialog, open && (() => {
          open();
          fitToScreen(dialog);
          // Si las fuentes aún cargaban, se vuelve a ajustar con las medidas definitivas
          if (document.fonts) document.fonts.ready.then(() => { if (dialog.open) fitToScreen(dialog); });
          dialog.scrollTop = 0;
          setExpanded(true);
        }));

        let frame = 0;
        window.addEventListener('resize', () => {
          if (!dialog.open) return;
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => fitToScreen(dialog));
        }, { passive: true });
      }

      const open = openers.get(dialog);
      if (!open) return;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', open);
    });
  }

  /* ---------- Carrusel de la galería ---------- */
  function initCarousel(openLightbox) {
    const root = $('.carousel');
    if (!root) return;
    const track = $('.carousel__track', root);
    const slides = $$('.carousel__slide', root);
    const label = $('.carousel__label', root);
    const counter = $('.carousel__counter', root);
    const dotsBox = $('.carousel__dots', root);
    const total = slides.length;
    const labels = slides.map((s) => $('img', s).alt);
    let current = 0;

    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot';
      dot.setAttribute('aria-label', `Ver foto ${i + 1}: ${labels[i]}`);
      dot.addEventListener('click', () => goTo(i));
      dotsBox.append(dot);
      return dot;
    });

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      slides.forEach((slide, i) => {
        const active = i === current;
        slide.inert = !active;
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === current)));
      label.textContent = labels[current];
      counter.textContent = `${current + 1} / ${total}`;
      // Precarga la siguiente imagen para que el cambio sea inmediato
      const next = $('img', slides[(current + 1) % total]);
      if (next.loading === 'lazy') next.loading = 'eager';
    }

    $$('.carousel__arrow', root).forEach((btn) =>
      btn.addEventListener('click', () => goTo(current + Number(btn.dataset.dir)))
    );

    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    });

    // Deslizamiento táctil
    let startX = null;
    root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // Ampliar imagen
    if (openLightbox) {
      $$('.carousel__open', root).forEach((btn, i) =>
        btn.addEventListener('click', () => openLightbox(btn.dataset.full, labels[i]))
      );
    }

    goTo(0);
  }

  /* ---------- Selector de menús (patrón ARIA tabs) ----------
   * En pantallas ≤900px se muestra un menú cada vez (.is-active) para que no haya scroll;
   * se cambia con las pestañas, con las flechas del teclado o deslizando el dedo.
   * En escritorio las pestañas se ocultan por CSS y se ven todos los menús. */
  function initMenuSwitch() {
    $$('.menu-switch').forEach((list) => {
      const tabs = $$('[role="tab"]', list);
      const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
      if (!tabs.length || panels.includes(null)) return;
      let current = 0;

      const select = (index, focus = false) => {
        current = (index + tabs.length) % tabs.length;
        tabs.forEach((tab, i) => {
          const active = i === current;
          tab.setAttribute('aria-selected', String(active));
          tab.tabIndex = active ? 0 : -1;
          panels[i].classList.toggle('is-active', active);
        });
        if (focus) tabs[current].focus();
      };

      tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)));
      list.addEventListener('keydown', (e) => {
        const keys = { ArrowRight: 1, ArrowLeft: -1, Home: -current, End: tabs.length - 1 - current };
        if (!(e.key in keys)) return;
        e.preventDefault();
        select(current + keys[e.key], true);
      });

      // Deslizamiento táctil entre menús
      const area = panels[0].parentElement;
      let startX = null;
      area.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
      area.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        startX = null;
        if (Math.abs(dx) > 50) select(current + (dx < 0 ? 1 : -1));
      }, { passive: true });

      select(0);
    });
  }

  /* ---------- Botón «Menú personalizado» ----------
   * TODO: acción pendiente de definir. Mientras el botón tenga aria-disabled="true"
   * no hace nada. Para activarlo, quitar aria-disabled (y el aviso) en index.html
   * y programar la acción donde indica el comentario. */
  function initCustomMenu() {
    $$('[data-accion="menu-personalizado"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (btn.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
        // Aquí irá la acción del menú personalizado
      });
    });
  }

  /* ---------- Formulario de reserva → WhatsApp ---------- */
  function initBooking() {
    const form = $('#booking-form');
    if (!form) return;
    const area = $('#booking-area');
    const success = $('#booking-success');
    const error = $('#booking-error');
    const date = form.elements.fecha;

    // Impide elegir fechas pasadas (fecha local, no UTC)
    const now = new Date();
    date.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

    const formatDate = (iso) => {
      const [y, m, d] = iso.split('-');
      return `${d}/${m}/${y}`;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = ['nombre', 'fecha', 'hora'].map((n) => form.elements[n]);
      let firstInvalid = null;
      required.forEach((field) => {
        const valid = field.value.trim() !== '' && field.checkValidity();
        field.setAttribute('aria-invalid', String(!valid));
        if (!valid && !firstInvalid) firstInvalid = field;
      });
      error.hidden = !firstInvalid;
      if (firstInvalid) { firstInvalid.focus(); return; }

      const { nombre, fecha, hora, comensales, notas } = form.elements;
      const lines = [
        '¡Hola Mau Loa! Me gustaría reservar una mesa.',
        '',
        `Nombre: ${nombre.value.trim()}`,
        `Fecha: ${formatDate(fecha.value)}`,
        `Hora: ${hora.value}`,
        `Comensales: ${comensales.value}`,
      ];
      if (notas.value.trim()) lines.push(`Notas: ${notas.value.trim()}`);

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
      area.hidden = true;
      success.hidden = false;
      success.focus();
    });

    form.addEventListener('input', (e) => {
      if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) {
        e.target.setAttribute('aria-invalid', 'false');
      }
    });
  }

  /* ---------- Año del pie de página ---------- */
  function initYear() {
    const el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  initHeader();
  initMobileNav();
  initTabs();
  initCarousel(initLightbox());
  initEventDialogs();
  initMenuSwitch();
  initCustomMenu();
  initBooking();
  initYear();
})();
