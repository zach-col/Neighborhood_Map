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
        item.marker.addListener('click', function(){
          populateInfoWindow(this, largeInfowindow);
        });
      });
      return self.places();
    } else {
      return ko.utils.arrayFilter(self.places(), function(item) {
        var result = (item.title.toLowerCase().search(filter) >=0)
        item.marker.setVisible(result);
        item.marker.addListener('click', function(){
          populateInfoWindow(this, largeInfowindow);
        })
        return result;
      });
    }
  })


// Create an onclick event to open an infowindow at each marker.
    // marker.addListener('click', function() {
    //   populateInfoWindow(this, largeInfowindow);
    // });


  // shows marker info when clicked
  this.showInfo = function (data, event) {
      var context = ko.contextFor(event.target);
      google.maps.event.trigger(markers[context.$index()], 'click');
      // bounce google marker
      markers[context.$index()].setAnimation(4);
  };
}

ko.applyBindings(new ViewModel());
