import { listeRequest } from "./liste_request.js";

document.addEventListener("DOMContentLoaded", function() {

    console.log("player.js");

    // get dom elements
    let player_name = document.querySelector("#player_name");
    let description = document.querySelector("#description");
    let birth_date = document.querySelector("#birth_date");
    let height = document.querySelector("#height");
    let position = document.querySelector("#position");

    // get query parameters (GET)
    let params = get_query();
    let search_query = params["resource"].replace("+", "_");

    // do player search
    let request = listeRequest.pagePlayer(search_query)

    search(request, (data) => {
        // format results in dictionnary
        let object_found = data.results.bindings;
        let player = {};
        let clubs_found = [];
        let national_teams_found = [];
        player["birthDate"] = object_found[0]["dateDeNaissance"]["value"];
        player["player_name"] = object_found[0]["nomJoueur"]["value"];
        player["description"] = object_found[0]["descriptionJoueur"]["value"];
        player["height"] = object_found[0]["tailleJoueur"]["value"];
        player["position"] = object_found[0]["posteJoueur"]["value"];

        for (let o of object_found) {
            if (!clubs_found.includes(o["historiqueClubJoueur"]["value"]))
                clubs_found.push(o["historiqueClubJoueur"]["value"]);
            if (!national_teams_found.includes(o["nomEquipeNationale"]["value"]))
                national_teams_found.push(o["nomEquipeNationale"]["value"]);
        }


        // display player
        player_name.innerHTML = player["player_name"];
        description.innerHTML = player["description"];
        birth_date.innerHTML = player["birthDate"];
        height.innerHTML = player["height"];
        position.innerHTML = player["position"];

        // clone the node of the clubs
        let clubs_node = document.getElementById("clubs").lastElementChild;
        for(let c of clubs_found) {
            let cln = clubs_node.cloneNode(true);
            let p = cln.querySelector("p");
            p.innerHTML = c;
            document.getElementById("clubs").appendChild(cln);
        }
        clubs_node.remove();


        // clone the node of the national teams
        let national_team_node = document.getElementById("national_teams").lastElementChild;
        for(let x of national_teams_found) {
            let cln = national_team_node.cloneNode(true);
            let p = cln.querySelector("p");
            p.innerHTML = x;
            document.getElementById("national_teams").appendChild(cln);
        }
        national_team_node.remove();

        //hideSpinner();

    });

});



function hideSpinner() {
    document.getElementById('spinner').remove();
    document.getElementById('middleSpinner').remove();
}

