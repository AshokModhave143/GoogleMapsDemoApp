// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -33.866, lng: 151.196 },
        zoom: 15
    });

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.getDetails({
        placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                    'Place ID: ' + place.place_id + '<br>' +
                    place.formatted_address + '</div>');
                infowindow.open(map, this);
            });
        }
    });
}

function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

  function initBasicMap() {
      //Creating Maps
      var coords = {lat: 18.5204, lng: 73.8567};
      var options = {
          zoom: 8,
          center: coords
      }      
      var map = new google.maps.Map(document.getElementById('map'), options);

      //Listen to click on map
      google.maps.event.addListener(map, 'click', function(event){
        //Add marker to the map
        addMarker({coords:event.latLng});
      });

      var markers = [
        {
            coords:{lat: 18.5204, lng: 73.8567},
            iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            content: '<h4>Pune City</h4>'
        },
        {
            coords: {lat:19.0760, lng:72.8777},
           iconImage: '',
           content: '<h4>Mumbai City</h4>'
        }
      ];

      var searchBox = new google.maps.places.SearchBox(document.getElementById('fromloc'));
      google.maps.event.addListener(searchBox, 'places_changed', function(){
        var places = searchBox.getPlaces();
        console.log(places);

        var bounds = new google.maps.LatLngBounds();
        var i, place;
        for(i=0; place = places[i]; i++) {
            bounds.extend(place.geometry.location);
            addMarker(place.geometry.location);
        }
        map.fitBounds(bounds);
        map.setZoom(13);
      });

      //Loop through markers
      for(var i = 0; i<markers.length; i++) {
          addMarker(markers[i]);
      }
/*      addMarker({
          coords:{lat: 18.5204, lng: 73.8567},
          iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          content: '<h4>Pune City</h4>'
        });
      addMarker({
          coords: {lat:19.0760, lng:72.8777},
         iconImage: '',
         content: '<h4>Mumbai City</h4>'
     });
*/
/*
      //Add marker to Map
      var marker = new google.maps.Marker({
        position: coords,
        map: map,
        icon: ''
      });

      //Add info window
      var infowindow = new google.maps.InfoWindow({
          content: '<h4>Office Place</h4>'
      });
      marker.addListener('click', function() {
          infowindow.open(map, marker);
      });
*/
      
  function addMarker(props) {
    var marker = new google.maps.Marker({
        position: props.coords,
        map: map//,
        //icon: props.iconImage    //If icon is not provided, it sets it to undefined, we dont want it. So check it below
      });
      if(props.iconImage) {
          marker.setIcon(props.iconImage);
      }
      if(props.content) {
        var infowindow = new google.maps.InfoWindow({
            content: props.content
        });
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
      }
  }
  
  }

  
  function initService() {
    var displaySuggestions = function(predictions, status) {
        document.getElementById('results').innerHTML ='';
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          alert(status);
          return;
        }

        console.log(predictions);

        predictions.forEach(function(prediction) {
          var li = document.createElement('li');
          li.appendChild(document.createTextNode(prediction.description));
          document.getElementById('results').appendChild(li);
        });
      };

      var changeInput = function() {
          var seachvalue = this.value;
          var service = new google.maps.places.AutocompleteService();
          service.getQueryPredictions({ input: seachvalue }, displaySuggestions);
      };

      var searchval = document.getElementById('fromloc');
      searchval.addEventListener('change', changeInput);      
    }