/**
 * Created by yotoo2920 on 3/17/2017.
 */
function initMap() {
    var uluru = {lat: -20.363, lng: 131.044};
    var map = new google.maps.Map(canvas, {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}

var canvas = document.getElementById("grid");
initMap();