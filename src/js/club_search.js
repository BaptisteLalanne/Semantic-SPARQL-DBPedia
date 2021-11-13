import { listeRequest } from "./liste_request.js";

document.addEventListener("DOMContentLoaded", function() {

    // get dom elements
    let inputClubs = document.querySelector("#inputClubs");
    let clubs = document.querySelector("#clubs");
    let submit_club = document.querySelector("#submit_club");

    let clubs_compare = document.querySelector("#clubs-compare");
    let submit_club_compare = document.querySelector("#submit_club_compare");
    let inputCompareClub1 = document.querySelector("#inputCompareClub1");
    let inputCompareClub2 = document.querySelector("#inputCompareClub2");

    // disable submit buttons by default
    submit_club.disabled = true;
    submit_club_compare.disabled = true;

    // filling datalists
    let tab_clubs = {};
    let req = listeRequest.listClub();
    search(req, (data) => {

        let tab_objects = data.results.bindings;

        for (let o of tab_objects) {
            tab_clubs[o["teamName"]["value"]] = o["team"]["value"]
        }

        for (let c of Object.keys(tab_clubs)) {
            e("option", c, clubs);
            e("option", c, clubs_compare);
        }

        submit_club.disabled = false;
        submit_club_compare.disabled = false;

    });

    submit_club.addEventListener("click", (e) => {

        let user_input = inputClubs.value;
        if (user_input in tab_clubs) {
            console.log("yes")
            let tmp_resource = tab_clubs[user_input].split("/");
            window.location.href = "./club.html?resource=" + encodeURI(tmp_resource[tmp_resource.length-1]);
        } else {
            inputClubs.classList.add("is-invalid");
        }

    });

    submit_club_compare.addEventListener("click", (e) => {

        inputCompareClub1.classList.remove("is-invalid");
        inputCompareClub2.classList.remove("is-invalid");

        let user_input1 = inputCompareClub1.value;
        let user_input2 = inputCompareClub2.value;
        let correct = true;

        if (!(user_input1 in tab_clubs) || user_input1 == user_input2) {
            inputCompareClub1.classList.add("is-invalid");
            correct = false;
        }

        if (!(user_input2 in tab_clubs) || user_input1 == user_input2) {
            inputCompareClub2.classList.add("is-invalid");
            correct = false;
        }

        if (correct) {
            let tmp_resource1 = tab_clubs[user_input1].split("/");
            let tmp_resource2 = tab_clubs[user_input2].split("/");
            let new_url = "./compare-clubs.html?";
            new_url += "resource1=" + encodeURI(tmp_resource1[tmp_resource1.length-1]) + "&";
            new_url += "resource2=" + encodeURI(tmp_resource2[tmp_resource2.length-1]);
            window.location.href = new_url;
        }

    });

});