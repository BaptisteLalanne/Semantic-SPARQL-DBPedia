import { listeRequest } from "./liste_request.js";

document.addEventListener("DOMContentLoaded", makeSearch);
function makeSearch(event) {

    console.log("keyword_search.js");
    // get dom elements
    let results_container = document.querySelector("#results_container");
    let teams_container = document.querySelector("#teams_container");
    let teams_results = document.querySelector("#teams_results");
    let players_container = document.querySelector("#players_container");
    let players_results = document.querySelector("#players_results");
    let span_searched = document.querySelector("span#searched");
    let searchInput = document.getElementById("searchInput");
    // Value written in the search field
    let dynamicValue = searchInput.value;
    let search_query;
    // Difference between fist loading and next ones
    if(event.type == "input"){
        search_query = dynamicValue;
        showLittleSpinner();
    } else{
        // get query parameters (GET)
        let params = get_query();
        search_query = params["search"].replace("+", " ");
        searchInput.value = search_query;
    }
    // Make query on each input
    searchInput.oninput = makeSearch ;

    // display query
    span_searched.innerHTML = search_query

    let request = "";

    // do team search
    request = listeRequest.searchTeam(search_query)
    search(request, (data) => {
        // if dynamic reseach, need to clean old result
        if(dynamicValue){
            // clean old results
            teams_results.innerHTML = '';
        }
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

    });

    // do player search
    request = listeRequest.searchPlayer(search_query)
    search(request, (data) => {
        if(dynamicValue){
            // clean old results
            players_results.innerHTML = '';
        }
        // format results in dictionnary
        let objects_found = data.results.bindings;
        let players_found = {};

        for (let o of objects_found) {
            let tmp_resource = o["lienDuJoueur"]["value"].split("/");
            players_found[o["nomDuJoueur"]["value"]] = tmp_resource[tmp_resource.length-1]
        }

        // display players
        for (let p of Object.keys(players_found)) {
            display_player(players_results, p, players_found[p]);
        }

        if(event.type == "input"){
            hideLittleSpinner();
        } else{
            hideSpinner();
        }
        showContent();
    });

}

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

    let displayed_name = player_name.split("/");
    displayed_name = displayed_name[displayed_name.length-1]
    displayed_name = displayed_name.replace("_", " ");

    let container = e("div", "", parent, "col-lg-4 col-md-6 p-2");
    
    let ticket;
    if (disabled)
        ticket = e("div", "", container, "ticket h-100 disabled");
    else
        ticket = e("div", "", container, "ticket h-100");
    
    let link;
    if (disabled) {
        link = e("p", displayed_name, ticket, "w-100 h-100 p-3");
    } else {
        link = e("a", displayed_name, ticket, "w-100 h-100 p-3");
    }
    link.href = "./player.html?resource=" + encodeURIComponent(resource);
}

function hideSpinner() {
    document.getElementById('spinner').remove();
    document.getElementById('middleSpinner').remove();
}

function hideContent() {
    document.getElementById("results_container").style.display = 'none';
}

function showContent() {
    document.getElementById("results_container").style.display = 'block';
}

function showLittleSpinner() {
    document.getElementById('little-spinner').style.display = 'block';
}

function hideLittleSpinner() {
    document.getElementById("little-spinner").style.display = 'none';
}
