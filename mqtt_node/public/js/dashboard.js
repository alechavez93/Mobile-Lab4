/**
 * Created by yotoo2920 on 3/17/2017.
 */
var map;
var beaconLocations = [];

function initMap() {

    // Gainesville FL (UF)
    var center = {lat: 29.649277, lng: -82.343901};
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: center
    });

    // for (var city in citymap) {
        // Add the circle for this city to the map.
        // var cityCircle = new google.maps.Circle({
        //     strokeColor: '#FF0000',
        //     strokeOpacity: 0.8,
        //     strokeWeight: 2,
        //     fillColor: '#FF0000',
        //     fillOpacity: 0.35,
        //     map: map,
        //     center: center,
        //     radius: 0.8 * 100
        // });
    // }

}


var beaconList;
var socket = io();
socket.emit("request-beacons", {});

socket.on("send-beacons", function(data){
    console.log("here");
    console.log(data);
    beaconList = data;
    for(var beacon of beaconList){
        beaconLocations.push(drawCircle(beacon));
    }
});


socket.on("update-beacons", function(data){
    console.log("Update called");
    beaconList = data;
    updateCircles();
});


function drawCircle(beacon){
    var location = beacon._location;
    var count = beacon._count;

    var cityCircle = new google.maps.Circle({
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#2321a8',
        fillOpacity: 0.35,
        map: map,
        center: {lat: location.lat, lng: location.lng},
        radius: 0.8 * 20 + count*5
    });

    return cityCircle;
}

function updateCircles(){
    eraseCircles();
    var i = 0;
    for(var beacon of beaconList){
        var location = beacon._location;
        var count = beacon._count;
        if(count>0) {
            var cityCircle = new google.maps.Circle({
                strokeColor: '#000000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: {lat: location.lat, lng: location.lng},
                radius: 0.8 * 20 + count * 5
            });
            beaconLocations.push(cityCircle);
        }

        else{
            beaconLocations.push(drawCircle(beacon));
        }
        i++;
    }
}

function eraseCircles(){
    for(var circle of beaconLocations){
        circle.setMap(null);
    }
}