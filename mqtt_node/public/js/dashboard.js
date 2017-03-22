/**
 * Created by yotoo2920 on 3/17/2017.
 */

function initMap() {

    // Gainesville FL (UF)
    var uf = {lat: 29.6436325, lng: -82.3571189};
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: uf
    });

    // for (var city in citymap) {
        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: uf,
            radius: 0.8 * 100
        });
    // }
}


var beaconList;
var socket = io();
socket.emit("request-beacons", {});

socket.on("send-beacons", function(data){
    console.log("here");
    console.log(data);
    beaconList = data;
});