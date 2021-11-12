import { listeRequest } from "./liste_request.js";

document.addEventListener("DOMContentLoaded", function() {

    console.log("club_global_research.js");

    // get dom elements
    let description_result = document.querySelector("#description-element");
    let president_result = document.querySelector("#president_result");
    let teamname_result = document.querySelector("#teamname_result");
    let classement_result = document.querySelector("#classement_result");
    let topscorer_result = document.querySelector("#topscorer_result");
    let entraineurs_result = document.querySelector("#entraineurs_result");
    let joueurs_result = document.querySelector("#players-grid");
    let stadeName_result = document.querySelector("#stadeName_result");
    let stadeSize_result = document.querySelector("#stadeSize_result");
    let largeVictoire_result = document.querySelector("#largeVictoire_result");
    let largeDefaite_result = document.querySelector("#largeDefaite_result");


    // get query parameters (GET)
    let params = get_query();
    let search_query = decodeURI(params["resource"]);
    let request = "";
    request = listeRequest.pageClub(search_query);
    console.log(search_query);
    search(request, (data) => {

        let objects_found = data.results.bindings;
        let description;
        let presidents={};
        let nomClub ;
        let classement;
        let meilleurbuteur;
        let meilleurbuteurLink;
        let entraineurs = {};
        let joueurs= {};
        let nomStade;
        let placesStade;
        let plusLargeVictoire={};
        let plusLargeDefaite={};

        for (let o of objects_found) {
            presidents[o["nomPresident"]["value"]]=o["nomPresident"]["value"];
            entraineurs[o["nomEntraineur"]["value"]]= o["nomEntraineur"]["value"];
            joueurs[o["joueursNoms"]["value"]]= o["joueursLink"]["value"];
            description = o["description"]["value"];
            nomClub= o["nom"]["value"];
            classement= o["classement"]["value"];
            meilleurbuteur= o["meilleurButeur"]["value"];
            meilleurbuteurLink= o["meilleurButeurLink"]["value"];
            nomStade = o["nomStade"]["value"];
            placesStade = o["nombreDePlacesDansLeStade"]["value"];
            plusLargeVictoire[o["plusLargeVictoire"]["value"]] = o["plusLargeVictoire"]["value"];
            plusLargeDefaite[o["plusLargeDefaite"]["value"]] = o["plusLargeDefaite"]["value"];

        }
        // display results
        display_p(description_result, description);
        display_NomClub(teamname_result, nomClub);
        display_p(classement_result, classement);
        display_p(topscorer_result, meilleurbuteur);
        display_p(stadeName_result, nomStade);
        display_p(stadeSize_result, placesStade);

        for (let t of Object.keys(presidents)) {
            display_Entraineurs_Pres(president_result, t);
        }
        for (let t of Object.keys(entraineurs)) {
            display_Entraineurs_Pres(entraineurs_result,t)
        }
        for (let t of Object.keys(joueurs)) {
            let tmp_resource = joueurs[t].split("/");
            tmp_resource = encodeURI(tmp_resource[tmp_resource.length-1]);
            display_Joueurs(joueurs_result,tmp_resource,t);
        }
        for (let t of Object.keys(plusLargeVictoire)) {
            display_Victoires_Defaites(largeVictoire_result,t);
        }
        for (let t of Object.keys(plusLargeDefaite)) {
            display_Victoires_Defaites(largeDefaite_result,t);
        }

        hideSpinner();
        showContent();

    });

});

function display_p(parent, element) {
    let title = e("p", element, parent);
}

function display_NomClub(parent, element) {
    let title = e("h1", element, parent);
}

function display_Entraineurs_Pres(parent, element){
    let div = e("div", "", parent, "element-content");
    let title = e("p",element, div);
}


function display_Joueurs(parent, elementLink, element){
    let divPlayer = e("div", "", parent, "player");
    let divPlayerName = e("div", "", divPlayer, "player-name");
    let title = e("p",element, divPlayerName);
    let divPlayerLink = e("div", "", divPlayer, "player-link");
    let link = e("a", "Fiche joueur", divPlayerLink, "btn ligue1-button-outline");
    link.href="./player.html?resource=" + elementLink;
    // TODO : rediriger le button vers la fiche joueur à l'aide de "elementLink"
}


function display_Victoires_Defaites(parent, element){
    let team1 = element.substring(0, element.indexOf(" "));
    let tmp = element.substring(element.indexOf(" ")+1);
    let team2 = tmp.substring(tmp.indexOf(" ")+1);
    let score = tmp.substring(0,tmp.indexOf(" "));

    let mainDiv  = e("div", "", parent, "many-content");
    let divTeam1 = e("div", "", mainDiv, "element-content team-score");
    let title1 = e("p",team1, divTeam1);
    let divScore = e("div", "", mainDiv, "element-content score");
    let title2 = e("p",score, divScore);
    let divTeam2 = e("div", "", mainDiv, "element-content team-score");
    let title3 = e("p",team2, divTeam2);
}

function hideSpinner() {
    document.getElementById('spinner').remove();
    document.getElementById('middleSpinner').remove();
}

function showContent() {
    document.getElementById("results_container").style.display = 'block';
}
