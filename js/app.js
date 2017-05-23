'use strict';
// map global variable
var map;
// infowindow global variable so that there is only one active at a time.
var largeInfowindow;
// Stored locations of my personal favorites in the area.
var model = {
  locations: [
    {title: 'Kaffa', location: {lat: 33.7816642, lng: -117.8705335}, type: 'Coffee', venue_id: '4adf6d11f964a520727a21e3'},
    {title: 'The Tulsa Rib Company', location: {lat: 33.8088563, lng: -117.8537571}, type: 'Other', venue_id: '4b78bac2f964a520b0df2ee3'},
    {title: 'Nguyen\'s Kitchen', location: {lat: 33.7815967, lng: -117.8692298}, type: 'Asian', venue_id:'564fec23498e64656d8a14b3'},
    {title: 'Bruxie', location: {lat: 33.7913008, lng: -117.8536319}, type: 'Other', venue_id: '4cd091467561236a13082df3'},
    {title: 'Lanta Thai Fusion', location: {lat: 33.8088, lng: -117.8459}, type: 'Asian', venue_id: '5004b531e4b03f55b39be094'},
    {title: 'Felix Cafe', location: {lat: 33.7875, lng: -117.8535}, type: 'Hispanic', venue_id: '4b5cdb17f964a520964729e3'}
  ]
};
// viewmodel for knockoutjs to work correctly
var viewModel = {
  markers: [],
  foodList: ko.observableArray([]),
  // this is the dropdown filter and gives filter its value
  searchFilter: ko.observableArray(['','Hispanic','Asian','Coffee','Other']),
  filter: ko.observable(''),

  getFood: function(){
    for(var i = 0;i < model.locations.length;i++){
      this.foodList.push(model.locations[i]);
    }
  },
  // code for when a marker is activated
  activateMarker: function(food){
    bounceMarker(food.title);
  }
};
// computes the sidebar list based on the value of the searchFilter dropdown
// which is passed into filter.
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
    // iterates over foodList and markers, checking for type and
    // comparing titles to determine which markers should be shown.
    // markers are put in an array and added to the map.
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
      return food.type === filter;
    });
  }
},viewModel);

// Google Maps functions
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
  largeInfowindow = new google.maps.InfoWindow();
  // The following group uses the location array to
  // create an array of markers on initialize.
  for (var i = 0; i < model.locations.length; i++) {
    // Get the position from the location array.
    var position = model.locations[i].location;
    var title = model.locations[i].title;
    var venue_id = model.locations[i].venue_id;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      venue_id: venue_id,
      id: i
    });
    // Push the marker to array of markers.
    viewModel.markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      //populateInfoWindow(this, largeInfowindow);
      bounceMarker(this.title);
    });
  }

  showMarkers();
}

// bounces marker corresponding to foodList item clicked
function bounceMarker(title){
  //var largeInfowindow = new google.maps.InfoWindow();
  for(var i = 0;i < viewModel.markers.length;i++){
    if(viewModel.markers[i].title === title){
      viewModel.markers[i].setAnimation(google.maps.Animation.BOUNCE);
      // passes current marker into setTimeout to make it work properly
      populateInfoWindow(viewModel.markers[i],largeInfowindow);

      (function(marker){
        setTimeout(function(){
          marker.setAnimation(null);
        },1400);
      })(viewModel.markers[i]);
    }
  }
}
// This function populates the infowindow when the marker is clicked.
// We'll only allow one infowindow which will open at the marker
// that is clicked, and populate based on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    // initialize an array for data from foursquare response
    var hours = [];
    // set a timeout to trigger if the ajax request fails
    var requestTimeout = setTimeout(function(){
      window.alert('foursquare request failed.');
    }, 8000);
    var foursquareUrl = 'https://api.foursquare.com/v2/venues/'+marker.venue_id+
    '/hours?client_id=HT3M2LKKTJU1JL1XBWBWPX1VIFTS5IPFVVDN5NF5ODMAFXMF&client_secret=SWOI0NOHXRXJ3H4FNF2BEPTWTIXSQMJ5W3KR3UJVB3Z00MKZ&v=20170501';
    $.ajax(foursquareUrl,{
      dataType: "jsonp",
      success: function(data){
        // if there are no hours listed, replace content with a message
        if(!data.response.hours.timeframes){
          hours.push('No Available Hours');
          // cancels the timeout
          clearTimeout(requestTimeout);
          infowindow.setContent('<div>' + marker.title +'</br>'+ hours[0] +'</div>'+
            '<a href="https://foursquare.com/v/'+ marker.venue_id +'?ref=HT3M2LKKTJU1JL1XBWBWPX1VIFTS5IPFVVDN5NF5ODMAFXMF">Foursquare</a>');
        }
        else{
          // iterate over the foursquare response to acquire daily hours
          for(var i=0;i<data.response.hours.timeframes.length;i++){
            var frame = data.response.hours.timeframes[i];
            for(var j=0;j<frame.days.length;j++){
              hours.push(frame.open[0].start+' - '+frame.open[0].end);
            }
          }
          // cancels the timeout
          clearTimeout(requestTimeout);
          // populates infowindow with hours from foursquare
          infowindow.setContent('<div>' + marker.title +'</br></br>Hours:</br>Mon '+
            hours[0]+'</br>Tue '+
            hours[1]+'</br>Wed '+
            hours[2]+'</br>Thu '+
            hours[3]+'</br>Fri '+
            hours[4]+'</br>Sat '+
            hours[5]+'</br>Sun '+
            hours[6]+'</div>'+
            '<a href="https://foursquare.com/v/'+ marker.venue_id +'?ref=HT3M2LKKTJU1JL1XBWBWPX1VIFTS5IPFVVDN5NF5ODMAFXMF">Foursquare</a>');
        }
      }
    });
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

// callback function for an authentication failure
function gm_authFailure() { window.alert('Google authentication failure'); }

// populate the foodList for filteredList to use
viewModel.getFood();
ko.applyBindings(viewModel);
