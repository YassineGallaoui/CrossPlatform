class Oggetto {
    constructor(idO, lati, longi, type, size, name){
        this._id=parseInt(idO);
        this._latitude=parseFloat(lati);
        this._longitude=parseFloat(longi);
        this._type=type;
        this._size=size;
        this._name=name;
    };

    get id(){
        return this._id;
    }
    get latitude(){
        return this._latitude;
    }
    get longitude(){
        return this._longitude;
    }
    get type(){
        return this._type;
    }
    get size(){
        return this._size;
    }
    get name(){
        return this._name;
    }

    set id(value) {
        this._id = parseInt(value);
    }
    set latitude(value) {
        this._latitude = parseFloat(value);
    }
    set longitude(value) {
        this._longitude = parseFloat(value);
    }
    set type(value) {
        this._type = value;
    }
    set size(value) {
        this._size = value;
    }
    set name(value) {
        this._name = value;
    }
}