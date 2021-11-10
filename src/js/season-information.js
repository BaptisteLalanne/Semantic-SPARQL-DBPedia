const tableRankButton = document.getElementById('table-rank-button');
const qualifiedEuropeButton = document.getElementById('qualified-europe-button');
const statisticsButton = document.getElementById('statistics-button');
const nationalitiesButton = document.getElementById('nationalities-button');

const tableRank = document.getElementById('table-rank');
const qualifiedEurope = document.getElementById('qualified-europe');
const statistics = document.getElementById('statistics');
const nationalities = document.getElementById('nationalities');

window.addEventListener('load', function (){
    hideAllComponents();
    showTableRank();
});

tableRankButton.addEventListener('click', showTableRank);
qualifiedEuropeButton.addEventListener('click', showQualifiedEurope);
statisticsButton.addEventListener('click', showStatistics);
nationalitiesButton.addEventListener('click', showNationalities);

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

function showNationalities() {
    if (nationalities.classList.contains('d-none')) {
        hideAllComponents();
        nationalities.classList.remove('d-none');
        nationalitiesButton.classList.replace('ligue1-button-outline', 'ligue1-button');
    }
}

function hideAllComponents() {
    tableRankButton.classList.replace('ligue1-button', 'ligue1-button-outline');
    qualifiedEuropeButton.classList.replace('ligue1-button', 'ligue1-button-outline');
    statisticsButton.classList.replace('ligue1-button', 'ligue1-button-outline');
    nationalitiesButton.classList.replace('ligue1-button', 'ligue1-button-outline');

    tableRank.classList.add('d-none');
    qualifiedEurope.classList.add('d-none');
    statistics.classList.add('d-none');
    nationalities.classList.add('d-none');
}