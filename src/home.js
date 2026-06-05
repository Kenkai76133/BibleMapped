    const modalTriggers = document.querySelectorAll("[data-modal-target]");
    const modalCloseButtons = document.querySelectorAll("[data-modal-close]");
    const modals = document.querySelectorAll(".modal-overlay");
    const booksDropdown = document.querySelector("[data-books-dropdown]");

    function closeBooksDropdown() {
      if (!booksDropdown) return;

      booksDropdown.classList.remove("open");
      booksDropdown.removeAttribute("open");
    }

    if (booksDropdown) {
      document.addEventListener("click", (event) => {
        if (!booksDropdown.contains(event.target)) {
          closeBooksDropdown();
        }
      });
    }

    function openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;

      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    }

    function closeModal(modal) {
      if (!modal) return;

      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }

    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        openModal(trigger.dataset.modalTarget);
      });
    });

    modalCloseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        closeModal(button.closest(".modal-overlay"));
      });
    });

    modals.forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          closeModal(modal);
        }
      });
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeBooksDropdown();

        modals.forEach((modal) => {
          if (modal.classList.contains("active")) {
            closeModal(modal);
          }
        });
      }
    });

    const formulaToggle = document.getElementById("formulaToggle");
    const formulaInlineWindow = document.getElementById("formulaInlineWindow");
    const formulaArtFrame = document.getElementById("formulaArtFrame");
    const formulaTourPanels = document.querySelectorAll("[data-formula-tour-panel]");
    const formulaTourDots = document.querySelectorAll("[data-formula-tour-dot]");
    const formulaTourButtons = document.querySelectorAll("[data-formula-tour-next]");
    const formulaQuestionLinks = document.querySelectorAll(".formula-question");

    function triggerFormulaImagePanOut() {
      if (!formulaArtFrame) return;

      formulaArtFrame.classList.remove("image-pan-out");

      // Force the browser to reset the starting zoom before playing the pan-out animation.
      void formulaArtFrame.offsetWidth;

      requestAnimationFrame(() => {
        formulaArtFrame.classList.add("image-pan-out");
      });
    }

    function resetFormulaImagePanOut() {
      if (!formulaArtFrame) return;
      formulaArtFrame.classList.remove("image-pan-out");
    }


    function setupFormulaMagnetLinks() {
      formulaQuestionLinks.forEach((link) => {
        link.addEventListener("mousemove", (event) => {
          const rect = link.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;
          const pullX = Math.max(Math.min(x * 0.12, 12), -12);
          const pullY = Math.max(Math.min(y * 0.14, 10), -10);

          link.style.setProperty("--mx", `${pullX}px`);
          link.style.setProperty("--my", `${pullY}px`);
        });

        link.addEventListener("mouseleave", () => {
          link.style.setProperty("--mx", "0px");
          link.style.setProperty("--my", "0px");
        });
      });
    }

    function setFormulaTourStep(step) {
      const safeStep = Math.min(Math.max(Number(step) || 1, 1), 3);

      formulaTourPanels.forEach((panel) => {
        const panelStep = Number(panel.dataset.formulaTourPanel);
        const isActive = panelStep === safeStep;

        panel.classList.toggle("active", isActive);
        panel.setAttribute("aria-hidden", String(!isActive));
      });

      formulaTourDots.forEach((dot) => {
        const dotStep = Number(dot.dataset.formulaTourDot);
        dot.classList.toggle("active", dotStep === safeStep);
      });
    }

    formulaTourButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setFormulaTourStep(button.dataset.formulaTourNext);
      });
    });

    function resetFormulaWindow() {
      if (!formulaInlineWindow) return;

      if (formulaToggle) {
        formulaInlineWindow.classList.remove("open");
        formulaInlineWindow.setAttribute("aria-hidden", "true");
        formulaToggle.setAttribute("aria-expanded", "false");
      }

      if (formulaArtFrame) {
        formulaArtFrame.classList.remove("words-in-view");
        formulaArtFrame.classList.remove("tour-active");
        resetFormulaImagePanOut();
      }

      setFormulaTourStep(1);
    }

    function closeMinimalPanels(exceptPanel = null) {
      document.querySelectorAll(".minimal-panel.open").forEach((openPanel) => {
        if (openPanel === exceptPanel) return;
        if (exceptPanel && openPanel.contains(exceptPanel)) return;

        if (openPanel.contains(formulaInlineWindow)) {
          resetFormulaWindow();
        }

        openPanel.classList.remove("open");
        openPanel.setAttribute("aria-hidden", "true");

        const controllingToggle = document.querySelector(`[aria-controls="${openPanel.id}"]`);
        if (controllingToggle) {
          controllingToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    if (formulaToggle && formulaInlineWindow) {
      formulaToggle.addEventListener("click", () => {
        const parentMinimalPanel = formulaInlineWindow.closest(".minimal-panel");
        closeMinimalPanels(parentMinimalPanel || formulaInlineWindow);

        const isOpen = formulaInlineWindow.classList.toggle("open");

        formulaToggle.setAttribute("aria-expanded", String(isOpen));
        formulaInlineWindow.setAttribute("aria-hidden", String(!isOpen));

        if (isOpen) {
          setFormulaTourStep(1);

          if (formulaArtFrame) {
            formulaArtFrame.classList.remove("tour-active");
            triggerFormulaImagePanOut();
          }

          setTimeout(() => {
            formulaInlineWindow.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }, 180);

          setTimeout(() => {
            if (formulaArtFrame) {
              formulaArtFrame.classList.add("tour-active");
            }
          }, 700);

          setTimeout(checkFormulaWordsPanUp, 520);
        } else {
          if (formulaArtFrame) {
            formulaArtFrame.classList.remove("words-in-view");
            formulaArtFrame.classList.remove("tour-active");
            resetFormulaImagePanOut();
          }

          setFormulaTourStep(1);
        }
      });
    }

    function checkFormulaWordsPanUp() {
      if (!formulaArtFrame || !formulaInlineWindow) return;
      if (!formulaInlineWindow.classList.contains("open")) return;

      const rect = formulaArtFrame.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isVisible =
        rect.top < windowHeight * 0.78 &&
        rect.bottom > windowHeight * 0.18;

      if (isVisible) {
        formulaArtFrame.classList.add("words-in-view");
      }
    }

    window.addEventListener("scroll", checkFormulaWordsPanUp);
    window.addEventListener("resize", checkFormulaWordsPanUp);
    window.addEventListener("load", () => {
      checkFormulaWordsPanUp();

      const aboutPanel = document.getElementById("aboutMappedPanel");
      if (aboutPanel && aboutPanel.classList.contains("open")) {
        triggerFormulaImagePanOut();
      }
    });

    requestAnimationFrame(checkFormulaWordsPanUp);

    const aboutMappedShell = document.getElementById("aboutMappedShell");

    if (aboutMappedShell) {
      const aboutMappedObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              aboutMappedShell.classList.add("in-view");
            }
          });
        },
        { threshold: 0.2 }
      );

      aboutMappedObserver.observe(aboutMappedShell);
    }

    const revealPanels = document.querySelectorAll(".premium-reveal");
    const watchTypeTitle = document.querySelector("[data-type-text]");
    const watchVideosSection = watchTypeTitle ? watchTypeTitle.closest(".landing-followup-bars") : null;
    const typewriterReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function typeWatchTitle() {
      if (!watchTypeTitle || watchTypeTitle.dataset.typed === "true") return;

      const fullText = watchTypeTitle.dataset.typeText || watchTypeTitle.textContent || "";
      const stepDelay = 58;
      let index = 0;

      watchTypeTitle.dataset.typed = "true";

      if (typewriterReduceMotion.matches) {
        watchTypeTitle.textContent = fullText;
        watchTypeTitle.classList.add("typed");
        return;
      }

      watchTypeTitle.textContent = "";
      watchTypeTitle.classList.add("typing");

      function typeNextCharacter() {
        index += 1;
        watchTypeTitle.textContent = fullText.slice(0, index);

        if (index < fullText.length) {
          window.setTimeout(typeNextCharacter, stepDelay);
        } else {
          watchTypeTitle.classList.remove("typing");
          watchTypeTitle.classList.add("typed");
        }
      }

      window.setTimeout(typeNextCharacter, 220);
    }

    if (watchTypeTitle && !typewriterReduceMotion.matches) {
      watchTypeTitle.textContent = "";
      watchTypeTitle.classList.add("typing-ready");
    }

    if (revealPanels.length) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-in-view");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
      );

      revealPanels.forEach((panel) => {
        revealObserver.observe(panel);
      });
    }

    if (watchVideosSection && watchTypeTitle) {
      const watchTitleObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              typeWatchTitle();
              watchTitleObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -18% 0px", threshold: 0.22 }
      );

      watchTitleObserver.observe(watchVideosSection);
    }

    function setupMinimalPanel(toggleId, panelId) {
      const toggle = document.getElementById(toggleId);
      const panel = document.getElementById(panelId);

      if (!toggle || !panel) return;

      toggle.addEventListener("click", () => {
        closeMinimalPanels(panel);
        const isOpen = panel.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        panel.setAttribute("aria-hidden", String(!isOpen));

        if (isOpen && panelId === "aboutMappedPanel") {
          if (formulaArtFrame) {
            formulaArtFrame.classList.remove("words-in-view");
            formulaArtFrame.classList.remove("tour-active");
          }

          triggerFormulaImagePanOut();
          setTimeout(checkFormulaWordsPanUp, 520);
        } else if (!isOpen && panelId === "aboutMappedPanel") {
          if (formulaArtFrame) {
            formulaArtFrame.classList.remove("words-in-view");
            formulaArtFrame.classList.remove("tour-active");
          }

          resetFormulaImagePanOut();
        }
      });
    }

    setupMinimalPanel("aboutMappedToggle", "aboutMappedPanel");

    /* Keep About Bible Mapped permanently open */
    function forceAboutMappedOpen() {
      const aboutToggle = document.getElementById("aboutMappedToggle");
      const aboutPanel = document.getElementById("aboutMappedPanel");
      const inlineWindow = document.getElementById("formulaInlineWindow");

      if (aboutPanel) {
        aboutPanel.classList.add("open");
        aboutPanel.setAttribute("aria-hidden", "false");
      }

      if (aboutToggle) {
        aboutToggle.setAttribute("aria-expanded", "true");
        aboutToggle.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();

          if (aboutPanel) {
            aboutPanel.classList.add("open");
            aboutPanel.setAttribute("aria-hidden", "false");
          }

          if (inlineWindow) {
            inlineWindow.classList.add("open");
            inlineWindow.setAttribute("aria-hidden", "false");
          }

          if (formulaArtFrame) {
            triggerFormulaImagePanOut();
            setTimeout(checkFormulaWordsPanUp, 160);
          }
        }, true);
      }

      if (inlineWindow) {
        inlineWindow.classList.add("open");
        inlineWindow.setAttribute("aria-hidden", "false");
      }
    }

    forceAboutMappedOpen();

    const moodButtons = document.querySelectorAll(".mood-mode-redesign .mood-card-button");
    const moodRouteModal = document.getElementById("moodRouteModal");
    const moodRouteDialog = moodRouteModal ? moodRouteModal.querySelector(".mood-route-dialog") : null;
    const moodRouteTitle = document.getElementById("moodRouteTitle");
    const moodRouteReference = document.getElementById("moodRouteReference");
    const moodRouteEncouragement = document.getElementById("moodRouteEncouragement");
    let lastMoodTrigger = null;

    function openMoodRoute(button) {
      if (!moodRouteModal || !moodRouteDialog) return;

      lastMoodTrigger = button;

      if (moodRouteTitle) moodRouteTitle.textContent = button.dataset.mood || "";
      if (moodRouteReference) moodRouteReference.textContent = button.dataset.reference || "";
      if (moodRouteEncouragement) moodRouteEncouragement.textContent = button.dataset.encouragement || "";

      moodRouteModal.hidden = false;
      document.body.classList.add("mood-route-open");
      moodRouteDialog.focus();
    }

    function closeMoodRoute() {
      if (!moodRouteModal) return;

      moodRouteModal.hidden = true;
      document.body.classList.remove("mood-route-open");

      if (lastMoodTrigger) {
        lastMoodTrigger.focus();
      }
    }

    moodButtons.forEach((button) => {
      button.addEventListener("click", () => {
        openMoodRoute(button);
      });
    });

    if (moodRouteModal) {
      moodRouteModal.querySelectorAll("[data-mood-close]").forEach((closeControl) => {
        closeControl.addEventListener("click", closeMoodRoute);
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && moodRouteModal && !moodRouteModal.hidden) {
        closeMoodRoute();
      }
    });


    const testamentWrap = document.getElementById("testamentPuzzleWrap");
    const startHereButton = document.getElementById("startHereButton");
    const testamentsSection = document.getElementById("testaments");

    function openLandingPanel() {
      document.body.classList.add("journey-open");

      window.setTimeout(() => {
        if (testamentsSection) {
          const navHeight = Number.parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--nav-height")
          ) || 92;
          const targetTop =
            testamentsSection.getBoundingClientRect().top + window.scrollY - navHeight - 24;

          window.scrollTo({
            top: Math.max(0, targetTop),
            behavior: "smooth"
          });
        }

        checkTestamentPuzzleAnimation();
      }, 760);
    }

    if (window.location.hash && window.location.hash !== "#") {
      document.body.classList.add("journey-open");
    }

    if (startHereButton) {
      startHereButton.addEventListener("click", openLandingPanel);
    }

    function checkTestamentPuzzleAnimation() {
      if (!testamentWrap) return;

      const rect = testamentWrap.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isVisible =
        rect.top < windowHeight * 0.82 &&
        rect.bottom > windowHeight * 0.15;

      if (isVisible) {
        testamentWrap.classList.add("in-view");
      }
    }

    window.addEventListener("scroll", checkTestamentPuzzleAnimation);
    window.addEventListener("resize", checkTestamentPuzzleAnimation);
    window.addEventListener("load", checkTestamentPuzzleAnimation);

    requestAnimationFrame(checkTestamentPuzzleAnimation);
    setTimeout(checkTestamentPuzzleAnimation, 300);
    setTimeout(checkTestamentPuzzleAnimation, 900);

    const videoTrack = document.querySelector(".watch-videos-track");
    const videoMarquee = document.querySelector(".watch-videos-marquee");
    const videoCards = document.querySelectorAll(".watch-video-card");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (videoTrack && videoMarquee && !reduceMotion.matches) {
      let videoOffset = 0;
      let videoDirection = 1;
      let videoRunning = true;
      let videoPauseUntil = 0;
      let lastScrollY = window.scrollY;
      let lastFrameTime = performance.now();

      function getVideoLoopWidth() {
        return Math.max(1, videoTrack.scrollWidth / 2);
      }

      function normalizeVideoOffset() {
        const loopWidth = getVideoLoopWidth();

        if (videoOffset <= -loopWidth) {
          videoOffset += loopWidth;
        } else if (videoOffset >= 0) {
          videoOffset -= loopWidth;
        }
      }

      videoOffset = -getVideoLoopWidth() / 2;

      function animateVideoTrack(now) {
        const elapsed = Math.min(34, now - lastFrameTime);
        lastFrameTime = now;

        if (videoRunning && now >= videoPauseUntil) {
          videoOffset += videoDirection * elapsed * 0.032;
          normalizeVideoOffset();
          videoTrack.style.setProperty("--watch-video-offset", `${videoOffset}px`);
        }

        window.requestAnimationFrame(animateVideoTrack);
      }

      function handleVideoScrollDirection() {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;

        if (Math.abs(delta) > 2) {
          if (delta > 0) {
            videoDirection = -1;
            videoPauseUntil = 0;
          } else {
            videoDirection = 1;
            videoPauseUntil = performance.now() + 420;
          }
        }

        lastScrollY = currentScrollY;
      }

      function stopVideoCarousel() {
        videoRunning = false;
        videoTrack.classList.add("is-paused");
      }

      videoCards.forEach((card) => {
        card.addEventListener("pointerdown", stopVideoCarousel, { passive: true });
        card.addEventListener("click", stopVideoCarousel);
      });

      window.addEventListener("blur", () => {
        if (document.activeElement && document.activeElement.classList.contains("watch-video-embed")) {
          stopVideoCarousel();
        }
      });

      window.addEventListener("scroll", handleVideoScrollDirection, { passive: true });
      window.addEventListener("resize", () => {
        videoOffset = -getVideoLoopWidth() / 2;
        videoTrack.style.setProperty("--watch-video-offset", `${videoOffset}px`);
      });

      videoTrack.style.setProperty("--watch-video-offset", `${videoOffset}px`);
      window.requestAnimationFrame(animateVideoTrack);
    }

    const storyCards = document.querySelectorAll(".scripture-story-card");

    storyCards.forEach((card) => {
      let clickLocked = false;

      card.addEventListener("click", (event) => {
        if (clickLocked) {
          event.preventDefault();
          return;
        }

        clickLocked = true;
        card.classList.add("card-clicked");

        window.setTimeout(() => {
          card.classList.remove("card-clicked");
          clickLocked = false;
        }, 880);
      });
    });



    const scriptureFan = document.querySelector(".scripture-card-fan");

    if (scriptureFan && !reduceMotion.matches) {
      let lastCardScrollY = window.scrollY;
      let cardFanTicking = false;

      function updateStoryCardFanByScroll() {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastCardScrollY;
        const rect = scriptureFan.getBoundingClientRect();
        const fanIsNearViewport = rect.top < window.innerHeight + 260 && rect.bottom > -260;

        if (fanIsNearViewport && Math.abs(delta) > 3) {
          if (delta > 0) {
            scriptureFan.classList.add("scroll-fanned");
            scriptureFan.classList.remove("scroll-retracted");
          } else {
            // Keep the cards static when scrolling back up.
            // No retracting inward after the fan has opened.
            scriptureFan.classList.add("scroll-fanned");
            scriptureFan.classList.remove("scroll-retracted");
          }
        }

        lastCardScrollY = currentScrollY;
        cardFanTicking = false;
      }

      function requestStoryCardFanUpdate() {
        if (!cardFanTicking) {
          window.requestAnimationFrame(updateStoryCardFanByScroll);
          cardFanTicking = true;
        }
      }

      scriptureFan.classList.add("scroll-fanned");
      window.addEventListener("scroll", requestStoryCardFanUpdate, { passive: true });
      window.addEventListener("resize", requestStoryCardFanUpdate);
    }

    const parallaxItems = document.querySelectorAll(".parallax-item");
    let ticking = false;

    function updateParallax() {
      if (window.matchMedia("(max-width: 768px)").matches) {
        parallaxItems.forEach((item) => {
          item.style.transform = "";
        });
        ticking = false;
        return;
      }

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.speed || 0.03);
        const rect = item.getBoundingClientRect();
        const itemTop = rect.top + scrollY;
        const distanceFromCenter = scrollY + viewportHeight / 2 - itemTop;
        const rawMovement = distanceFromCenter * speed;
        const movement = Math.max(-24, Math.min(24, rawMovement));
        item.style.transform = `translate3d(0, ${movement}px, 0)`;
      });

      ticking = false;
    }

    function requestParallaxUpdate() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener("scroll", requestParallaxUpdate);
    window.addEventListener("resize", requestParallaxUpdate);
    window.addEventListener("load", updateParallax);
