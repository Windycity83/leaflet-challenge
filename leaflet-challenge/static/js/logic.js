// create the tile layer
console.log("Step 1 working");

// create the tile layer for background of the map 
let basemap = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
);


//  create the map object with options.
let map = L.map("map", {
  center: [
    0.7, 94.5
  ],
  zoom: 3
});

// Create 'basemap' tile layer to the map.
basemap.addTo(map);

// Add earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  /// Create circle
      // define marker (in this case a circle)
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // color marker.
  function getColor(depth) {
    switch (true) {
      case depth > 90:
        return "#1f005c";
      case depth > 70:
        return "#5b1060";
      case depth > 50:
        return "#ac255e";
      case depth > 30:
        return "#ca485c";
      case depth > 10:
        return "#e16b5c";
      default:
        return "#ffb56b";
    }
  }  

  // Get radius of the earthquake marker based on its magnitude.
 
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  //  Add a GeoJSON layer to the map 
  L.geoJson(data, {
    // Add circleMarker to the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Select the style for each circleMarker
    style: styleInfo,
    // Create a popup for each marker styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
  }).addTo(map);

  //legend 
  let legend = L.control({
    position: "bottomright"
  });

  
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = [
      "#ffb56b",
      "#e16b5c",
      "#ca485c",
      "#ac255e",
      "#5b1060",
      "#1f005c"
    ];

    
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Add legend to map.
  legend.addTo(map);
});

  