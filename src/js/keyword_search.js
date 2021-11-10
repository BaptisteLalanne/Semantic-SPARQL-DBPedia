import { listeRequest } from "./liste_request.js";

document.addEventListener("DOMContentLoaded", function() {

    console.log("do_search.js");

    // get dom elements
    let results_container = document.querySelector("#results_container");
    let teams_container = document.querySelector("#teams_container");
    let teams_results = document.querySelector("#teams_results");
    let players_container = document.querySelector("#players_container");
    let players_results = document.querySelector("#players_results");
    let span_searched = document.querySelector("span#searched");

    // get query parameters (GET)
    let params = get_query();
    let search_query = params["search"].replace("+", " ");

    // display query
    span_searched.innerHTML = search_query

    let request = "";

    // do team search
    request = listeRequest.searchTeam(search_query)
    search(request, (data) => {

        // format results in dictionnary
        let objects_found = data.results.bindings;
        let teams_found = {};
        for (let o of objects_found) {
            let tmp_resource = o["team"]["value"].split("/");
            teams_found[o["teamName"]["value"]] = tmp_resource[tmp_resource.length-1]
        }

        // display teams
        for (let t of Object.keys(teams_found)) {
            display_team(teams_results, t, teams_found[t]);
        }
        hideSpinner();
        showContent();

    });

    // do player search
    request = listeRequest.searchPlayer(search_query)
    search(request, (data) => {

        // format results in dictionnary
        let objects_found = data.results.bindings;
        let players_found = {};
        //console.log(objects_found);

        for (let o of objects_found) {
            let tmp_resource = o["lienDuJoueur"]["value"].split("/");
            players_found[o["nomDuJoueur"]["value"]] = tmp_resource[tmp_resource.length-1]
        }

        // display players
        for (let p of Object.keys(players_found)) {
            display_player(players_results, p, players_found[p]);
        }
        hideSpinner();
        showContent();
        

    });

});

function display_team(parent, team_name, resource) {

    let disabled = false;
    if (resource == "null") 
        disabled = true;

    let container = e("div", "", parent, "col-lg-4 col-md-6 p-2");
    
    let ticket;
    if (disabled)
        ticket = e("div", "", container, "ticket h-100 disabled");
    else
        ticket = e("div", "", container, "ticket h-100");

    let link;
    if (disabled) {
        link = e("p", team_name, ticket, "w-100 h-100 p-3");
    } else {
        link = e("a", team_name, ticket, "w-100 h-100 p-3");
    }
    link.href = "./club.html?resource=" + encodeURIComponent(resource);
}

function display_player(parent, player_name, resource) {

    let disabled = false;
    if (resource == "null") 
        disabled = true;

    let container = e("div", "", parent, "col-lg-4 col-md-6 p-2");
    
    let ticket;
    if (disabled)
        ticket = e("div", "", container, "ticket h-100 disabled");
    else
        ticket = e("div", "", container, "ticket h-100");
    
    let link;
    if (disabled) {
        link = e("p", player_name, ticket, "w-100 h-100 p-3");
    } else {
        link = e("a", player_name, ticket, "w-100 h-100 p-3");
    }
    link.href = "./player.html?resource=" + encodeURIComponent(resource);
}

function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

function showContent() {
    document.getElementById("results_container").style.display = 'block';
}
