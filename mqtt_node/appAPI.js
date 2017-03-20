
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

    app.get(appEndpoint, getHandler(req, res));
    app.post(appEndpoint, postHandler(req, res));
    app.put(appEndpoint, putHandler(req, res));
    app.delete(appEndpoint, deleteHandler(req, res));

    function getHandler(req, res) {
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