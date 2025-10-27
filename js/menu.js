document.addEventListener("DOMContentLoaded", () => {
  // Menú móvil básico (mejorado luego con scroll y cierre automático)
  const btnMenu = document.querySelector(".fa-bars");
  const nav = document.querySelector(".nav");
  if (btnMenu && nav) {
    btnMenu.addEventListener("click", () => {
      const isOpen = nav.style.display === "block";
      nav.style.display = isOpen ? "none" : "block";
    });
  }

  // Modo oscuro/claro con persistencia
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  function setIcon(theme) {
    if (!themeToggle) return;
    const i = themeToggle.querySelector("i");
    if (!i) return;
    if (theme === "light") {
      i.classList.remove("fa-moon");
      i.classList.add("fa-sun");
    } else {
      i.classList.remove("fa-sun");
      i.classList.add("fa-moon");
    }
  }

  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.add("light-theme");
    } else {
      body.classList.remove("light-theme");
    }
    setIcon(theme);
  }

  const storedTheme = localStorage.getItem("theme");
  applyTheme(storedTheme === "light" ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = body.classList.contains("light-theme") ? "dark" : "light";
      localStorage.setItem("theme", next);
      applyTheme(next);
    });
  }

  // WhatsApp y Modal de Turnos
  const waNumber = (document.body.dataset.waNumber || "").replace(/\D/g, "");
  const whatsappLink = document.getElementById("whatsappLink");
  if (whatsappLink && waNumber) {
    const baseMsg = encodeURIComponent(
      "¡Hola! Quisiera hacer una consulta / pedir un turno."
    );
    whatsappLink.href = `https://wa.me/${waNumber}?text=${baseMsg}`;
  }

  const modal = document.getElementById("modal-turno");
  const openBtns = document.querySelectorAll(
    '[data-open-modal="#modal-turno"]'
  );
  const closeEls = document.querySelectorAll("[data-close-modal]");

  function openModal() {
    if (!modal) return;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  openBtns.forEach((b) => b.addEventListener("click", openModal));
  closeEls.forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Formulario de turno
  const turnoForm = document.getElementById("turnoForm");
  const turnoFeedback = document.getElementById("turnoFeedback");
  if (turnoForm) {
    // Fecha mínima hoy
    const fecha = turnoForm.querySelector('input[name="fecha"]');
    if (fecha) {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, "0");
      const d = String(today.getDate()).padStart(2, "0");
      fecha.min = `${y}-${m}-${d}`;
    }

    turnoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(turnoForm);
      const data = Object.fromEntries(fd.entries());
      // Validación simple
      const required = [
        "nombre",
        "email",
        "telefono",
        "mascota",
        "servicio",
        "fecha",
        "hora",
      ];
      const missing = required.filter((k) => !String(data[k] || "").trim());
      if (missing.length) {
        turnoFeedback.textContent =
          "Por favor complete todos los campos requeridos.";
        turnoFeedback.style.color = "#ff7a7a";
        return;
      }
      const msg =
        `Hola! Quiero reservar un turno.%0A%0A` +
        `Nombre: ${encodeURIComponent(data.nombre)}%0A` +
        `Email: ${encodeURIComponent(data.email)}%0A` +
        `Teléfono: ${encodeURIComponent(data.telefono)}%0A` +
        `Mascota: ${encodeURIComponent(data.mascota)}%0A` +
        `Servicio: ${encodeURIComponent(data.servicio)}%0A` +
        `Fecha: ${encodeURIComponent(data.fecha)}%0A` +
        `Hora: ${encodeURIComponent(data.hora)}%0A` +
        `Comentarios: ${encodeURIComponent(data.mensaje || "")}%0A`;

      if (waNumber) {
        const url = `https://wa.me/${waNumber}?text=${msg}`;
        window.open(url, "_blank");
      }
      turnoFeedback.textContent =
        "¡Turno generado! Te contactaremos a la brevedad.";
      turnoFeedback.style.color = "#35d399";
      setTimeout(() => {
        closeModal();
        turnoForm.reset();
      }, 800);
    });
  }

  // Smooth scroll y Scrollspy
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Cerrar menú móvil
        if (window.innerWidth <= 768 && nav) nav.style.display = "none";
      }
    });
  });

  const sections = ["#inicio", "#about", "#services", "#choose", "#contact"]
    .map((sel) => document.querySelector(sel))
    .filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll("header .nav a"));
  const byId = new Map(navLinks.map((a) => [a.getAttribute("href"), a]));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          navLinks.forEach((l) => l.classList.remove("active"));
          const link = byId.get(id);
          if (link) link.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
  );

  sections.forEach((sec) => observer.observe(sec));

  // Reveal animado
  const revealEls = document.querySelectorAll(
    ".circle, .card, .bg_newsletter, .container_about, .container_choose, .title_services"
  );
  const revObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  revealEls.forEach((el) => {
    el.classList.add("reveal");
    revObs.observe(el);
  });

  // Newsletter validación básica
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterFeedback = document.getElementById("newsletterFeedback");
  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!newsletterEmail.checkValidity()) {
        newsletterFeedback.textContent = "Ingrese un email válido.";
        newsletterFeedback.style.color = "#ff7a7a";
        return;
      }
      newsletterFeedback.textContent =
        "¡Gracias por suscribirte! Pronto recibirás novedades.";
      newsletterFeedback.style.color = "#35d399";
      newsletterForm.reset();
    });
  }
});
