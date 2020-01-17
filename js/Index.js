var play = {
    initialize: function() {
        this.bindEvents();

    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        play.receivedEvent('deviceready');
        richiedoId();
    },

    receivedEvent: function(id) {

    }
};

var mapObjects;
var sessionId;

/*FUNZIONI IN INDEX*/

function richiedoId() {
    if (localStorage.getItem("session_id") === null) {
        $.ajax({
            method: 'post',
            url: "https://ewserver.di.unimi.it/mobicomp/mostri/register.php",
            dataType: 'json',
            success: function (result) {
                console.log(result);
                sessionId=result.session_id;
                console.log(sessionId);
                localStorage.setItem("session_id", JSON.stringify(sessionId));
            },
            error: function (error) {
                console.error(error);
            }
        });
    } else {
        sessionId = JSON.parse(localStorage.getItem("session_id"));
    }
    mapLoad();
}

function mapLoad(){
    mapboxgl.accessToken = 'pk.eyJ1IjoieWFzc2luZTk3IiwiYSI6ImNrMzVtZWFwMjA5MmEzZHFqdDRiNGExMzIifQ.gemPT-eRrkMTbxLOB_517w';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [9.185970, 45.468732],
        zoom: 13
    });

    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
                },
                trackUserLocation: true
            })
        );

    $.ajax({ 
        method: 'post',
        url:"https://ewserver.di.unimi.it/mobicomp/mostri/getmap.php",
        data: JSON.stringify({session_id : sessionId}),
        dataType: 'json',
        success: function(result) {

            let geojson = {
              type: 'FeatureCollection',
              features: []
            };

            mapObjects= new OggettoModel();
            mapObjects.popolaMappa(result.mapobjects);

            for(let i=0; i<mapObjects.oggettiMappa.length; i++){
                let o = mapObjects.oggettiMappa[i];
                let urlIcona;
                if(o.type==="CA")
                    urlIcona="../img/candy_icon.png";
                else urlIcona="../img/monster_icon.png";

                geojson.features.push([]);
                geojson.features[i].type = 'Feature';
                geojson.features[i].geometry = {
                        'type': 'Point',
                        'coordinates': [o.longitude, o.latitude],
                        };
                geojson.features[i].properties = {'icon':{
                        'iconUrl': urlIcona
                        }
                    };

                //add markers to map
                let el = document.createElement('img');
                el.className = 'marker';
                el.setAttribute('src', geojson.features[i].properties.icon.iconUrl+'');
                el.setAttribute('onClick', `inserisciInfoOggetto(${o.id})`);

                new mapboxgl.Marker(el)
                .setLngLat(geojson.features[i].geometry.coordinates)
                .addTo(map);

            }
        },
        error: function(error) {console.error(error); }
    });
}

function inserisciInfoOggetto(idOggetto){
    let o = new Oggetto();
    for(let i=0; i<mapObjects.oggettiMappa.length; i++){
        if(mapObjects.oggettiMappa[i].id===idOggetto){
            o=mapObjects.oggettiMappa[i];
            console.log(o);
            inserisciImmagine(idOggetto);
            $("#nomeOggetto").html(o.name);
            $("#grandezzaOggetto").html("Dimensione: "+o.size);
            document.getElementById("tastoPrim").setAttribute("onclick", "azione("+o.id+")");
            if(o.type==="MO"){
                if(o.size==="S")
                    $("#infoOggetto").html("Puoi guadagnare 1 XP<br>... o perdere da 0 a 50 LP");
                if(o.size==="M")
                    $("#infoOggetto").html("Puoi guadagnare 3 XP<br>... o perdere da 25 a 75 LP");
                if(o.size==="L")
                    $("#infoOggetto").html("Puoi guadagnare 10 XP<br>... o perdere da 50 a 100 LP");
                $("#tastoSec").text("SCAPPA");
                $("#tastoPrim").text("LOTTA");
                
            } else {
                if(o.size==="S")
                    $("#infoOggetto").text("Puoi guadagnare da 0 a 50 LP");
                if(o.size==="M")
                    $("#infoOggetto").text("Puoi guadagnare da 25 a 75 LP");
                if(o.size==="L")
                    $("#infoOggetto").text("Puoi guadagnare da 50 a 100 LP");
                $("#tastoSec").text("NON HO FAME");
                $("#tastoPrim").text("MANGIA");
            }
            return;
        }
    }
    console.log("Sembra che qui non ci sia nulla... continua a cercare !");
}

