const atlasPlaces = [
  {
    name: "Eden",
    coordinates: [44.5, 33.8],
    where: "A remembered garden region connected with the Bible's first story.",
    story: "Creation, human calling, temptation, and exile from the garden.",
    why: "Eden begins the Bible's story of place, presence, loss, and promised restoration.",
    related: "Genesis, Adam, Eve"
  },
  {
    name: "Ur",
    coordinates: [45.6, 30.96],
    where: "Southern Mesopotamia, east of the promised land.",
    story: "Abram is called from his homeland toward a promise he cannot yet see.",
    why: "Ur anchors the beginning of Abraham's journey and the covenant family.",
    related: "Genesis, Abraham, Sarah"
  },
  {
    name: "Haran",
    coordinates: [39.03, 36.86],
    where: "Northern Mesopotamia, along the route between Ur and Canaan.",
    story: "Abraham's family pauses in Haran before the call continues into Canaan.",
    why: "Haran shows the journey of faith unfolding step by step.",
    related: "Genesis, Terah, Abraham, Jacob"
  },
  {
    name: "Canaan",
    coordinates: [35.2, 31.95],
    where: "The promised land between the Jordan, the coast, and the hill country.",
    story: "Abraham enters the land, Israel receives it, and the kingdom story unfolds there.",
    why: "Canaan turns promise into geography and shows faithfulness lived out in real places.",
    related: "Genesis, Joshua, Judges, Abraham, Joshua, David"
  },
  {
    name: "Egypt",
    coordinates: [31.23, 30.04],
    where: "The Nile region southwest of Canaan.",
    story: "Israel finds refuge, becomes enslaved, and is rescued through the Exodus.",
    why: "Egypt becomes the Bible's great picture of bondage, judgment, Passover, and deliverance.",
    related: "Genesis, Exodus, Joseph, Moses"
  },
  {
    name: "Sinai",
    coordinates: [33.98, 28.54],
    where: "The wilderness region between Egypt and the promised land.",
    story: "God forms Israel through covenant, law, worship, testing, and provision.",
    why: "Sinai shows rescued people learning how to live with God.",
    related: "Exodus, Leviticus, Numbers, Moses"
  },
  {
    name: "Jerusalem",
    coordinates: [35.21, 31.77],
    where: "The hill country of Judea.",
    story: "City of David, temple worship, prophetic warning, the cross, and resurrection.",
    why: "Jerusalem gathers together kingdom, worship, judgment, redemption, and hope.",
    related: "Samuel, Kings, Psalms, Gospels, Jesus"
  },
  {
    name: "Babylon",
    coordinates: [44.42, 32.54],
    where: "Mesopotamia, along the Euphrates.",
    story: "Judah is taken into exile, and God preserves hope through judgment.",
    why: "Babylon shows the weight of exile and the promise that God has not abandoned His people.",
    related: "Daniel, Jeremiah, Ezekiel, Ezra"
  },
  {
    name: "Galilee",
    coordinates: [35.55, 32.85],
    where: "Northern Israel around the Sea of Galilee.",
    story: "Jesus teaches, heals, calls disciples, and announces the kingdom.",
    why: "Galilee places Jesus' ministry among towns, roads, fishermen, and ordinary people.",
    related: "Matthew, Mark, Luke, John, Peter"
  },
  {
    name: "Rome",
    coordinates: [12.5, 41.9],
    where: "The imperial capital of the New Testament world.",
    story: "The Gospel moves through the Mediterranean world toward the heart of empire.",
    why: "Rome shows the message of Jesus reaching beyond Judea to the nations.",
    related: "Acts, Romans, Paul"
  }
];

const atlasRoute = [
  "Eden",
  "Ur",
  "Haran",
  "Canaan",
  "Egypt",
  "Sinai",
  "Jerusalem",
  "Babylon",
  "Galilee",
  "Rome"
].map((name) => atlasPlaces.find((place) => place.name === name).coordinates);

function popupMarkup(place) {
  return `
    <article class="atlas-popup-card">
      <h3>${place.name}</h3>
      <div class="atlas-popup-row"><strong>Where</strong><span>${place.where}</span></div>
      <div class="atlas-popup-row"><strong>Story</strong><span>${place.story}</span></div>
      <div class="atlas-popup-row"><strong>Why It Matters</strong><span>${place.why}</span></div>
      <div class="atlas-popup-row"><strong>Related Books / People</strong><span>${place.related}</span></div>
    </article>
  `;
}

function initBibleAtlasMap() {
  const mapElement = document.getElementById("bibleAtlasMap");

  if (!mapElement || typeof maplibregl === "undefined") return;

  const map = new maplibregl.Map({
    container: mapElement,
    center: [34.8, 33.2],
    zoom: 4,
    minZoom: 2.4,
    maxZoom: 10,
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap contributors"
        }
      },
      layers: [
        {
          id: "osm",
          type: "raster",
          source: "osm"
        }
      ]
    }
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

  map.on("load", () => {
    map.addSource("bible-atlas-route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: atlasRoute
        }
      }
    });

    map.addLayer({
      id: "bible-atlas-route-line",
      type: "line",
      source: "bible-atlas-route",
      layout: {
        "line-cap": "round",
        "line-join": "round"
      },
      paint: {
        "line-color": "#8B3DFF",
        "line-width": 4,
        "line-dasharray": [0.1, 2.2],
        "line-opacity": 0.9
      }
    });

    atlasPlaces.forEach((place) => {
      const marker = document.createElement("div");
      marker.className = "atlas-map-marker-wrap";
      marker.innerHTML = `
        <button class="atlas-map-marker" type="button" aria-label="Open ${place.name} map note"></button>
        <span class="atlas-map-label">${place.name}</span>
      `;

      new maplibregl.Marker({ element: marker, anchor: "bottom" })
        .setLngLat(place.coordinates)
        .setPopup(
          new maplibregl.Popup({
            closeButton: true,
            closeOnClick: true,
            offset: 24
          }).setHTML(popupMarkup(place))
        )
        .addTo(map);
    });
  });
}

window.addEventListener("DOMContentLoaded", initBibleAtlasMap);
