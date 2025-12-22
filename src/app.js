// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Simple demo content so the homepage doesn't feel empty
const demo = {
  explainers: [
    { kicker: "EXPLAINER", title: "Why Bethlehem mattered", desc: "A geography-first look at the Christmas claim." },
    { kicker: "EXPLAINER", title: "Nazareth: small town, big implication", desc: "What the setting tells us about the story." },
    { kicker: "EXPLAINER", title: "Rome’s census question", desc: "What we know, what we don’t, and why it matters." }
  ],
  maps: [
    { kicker: "MAP", title: "Judea under Rome", desc: "Borders, roads, and political pressure points." },
    { kicker: "MAP", title: "From Nazareth to Bethlehem", desc: "Distance, terrain, and the route options." },
    { kicker: "MAP", title: "Herodian kingdoms", desc: "Who ruled what — and when." }
  ],
  history: [
    { kicker: "HISTORY", title: "Herod in context", desc: "Sources, reputation, and the timeline." },
    { kicker: "HISTORY", title: "Temple politics", desc: "Why Jerusalem was always tense." },
    { kicker: "HISTORY", title: "Roman provincial control", desc: "How empire governance worked on the ground." }
  ],
  people: [
    { kicker: "PERSON", title: "Mary", desc: "What the texts emphasize — and what’s later tradition." },
    { kicker: "PERSON", title: "Joseph", desc: "The quiet backbone of the narrative." },
    { kicker: "PERSON", title: "The Magi", desc: "Who they might have been (and who they weren’t)." }
  ]
};

function makeCard({ kicker, title, desc }) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="kicker">${kicker}</div>
    <h3>${title}</h3>
    <p>${desc}</p>
  `;
  return card;
}

function fillGrid(gridId, items) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = "";
  items.forEach(item => grid.appendChild(makeCard(item)));
}

fillGrid("explainersGrid", demo.explainers);
fillGrid("mapsGrid", demo.maps);
fillGrid("historyGrid", demo.history);
fillGrid("peopleGrid", demo.people);

// Placeholder search behavior (we'll build real search later)
const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    alert("Search is next. Skeleton first, then power-ups.");
  });
}
