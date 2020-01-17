class OggettoModel {
    constructor(){
        this._oggettiMappa = [];
    };

    get oggettiMappa() {
        return this._oggettiMappa;
    }

    set oggettiMappa(value) {
        this._oggettiMappa = value;
    }

    popolaMappa(result){
        //this._oggettiMappa=[];
        for(let i=0; i<result.length; i++){
                let o = new Oggetto();
                o.id=result[i].id;
                o.latitude=result[i].lat;
                o.longitude=result[i].lon;
                o.type=result[i].type;
                o.size=result[i].size;
                o.name=result[i].name;
                this._oggettiMappa.push(o);
            }
    }

}