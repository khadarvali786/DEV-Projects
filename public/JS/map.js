let key = mapToken;
mapboxgl.accessToken = key;
let coordinates = listing.geometry.coordinates;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  zoom: 12, // starting zoom
});

// console.log(coordinates);
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<strong><h6>${listing.location}</h6></strong><p>This place is fun place.</p>`
);
const marker = new mapboxgl.Marker({color: "red",
})
  .setLngLat(coordinates)
  .setPopup(popup) 
  .addTo(map);



