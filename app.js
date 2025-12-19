// Make the globe play once, then freeze on the last frame.
const video = document.getElementById("globeVideo");
if (video) {
  video.addEventListener("ended", () => {
    try {
      video.currentTime = Math.max(0, video.duration - 0.08);
      video.pause();
    } catch {}
  });
}

// Israel hotspot -> tiny “zoom” effect + pop card
const hotspot = document.getElementById("israelHotspot");
const popcard = document.getElementById("popcard");
const globeWrap = document.querySelector(".globe-wrap");

function toggleCard() {
  if (!popcard || !globeWrap) return;
  const isOpen = popcard.style.display === "block";
  popcard.style.display = isOpen ? "none" : "block";

  // Tiny zoom illusion
  globeWrap.animate(
    [
      { transform: "translateX(-50%) scale(1)" },
      { transform: "translateX(-50%) scale(1.04)" },
      { transform: "translateX(-50%) scale(1.02)" }
    ],
    { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" }
  );
}

if (hotspot) hotspot.addEventListener("click", toggleCard);

// Close card when clicking outside
document.addEventListener("click", (e) => {
  if (!popcard || popcard.style.display !== "block") return;
  if (e.target.closest("#popcard") || e.target.closest("#israelHotspot")) return;
  popcard.style.display = "none";
});
// Start Journey: pulse globe, then smooth scroll
const startBtn = document.getElementById("startJourney");
const globe = document.querySelector(".globe-wrap");
const books = document.getElementById("books");

if (startBtn && globe) {
  startBtn.addEventListener("click", (e) => {
    e.preventDefault(); // stop the instant jump

    globe.animate(
      [
        { transform: "translateX(-50%) scale(1)" },
        { transform: "translateX(-50%) scale(1.08)" },
        { transform: "translateX(-50%) scale(1.02)" }
      ],
      { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" }
    );

    // scroll after a beat so the pulse is visible
    setTimeout(() => {
      if (books) books.scrollIntoView({ behavior: "smooth", block: "start" });
      else location.hash = "books";
    }, 180);
  });
}


if (startBtn && globe) {
  startBtn.addEventListener("click", () => {
    // tiny cinematic pulse
    globe.animate(
      [
        { transform: "translateX(-50%) scale(1)", filter: "brightness(1)" },
        { transform: "translateX(-50%) scale(1.06)", filter: "brightness(1.08)" },
        { transform: "translateX(-50%) scale(1.02)", filter: "brightness(1.02)" }
      ],
      { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  });
}
