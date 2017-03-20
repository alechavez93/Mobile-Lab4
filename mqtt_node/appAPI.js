
//Keeps track of the Beacons in our project
var beaconsList = [];

class Beacon{
    constructor(UUID, location){
        this._UUID = UUID;
        this._location = location;
        this._count = 0;
        this._capacity = 0;
        this._location = location;
    }

    //Getters
    get UUID() { return this._UUID; }
    get location() { return this._location; }
    get count() { return this._count; }
    get capacity() { return this._capacity; }

    //Setters
    set capacity(value) { this._capacity = value; }
    addUserCount() { this._count++ };
    addCapacity() { this._capacity++ };
}

const appEndpoint = "/beaconTracker";


//Restful API to communicate with the Android App
module.exports = function (app) {

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

    //In case a Client Requests the list of Beacons
    function getBeacons(){
        return beaconsList;
    }
};