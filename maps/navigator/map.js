// BibleMapped Map Navigator (Leaflet, static)
const PLACES_URL = "/maps/navigator/places.geojson";

const map = L.map("map", { zoomControl: true }).setView([31.778, 35.235], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const placesCluster = L.markerClusterGroup({
  disableClusteringAtZoom: 11,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  maxClusterRadius: 45
});

const routesLayer = L.layerGroup();
let places = [];

// Simple HTML escape for popups
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]
  ));
}

function chipify(list, container) {
  container.innerHTML = "";
  if (!list?.length) {
    container.innerHTML = `<span class="muted">None</span>`;
    return;
  }
  for (const item of list) {
    const div = document.createElement("span");
    div.className = "chip";
    div.textContent = item;
    container.appendChild(div);
  }
}

function openDrawer(place) {
  const drawer = document.getElementById("infoDrawer");
  if (!drawer) return;
  drawer.classList.add("open");

  document.getElementById("drawerTitle").textContent = place.name;
  document.getElementById("drawerMeta").textContent = place.meta;
  document.getElementById("drawerType").textContent = place.type;
  document.getElementById("drawerBook").textContent = place.book;
  chipify(place.refs, document.getElementById("drawerRefs"));
  chipify(place.tags, document.getElementById("drawerTags"));
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
    btn.className = "placeBtn";
    btn.innerHTML = `<div class="placeBtn__name">${esc(p.name)}</div>
                     <div class="placeBtn__meta">${esc(p.meta)}</div>`;

    if (p.tags?.length) {
      const tagsRow = document.createElement("div");
      tagsRow.className = "placeBtn__tags";
      for (const t of p.tags) {
        const span = document.createElement("span");
        span.className = "pill";
        span.textContent = t;
        tagsRow.appendChild(span);
      }
      btn.appendChild(tagsRow);
    }

    btn.addEventListener("click", () => {
      map.flyTo([p.lat, p.lng], 11, { duration: 0.8 });
      openDrawer(p);
      if (p.marker) {
        p.marker.openPopup();
      }
    });
    list.appendChild(btn);
  }
}

function drawPlaces(items) {
  placesCluster.clearLayers();

  for (const p of items) {
    const marker = L.marker([p.lat, p.lng]);
    p.marker = marker;

    marker.bindPopup(`<b>${esc(p.name)}</b><br>${esc(p.meta)}`);
    marker.on("click", () => openDrawer(p));
    placesCluster.addLayer(marker);
  }
}

function populateFilters(data) {
  const typeSet = new Set();
  const bookSet = new Set();
  data.forEach(p => {
    if (p.type) typeSet.add(p.type);
    if (p.book) bookSet.add(p.book);
  });

  const typeFilters = document.getElementById("typeFilters");
  const bookFilters = document.getElementById("bookFilters");
  typeFilters.innerHTML = "";
  bookFilters.innerHTML = "";

  for (const type of Array.from(typeSet).sort()) {
    const label = document.createElement("label");
    label.className = "filterOption";
    label.innerHTML = `<input type="checkbox" value="${esc(type)}" checked /> <span>${esc(type)}</span>`;
    typeFilters.appendChild(label);
  }

  for (const book of Array.from(bookSet).sort()) {
    const label = document.createElement("label");
    label.className = "filterOption";
    label.innerHTML = `<input type="checkbox" value="${esc(book)}" checked /> <span>${esc(book)}</span>`;
    bookFilters.appendChild(label);
  }
}

function currentFilters() {
  const search = document.getElementById("searchInput")?.value.trim().toLowerCase() || "";
  const typeChecks = Array.from(document.querySelectorAll("#typeFilters input:checked")).map(el => el.value);
  const bookChecks = Array.from(document.querySelectorAll("#bookFilters input:checked")).map(el => el.value);
  return { search, typeChecks, bookChecks };
}

function applyFilters() {
  const { search, typeChecks, bookChecks } = currentFilters();
  const typeTotal = document.querySelectorAll("#typeFilters input").length;
  const bookTotal = document.querySelectorAll("#bookFilters input").length;
  const filtered = places.filter(p => {
    const matchesSearch = !search || (p.name + " " + p.meta + " " + (p.tags || []).join(" ")).toLowerCase().includes(search);
    const matchesType = typeChecks.length ? typeChecks.includes(p.type) : typeTotal === 0;
    const matchesBook = bookChecks.length ? bookChecks.includes(p.book) : bookTotal === 0;
    return matchesSearch && matchesType && matchesBook;
  });

  renderList(filtered);
  drawPlaces(filtered);
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
        id: f.properties?.id ?? "",
        name: f.properties?.name ?? "Untitled",
        meta: f.properties?.meta ?? "",
        type: f.properties?.type ?? "",
        book: f.properties?.book ?? "",
        tags: f.properties?.tags || [],
        refs: f.properties?.refs || [],
        lat,
        lng,
        marker: null
      };
    });

  populateFilters(places);
  renderList(places);
  drawPlaces(places);
}

function wireUI() {
  const search = document.getElementById("searchInput");
  const togglePlaces = document.getElementById("togglePlaces");
  const toggleRoutes = document.getElementById("toggleRoutes");
  const homeBtn = document.getElementById("homeBtn");
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  const drawerClose = document.getElementById("drawerClose");
  const typeFilters = document.getElementById("typeFilters");
  const bookFilters = document.getElementById("bookFilters");

  map.addLayer(placesCluster);

  search?.addEventListener("input", applyFilters);
  typeFilters?.addEventListener("change", applyFilters);
  bookFilters?.addEventListener("change", applyFilters);

  togglePlaces?.addEventListener("change", () => {
    if (togglePlaces.checked) {
      map.addLayer(placesCluster);
    } else {
      map.removeLayer(placesCluster);
    }
  });

  toggleRoutes?.addEventListener("change", () => {
    if (toggleRoutes.checked) {
      map.addLayer(routesLayer);
    } else {
      map.removeLayer(routesLayer);
    }
  });

  homeBtn?.addEventListener("click", () => {
    map.flyTo([31.778, 35.235], 7, { duration: 0.8 });
  });

  menuBtn?.addEventListener("click", () => {
    sidebar?.classList.toggle("open");
  });

  drawerClose?.addEventListener("click", () => {
    document.getElementById("infoDrawer")?.classList.remove("open");
  });
}

wireUI();
loadPlaces().catch(err => {
  console.error(err);
  alert("Map failed to load. Check console for details.");
});
