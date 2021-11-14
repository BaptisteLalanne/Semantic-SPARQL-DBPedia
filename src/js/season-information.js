import { listeRequest } from "./liste_request.js";

const tableRankButton = document.getElementById('table-rank-button');
const qualifiedEuropeButton = document.getElementById('qualified-europe-button');
const statisticsButton = document.getElementById('statistics-button');

const tableRank = document.getElementById('table-rank');
const qualifiedEurope = document.getElementById('qualified-europe');
const statistics = document.getElementById('statistics');

window.addEventListener('load', function (){
    hideAllComponents();
    loadTableRank();
    loadQualifiedEurope();
    loadStatistics();
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

function loadTableRank() {
    let req = "";
    let tab_clubs = {};
    req = listeRequest.rank_club();
    search(req, (data) => {
        let tab_objects = data.results.bindings;

        for (let o of tab_objects) {
            tab_clubs[o["Rank"]["value"]] = o["Clubs"]["value"];
        }
        let rank_node = document.getElementById("table-rank").lastElementChild;
        let i = 1;

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
    hideSpinner();
    showTableRank()
    tableRank.style.display = 'flex';
}

function loadQualifiedEurope() {
    let championsLeague = [];
    let europaLeague = [];
    let europaConferenceLeague = [];
    let req = listeRequest.qualifiedEurope();
    search(req, (data) => {
        let tab_objects = data.results.bindings;

        for (let o of tab_objects) {
            const championsLeagueValue = o["ChampionsLeague"]["value"];
            const europaLeagueValue = o["EuropaLeague"]["value"];
            const europaConferenceLeagueValue = o["EuropaConferenceLeague"]["value"];
            if (!championsLeague.includes(championsLeagueValue)) championsLeague.push(championsLeagueValue)
            if (!europaLeague.includes(europaLeagueValue)) europaLeague.push(europaLeagueValue)
            if (!europaConferenceLeague.includes(europaConferenceLeagueValue)) europaConferenceLeague.push(europaConferenceLeagueValue)
        }
        const qualifiedEurope = {
            "Champions League" : championsLeague,
            "Europa League" : europaLeague,
            "Europa Conference League" : europaConferenceLeague
        }

        let qualifiedEuropeNode = document.getElementById("qualified-europe");
        let competitionNode = qualifiedEuropeNode.lastElementChild;
        for (let competition of Object.keys(qualifiedEurope)) {
            let node = competitionNode.cloneNode(true);
            node.querySelector(".element-name").querySelector("p").innerHTML = competition;
            let clubsOfCompetitionNode = node.querySelector(".qualified-clubs");
            let clubNode = clubsOfCompetitionNode.lastElementChild;
            for (let clubIndex in qualifiedEurope[competition]) {
                let node = clubNode.cloneNode(true);
                node.querySelector("p").innerHTML = qualifiedEurope[competition][clubIndex];
                clubsOfCompetitionNode.appendChild(node);
            }
            clubNode.remove();
            qualifiedEuropeNode.appendChild(node);
        }
        competitionNode.remove();
    });
    qualifiedEurope.style.display = 'flex';
}

function loadStatistics() {
    let req = listeRequest.statistics();

    function fillValues(tabValues, idElement) {
        let statisticNode = document.getElementById(idElement);
        let valueNode = statisticNode.lastElementChild;
        for (let value of tabValues) {
            let node = valueNode.cloneNode(true);
            node.querySelector("p").innerHTML = value;
            statisticNode.appendChild(node);
        }
        valueNode.remove();
    }

    function fillScoreValues(tabValues, idElement) {
        let statisticNode = document.getElementById(idElement);
        let valueNode = statisticNode.lastElementChild;
        for (let value of tabValues) {
            let node = valueNode.cloneNode(true);
            const regexScore = /\s[0-9]+.[0-9]+\s/
            const score = value.match(regexScore)[0];
            const team1 = value.substring(0,value.indexOf(score));
            const team2 = value.substring(value.indexOf(score)+score.length)
            node.firstElementChild.querySelector("p").innerHTML = team1
            node.lastElementChild.querySelector("p").innerHTML = team2
            node.querySelector(".score").querySelector("p").innerHTML = score.trim()
            statisticNode.appendChild(node);
        }
        valueNode.remove();
    }

    search(req, (data) => {
        let tab_objects = data.results.bindings;

        let tabMeilleurButeur = [];
        let tabPlusLargeVictoireDomicile = [];
        let tabPlusLargeVictoireExterieur = [];
        let tabPlusGrosScore = [];
        let tabPlusLongueSerieVictoire = [];
        let tabPlusLongueSerieDefaite = [];
        let tabPlusLongueSerieSansVictoire = [];
        let tabPlusLongueSerieSansDefaite = [];

        for (let o of tab_objects) {
            const meilleurButeur = o["meilleurButeur"]["value"];
            const plusLargeVictoireDomicile = o["plusLargeVictoireDomicile"]["value"];
            const plusLargeVictoireExterieur = o["plusLargeVictoireExterieur"]["value"];
            const plusGrosScore = o["plusGrosScore"]["value"];
            const plusLongueSerieVictoire = o["plusLongueSerieVictoire"]["value"];
            const plusLongueSerieDefaite = o["plusLongueSerieDefaite"]["value"];
            const plusLongueSerieSansVictoire = o["plusLongueSerieSansVictoire"]["value"];
            const plusLongueSerieSansDefaite = o["plusLongueSerieSansDefaite"]["value"];
            if (!tabMeilleurButeur.includes(meilleurButeur)) tabMeilleurButeur.push(meilleurButeur)
            if (!tabPlusLargeVictoireDomicile.includes(plusLargeVictoireDomicile)) tabPlusLargeVictoireDomicile.push(plusLargeVictoireDomicile)
            if (!tabPlusLargeVictoireExterieur.includes(plusLargeVictoireExterieur)) tabPlusLargeVictoireExterieur.push(plusLargeVictoireExterieur)
            if (!tabPlusGrosScore.includes(plusGrosScore)) tabPlusGrosScore.push(plusGrosScore)
            if (!tabPlusLongueSerieVictoire.includes(plusLongueSerieVictoire)) tabPlusLongueSerieVictoire.push(plusLongueSerieVictoire)
            if (!tabPlusLongueSerieDefaite.includes(plusLongueSerieDefaite)) tabPlusLongueSerieDefaite.push(plusLongueSerieDefaite)
            if (!tabPlusLongueSerieSansVictoire.includes(plusLongueSerieSansVictoire)) tabPlusLongueSerieSansVictoire.push(plusLongueSerieSansVictoire)
            if (!tabPlusLongueSerieSansDefaite.includes(plusLongueSerieSansDefaite)) tabPlusLongueSerieSansDefaite.push(plusLongueSerieSansDefaite)
        }

        fillValues(tabMeilleurButeur, "buteur");
        fillValues(tabPlusLongueSerieVictoire, "serie-victoires");
        fillValues(tabPlusLongueSerieDefaite, "serie-defaites");
        fillValues(tabPlusLongueSerieSansVictoire, "serie-sans-victoires");
        fillValues(tabPlusLongueSerieSansDefaite, "serie-sans-defaites");

        console.log(tabPlusLargeVictoireDomicile)
        console.log(tabPlusLargeVictoireExterieur)
        fillScoreValues(tabPlusLargeVictoireDomicile, "victoire-domicile");
        fillScoreValues(tabPlusLargeVictoireExterieur, "victoire-exterieur");
        fillScoreValues(tabPlusGrosScore, "plus-buts");
    });
    statistics.style.display = 'block';
}

function hideSpinner() {
    document.getElementById('spinner').remove();
    document.getElementById('middleSpinner').remove();
}
