/* =====================================================
   GALLERY.JS — Shared gallery system
   Supports:
   - gallery.html
   - categories.html
   IMPORTANT:
   - No body/document scroll locking
   - Categories page must remain normally scrollable
   ===================================================== */

(() => {
  const CATEGORIES = [
    { key: "boxbraids", label: "Box Braids" },
    { key: "cornrows",  label: "Cornrows" },
    { key: "kids",      label: "Kids" },
    { key: "knotless",  label: "Knotless" },
    { key: "men",       label: "Men" },
    { key: "twists",    label: "Twists" },
  ];

  const STARTING_PRICES = {
    knotless: "From $200–$500",
    boxbraids: "From $200–$500",
    twists: "From $200–$500",
    cornrows: "From $180–$300",
    kids: "From $100–$200",
    men: "From $80–$160",
  };

  const BOOKING_NOTES = [
    "Bring a reference photo if you have one.",
    "Wash & blow-dry recommended before appointment.",
    "Exact price depends on length & size — call/text to confirm.",
  ];

  const LOCATION_LABEL = "Harlem, NYC";
  const MAIN_PHONE_TEL = "tel:6463995042";

  const ROOT = "images/gallery";
  const CATEGORY_PAGE = "categories.html";

  const byId = (id) => document.getElementById(id);
  const pad2 = (n) => String(n).padStart(2, "0");
  const getParam = (name) => new URL(window.location.href).searchParams.get(name);

  const braiderCache = new Map();

  /* -----------------------------------------------------
     Safety reset:
     if any earlier version left the page scroll-locked,
     clear it immediately on load.
     ----------------------------------------------------- */
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";

  async function fileExists(url) {
    try {
      const res = await fetch(url, { method: "HEAD", cache: "no-store" });
      return res.ok;
    } catch {
      return false;
    }
  }

  function normalizeBraiderText(raw) {
    const text = (raw || "").trim();
    if (!text) return "";
    const parts = text.split(":");
    if (parts.length >= 2) return parts.slice(1).join(":").trim();
    return text;
  }

  async function getBraider(catKey, num2) {
    const cacheKey = `${catKey}/${num2}`;
    if (braiderCache.has(cacheKey)) return braiderCache.get(cacheKey);

    const txtUrl = `${ROOT}/${catKey}/${num2}.txt`;

    try {
      const res = await fetch(txtUrl, { cache: "no-store" });
      if (!res.ok) {
        braiderCache.set(cacheKey, "");
        return "";
      }
      const value = normalizeBraiderText(await res.text());
      braiderCache.set(cacheKey, value);
      return value;
    } catch {
      braiderCache.set(cacheKey, "");
      return "";
    }
  }

  function initGalleryLanding() {
    const grid = byId("galleryGrid");
    if (!grid) return;

    grid.innerHTML = "";

    for (const cat of CATEGORIES) {
      const card = document.createElement("a");
      card.className = "cat-card";
      card.href = `${CATEGORY_PAGE}?cat=${cat.key}`;

      const img = document.createElement("img");
      img.src = `${ROOT}/${cat.key}/01.jpg`;
      img.alt = cat.label;
      img.onerror = () => img.removeAttribute("src");

      const label = document.createElement("div");
      label.className = "cat-label";
      label.textContent = cat.label;

      card.appendChild(img);
      card.appendChild(label);
      grid.appendChild(card);
    }
  }

  async function initCategoryPage() {
    const grid = byId("catGrid");
    const title = byId("catTitle");
    const lead = byId("catLead");
    const empty = byId("catEmpty");

    if (!grid) return;

    const catKey = (getParam("cat") || "").toLowerCase().trim();
    const found = CATEGORIES.find((c) => c.key === catKey);

    grid.innerHTML = "";
    if (empty) empty.hidden = true;

    if (!catKey || !found) {
      if (title) title.textContent = "Category not found";
      if (lead) lead.textContent = "Please go back and choose a valid gallery category.";
      if (empty) {
        empty.textContent = "No images found for this category.";
        empty.hidden = false;
      }
      return;
    }

    if (title) title.textContent = found.label;
    if (lead) lead.textContent = "Tap any image to enlarge.";

    const lightbox = createModal(catKey, found.label);

    let i = 1;
    let loadedAny = false;

    while (true) {
      const num2 = pad2(i);
      const jpgUrl = `${ROOT}/${catKey}/${num2}.jpg`;

      const ok = await fileExists(jpgUrl);
      if (!ok) break;

      loadedAny = true;

      const card = document.createElement("button");
      card.type = "button";
      card.className = "photo-card";
      card.setAttribute("aria-label", `Open ${found.label} photo ${num2}`);

      const img = document.createElement("img");
      img.src = jpgUrl;
      img.alt = `${found.label} ${num2}`;

      card.appendChild(img);

      card.addEventListener("click", async () => {
        await lightbox.open(jpgUrl, num2);
      });

      grid.appendChild(card);
      i++;
    }

    if (!loadedAny && empty) {
      empty.textContent = "No photos yet. Add 01.jpg to this folder to begin.";
      empty.hidden = false;
    }
  }

  function createModal(catKey, label) {
    const modal = document.createElement("div");
    modal.className = "lb";

    modal.innerHTML = `
      <div class="lb-inner" role="dialog" aria-modal="true" aria-label="${label} photo preview">
        <div class="lb-layout">
          <div class="lb-media">
            <img class="lb-img" alt="Preview">
          </div>

          <div class="lb-info">
            <div class="lb-head">
              <h2 class="lb-h2">${label}</h2>
              <div class="lb-photo" id="lbPhoto">Photo #—</div>
            </div>

            <div class="lb-rows">
              <div class="lb-row">
                <span>Price</span>
                <span>${STARTING_PRICES[catKey] || "Call for price"}</span>
              </div>
              <div class="lb-row">
                <span>Braider</span>
                <span id="lbBraider">Assigned stylist</span>
              </div>
              <div class="lb-row">
                <span>Location</span>
                <span>${LOCATION_LABEL}</span>
              </div>
            </div>

            <div class="lb-notes">
              <div class="lb-notes-title">Booking notes</div>
              <ul class="lb-notes-list">
                ${BOOKING_NOTES.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>

            <a class="lb-big-btn" href="${MAIN_PHONE_TEL}">Book This Style</a>

            <div class="lb-phones">
              Call/Text (646) 399-5042<br>
              Secondary: (646) 648-4213
            </div>

            <button class="lb-close" type="button">Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const img = modal.querySelector(".lb-img");
    const photoEl = modal.querySelector("#lbPhoto");
    const braiderEl = modal.querySelector("#lbBraider");
    const closeBtn = modal.querySelector(".lb-close");

    function closeModal() {
      modal.classList.remove("is-open");
    }

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });

    return {
      async open(jpgUrl, num2) {
        img.src = jpgUrl;
        photoEl.textContent = `Photo #${num2}`;

        const braider = await getBraider(catKey, num2);
        braiderEl.textContent = braider || "Assigned stylist";

        modal.classList.add("is-open");
      }
    };
  }

  initGalleryLanding();
  initCategoryPage();
})();