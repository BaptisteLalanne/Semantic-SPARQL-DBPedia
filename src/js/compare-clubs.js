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
        // pour stocker les victoires et défaites
        let victoires_larges = [];
        let defaites_larges = [];
        // pour eviter les doublons
        let defaite_temporaire = [];
        let victoire_temporaire = [];
        // met les données unitaires dans la page
        putDatasInPage(equipe1,nom_equipe1,nombre_victoires_1, nombre_defaites_1, nombre_nuls_1, buts_marques_1, buts_encaisses_1, capacite_stade1,classement_equipe1,object_found);
        for (let o of object_found) {
            // vérifie que le score est de la forme : equipe1 score1-score2 eqipe2
            if(o["plusLargeVictoire"]["value"].split("–").length>1 && !victoire_temporaire.includes(o["plusLargeVictoire"]["value"])) {
                // on l'ajoute au tableau pour éviter les doublons
                victoire_temporaire.push(o["plusLargeVictoire"]["value"])
                // on exécute l'algo qui récupère le match et ses paramètres
                victoires_larges.push(resultatLargeMatch(o,"victoire"));
            }
            if(o["plusLargeDefaite"]["value"].split("–").length>1 && !defaite_temporaire.includes(o["plusLargeDefaite"]["value"])) {
                defaite_temporaire.push(o["plusLargeDefaite"]["value"])
                defaites_larges.push(resultatLargeMatch(o,"defaite"));
            }
        }
        // on ajoute les données des tableau de matchs à la page
        putScoresInPage("largeVictoire_result", victoires_larges);
        putScoresInPage("largeDefaite_result", defaites_larges);

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
        let victoires_larges2 = [];
        let defaites_larges2 = [];
        let defaite_temporaire2 = [];
        let victoire_temporaire2 = [];
        putDatasInPage(equipe2,nom_equipe2,nombre_victoires_2, nombre_defaites_2, nombre_nuls_2, buts_marques_2, buts_encaisses_2, capacite_stade2,classement_equipe2,object_found);


        for (let o of object_found) {
            if(o["plusLargeVictoire"]["value"].split("–").length>1 && !victoire_temporaire2.includes(o["plusLargeVictoire"]["value"])) {
                victoire_temporaire2.push(o["plusLargeVictoire"]["value"])
                victoires_larges2.push(resultatLargeMatch(o,"victoire"));
            }
            if(o["plusLargeDefaite"]["value"].split("–").length>1 && !defaite_temporaire2.includes(o["plusLargeDefaite"]["value"])) {
                defaite_temporaire2.push(o["plusLargeDefaite"]["value"])
                defaites_larges2.push(resultatLargeMatch(o,"defaite"));
            }
        }

        putScoresInPage("largeVictoire_result2", victoires_larges2);
        putScoresInPage("largeDefaite_result2", defaites_larges2);

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

function resultatLargeMatch(o,type) {
    let score;
    if(type == "victoire") {
        score = o["plusLargeVictoire"]["value"].split("–");
    } else {
        score = o["plusLargeDefaite"]["value"].split("–");
    }
    let espaceScore1;
    if(score[0].split("\t").length>1) { // prise en compte du cas particulier des tabulations au lieu des espaces
        espaceScore1 = score[0].split("\t");
    } else {
        espaceScore1 = score[0].split(" ");
    }
    let tailleScorePart1 = espaceScore1.length;
    let number1 = espaceScore1[tailleScorePart1-1];
    let i=0;
    let newEspaceScore1 = [];
    while(i<tailleScorePart1-1){
        newEspaceScore1[i] = espaceScore1[i];
        i++;
    }
    let espaceScore2;
    if(score[0].split("\t").length>1) {
        espaceScore2 = score[1].split("\t");
    } else {
        espaceScore2 = score[1].split(" ");
    }

    let number2 = espaceScore2[0];
    let tailleScorePart2 = espaceScore2.length;

    let j=1;
    let newEspaceScore2 = [];
    while(j<tailleScorePart2){
        newEspaceScore2[j] = espaceScore2[j];
        j++;
    }
    let equipeDomicile = newEspaceScore1.join(" ");
    let equipeExterieur = newEspaceScore2.join(" ");
    let resultat = [];
    resultat.push(equipeDomicile.trim());
    resultat.push(number1.trim());
    resultat.push(number2.trim());
    resultat.push(equipeExterieur.trim());
    return resultat;
}

function putScoresInPage(id, tabToPrint) {
    // clone the nodes of the biggestWins
    let biggestWin_node = document.getElementById(id).lastElementChild;
    console.log(biggestWin_node);
    for (let t of tabToPrint) {
        let node = biggestWin_node.cloneNode(true);
        let div1 = node.querySelector(".team-score.team1");
        let p1 = div1.querySelector("p");
        p1.innerHTML = t[0];
        let div2 = node.querySelector(".element-content.score");
        let p2 = div2.querySelector("p");
        p2.innerHTML = t[1]+"-"+t[2];
        let div3 = node.querySelector(".team-score.team2");
        let p3 = div3.querySelector("p");
        p3.innerHTML = t[3];
        document.getElementById(id).appendChild(node);
    }
    biggestWin_node.remove();
}

function putDatasInPage(equipe2,nom_equipe2,nombre_victoires_2, nombre_defaites_2, nombre_nuls_2, buts_marques_2, buts_encaisses_2, capacite_stade2,classement_equipe2,object_found) {
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
    equipe2["name"] = object_found[0]["nom"]["value"];
    nom_equipe2.innerHTML = equipe2["name"];

}


