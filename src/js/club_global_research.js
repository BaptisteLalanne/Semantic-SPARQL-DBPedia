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

        description_result.innerHTML= description;
        teamname_result.innerHTML = nomClub;
        classement_result.innerHTML = classement;
        topscorer_result.innerHTML = meilleurbuteur;
        stadeName_result.innerHTML = nomStade;
        stadeSize_result.innerHTML = placesStade;

        // clone the node of the presidents
        let presidents_node = document.getElementById("president_result").lastElementChild;
        for (let t of Object.keys(presidents)) {
            let node = presidents_node.cloneNode(true);
            let p = node.querySelector("p");
            p.innerHTML = t;
            document.getElementById("president_result").appendChild(node);
        }
        presidents_node.remove();

        // clone the node of the trainers
        let trainers_node = document.getElementById("entraineurs_result").lastElementChild;
        for (let t of Object.keys(entraineurs)) {
            let node = trainers_node.cloneNode(true);
            let p = node.querySelector("p");
            p.innerHTML = t;
            document.getElementById("entraineurs_result").appendChild(node);
        }
        trainers_node.remove();

        // clone the node of the players
        let players_node = document.getElementById("players-grid").lastElementChild;
        for (let t of Object.keys(joueurs)) {
            let node = players_node.cloneNode(true);
            let p = node.querySelector("p");
            p.innerHTML = t;

            let tmp_resource = joueurs[t].split("/");
            tmp_resource = encodeURI(tmp_resource[tmp_resource.length-1]);
            let a = node.querySelector("a");
            a.href = "./player.html?resource=" + tmp_resource;

            document.getElementById("players-grid").appendChild(node);
        }
        players_node.remove();

        // clone the nodes of the biggestWins
        let biggestWin_node = document.getElementById("largeVictoire_result").lastElementChild;
        for (let t of Object.keys(plusLargeVictoire)) {
            console.log(biggestWin_node);
            let team1 = t.substring(0, t.indexOf(" "));
            let tmp = t.substring(t.indexOf(" ")+1);
            let team2 = tmp.substring(tmp.indexOf(" ")+1);
            let score = tmp.substring(0,tmp.indexOf(" "));

            let node = biggestWin_node.cloneNode(true);
            let div1 = node.querySelector(".team-score.team1");
            console.log(div1);
            let p1 = div1.querySelector("p");
            p1.innerHTML = team1;
            let div2 = node.querySelector(".element-content.score");
            console.log(div2);
            let p2 = div2.querySelector("p");
            p2.innerHTML = score;
            let div3 = node.querySelector(".team-score.team2");
            console.log(div3);
            let p3 = div3.querySelector("p");
            p3.innerHTML = team2;
            document.getElementById("largeVictoire_result").appendChild(node);
        }
        biggestWin_node.remove();


// clone the nodes of the biggestLosts
        let biggestLost_node = document.getElementById("largeDefaite_result").lastElementChild;
        for (let t of Object.keys(plusLargeDefaite)) {
            let team1 = t.substring(0, t.indexOf(" "));
            let tmp = t.substring(t.indexOf(" ")+1);
            let team2 = tmp.substring(tmp.indexOf(" ")+1);
            let score = tmp.substring(0,tmp.indexOf(" "));

            let node = biggestLost_node.cloneNode(true);
            let div1 = node.querySelector(".team-score.team1");
            console.log(div1);
            let p1 = div1.querySelector("p");
            p1.innerHTML = team1;
            let div2 = node.querySelector(".element-content.score");
            console.log(div2);
            let p2 = div2.querySelector("p");
            p2.innerHTML = score;
            let div3 = node.querySelector(".team-score.team2");
            console.log(div3);
            let p3 = div3.querySelector("p");
            p3.innerHTML = team2;
            document.getElementById("largeDefaite_result").appendChild(node);
        }
        biggestLost_node.remove();

        hideSpinner();
        showContent();

    });

});

function hideSpinner() {
    document.getElementById('spinner').remove();
    document.getElementById('middleSpinner').remove();
}

function showContent() {
    document.getElementById("results_container").style.display = 'block';
}
