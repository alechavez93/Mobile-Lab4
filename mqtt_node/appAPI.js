//Keeps track of the Beacons in our project
var Beacon = require("./Beacon.js");
var beaconsList = [];
const appEndpoint = "/beaconTracker";


//Restful API to communicate with the Android App
exports.run = function (app) {

    app.get(appEndpoint, getHandler);
    app.post(appEndpoint, postHandler);
    app.put(appEndpoint, putHandler);
    app.delete(appEndpoint, deleteHandler);

    function getHandler(req, res) {
        res.send("Hello");
        console.log("GET called");
    }

    function postHandler(req, res) {
        console.log("POST called");
    }

    function putHandler(req, res) {
        console.log("PUT called");
    }

    function deleteHandler(req, res) {
        console.log("DELETE called");
    }
};

//In case a Client Requests the list of Beacons
exports.getBeacons = function(){
    return beaconsList;
}

exports.getBeacon = function(UUID){
    for(var beacon of beaconsList){
        if(beacon.UUID == UUID)
            return beacon;
    }
    return null;
}

exports.addBeacon = function(beacon){
    if(beacon.constructor.name != "Beacon")
        throw new Error("Function addBeacon() takes a Beacon object as parameter");
    //If we don't have that Beacon yet
    if(!exports.getBeacon(beacon.UUID))
        beaconsList.push(beacon);
}


// Tests
exports.test = function(){
    var beacon1 = new Beacon("1234", "lat:1234, long:2345");
    var beacon1_5 = new Beacon("1234", "lat:1234, long:2345");
    var beacon2 = new Beacon("5678", "lat:5678, long:8765");
    var beacon3 = new Beacon("9090", "lat:9090, long:0909");
    exports.addBeacon(beacon1);
    exports.addBeacon(beacon1_5);
    exports.addBeacon(beacon2);
    exports.addBeacon(beacon3);
    console.log(exports.getBeacons());
    console.log("----------------------------");
    console.log(exports.getBeacon("1234"));
}   
// exports.test();