import { listeRequest } from "./liste_request.js";

const tableRankButton = document.getElementById('table-rank-button');
const qualifiedEuropeButton = document.getElementById('qualified-europe-button');
const statisticsButton = document.getElementById('statistics-button');

const tableRank = document.getElementById('table-rank');
const qualifiedEurope = document.getElementById('qualified-europe');
const statistics = document.getElementById('statistics');

window.addEventListener('load', function (){
    hideAllComponents();
    showTableRank();
});

tableRankButton.addEventListener('click', showTableRank);
qualifiedEuropeButton.addEventListener('click', showQualifiedEurope);
statisticsButton.addEventListener('click', showStatistics);

function showTableRank() {
    if (tableRank.classList.contains('d-none')) {
        hideAllComponents();
        tableRank.classList.remove('d-none');
        tableRankButton.classList.replace('ligue1-button-outline', 'ligue1-button');
    }

    let req = "";
    // filling datalists
    let tab_clubs = {};
    req = listeRequest.rank_club();
    search(req, (data) => {
        let tab_objects = data.results.bindings;

        for (let o of tab_objects) {
            tab_clubs[o["Rank"]["value"]] = o["Clubs"]["value"];
        }

        let rank_node = document.getElementById("table-rank").lastElementChild;
        let i =1;
        for (let t of Object.values(tab_clubs)) {
            let node = rank_node.cloneNode(true);

            let p1 = node.querySelector(".number-rank");
            p1.innerHTML = i.toString();
            let p2 = node.querySelector(".club-name-rank");
            p2.innerHTML = t;
            document.getElementById("table-rank").appendChild(node);
            i++;

        }
        rank_node.remove();
    });

}

function showQualifiedEurope() {
    if (qualifiedEurope.classList.contains('d-none')) {
        hideAllComponents();
        qualifiedEurope.classList.remove('d-none');
        qualifiedEuropeButton.classList.replace('ligue1-button-outline', 'ligue1-button');
    }
}

function showStatistics() {
    if (statistics.classList.contains('d-none')) {
        hideAllComponents();
        statistics.classList.remove('d-none');
        statisticsButton.classList.replace('ligue1-button-outline', 'ligue1-button');
    }
}

function hideAllComponents() {
    tableRankButton.classList.replace('ligue1-button', 'ligue1-button-outline');
    qualifiedEuropeButton.classList.replace('ligue1-button', 'ligue1-button-outline');
    statisticsButton.classList.replace('ligue1-button', 'ligue1-button-outline');

    tableRank.classList.add('d-none');
    qualifiedEurope.classList.add('d-none');
    statistics.classList.add('d-none');
}