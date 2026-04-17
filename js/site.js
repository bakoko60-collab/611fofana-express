/* =========================================================
   SITE.JS — Shared Header/Footer injection (GLOBAL)
   ========================================================= */

(function () {
  const header = document.getElementById("siteHeader");
  const footer = document.getElementById("siteFooter");

  const icon = (name) => {
    if (name === "ig") {
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9A3.5 3.5 0 0 0 20 16.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm4.5 4.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2ZM17.7 7.1a.9.9 0 1 1-.9-.9.9.9 0 0 1 .9.9Z"/></svg>`;
    }
    if (name === "tt") {
      return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h2.1c.3 2.4 1.9 4 4.1 4.2V9c-1.7-.1-3.2-.7-4.2-1.8v8.1a6.3 6.3 0 1 1-6.3-6.3c.4 0 .8 0 1.2.1v2.2c-.4-.2-.8-.2-1.2-.2a4.1 4.1 0 1 0 4.1 4.1V3Z"/></svg>`;
    }
    return "";
  };

  const headerHTML = `
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="Fofana Express Hair Braiding home">
        <div class="brand-mark">FB</div>
        <div class="brand-name">Fofana Express Hair Braiding</div>
      </a>

      <nav class="nav" aria-label="Primary">
        <a href="index.html" data-nav="index.html">Home</a>
        <a href="about.html" data-nav="about.html">About</a>
        <a href="gallery.html" data-nav="gallery.html">Galleries</a>
        <a href="contact.html" data-nav="contact.html">Contact</a>
      </nav>

      <div class="header-right">
        <div class="socials" aria-label="Social links">
          <a class="icon-btn"
             href="https://www.instagram.com/fofanaexpresshair/?hl=en"
             target="_blank" rel="noopener"
             aria-label="Instagram">
            <span class="sr-only">Instagram</span>${icon("ig")}
          </a>

          <a class="icon-btn"
             href="https://www.tiktok.com/@fofanaexpressbraiding"
             target="_blank" rel="noopener"
             aria-label="TikTok">
            <span class="sr-only">TikTok</span>${icon("tt")}
          </a>
        </div>
      </div>
    </div>
  `;

  const footerHTML = `
    <div class="container footer-inner">
      <div class="footer-one-line">
        Fofana Express Hair Braiding · © <span id="year"></span> · Harlem, New York
      </div>
    </div>
  `;

  if (header) header.innerHTML = headerHTML;
  if (footer) footer.innerHTML = footerHTML;

  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = (a.getAttribute("data-nav") || "").toLowerCase();
    if (href === path) a.classList.add("is-active");
    if (path === "" && href === "index.html") a.classList.add("is-active");
  });

  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();