function inserisciImmagine(idOgg){
        if(localStorage.getItem("imgOggetti") === null) {
                    let array =[];
                    localStorage.setItem("imgOggetti", JSON.stringify(array));
                }
        let arrayLocalS=JSON.parse(localStorage.getItem("imgOggetti"));
            let imgb64="";
            for(let i=0; i<arrayLocalS.length; i++){
                if(arrayLocalS[i][0]===idOgg){
                    imgb64=arrayLocalS[i][1];
                    $("#img").attr("src", "data:image/jpeg;base64, " + imgb64);
                    $("#img2").attr("src", "data:image/jpeg;base64, " + imgb64);
                    visualizzaDivInfoOgg();
                    imgb64="";
                }
                
            }

        if(imgb64===""){    
            $.ajax({ 
                method: 'post',
                url:"https://ewserver.di.unimi.it/mobicomp/mostri/getimage.php",
                data: JSON.stringify({session_id : sessionId, target_id: idOgg}),
                dataType: 'json',
                success: function(result) {
                    let coppiaValori=[idOgg, result.img];
                    arrayLocalS.push(coppiaValori);
                    localStorage.setItem("imgOggetti", JSON.stringify(arrayLocalS));
                    imgb64=result.img;
                    $("#img").attr("src", "data:image/jpeg;base64, " + imgb64);
                    $("#img2").attr("src", "data:image/jpeg;base64, " + imgb64);
                    visualizzaDivInfoOgg();
                    imgb64="";
                },
                error: function(error) {console.error(error); }
            });
        }
}

function visualizzaDivInfoOgg(){
    document.getElementById("rowInfoOgg").style.marginTop = "0%";
}

function visualizzaDivRisOgg(){
    document.getElementById("rowRisOgg").style.marginTop = "-100%";
}

function togliDivInfoOggetto(){
    document.getElementById("rowInfoOgg").style.marginTop = "200%";
}

function chiudiRis(){
    document.getElementById("rowInfoOgg").style.marginTop = "200%";
    document.getElementById("rowRisOgg").style.marginTop = "100%";
}

function azione(idOgg){
    let o = new Oggetto();
    let tipo;
    for(let i=0; i<mapObjects.oggettiMappa.length; i++){
        if(mapObjects.oggettiMappa[i].id===idOgg){
            o=mapObjects.oggettiMappa[i];
            tipo=o.type;
        }
    }
    $.ajax({
        method: 'post',
        url:"https://ewserver.di.unimi.it/mobicomp/mostri/fighteat.php",
        data: JSON.stringify({session_id : sessionId, target_id: idOgg}),
        dataType: 'json',
        success: function(result) {
            console.log(result.died);
            if(tipo==="MO"){
                if(result.died===false)
                    $("#risultato").text("Hai vinto !");
                else
                    $("#risultato").text("Hai perso !");
            } else {
                $("#risultato").text("Caramella mangiata !");
            }
            console.log(result.lp);
            $("#lpDiv").text("Life Points: "+result.lp);
            console.log(result.xp);
            $("#xpDiv").text("Experience Points: "+result.xp);

        },
        error: function(error) {console.error(error); }
    });
    visualizzaDivRisOgg();
}

function riposiziona(){
    //QUA VA IL CODICE PER RIPOSIZIONARE L'UTENTE
}

function daIndexaProfilo(){
    document.getElementById("index").style.display="none";
    document.getElementById("profilo").style.display="block";
    chiediInfoP();
    getRanking();
}










/*FUNZIONI PROFILO E CLASSIFICA (solamente getRanking() e daClassificaaProfilo())*/
function daProfiloaIndex(){
    document.getElementById("profilo").style.display="none";
    document.getElementById("index").style.display="block";
}

function daProfiloaClassifica(){
    document.getElementById("profilo").style.display="none";
    document.getElementById("classifica").style.display="block";
}

