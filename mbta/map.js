var map;
var myLat = 0;
var myLng = 0;
var marker;

var stations = [
	{ 	name: 'South Station',
	 	loc: [42.352271, -71.05524200000001],	 
	  	marker: 0,
	  	times: []
	}, {
		name: 'Andrew',
		loc: [42.330154, -71.057655],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Porter Square',
		loc: [42.3884, -71.11914899999999],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Harvard Square', 
		loc: [42.373362, -71.118956],
      	marker: 0,
      	times: []
  
	}, {
		name: 'JFK/UMass',
		loc: [42.320685, -71.052391],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Savin Hill',
		loc: [42.31129, -71.053331],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Park Street',
		loc: [42.35639457, -71.0624242],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Broadway',
		loc: [42.342622, -71.056967],
      	marker: 0,
      	times: []
  
	}, {
		name: 'North Quincy',
		loc: [42.275275, -71.029583],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Shawmut',
		loc: [42.29312583, -71.06573796000001],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Davis',
		loc: [42.39674, -71.121815],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Alewife',
		loc: [42.395428, -71.142483],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Kendall/MIT',
		loc: [42.36249079, -71.08617653],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Charles/MGH',
		loc: [42.361166, -71.070628],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Downtown Crossing',
		loc: [42.355518, -71.060225],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Quincy Center',
		loc: [42.251809, -71.005409],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Quincy Adams',
		loc: [42.233391, -71.007153],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Ashmont',
		loc: [42.284652, -71.06448899999999],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Wollaston',
		loc: [42.2665139, -71.0203369],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Fields Corner', 
		loc: [42.300093, -71.061667],
      	marker: 0,
      	times: []
  
	}, {
		name: 'Central Square',
		loc: [42.365486, -71.103802],
      	marker: 0,
      	times: []
  
	},{
		name:'Braintree',
		loc: [42.2078543, -71.0011385],
      	marker: 0,
      	times: []
  
	}];


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
        center: {lat: myLat, lng: myLng},
        zoom: 13
    });
    

	/* add user location marker*/
    marker = new google.maps.Marker({
    	position: {lat: myLat, lng: myLng},
    	map: map,
    	title: 'Me!'
    });

    var closestStation = getClosestStation();

    var infowindow1 = new google.maps.InfoWindow({
   		content: "<h3> Closest station: " + closestStation[0] + 
   				 "</h3> <p>Only " + closestStation[1] + " miles away!</p>"
  	});

  	var infowindow = new google.maps.InfoWindow();

    var stationCoordinates = [
    	new google.maps.LatLng(myLat, myLng),
    	new google.maps.LatLng(closestStation[2][0], closestStation[2][1]),
    ];

    var lineToStation = new google.maps.Polyline({
          path: stationCoordinates,
          geodesic: true,
          strokeColor: '#b642f4',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

    lineToStation.setMap(map);

    marker.addListener('click', function() {
    	infowindow1.open(map, marker);
    });

    var stationTimes;

    /* Get station data from API */
    var xhr = new XMLHttpRequest();

   	xhr.open("get", "https://rocky-taiga-26352.herokuapp.com/redline.json", true);
	xhr.onreadystatechange = function() {

   		if (xhr.readyState == 4 && xhr.status == 200) {
				stationTimes = JSON.parse(xhr.responseText)["TripList"]["Trips"];
				for (var i = 0; i < stationTimes.length; i++) {
					var predictions = stationTimes[i]["Predictions"];
					for (var j = 0; j < predictions.length; j++) {
						addToTimeList(predictions[j]["Stop"], predictions[j]["Seconds"]);
					}
				}		
		} else if (xhr.status != 200) {
			window.alert("Error connecting to MBTA server! Refresh.");
		}

		/* Add station markers */
		for (i = 0; i < stations.length; i++) {
			var sortedTimes = stations[i]["times"].sort(function (a, b) {
			  return a - b;
			});

			//console.log(sortedTimes);

			stations[i]["marker"] = new google.maps.Marker({
	          	position: {lat: stations[i]["loc"][0], lng: stations[i]["loc"][1]},
	          	map: map,
	          	title: stations[i]["name"] + "<p>Train Times (in seconds): " + sortedTimes + "</p>",
	          	icon: "images/boston-T.png"
	   		});

	   		stations[i]["infoWindow"] = new google.maps.InfoWindow({
		   		content: stations[i]["name"]
		  	});

	   		stations[i]["marker"].addListener('click', function() {
	   			infowindow.setContent(this.title);
	   			infowindow.open(map, this);
	   		});	 		
		}

   	}

   	xhr.send();

	drawRedLine(map);
}

function addToTimeList(stopName, time) {
	for (var i = 0; i < stations.length; i++) {
		if (stopName === stations[i]["name"]) {
			//console.log(time);
			stations[i]["times"][stations[i]["times"].length] = time;
			break;
		}
	}

}

function drawRedLine(map) {

	var lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.395428, -71.142483),
    			 new google.maps.LatLng(42.39674, -71.121815)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
	lineToStation.setMap(map);

	// davis -> porter
	lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.39674, -71.121815), 
          		 new google.maps.LatLng(42.3884, -71.11914899999999)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // porter -> harvard
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.3884, -71.11914899999999),
    			 new google.maps.LatLng(42.373362, -71.118956)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // harvard -> central
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.373362, -71.118956),
    			 new google.maps.LatLng(42.365486, -71.103802)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);


	// central -> kendall/mit
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.365486, -71.103802),
    			 new google.maps.LatLng(42.36249079, -71.08617653)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // kendall/mit -> charles/MGH
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.36249079, -71.08617653), 
          		 new google.maps.LatLng(42.361166, -71.070628)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // charles/MGH -> park
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.361166, -71.070628), 
          		 new google.maps.LatLng(42.35639457, -71.0624242)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);
    
    // park -> downtown crossing
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.35639457, -71.0624242), 
          		 new google.maps.LatLng(42.355518, -71.060225)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // downtown crossing -> south station
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.355518, -71.060225), 
          		 new google.maps.LatLng(42.352271, -71.05524200000001)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // south station -> broadway
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.352271, -71.05524200000001), 
          		 new google.maps.LatLng(42.342622, -71.056967)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // broadway -> andrew
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.342622, -71.056967), 
          		 new google.maps.LatLng(42.330154, -71.057655)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

     // andrew -> jfk/umass
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.330154, -71.057655), 
          		 new google.maps.LatLng(42.320685, -71.052391)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // jfk/umass -> savin hill
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.320685, -71.052391), 
          		 new google.maps.LatLng(42.31129, -71.053331)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

	// savin hill -> field's corner
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.31129, -71.053331), 
          		 new google.maps.LatLng(42.300093, -71.061667)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // field's corner -> shawmut
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.300093, -71.061667), 
          		 new google.maps.LatLng(42.29312583, -71.06573796000001)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // shawmut -> ashmont
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.29312583, -71.06573796000001), 
				 new google.maps.LatLng(42.284652, -71.06448899999999)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

     // jfk/umass -> north quincy
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.320685, -71.052391), 
          		 new google.maps.LatLng(42.275275, -71.029583)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // north quincy -> wollaston
     lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.275275, -71.029583), 
          		 new google.maps.LatLng(42.2665139, -71.0203369)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // wollaston -> quincy center
     lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.2665139, -71.0203369), 
          		 new google.maps.LatLng(42.251809, -71.005409)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // quincy center -> quincy adams
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.251809, -71.005409), 
          		 new google.maps.LatLng(42.233391, -71.007153)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);

    // quincy adams -> braintree
    lineToStation = new google.maps.Polyline({
          path: [new google.maps.LatLng(42.233391, -71.007153), 
          		 new google.maps.LatLng(42.2078543, -71.0011385)],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
    });
    lineToStation.setMap(map);
}


function getClosestStation() {
	var lat1 = myLat;
	var lon1 = myLng;
	var shortestDist;
	var statName;
	var finalLoc;
	
	for (i = 0; i < stations.length; i++) { 
		var lat2 = stations[i]["loc"][0];
		var lon2 = stations[i]["loc"][1];

		var R = 6371e3; 
	    var φ1 = toRad(lat1);
	    var φ2 = toRad(lat2);
	    var Δφ = toRad(lat2-lat1);
	    var Δλ = toRad(lon2-lon1);

	    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	            Math.cos(φ1) * Math.cos(φ2) *
	            Math.sin(Δλ/2) * Math.sin(Δλ/2);
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	    var d = R * c;

	    /* convert to miles */
	    d = d * 0.000621371192237;

	    /* round to nearest 100th*/
	    d = Math.round(1000*d)/1000;

	    if (i === 0 | d < shortestDist) {
	    		shortestDist = d;
	    		statName = stations[i]["name"];
	    		finalLoc = stations[i]["loc"];
	    }
	}
      
	return [statName, shortestDist, finalLoc];

}

function toRad(x) {
   return x * Math.PI / 180;
}
