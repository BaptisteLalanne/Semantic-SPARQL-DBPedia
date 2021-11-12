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
        equipe1["name"] = object_found[0]["nom"]["value"];
        nom_equipe1.innerHTML = equipe1["name"];

        for (let o of object_found) {
            console.log(victoire_temporaire)
            if(o["plusLargeVictoire"]["value"].split("–").length>1 && !victoire_temporaire.includes(o["plusLargeVictoire"]["value"])) {
                victoire_temporaire.push(o["plusLargeVictoire"]["value"])
                let score = o["plusLargeVictoire"]["value"].split("–");
                let espaceScore1 = score[0].split(" ");
                let tailleScorePart1 = espaceScore1.length;
                let number1 = espaceScore1[tailleScorePart1-1];
                let i=0;
                let newEspaceScore1 = [];
                while(i<tailleScorePart1-1){
                    newEspaceScore1[i] = espaceScore1[i];
                    i++;
                }
                let espaceScore2 = score[1].split(" ");

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
                victoires_larges.push(resultat);
            }
            if(o["plusLargeDefaite"]["value"].split("–").length>1 && !defaite_temporaire.includes(o["plusLargeDefaite"]["value"])) {
                defaite_temporaire.push(o["plusLargeDefaite"]["value"])
                let scoreD = o["plusLargeDefaite"]["value"].split("–");
                let espaceScore1D = scoreD[0].split(" ");
                let tailleScorePart1D = espaceScore1D.length;
                let number1D = espaceScore1D[tailleScorePart1D-1];
                let iD=0;
                let newEspaceScore1D = [];
                while(iD<tailleScorePart1D-1){
                    newEspaceScore1D[iD] = espaceScore1D[iD];
                    iD++;
                }
                let espaceScore2D = scoreD[1].split(" ");

                let number2D = espaceScore2D[0];
                let tailleScorePart2D = espaceScore2D.length;

                let jD=1;
                let newEspaceScore2D = [];
                while(jD<tailleScorePart2D){
                    newEspaceScore2D[jD] = espaceScore2D[jD];
                    jD++;
                }
                let equipeDomicileD = newEspaceScore1D.join(" ");
                let equipeExterieurD = newEspaceScore2D.join(" ");
                let resultatD = [];
                resultatD.push(equipeDomicileD.trim());
                resultatD.push(number1D.trim());
                resultatD.push(number2D.trim());
                resultatD.push(equipeExterieurD.trim());
                defaites_larges.push(resultatD);
            }
        }

        // clone the nodes of the biggestWins
        let biggestWin_node = document.getElementById("largeVictoire_result").lastElementChild;
        for (let t of victoires_larges) {
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
            document.getElementById("largeVictoire_result").appendChild(node);
        }
        biggestWin_node.remove();

        let biggestLose_node = document.getElementById("largeDefaite_result").lastElementChild;
        for (let t of defaites_larges) {
            let node = biggestLose_node.cloneNode(true);
            let div1 = node.querySelector(".team-score.team1");
            let p1 = div1.querySelector("p");
            p1.innerHTML = t[0];
            let div2 = node.querySelector(".element-content.score");
            let p2 = div2.querySelector("p");
            p2.innerHTML = t[1]+"-"+t[2];
            let div3 = node.querySelector(".team-score.team2");
            let p3 = div3.querySelector("p");
            p3.innerHTML = t[3];
            document.getElementById("largeDefaite_result").appendChild(node);
        }
        biggestLose_node.remove();




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
        equipe2["name"] = object_found[0]["nom"]["value"];
        nom_equipe2.innerHTML = equipe2["name"];


        for (let o of object_found) {
            if(o["plusLargeVictoire"]["value"].split("–").length>1 && !victoire_temporaire2.includes(o["plusLargeVictoire"]["value"])) {
                victoire_temporaire2.push(o["plusLargeVictoire"]["value"])
                let score = o["plusLargeVictoire"]["value"].split("–");
                let espaceScore1 = score[0].split(" ");
                let tailleScorePart1 = espaceScore1.length;
                let number1 = espaceScore1[tailleScorePart1-1];
                let i=0;
                let newEspaceScore1 = [];
                while(i<tailleScorePart1-1){
                    newEspaceScore1[i] = espaceScore1[i];
                    i++;
                }
                let espaceScore2 = score[1].split(" ");

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
                victoires_larges2.push(resultat);
            }
            if(o["plusLargeDefaite"]["value"].split("–").length>1 && !defaite_temporaire2.includes(o["plusLargeDefaite"]["value"])) {
                defaite_temporaire2.push(o["plusLargeDefaite"]["value"])
                let scoreD = o["plusLargeDefaite"]["value"].split("–");
                let espaceScore1D = scoreD[0].split(" ");
                let tailleScorePart1D = espaceScore1D.length;
                let number1D = espaceScore1D[tailleScorePart1D-1];
                let iD=0;
                let newEspaceScore1D = [];
                while(iD<tailleScorePart1D-1){
                    newEspaceScore1D[iD] = espaceScore1D[iD];
                    iD++;
                }
                let espaceScore2D = scoreD[1].split(" ");

                let number2D = espaceScore2D[0];
                let tailleScorePart2D = espaceScore2D.length;

                let jD=1;
                let newEspaceScore2D = [];
                while(jD<tailleScorePart2D){
                    newEspaceScore2D[jD] = espaceScore2D[jD];
                    jD++;
                }
                let equipeDomicileD = newEspaceScore1D.join(" ");
                let equipeExterieurD = newEspaceScore2D.join(" ");
                let resultatD = [];
                resultatD.push(equipeDomicileD.trim());
                resultatD.push(number1D.trim());
                resultatD.push(number2D.trim());
                resultatD.push(equipeExterieurD.trim());
                defaites_larges2.push(resultatD);
            }
        }

        console.log(victoires_larges2)

        // clone the nodes of the biggestWins
        let biggestWin_node = document.getElementById("largeVictoire_result2").lastElementChild;
        for (let t of victoires_larges2) {
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
            document.getElementById("largeVictoire_result2").appendChild(node);
        }
        biggestWin_node.remove();

        let biggestLose_node = document.getElementById("largeDefaite_result2").lastElementChild;
        for (let t of defaites_larges2) {
            let node = biggestLose_node.cloneNode(true);
            let div1 = node.querySelector(".team-score.team1");
            let p1 = div1.querySelector("p");
            p1.innerHTML = t[0];
            let div2 = node.querySelector(".element-content.score");
            let p2 = div2.querySelector("p");
            p2.innerHTML = t[1]+"-"+t[2];
            let div3 = node.querySelector(".team-score.team2");
            let p3 = div3.querySelector("p");
            p3.innerHTML = t[3];
            document.getElementById("largeDefaite_result2").appendChild(node);
        }
        biggestLose_node.remove();
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


