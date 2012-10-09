var $ = jQuery;

$(document).ready(function(){
    $('#map').width(document.width).height(document.height);
    $('#map').gmap3();
        
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
                        $('#map').gmap3({
                            action:'getAddress',
                            address: _location.street1+" "+ _location.city+" "+_location.postalCode,
                            callback:function(loc){
                                var latlng = loc[0].geometry.location;
                                
                                $.ajax({
                                    url: 'https://maps.googleapis.com/maps/api/place/search/json?location='+latlng.Ya+','+latlng.Xa +'&radius=500&types=restaurant&sensor=true&key=AIzaSyC97Y0B4PZor-L43_tauOFWwOceNWKUEkI',
                                    success: function(places) {
                                        console.log("places here!");
                                        console.log(places);
                                    },
                                    error: function(err){
                                        console.log(err);
                                    }
                                });
                                //https://maps.googleapis.com/maps/api/place/search/json?location=-33.8670522,151.1957362&radius=500&types=restaurant&sensor=true&key=AIzaSyC97Y0B4PZor-L43_tauOFWwOceNWKUEkI
                            }
                        });
                });
            }
            
           // console.log(JSON.stringify(result));
           
        });
}

