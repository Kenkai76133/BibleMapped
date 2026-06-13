const tabs = Array.from(document.querySelectorAll(".story-tab"));
const panels = Array.from(document.querySelectorAll(".story-panel"));

function activateStory(story) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.story === story;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === story;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateStory(tab.dataset.story));
});
