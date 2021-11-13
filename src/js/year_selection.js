import {listeRequest} from "./liste_request.js";
import {loadClubSearch} from "./club_search.js";
import {loadPlayerSearch} from "./player_search.js";

document.addEventListener("DOMContentLoaded", function() {

    let selectionSeason = document.querySelector("#selection-season");

    let yearSeasons = {};

    let req = listeRequest.allSeasons();
    search(req, (data) => {

        let tab_objects = data.results.bindings;
        const actualYear = new Date().getFullYear()

        const regexYear = /[0-9]{4}.[0-9]{2}/
        const regexResource = /[0-9]{4}.*/
        for (let o of tab_objects.reverse()) {
            const year = o["competition"]["value"].match(regexYear)[0];
            const resource = o["competition"]["value"].match(regexResource)[0];
            if (!year.includes((actualYear).toString())) {
                yearSeasons[year] = resource;
            }
        }

        const yearSelected = sessionStorage.getItem('yearSeason');
        for (let year of Object.keys(yearSeasons)) {
            if (yearSeasons[year] === yearSelected || (yearSelected == null && year.includes(actualYear-1))) {
                e("option", year, selectionSeason, null, "selected-year");
                sessionStorage.setItem('yearSeason', yearSeasons[year]);
            } else {
                e("option", year, selectionSeason);
            }
        }

        document.querySelector("#selected-year").setAttribute("selected", "");
        loadClubSearch();
        loadPlayerSearch();

        selectionSeason.addEventListener('change', (event) =>  {
            sessionStorage.setItem('yearSeason', yearSeasons[event.target.value]);
            showSpinner();
            loadClubSearch();
            loadPlayerSearch();
        })

    });
})

function showSpinner() {
    document.getElementById('spinner').classList.remove('d-none');
    document.getElementById('middleSpinner').classList.remove('d-none');
}