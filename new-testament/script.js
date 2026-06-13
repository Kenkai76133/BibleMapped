const animatedItems = document.querySelectorAll(
  ".main-infographic, .context-copy, .floating-graphic, .nt-library .eyebrow, .nt-library h2, .nt-library > p:not(.eyebrow), .floating-item"
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
