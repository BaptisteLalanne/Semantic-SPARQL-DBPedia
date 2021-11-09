import { listeRequest } from "./liste_request.js";

document.addEventListener("DOMContentLoaded", function() {

    // get dom elements
    let players = document.querySelector("#joueurs");

    console.log("fill_player_select.js loaded!");
    let req = listeRequest.listJoueur();

    search(req, (data) => {

        let tab_objects = data.results.bindings;
        console.log(tab_objects);
        let tab_players = tab_objects.map(x => x["joueursNoms"]["value"])

        for (let p of tab_players) {
            e("option", p, players);
        }

    });
});