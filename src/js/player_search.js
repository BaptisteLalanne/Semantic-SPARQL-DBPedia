import { listeRequest } from "./liste_request.js";

export function loadPlayerSearch() {

    // get dom elements
    let inputJoueurs = document.querySelector("#inputJoueurs");
    let players = document.querySelector("#joueurs");
    let submit_player = document.querySelector("#submit_player");

    $(players).children().remove()

    // disable submit buttons by default
    submit_player.disabled = true;

    // filling datalists
    let tab_players = {};
    let req = listeRequest.listJoueurLien();
    search(req, (data) => {

        let tab_objects = data.results.bindings;

        for (let o of tab_objects) {
            if (o["lienDuJoueur"]["value"] != "null")
                tab_players[o["nomDuJoueur"]["value"]] = o["lienDuJoueur"]["value"]
        }

        for (let p of Object.keys(tab_players)) {
            e("option", p, players);
        }

        submit_player.disabled = false;

    });

    submit_player.addEventListener("click", (e) => {

        let user_input = inputJoueurs.value;
        if (user_input in tab_players) {
            let tmp_resource = tab_players[user_input].split("/");
            window.location.href = "./player.html?resource=" + encodeURI(tmp_resource[tmp_resource.length-1]);
        } else {
            inputJoueurs.classList.add("is-invalid");
        }

    });
    hideSpinner();
    showContent();
}

function hideSpinner() {
    document.getElementById('spinner').classList.add('d-none');
    document.getElementById('middleSpinner').classList.add('d-none');
}

function showContent() {
    document.getElementById("results_container").style.display = 'block';
}
