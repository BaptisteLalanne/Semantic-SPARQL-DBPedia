import { listeRequest } from "./liste_request.js";

document.addEventListener("DOMContentLoaded", function() {

    // get dom elements
    let clubs = document.querySelector("#clubs");
    let clubs_compare = document.querySelector("#clubs-compare");

    console.log("fill_club_select.js loaded!");
    let req = listeRequest.listClub();

    search(req, (data) => {

        let tab_objects = data.results.bindings;
        let tab_clubs = {};

        for (let o of tab_objects) {
            tab_clubs[o["teamName"]["value"]] = o["team"]["value"]
        }

        for (let c of Object.keys(tab_clubs)) {
            e("option", c, clubs);
            e("option", c, clubs_compare);
        }

    });
});