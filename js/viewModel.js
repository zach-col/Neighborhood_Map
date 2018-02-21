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
        var result = (item.title.toLowerCase().search(filter) >=0);
        item.marker.setVisible(result);
        item.marker.addListener('click', function(){
          populateInfoWindow(this, largeInfowindow);
          item.marker.setAnimation(4);
        });
      });  return self.places();
    } else {
      return ko.utils.arrayFilter(self.places(), function(item) {
        var result = (item.title.toLowerCase().search(filter) >=0);
        item.marker.setVisible(result);
        item.marker.addListener('click', function(){
          populateInfoWindow(this, largeInfowindow);
          item.marker.setAnimation(4);
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
  this.showInfo = function (data) {
      // var context = ko.contextFor(event.target);
      // // google.maps.event.trigger(markers[context.$index()], 'click');
      // // bounce google marker
      // markers[context.$index()].setAnimation(4);
      // console.log(data)
      // largeInfowindow.open(map, markers[context.$index()]);
      populateInfoWindow(data.marker, largeInfowindow);
      data.marker.setAnimation(4);
  };
}

ko.applyBindings(new ViewModel());
