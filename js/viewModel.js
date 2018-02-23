function ViewModel(){
  var self = this;

  self.filter = ko.observable('');

  self.places = ko.observableArray();

  locations.forEach(function(location) {
    self.places.push(new Constructor(location))
  })

  self.visiblePlaces = ko.computed(function() {
    var filter = self.filter().toLowerCase();{
      return ko.utils.arrayFilter(self.places(), function(item) {
        var result = (item.title.toLowerCase().search(filter) >=0);
        if(item.marker){
          item.marker.setVisible(result);
        }
        item.marker.addListener('click', function(){
          populateInfoWindow(this, largeInfowindow);
          item.marker.setAnimation(4);
        })
        return result;
      });
    }
  })
}
