// BibleMapped Map Navigator (Leaflet, static)
const PLACES_URL = "/maps/navigator/places.geojson";

const map = L.map("map", { zoomControl: true }).setView([31.778, 35.235], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const placesLayer = L.layerGroup().addTo(map);
let places = [];

// Simple HTML escape for popups
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]
  ));
}

function renderList(items) {
  const list = document.getElementById("placesList");
  list.innerHTML = "";

  if (!items.length) {
    list.innerHTML = `<div style="padding:10px; opacity:.7;">No matches</div>`;
    return;
  }

  for (const p of items) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.style.cssText = "width:100%; text-align:left; padding:10px; border:1px solid #223142; background:#0b1220; color:#e7eef7; border-radius:10px; margin-bottom:8px;";
    btn.innerHTML = `<div style="font-weight:700;">${esc(p.name)}</div>
                     <div style="opacity:.8; font-size:12px; margin-top:2px;">${esc(p.meta)}</div>`;
    btn.addEventListener("click", () => {
      map.flyTo([p.lat, p.lng], 11, { duration: 0.8 });
      if (p.marker) {
        p.marker.openPopup();
      }
    });
    list.appendChild(btn);
  }
}

function drawPlaces(items) {
  placesLayer.clearLayers();

  for (const p of items) {
    const marker = L.marker([p.lat, p.lng]);
    p.marker = marker;

    marker.bindPopup(`<b>${esc(p.name)}</b><br>${esc(p.meta)}`);
    marker.addTo(placesLayer);
  }
}

async function loadPlaces() {
  const res = await fetch(PLACES_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load places: ${res.status}`);
  const geo = await res.json();

  places = (geo.features || [])
    .filter(f => f.geometry && f.geometry.type === "Point")
    .map(f => {
      const [lng, lat] = f.geometry.coordinates;
      return {
        name: f.properties?.name ?? "Untitled",
        meta: f.properties?.meta ?? "",
        lat,
        lng,
        marker: null
      };
    });

  renderList(places);
  drawPlaces(places);
}

function wireUI() {
  const search = document.getElementById("searchInput");
  const togglePlaces = document.getElementById("togglePlaces");
  const homeBtn = document.getElementById("homeBtn");

  search?.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    const filtered = !q
      ? places
      : places.filter(p =>
          (p.name + " " + p.meta).toLowerCase().includes(q)
        );
    renderList(filtered);
    drawPlaces(filtered);
  });

  togglePlaces?.addEventListener("change", () => {
    if (togglePlaces.checked) {
      placesLayer.addTo(map);
    } else {
      map.removeLayer(placesLayer);
    }
  });

  homeBtn?.addEventListener("click", () => {
    map.flyTo([31.778, 35.235], 7, { duration: 0.8 });
  });
}

wireUI();
loadPlaces().catch(err => {
  console.error(err);
  alert("Map failed to load. Check console for details.");
});
