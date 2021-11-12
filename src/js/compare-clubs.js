import { listeRequest } from "./liste_request.js";

document.addEventListener("DOMContentLoaded", () => {

    console.log("compare-clubs.js");

    // get parameters
    let params = get_query();
    let resource1 = decodeURI(params["resource1"]).replace("+", "_");
    let resource2 = decodeURI(params["resource2"]).replace("+", "_");

    // debug messages
    console.log(resource1);
    console.log(resource2);

    let req_team1 = listeRequest.compareClub(resource1);

    search(req_team1, (data) => {
        let nom_equipe1 = document.getElementById("nomEquipe1");
        let nombre_victoires_1 = document.getElementById("nombreVictoires1");
        let nombre_defaites_1 = document.getElementById("nombreDefaites1");
        let nombre_nuls_1 = document.getElementById("nombreNuls1");
        let buts_marques_1 = document.getElementById("butsMarques1");
        let buts_encaisses_1 = document.getElementById("butsEncaisses1");
        let capacite_stade1 = document.querySelector("#capaciteStade1");
        let classement_equipe1 = document.querySelector("#classementEquipe1");
        let object_found = data.results.bindings;
        let equipe1 = {};
        //equipe1["name"] = object_found[0]["dateDeNaissance"]["value"];
        equipe1["ranking"] = object_found[0]["classement"]["value"];
        classement_equipe1.innerHTML = equipe1["ranking"];
        equipe1["wins"] = object_found[0]["victoires"]["value"];
        nombre_victoires_1.innerHTML = equipe1["wins"];
        equipe1["loss"] = object_found[0]["defaites"]["value"];
        nombre_defaites_1.innerHTML = equipe1["loss"];
        equipe1["draws"] = object_found[0]["matchsNuls"]["value"];
        nombre_nuls_1.innerHTML = equipe1["draws"];
        equipe1["goalsFor"] = object_found[0]["nombresButsMarques"]["value"];
        buts_marques_1.innerHTML = equipe1["goalsFor"];
        equipe1["goalsAgainst"] = object_found[0]["nombresButsEncaisses"]["value"];
        buts_encaisses_1.innerHTML = equipe1["goalsAgainst"];
        equipe1["groundCapacity"] = object_found[0]["nombreDePlacesDansLeStade"]["value"];
        capacite_stade1.innerHTML = equipe1["groundCapacity"];
        hideSpinner();
        showContent();
    });

    let req_team2 = listeRequest.compareClub(resource2);
    search(req_team2, (data) => {
        let nom_equipe2 = document.querySelector("#nomEquipe2");
        let nombre_victoires_2 = document.getElementById("nombreVictoires2");
        let nombre_defaites_2 = document.getElementById("nombreDefaites2");
        let nombre_nuls_2 = document.getElementById("nombreNuls2");
        let buts_marques_2 = document.getElementById("butsMarques2");
        let buts_encaisses_2 = document.getElementById("butsEncaisses2");
        let capacite_stade2 = document.querySelector("#capaciteStade2");
        let classement_equipe2 = document.querySelector("#classementEquipe2");
        let object_found = data.results.bindings;
        let equipe2 = {};
        //equipe2["name"] = object_found[0]["dateDeNaissance"]["value"];
        equipe2["ranking"] = object_found[0]["classement"]["value"];
        classement_equipe2.innerHTML = equipe2["ranking"];
        equipe2["wins"] = object_found[0]["victoires"]["value"];
        nombre_victoires_2.innerHTML = equipe2["wins"];
        equipe2["loss"] = object_found[0]["defaites"]["value"];
        nombre_defaites_2.innerHTML = equipe2["loss"];
        equipe2["draws"] = object_found[0]["matchsNuls"]["value"];
        nombre_nuls_2.innerHTML = equipe2["draws"];
        equipe2["goalsFor"] = object_found[0]["nombresButsMarques"]["value"];
        buts_marques_2.innerHTML = equipe2["goalsFor"];
        equipe2["goalsAgainst"] = object_found[0]["nombresButsEncaisses"]["value"];
        buts_encaisses_2.innerHTML = equipe2["goalsAgainst"];
        equipe2["groundCapacity"] = object_found[0]["nombreDePlacesDansLeStade"]["value"];
        capacite_stade2.innerHTML = equipe2["groundCapacity"];
        hideSpinner();
        showContent();
    });

});


function showContent() {
    document.getElementById("results_container").style.display = 'block';
}

function hideSpinner() {
    document.getElementById('spinner').remove();
    document.getElementById('middleSpinner').remove();
}