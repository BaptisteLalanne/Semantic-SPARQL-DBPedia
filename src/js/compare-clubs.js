import { listeRequest } from "./liste_request.js";

document.addEventListener("DOMContentLoaded", () => {

    console.log("compare-clubs.js");

    // get parameters
    let params = get_query();
    let resource1 = decodeURI(params["resource1"]).replace("+", " ");
    let resource2 = decodeURI(params["resource2"]).replace("+", " ");

    // debug messages
    console.log(resource1);
    console.log(resource2);

    // send request for first team
    let req_team1 = listeRequest.compareClub();
    search(req_team1, (data) => {

    });

    // send request for second team
    let req_team2 = listeRequest.compareClub();
    search(req_team2, (data) => {

    });

});