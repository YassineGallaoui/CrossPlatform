class User {
    constructor(id, username, XP, LP, profileImage){
        this._id = id;
        this._username = username;
        this._XP=XP;
        this._LP=LP;
        this._profileImage=profileImage;
    };

    get id() {
        return this._id;
    }
    get username(){
        return this._username;
    }
    get XP(){
        return this._XP;
    }
    get LP(){
        return this._LP;
    }

    get profileImage(){
        return this._profileImage;
    }

    set id(value) {
        this._id = value;
    }

    set username(value) {
        this._username = value;
    }
    set XP(value) {
        this._XP = value;
    }
    set LP(value) {
        this._LP = value;
    }
    set profileImage(value) {
       this._profileImage = value;
    }

}