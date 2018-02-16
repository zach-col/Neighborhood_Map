var map;
// Create a new blank array for all the listing markers.
var markers = [];


// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.
var locations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
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
    var position = locations[i].location;
    var title = locations[i].title;

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
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
    infowindow.setContent('<div>' + marker.title + '</div>');
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

function ViewModel(){
  var self = this;

  self.filter = ko.observable('');

  self.places = ko.observableArray();

  locations.forEach(function(location) {
    self.places.push(new Constructor(location))
  })

  self.visiblePlaces = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if(!filter) {
      ko.utils.arrayForEach(self.places(), function (item){
        item.marker.setVisible(true);
      });
      return self.places();
    } else {
      return ko.utils.arrayFilter(self.places(), function(item) {
        var result = (item.title.toLowerCase().search(filter) >=0)
        item.marker.setVisible(result);
        return result;
      });
    }
  })

  // shows marker info when clicked
  this.showInfo = function (data, event) {
      var context = ko.contextFor(event.target);
      google.maps.event.trigger(markers[context.$index()], 'click');
      // bounce google marker
      markers[context.$index()].setAnimation(4);
  };
}

ko.applyBindings(new ViewModel());
