maptilersdk.config.apiKey = mapKey;
const mapCoordinates = listing.geometry.coordinates;
const listingLocation = listing.location;

const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.STREETS,
  center: mapCoordinates, // starting position [lng, lat]
  zoom: 14, // starting zoom
});



const marker = new maptilersdk.Marker({
  color: "red",

})
  .setLngLat(mapCoordinates)
  .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML(`<h4>${listingLocation}</h4><p>Exact location after Booking!</p>`))
  .addTo(map);
 