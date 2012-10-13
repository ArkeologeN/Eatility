var $ = jQuery;
var map;
var mapI;
var service;
var infowindow;

$(document).ready(function(){
    $('#map').width(window.innerWidth).height(window.innerHeight);
    buildMap({});
    //$("map").gmap3();
        
});

function onLinkedInLoad() {
    IN.API.Profile("me")
    .fields(["firstName","lastName","twitterAccounts","connections"])
    .result(function(result) {
        //console.log(result);
        //console.log(JSON.stringify(result));
    })
    
    IN.API.Raw('/people/~:(positions' +
                ")")
        .result(function(result){
            //console.log(result);
            if ( typeof result.positions.values == 'object') {
                IN.API.Raw('/companies/'+result.positions.values[0].company.id +':(id,locations:(address))')
                    .result(function(res){
                        var _location = res.locations.values[0].address;
                        initialize(_location);
                });
            }
            
           // console.log(JSON.stringify(result));
           
        });
}




function initialize(addr) {
   //console.log(addr);
   var _addr = addr.street1 + " "+ addr.postalCode + " " + addr.city;
   var locs = null;
    makePlacesFromAddress(_addr);
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: place.icon
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function makePlacesFromAddress(addr) {
    var toReturn = null
    var geocoder = null;
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( {'address': addr}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            toReturn = (results[0].geometry.location);
            //var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);
           // var pyrmont = new google.maps.LatLng(toReturn.Ya,toReturn.Xa);
           var pyrmont = new google.maps.LatLng(toReturn.Xa,toReturn.Ya);
           buildMap({'pyrmont': pyrmont});
           
            var request = {
                location: pyrmont,
                radius: '500',
                types: ['store']
            };

            service = new google.maps.places.PlacesService(map);
            service.search(request, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                }
            });
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
    
    return toReturn;
}

function buildMap (args) {
    var pyrmont = args.pyrmont;// ||  new google.maps.LatLng(151.1956316,-33.8665433);
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: pyrmont,
        zoom: 15
    });
}