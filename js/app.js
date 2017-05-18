var map;
var model = {
  locations: [
    {title: 'Kaffa', location: {lat: 33.7816642, lng: -117.8705335}, type: 'Coffee'},
    {title: 'The Tulsa Rib Company', location: {lat: 33.8088563, lng: -117.8537571}, type: 'Other'},
    {title: 'Nguyen\'s Kitchen', location: {lat: 33.7815967, lng: -117.8692298}, type: 'Asian'},
    {title: 'Bruxie', location: {lat: 33.7913008, lng: -117.8536319}, type: 'Other'},
    {title: 'Lanta Thai Fusion', location: {lat: 33.8088, lng: -117.8459}, type: 'Asian'},
    {title: 'Felix Cafe', location: {lat: 33.7875, lng: -117.8535}, type: 'Hispanic'}
  ]
};

var viewModel = {
  markers: [],
  foodList: ko.observableArray([]),
  searchFilter: ko.observableArray(['','Hispanic','Asian','Coffee','Other']),
  filter: ko.observable(''),

  getFood: function(){
    for(var i = 0;i < model.locations.length;i++){
      this.foodList.push(model.locations[i]);
    }
  },
  activateMarker: function(food){
    console.log(food.location.lat);
    console.log(food.type);
    bounceMarker(food.title);
  }
};

viewModel.filteredList = ko.computed(function(){
  var filter = viewModel.filter();
  var visMarkers = [];
  if(filter === ''){
    for(var i = 0;i < viewModel.markers.length;i++){
      viewModel.markers[i].setMap(map);
    }
    return viewModel.foodList();
  }
  else{
    for(var i = 0;i < viewModel.markers.length;i++){
      for(var j = 0;j<viewModel.foodList().length;j++){
        if(viewModel.foodList()[j].type === filter){
          if(viewModel.markers[i].title === viewModel.foodList()[j].title){
            visMarkers.push(viewModel.markers[i]);
          }
          else{
            viewModel.markers[i].setMap(null);
          }
        }
      }
    }
    for(var i = 0;i<visMarkers.length;i++){
      visMarkers[i].setMap(map);
    }
    return ko.utils.arrayFilter(viewModel.foodList(), function(food){
      //console.log(food.title);
      return food.type === filter;
    });
  }
},viewModel);
console.log(viewModel.filteredList());

// Google Maps functions

function gm_authFailure() { window.alert('Google authentication failure') };


function initMap() {
  var styles = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ];
  map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: 33.7879, lng: -117.8531},
    zoom: 13,
    styles: styles
  });
  var largeInfowindow = new google.maps.InfoWindow();
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < model.locations.length; i++) {
    // Get the position from the location array.
    var position = model.locations[i].location;
    var title = model.locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    viewModel.markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
  }

  showMarkers();
  document.getElementById('show-Markers').addEventListener('click', showMarkers);
  document.getElementById('hide-listings').addEventListener('click', hideListings);
}
// bounces marker corresponding to foodList item clicked
function bounceMarker(title){
  for(var i = 0;i < viewModel.markers.length;i++){
    if(viewModel.markers[i].title === title){
      viewModel.markers[i].setAnimation(google.maps.Animation.BOUNCE);
      // passes current marker into setTimeout to make it work properly
      (function(marker){
        setTimeout(function(){
          marker.setAnimation(null)
        },1400);
      })(viewModel.markers[i])
    }
  }
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
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}
// This function will loop through the markers array and display them all.
function showMarkers() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < viewModel.markers.length; i++) {
    viewModel.markers[i].setMap(map);
    bounds.extend(viewModel.markers[i].position);
  }
  map.fitBounds(bounds);
}
// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < viewModel.markers.length; i++) {
    viewModel.markers[i].setMap(null);
  }
}

viewModel.getFood();
ko.applyBindings(viewModel);
