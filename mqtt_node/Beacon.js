//Class encapsulates the functionality and data of a Beacon Object
module.exports = 

class Beacon{
    constructor(UUID, location){
        this._UUID = UUID;
        this._location = location;
        this._count = 0;
        this._capacity = 0;
        this._location = location;
        this._topic = null;
    }

    //Getters
    get UUID() { return this._UUID; }
    get location() { return this._location; }
    get count() { return this._count; }
    get capacity() { return this._capacity; }
    get topic() { return this._topic }

    //Setters
    set capacity(value) { this._capacity = value; }
    set topic(value) { this._topic = value; }
    addUserCount() { this._count++; };
    decreaseUserCount() {
        if(this._count > 0)
            this._count--;
    };
    addCapacity() { this._capacity++ };
}