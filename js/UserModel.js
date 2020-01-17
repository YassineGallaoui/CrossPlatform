class UserModel {
    constructor(){
        this._users = [];
    };

    get users() {
        return this._users;
    }

    set users(value) {
        this._users = value;
    }

    makeRanking(val){
        for(let i=0; i<val.length; i++){
            let u = new User();
            u.username=val[i].username;
            u.XP=val[i].xp;
            u.LP=val[i].lp;
            u.profileImage=val[i].img;
            this._users.push(u);
        }
    }
}