(() => {
  const body = document.body;
  const toggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector("#primaryNav");
  const moreMenu = document.querySelector(".nav-more");

  const setNavOpen = (open) => {
    body.classList.toggle("nav-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
  };

  toggle?.addEventListener("click", () => {
    setNavOpen(!body.classList.contains("nav-open"));
  });

  primaryNav?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) {
      setNavOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;

    if (moreMenu?.open && !moreMenu.contains(target)) {
      moreMenu.open = false;
    }

    if (
      body.classList.contains("nav-open") &&
      !primaryNav?.contains(target) &&
      !toggle?.contains(target)
    ) {
      setNavOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavOpen(false);
      if (moreMenu) moreMenu.open = false;
    }
  });

  document.querySelectorAll("[data-video-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const videoId = button.getAttribute("data-video-id");
      if (!videoId) return;

      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = "Bible Mapped video";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;

      button.replaceChildren(iframe);
      button.classList.add("is-playing");
      button.setAttribute("aria-label", "Bible Mapped video player");
    });
  });
})();
