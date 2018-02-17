var map;
// Create a new blank array for all the listing markers.
var markers = [];

// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.
var locations = [
  {title: 'WNYC Transmitter Park', location: {lat: 40.7298447, lng: -73.9629572}},
  {title: 'Whitney Museum of American Art', location: {lat: 40.739617, lng: -73.995753}},
  {title: 'Rockwood Music Hall', location: {lat: 40.72913, lng: -73.982531}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'Times Square Theater District', location: {lat: 40.7589542, lng: -73.9937348}},
  {title: 'Empire State building', location: {lat: 40.7484405, lng: -73.9878531}}
];

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });

  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {

    // Get the position from the location array.
    position = locations[i].location;
    markerLat = locations[i].location.lat;
    markerLng = locations[i].location.lng;

    title = locations[i].title;

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: {
        lat: this.markerLat,
        lng: this.markerLng
      },
      title: this.title,
      lat: this.markerLat,
      lng: this.markerLng,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // add to array
    locations[i].marker = marker ;
    // Push the marker to our array of markers.
    markers.push(marker);

    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);
  }

  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
  // Apply bindings
  ko.applyBindings(new ViewModel())

}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('');

    var googleMapContent = '<h1>' + marker.title + '</h1>'

    self.fourSquareRequest = "https://api.foursquare.com/v2/venues/search?ll=" +
      marker.lat +
      "," +
      marker.lng +
      "&query=" +
      marker.title +
      "&v=20150214&m=foursquare&client_secret=CLIENT_SECRET_GOES_HERE&client_id=CLIENT_ID_GOES_HERE"

      // json
      $.getJSON(fourSquareRequest).done(function(marker){
        var response = marker.response.venues[0];
        street = response.location.formattedAddress[0];

        apiContent = '<p><span style="color:green">' + "Street: "+  self.street +'</span></p>'

        infowindow.setContent( googleMapContent + apiContent);
        console.log("made ajax call")
      })

    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

  // Constructor takes locations aray data
  var Constructor = function(data){
    this.marker = data.marker;
    this.title =  data.title;
    this.location = data.location;
  };