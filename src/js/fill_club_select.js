import { listeRequest } from "./liste_request.js";

function e(tag, text, parent, classs=null, id=null) {
	let o = document.createElement(tag)
	o.appendChild(document.createTextNode(text))
	o.id = id
	o.classList.add(classs)
	parent.appendChild(o)
	return o
}

document.addEventListener("DOMContentLoaded", function() {

    // get dom elements
    let clubs = document.querySelector("#clubs");

    console.log("fill_club_select.js loaded!");
    let req = listeRequest.listClub();

    search(req, (data) => {

        let tab_objects = data.results.bindings;
        let tab_clubs = tab_objects.map(x => x["teamName"]["value"])

        for (let c of tab_clubs) {
            e("option", c, clubs);
        }

    });
});