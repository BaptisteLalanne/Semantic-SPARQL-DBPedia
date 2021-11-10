/*
------------------------------------------------------
                TESTING PURPOSE
------------------------------------------------------
*/

document.addEventListener("DOMContentLoaded", function() {
    let req_exemple = `
        select distinct ?Concept
        where {
            [] a ?Concept
        } LIMIT 100
    `;

    search(req_exemple, (data) => {console.log(data)});
})



