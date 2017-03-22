//Keeps track of the Beacons in our project
var Beacon = require("./Beacon.js");
var beaconsList = [];
const appEndpoint = "/beaconTracker";

//If you wanna call or use mqtt
var mqttManager = require("./mqtt");
var mqtt;

exports.init = function(externalMqtt){
    mqtt = externalMqtt;
};


//Restful API to communicate with the Android App
exports.run = function (app) {

    app.get(appEndpoint, getHandler);
    app.post(appEndpoint, postHandler);
    app.put(appEndpoint, putHandler);
    app.delete(appEndpoint, deleteHandler);

    //If Get we give out the list of Beacons
    function getHandler(req, res) {
        var beacons = exports.getBeacons();
        res.send(beacons);
        console.log("GET called");
    }

    //If Post we add a new Project Beacon
    function postHandler(req, res) {
        var beacon = new Beacon(req.body.UUID, req.body.location);
        exports.addBeacon(beacon);
        res.send("Beacon added to the Project");
        console.log("POST called");
    }

    //If Put just add a new User to a Beacon
    function putHandler(req, res) {
        var UUID = req.body.UUID;
        var beacon = exports.getBeacon(UUID);
        if(beacon) {
            beacon.addUserCount();
            if(beacon.count >= beacon.capacity){
                mqttManager.publishMaxCapacity(beacon.topic, mqtt);
            }
            res.send("User succesfully added to beacon:"+beacon.UUID);
        }else{
            res.send("UUID is not present as one of our Project Beacons");
        }
        console.log("PUT called");
    }

    function deleteHandler(req, res) {
        var UUID = req.body.UUID;
        var beacon = exports.getBeacon(UUID);
        if(beacon) {
            beacon.count = beacon.count-1;
            if(beacon.count >= beacon.capacity){
                mqttManager.publishMaxCapacity(beacon.topic, mqtt);
            }
            res.send("User succesfully removed from beacon:"+beacon.UUID);
        }else{
            res.send("UUID is not present as one of our Project Beacons");
        }
        console.log("DELETE called");
    }
};

//In case a Client Requests the list of Beacons
exports.getBeacons = function(){
    return beaconsList;
};

exports.getBeacon = function(UUID){
    for(var beacon of beaconsList){
        if(beacon.UUID == UUID)
            return beacon;
    }
    return null;
};

exports.getBeaconByTopic = function(topic){
    for(var beacon of beaconsList){
        if(beacon.topic == topic)
            return beacon;
    }
    return null;
};

exports.addBeacon = function(beacon){
    if(beacon.constructor.name != "Beacon")
        throw new Error("Function addBeacon() takes a Beacon object as parameter");
    //If we don't have that Beacon yet
    if(!exports.getBeacon(beacon.UUID))
        beaconsList.push(beacon);
};



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
};
// exports.test();