function apriLibreria() {
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);


    navigator.camera.getPicture(function cameraSuccess(imageUri) {
        // Do something
        console.log("Immagine caricata: "+imageUri);
        if (imageUri.substr(0, 5) == 'file:') {
            $("#img").attr("src", imageUri);
        }else {
            $("#img").attr("src", "data:image/jpeg;base64, " + imageUri);
        }

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}

function setOptions(srcType) {
    var options = {
        quality: 50,
        //FILE_URI al posto di FILE_URL per evitare problemi di gestione dI memoria
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true
    }
    return options;
}

function chiediInfoP(){
    $.ajax({ 
        method: 'post',
        url:"https://ewserver.di.unimi.it/mobicomp/mostri/getprofile.php",
        data: JSON.stringify({session_id : sessionId}),
        dataType: 'json',
        success: function(result) {
            let username=result.username;
            let xp=result.xp;
            let lp=result.lp;
            let imgP=result.img;
            
            if(imgP!==null)
                $('#img').attr("src", "data:image/jpeg;base64, "+imgP);
            else  $('#img').attr("src", "img/user.png");
            if(username!==null)
                document.getElementById("username").value=username;
                
            $('#exp').html(xp+" XP");
            $('#life').html(lp+" LP");

        },
        error: function(error) { console.error(error); }
    });
}

function saveChanges(bottone){
    let user=$('#username').val();
    let imgProf;
    try{
        imgProf=($('#img').attr('src')).substr(24);
    } catch (e) {
        return;
    }
    
    console.log();
    $.ajax({ 
        method: 'post',
        url:"https://ewserver.di.unimi.it/mobicomp/mostri/setprofile.php",
        data: JSON.stringify({session_id : sessionId, username: user, img: imgProf}),
        dataType: 'json',
        success: function(result) {
            console.log("modifiche salvate : )");
            if(bottone==="index")
                daProfiloaIndex();
            else
                daProfiloaClassifica()
        },
        error: function(error) { console.error(error); }
    });
}


//CLASSIFICA
function daClassificaaProfilo(){
    document.getElementById("classifica").style.display="none";
    document.getElementById("profilo").style.display="block";
}

function getRanking(){
    console.log("ora chiedo le informazioni sulla classifica");
    $.ajax({
        method: 'post',
        url:"https://ewserver.di.unimi.it/mobicomp/mostri/ranking.php",
        data: JSON.stringify({session_id : sessionId}),
        dataType: 'json',
        success: function(result) {
            console.log("informazioni richieste");
            let rankingUsers=new UserModel();
            rankingUsers.makeRanking(result.ranking);

            //let usersArray = result.ranking;
            var position=0;
            //iteriamo su tutti gli elementi dell'array
            for(let u of rankingUsers.users){
                position++;
                //leggiamo i dati di ogni utente
                let username = u.username;
                let xp = u.XP;
                let lp= u.LP;
                let imgUtente= u.profileImage;
                console.log("ora popolo listaUtenti");
                if (imgUtente!= null)
                    $("#listaUtenti").append(`<div class="row"> <div class="col-4 text-center align-self-center"> <span class="rank h3">
                     ${position} </span> </div> <div class="col-4"> <div class="mx-auto"> <img src="data:image/jpeg;base64, ${imgUtente}
                     "class="imgPersone mx-auto d-block"> </div> </div> <div class="col-4 text-center"> <span class=" h5 name"> ${username} </span><br>
                     <span class="exp"> ${xp} XP </span><br> <span class="life"> ${lp} LP </span> </div> </div><hr>`);
                else
                    $("#listaUtenti").append(`<div class="row"> <div class="col-4 text-center align-self-center"> <span class="rank h3"> ${position}
                     </span> </div> <div class="col-4"> <div class="mx-auto"> <img src="img/user.png"class="imgPersone mx-auto d-block">
                     </div> </div> <div class="col-4 text-center"> <span class="h5 name"> ${username} </span><br>
                     <span class="exp"> ${xp} XP </span><br> <span class="life"> ${lp} LP </span> </div> </div><hr>`);
            }
        },
        error: function(error) { console.error(error); }
    });
}