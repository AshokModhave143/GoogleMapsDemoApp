var app = angular.module('GoogleMap');

app.controller('headerController', function($scope){
    $scope.title ="Google Map Locator";
});

app.controller('locationController', function($scope, Map){

    //Search Location

    //Search Predictions
    $scope.place = {};
    $scope.selectedPlace ='';
    $scope.suggestionList = [];

    $scope.search = function() {
        //alert("hello");
        searchLocationService('pune');
    };   

    $scope.searchTextChanged = function() {
        //alert("searchTextChanged" + $scope.searchPlace);
        if($scope.searchPlace) {    
            if($scope.searchPlace.length >= 3) {
                clearSuggestionSection();
                searchSuggestionService($scope.searchPlace);
            }
        }
    };

    $scope.gotoLocation = function(prediction) {
        searchLocationService_usingPlaceId(prediction);
        //searchLocationService({lat: 18.5204, lng: 73.8567});
    };

    function clearSuggestionSection() {
        $scope.suggestionList = [];
    }

    var service;
    function searchLocationService_usingPlaceId(prediction) {
        var request = {
            placeId: prediction.place_id
        };

        var map = new google.maps.Map(document.getElementById('map'), request);
        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, displayLocation);

        function displayLocation(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log("place=" + place.geometry.location);
                console.log(place);
                //addMarker({coords: place.geometry.location});
                searchLocationService(place.geometry.location);                
            }
        }    
    }

    //Custom Helper Function
    function searchSuggestionService(place) {
        var displaySuggestions = function(predictions, status) {
            document.getElementById('results').innerHTML ='';
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                alert(status);
                return;
            }

            console.log(predictions);
            $scope.suggestionList = predictions;

            // predictions.forEach(function(prediction) {
            //     var li = document.createElement('li');
            //     li.appendChild(document.createTextNode(prediction.description));
            //     document.getElementById('results').appendChild(li);
            // });
        };

        service = new google.maps.places.AutocompleteService();
        service.getQueryPredictions({ input: place }, displaySuggestions);  
        //service.getPlacePredictions({input: place}, displaySuggestions);      
    }

    //Search Location and mark it
    function searchLocationService(coords) {
        //Creating Maps
        //var coords = {lat: 18.5204, lng: 73.8567};
        var options = {
            zoom: 8,
            center: coords
        }      
        var map = new google.maps.Map(document.getElementById('map'), options);

        addMarker({coords: coords});
  
        //Listen to click on map
        google.maps.event.addListener(map, 'click', function(event){
          //Add marker to the map
          addMarker({coords:event.latLng});
        });
  /*
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

});