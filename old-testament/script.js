const flushMapSlot = document.querySelector(".flush-map-slot");
const optionalCutout = new Image();

optionalCutout.className = "map-cutout";
optionalCutout.alt = "";
optionalCutout.setAttribute("aria-hidden", "true");
optionalCutout.addEventListener("load", () => {
  flushMapSlot?.append(optionalCutout);
});
optionalCutout.src = "/assets/old-testament-cutout.png";

document.querySelectorAll(".optional-graphic").forEach((figure) => {
  const source = figure.dataset.optionalSrc;
  const alt = figure.dataset.optionalAlt || "";
  const image = new Image();

  image.className = "js-lightbox-image";
  image.alt = alt;
  image.loading = "lazy";
  image.addEventListener("load", () => {
    figure.prepend(image);
    figure.classList.add("has-image");
    image.classList.add("pan-up");
    observePanUp(image);
    attachLightbox(image);
  });
  image.src = source;
});

function observePanUp(item) {
  if (!item || !observer) return;
  observer.observe(item);
}

const animatedItems = document.querySelectorAll(
  ".main-infographic, .floating-graphic, .floating-item"
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
    document.body.style.overflow = "hidden";
  });
}

document.querySelectorAll(".js-lightbox-image").forEach(attachLightbox);

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("active")) {
    lightbox.click();
  }
});
