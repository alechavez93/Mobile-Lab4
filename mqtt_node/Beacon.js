//Class encapsulates the functionality and data of a Beacon Object
module.exports = 

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