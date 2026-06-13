const flushMapSlot = document.querySelector(".flush-map-slot");
const optionalCutout = new Image();

optionalCutout.className = "map-cutout";
optionalCutout.alt = "";
optionalCutout.setAttribute("aria-hidden", "true");
optionalCutout.addEventListener("load", () => {
  flushMapSlot?.append(optionalCutout);
});
optionalCutout.src = "/assets/old-testament-cutout.png";

function observePanUp(item) {
  if (!item || !observer) return;
  observer.observe(item);
}

const animatedItems = document.querySelectorAll(
  ".main-infographic, .graphic-text, .floating-graphic, .ot-library .eyebrow, .ot-library h2, .floating-item"
);

animatedItems.forEach((item) => {
  item.classList.add("pan-up");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.18 }
);

animatedItems.forEach((item) => observer.observe(item));

const lightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");

function attachLightbox(image) {
  image.addEventListener("click", () => {
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "";
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  });
}

document.querySelectorAll(".js-lightbox-image").forEach(attachLightbox);

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.classList.remove("lightbox-open");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("active")) {
    lightbox.click();
  }
});
