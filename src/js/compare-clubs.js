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
    let req_team2 = listeRequest.compareClub(resource2);

    let statsEquipes = {
        "nom_equipe" : {},
        "nombre_victoires" : {},
        "nombre_defaites" : {},
        "nombre_nuls" : {},
        "buts_marques" : {},
        "buts_encaisses" : {},
        "capacite_stade" : {},
        "classement" : {}
    }

    search(req_team1, (data) => {
        statsEquipes["nom_equipe"][1] = document.getElementById("nomEquipe1");
        statsEquipes["nombre_victoires"][1] = document.getElementById("nombreVictoires1");
        statsEquipes["nombre_defaites"][1] = document.getElementById("nombreDefaites1");
        statsEquipes["nombre_nuls"][1] = document.getElementById("nombreNuls1");
        statsEquipes["buts_marques"][1] = document.getElementById("butsMarques1");
        statsEquipes["buts_encaisses"][1] = document.getElementById("butsEncaisses1");
        statsEquipes["capacite_stade"][1] = document.querySelector("#capaciteStade1");
        statsEquipes["classement"][1] = document.querySelector("#classementEquipe1");
        let object_found_1 = data.results.bindings;
        // pour stocker les victoires et défaites
        let victoires_larges = [];
        let defaites_larges = [];
        // pour eviter les doublons
        let defaite_temporaire = [];
        let victoire_temporaire = [];

        for (let o of object_found_1) {
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


        search(req_team2, (data) => {
            statsEquipes["nom_equipe"][2] = document.querySelector("#nomEquipe2");
            statsEquipes["nombre_victoires"][2] = document.getElementById("nombreVictoires2");
            statsEquipes["nombre_defaites"][2] = document.getElementById("nombreDefaites2");
            statsEquipes["nombre_nuls"][2] = document.getElementById("nombreNuls2");
            statsEquipes["buts_marques"][2] = document.getElementById("butsMarques2");
            statsEquipes["buts_encaisses"][2] = document.getElementById("butsEncaisses2");
            statsEquipes["capacite_stade"][2] = document.querySelector("#capaciteStade2");
            statsEquipes["classement"][2] = document.querySelector("#classementEquipe2");
            let object_found_2 = data.results.bindings;
            let victoires_larges2 = [];
            let defaites_larges2 = [];
            let defaite_temporaire2 = [];
            let victoire_temporaire2 = [];

            for (let o of object_found_2) {
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

            putDatasInPage(statsEquipes, object_found_1, object_found_2)

            hideSpinner();
        });

    });

});

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

function putDatasInPage(statsEquipes,object_found_1,object_found_2) {

    statsEquipes["nom_equipe"][1].innerHTML = object_found_1[0]["nom"]["value"];
    statsEquipes["nombre_victoires"][1].innerHTML = object_found_1[0]["victoires"]["value"];
    statsEquipes["nombre_defaites"][1].innerHTML = object_found_1[0]["defaites"]["value"];
    statsEquipes["nombre_nuls"][1].innerHTML = object_found_1[0]["matchsNuls"]["value"];
    statsEquipes["buts_marques"][1].innerHTML = object_found_1[0]["nombresButsMarques"]["value"];
    statsEquipes["buts_encaisses"][1].innerHTML = object_found_1[0]["nombresButsEncaisses"]["value"];
    statsEquipes["capacite_stade"][1].innerHTML = object_found_1[0]["nombreDePlacesDansLeStade"]["value"];
    statsEquipes["classement"][1].innerHTML = object_found_1[0]["classement"]["value"];

    statsEquipes["nom_equipe"][2].innerHTML = object_found_2[0]["nom"]["value"];
    statsEquipes["nombre_victoires"][2].innerHTML = object_found_2[0]["victoires"]["value"];
    statsEquipes["nombre_defaites"][2].innerHTML = object_found_2[0]["defaites"]["value"];
    statsEquipes["nombre_nuls"][2].innerHTML = object_found_2[0]["matchsNuls"]["value"];
    statsEquipes["buts_marques"][2].innerHTML = object_found_2[0]["nombresButsMarques"]["value"];
    statsEquipes["buts_encaisses"][2].innerHTML = object_found_2[0]["nombresButsEncaisses"]["value"];
    statsEquipes["capacite_stade"][2].innerHTML = object_found_2[0]["nombreDePlacesDansLeStade"]["value"];
    statsEquipes["classement"][2].innerHTML = object_found_2[0]["classement"]["value"];

    assignColor(statsEquipes["classement"][1], statsEquipes["classement"][2], false);
    assignColor(statsEquipes["nombre_victoires"][1], statsEquipes["nombre_victoires"][2], true);
    assignColor(statsEquipes["nombre_defaites"][1], statsEquipes["nombre_defaites"][2], false);
    assignColor(statsEquipes["buts_marques"][1], statsEquipes["buts_marques"][2], true);
    assignColor(statsEquipes["buts_encaisses"][1], statsEquipes["buts_encaisses"][2], false);
    assignColor(statsEquipes["capacite_stade"][1], statsEquipes["capacite_stade"][2], true);
}

function assignColor(node1, node2, betterIfPlus) {
    const value1 = parseInt(node1.innerHTML);
    const value2 = parseInt(node2.innerHTML);
    if(value1 !== value2) {
        if (betterIfPlus) {
            value1 > value2 ? node1.parentNode.classList.add('team-score') : node2.parentNode.classList.add('team-score');
        } else {
            value1 > value2 ? node2.parentNode.classList.add('team-score') : node1.parentNode.classList.add('team-score');
        }
    }
}