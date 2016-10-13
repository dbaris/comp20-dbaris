var map;
var myLat = 0;
var myLng = 0;

var stations = [
	[42.352271, -71.05524200000001],
	[42.330154, -71.057655],
	[42.3884, -71.11914899999999],
	[42.373362, -71.118956],
	[42.320685, -71.052391],
	[42.31129, -71.053331],
	[42.35639457, -71.0624242],
	[42.342622, -71.056967],
	[42.275275, -71.029583],
	[42.29312583 | -71.06573796000001],
	[42.39674, -71.121815],
	[42.395428, -71.142483],
	[42.36249079, -71.08617653],
	[42.361166, -71.070628],
	[42.355518, -71.060225],
	[42.251809, -71.005409],
	[42.233391, -71.007153],
	[42.284652, -71.06448899999999], 
	[42.2665139, -71.0203369],
	[42.300093, -71.061667],
	[42.365486, -71.103802],
	[42.2078543, -71.0011385]];



function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			loadMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}



function loadMap () {

	map = new google.maps.Map(document.getElementById('map'), {
        /* MAKE DYNAMIC !! */
        center: {lat: myLat, lng: myLng},
        zoom: 11
    });

	for (i = 0; i < stations.length; i++) {
		var marker = new google.maps.Marker({
          	position: {lat: stations[i][0], lng: stations[i][1]},
          	map: map,
          	icon: "images/boston-T.png"
   		});
	}

    

    /* LOAD STATIONS HERE */
}
