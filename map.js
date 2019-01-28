var map;
var directionsService;
var directionsRenderer;
var originMarker;
var destMarker;

function initMap(){
	let center = {
		lat : 40.532229182216376,
		lng : -74.34168661588154,
	}
	let zoom = 12;

	map = new google.maps.Map(document.getElementById('map'), {
		gestureHandling : 'cooperative',
		zoom: zoom,
		center: center,
		styles: style,
	});

	let markerOptions = {
		draggable : true,
	}
	
	originMarker = new google.maps.Marker({
		draggable:true,
		label : 'A',
		animation : google.maps.Animation.DROP,
	});
	destMarker = new google.maps.Marker({
		draggable : true,
		label : 'B',
		animation : google.maps.Animation.DROP,
	});

	directionsService = new google.maps.DirectionsService();
	directionsRenderer = new google.maps.DirectionsRenderer({
		draggable: true,
		map:map,
		panel : document.getElementById('directons-panel'),
		polylineOptions : {
			strokeWeight : 3,
			strokeColor : '#03fd03'
		},
	});

	let markers = [destMarker,originMarker];

	let cancelEvent = map.addListener('click', event=>{
		let marker = markers.pop();
		marker.setPosition(event.latLng);
		marker.setMap(map);

		if( markers.length<1 ){
			cancelEvent.remove();
			getDirections();
		}
	})
}

function getDirections(){
	directionsService.route({
		origin : originMarker.getPosition(),
		destination : destMarker.getPosition(),
		travelMode : google.maps.TravelMode.TRANSIT,
		unitSystem : google.maps.UnitSystem.METRIC,
		transitOptions : {
			modes: ['BUS','RAIL','SUBWAY'],
			routingPreference : 'LESS_WALKING',
			departureTime : new Date(),
		}
		//waypoints : [],
		//provideRouteAlternatives : true,
	},( results, status )=>{
		if( status!==google.maps.DirectionsStatus.OK ){
			return false;
		}


		directionsRenderer.setDirections(results);
	})
}