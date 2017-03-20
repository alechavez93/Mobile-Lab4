//===================================================================================
// for publishing to the embed system
// var mqtt; NOTE: your mqtt object will need to be passed as parameter to your functions (this is called dependecy injection)

//subscription allowed
var topics = ["position1", "position2", "position3", "position4"];
var MAX_CAP_MES = "red";
var NO_MAX_CAP_MES = "off";

//To use the resources from the API
var api = require("./appAPI");
var Beacon = require("./Beacon");

exports.publishMaxCapacity = function(topic, mqtt){
    var newPacket = {
        topic: topic,
        payload: MAX_CAP_MES,
        retain: false,
        qos: 0
    };
    mqtt.publish(newPacket);
}

exports.publishOffMaxCapacity = function (topic, mqtt){
    var newPacket = {
        topic: topic,
        payload: NO_MAX_CAP_MES,
        retain: false,
        qos: 0
    };
    mqtt.publish(newPacket);
}
//===================================================================================