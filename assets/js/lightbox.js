// Lightbox for .photo-grid images: click a thumbnail to open it full-screen,
// then click through the rest of that page's gallery via arrows, the
// keyboard, or the on-screen prev/next buttons. No-ops on pages with no
// .photo-grid, so it's safe to include everywhere.
document.addEventListener("DOMContentLoaded", function () {
  var grids = document.querySelectorAll(".photo-grid");
  if (!grids.length) return;

  var items = [];
  grids.forEach(function (grid) {
    grid.querySelectorAll("figure").forEach(function (figure) {
      var img = figure.querySelector("img");
      if (!img) return;
      var captionEl = figure.querySelector("figcaption");
      var index = items.length;
      items.push({
        src: img.getAttribute("src"),
        alt: img.getAttribute("alt") || "",
        caption: captionEl ? captionEl.textContent : ""
      });
      img.addEventListener("click", function () {
        openLightbox(index);
      });
    });
  });

  var overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lightbox-prev" aria-label="Previous">&#8249;</button>' +
    '<button type="button" class="lightbox-next" aria-label="Next">&#8250;</button>' +
    '<figure class="lightbox-figure">' +
      '<img class="lightbox-image" alt="">' +
      '<figcaption class="lightbox-caption"></figcaption>' +
    "</figure>";
  document.body.appendChild(overlay);

  var imageEl = overlay.querySelector(".lightbox-image");
  var captionEl = overlay.querySelector(".lightbox-caption");
  var closeBtn = overlay.querySelector(".lightbox-close");
  var prevBtn = overlay.querySelector(".lightbox-prev");
  var nextBtn = overlay.querySelector(".lightbox-next");
  var currentIndex = 0;
  var lastFocused = null;

  function renderItem(index) {
    currentIndex = (index + items.length) % items.length;
    var item = items[currentIndex];
    imageEl.src = item.src;
    imageEl.alt = item.alt;
    captionEl.textContent = item.caption;
  }

  function openLightbox(index) {
    lastFocused = document.activeElement;
    renderItem(index);
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", function () { renderItem(currentIndex - 1); });
  nextBtn.addEventListener("click", function () { renderItem(currentIndex + 1); });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") renderItem(currentIndex - 1);
    if (e.key === "ArrowRight") renderItem(currentIndex + 1);
  });
});
