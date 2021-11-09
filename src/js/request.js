console.log("loading request.js...");

/*
------------------------------------------------------
                GENERIC FUNCTIONS
------------------------------------------------------
*/

// send request and get data
// req: request command
// onload: callback function
function search(req, onload) {

    // encoding url
    let url_base = "http://dbpedia.org/sparql";
    let url = url_base + "?query=" + encodeURIComponent(req) + "&format=json";

    // create http request + use callfunction function
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let results = JSON.parse(this.responseText);
            onload(results)
        }
    };

    // sending request
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

console.log("request.js loaded!");
 