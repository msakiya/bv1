const menuBtn = document.querySelector(".menu-btn");
const mobileNav = document.querySelector(".mobile-nav");
if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    const open = mobileNav.hasAttribute("hidden");
    mobileNav.toggleAttribute("hidden", !open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menuBtn.textContent = open ? "Cerrar" : "Menú";
  });
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.hidden = true;
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "Menú";
    });
  });
}

document.querySelectorAll("[data-dorms]").forEach((button) => {
  if (!button.classList.contains("chip")) return;
  button.addEventListener("click", () => {
    const value = button.dataset.dorms;
    document.querySelectorAll(".chip").forEach((chip) => chip.classList.toggle("is-on", chip === button));
    document.querySelectorAll(".units li, .unit-grid li").forEach((row) => {
      row.hidden = value !== "todos" && row.dataset.dorms !== value;
    });
  });
});

document.querySelectorAll("[data-cotizar]").forEach((button) => {
  button.addEventListener("click", () => {
    const tipo = button.dataset.cotizar;
    const message = document.querySelector("#mensaje");
    if (message) {
      message.value = `Quiero cotizar el Tipo ${tipo} de Buenavista 338.`;
    }
    const pick = document.querySelector(".tipo-pick");
    if (pick) {
      pick.hidden = false;
      const name = pick.querySelector(".tipo-name");
      const meta = pick.querySelector(".tipo-meta");
      if (name) name.textContent = `Tipo ${tipo}`;
      if (meta) meta.textContent = `${button.dataset.dormsN} dorm / Área total: ${button.dataset.area} m²`;
      const title = document.querySelector(".form-title");
      const note = document.querySelector(".form-note");
      if (title) title.hidden = true;
      if (note) note.hidden = true;
    }
    document.querySelector("#cotizar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("form.form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    let ok = true;
    form.querySelectorAll("input, textarea").forEach((field) => {
      const value = String(data.get(field.name) || "").trim();
      const bad =
        value.length < (field.name === "mensaje" || field.name === "nombres" || field.name === "apellidos" ? 2 : 1) ||
        (field.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ||
        (field.name === "telefono" && value.replace(/\D/g, "").length < 7);
      field.classList.toggle("is-bad", bad);
      if (bad) ok = false;
    });
    const error = form.querySelector(".form-error");
    const done = form.querySelector(".form-ok");
    if (!ok) {
      if (error) error.hidden = false;
      return;
    }
    if (error) error.hidden = true;
    const text = [
      `Hola, soy ${data.get("nombres")} ${data.get("apellidos")}.`,
      `Quiero cotizar ${form.dataset.project}.`,
      `Teléfono: ${data.get("telefono")}`,
      `Email: ${data.get("email")}`,
      String(data.get("mensaje") || ""),
    ].join("\n");
    window.open(`https://wa.me/51938389931?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    if (done) done.hidden = false;
  });
});

const dock = document.querySelector(".dock");
if (dock && location.hash === "#cotizar") {
  document.querySelector("#cotizar")?.scrollIntoView();
}
if (dock) {
  dock.addEventListener("click", (event) => {
    const href = dock.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
