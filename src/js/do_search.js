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
    let search_query = params["search"];

    // display query
    span_searched.innerHTML = params["search"]

    let request = "";

    // do team search
    request = listeRequest.searchTeam(params["search"])
    search(request, (data) => {

        // format results in dictionnary
        let objects_found = data.results.bindings;
        let teams_found = {};
        for (let o of objects_found) {
            teams_found[o["teamName"]["value"]] = o["team"]["value"]
        }

        // display teams
        for (let t of Object.keys(teams_found)) {
            display_team(teams_results, t);
        }
        hideSpinner();
        showContent();

    });

    // do player search

});

function display_team(parent, team_name) {
    // TODO: set link to specific team page
    let container = e("div", "", parent, "col-lg-4 col-md-6 m-3 team_container");
    let title = e("h3", team_name, container);
}

function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

function showContent() {
    document.getElementById("results_container").style.display = 'block';
}
