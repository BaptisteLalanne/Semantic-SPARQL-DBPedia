export class listeRequest{
    static pageClub = (param) => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select STR(?nomPresident) as ?nomPresident, STR(?nom) as ?nom, STR(?descriptionNoString) as ?description,?resultat as ?classement, STR(?stadeName) as ?nomStade, ?meilleurButeurLink, STR(?meilleurButeur) as ?meilleurButeur, ?nombreDePlacesDansLeStade, STR(?nameCoach) as ?nomEntraineur,STR(?nomsJoueurs) as ?joueursNoms, ?joueurs as ?joueursLink, STR(?plusLargeVictoire_noString) as ?plusLargeVictoire, STR(?plusLargeDefaite_noString) as ?plusLargeDefaite
        where {
        dbr:${param} dbp:leagueResult ?resultat;
        dbo:team ?nomLink;
        dbp:chairman ?nomPresident;
        dbo:abstract ?descriptionNoString;
        dbp:leagueTopscorer ?meilleurButeurLink;
        dbo:manager ?coach;
        dbp:name ?joueurs;
        dbo:ground ?stade.
        ?nomLink dbp:fullname ?nom.
        ?meilleurButeurLink dbp:fullname ?meilleurButeur.
        ?joueurs dbp:name ?nomsJoueurs.
        ?coach dbp:name ?nameCoach.
        ?stade dbo:seatingCapacity ?nombreDePlaces.
        BIND(STR(?nombreDePlaces) as ?nombreDePlacesDansLeStade).
        FILTER(langMatches(lang(?descriptionNoString),"fr"))
        
        bind( "pas de données"  as ?default_win).
        optional {
        dbr:${param} dbp:largestWin ?bigWin.
        }
        bind(coalesce(?bigWin, ?default_win) as ?plusLargeVictoire_noString)
        
        bind( "pas de données"  as ?default_stadeName).
        optional {
        ?stade dbp:fullname ?stadeNameFound.
        }
        optional {
        ?stade dbp:name ?stadeNameFound.
        }
        bind(coalesce(?stadeNameFound, ?default_stadeName) as ?stadeName)
        
        bind( "pas de données"  as ?default_loss).
        optional {
        dbr:${param} dbp:largestLoss ?bigLoss.
        }
        bind(coalesce(?bigLoss, ?default_loss) as ?plusLargeDefaite_noString)
        }`;
    }

    static listClub = () => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdfs: <https://www.w3.org/2000/01/rdf-schema#/>        
        select  ?team ?teamName where {
                    ?team dbo:position dbr:2020–21_Ligue_1.
                    ?team dbo:team ?club.
                    ?club dbp:fullname ?teamName.
                    FILTER(strlen(?teamName) != 0).
        }`
    }

    static listJoueur = () => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select distinct STR(?nomJoueurTerminus) as ?joueursNoms
        where {
        ?team dbo:position dbr:2020–21_Ligue_1.
        ?team dbp:name ?joueurs.
        bind( ?joueurs  as ?default_joueur).
        optional {
        ?club dbo:position dbr:2020–21_Ligue_1.
        ?club dbp:name ?clubJoueur.
        ?clubJoueur dbp:name ?nomsJoueurs.
        }
        bind(coalesce(?nomsJoueurs, ?default_joueur) as ?nomJoueurTerminus)
        } 
        `
    }

    static listJoueurLien = () => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select ?lienDuJoueur, STR(?nomDuJoueur) as ?nomDuJoueur
        where {
            ?team dbo:position dbr:2020–21_Ligue_1.
            bind( "null"  as ?default_name).
            ?team dbp:name ?joueurs.
            optional {
                ?joueurs rdfs:label ?nomsJoueurs.
                FILTER(langMatches(lang(?nomsJoueurs),"en"))
            }
            bind(coalesce(?nomsJoueurs, ?default_name) as ?nomsJoueursNoString)
            bind(IF(?nomsJoueursNoString = ?default_name,?joueurs,?nomsJoueurs) AS ?nomDuJoueur)
            bind(IF(?nomsJoueursNoString = ?default_name,?default_name,?joueurs) AS ?lienDuJoueur)
        } 
        `
    }

    static meilleurButeurParClub = () => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select distinct ?team ?currentSeason ?topScorer Where{ 
            ?team dbo:season dbr:2020–21_Ligue_1; 
            ^dbp:club ?currentSeason . 
            ?currentSeason rdf:type dbo:SportsSeason; 
            dbo:position dbr:2020–21_Ligue_1; 
            dbp:leagueTopscorer ?topScorer. 
            ?topScorer rdf:type dbo:Person. 
            } 
            GROUP BY ?currentSeason 
        `
    }

    static searchTeam = (param) => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdfs: <https://www.w3.org/2000/01/rdf-schema#/>        
        select  ?team ?teamName where {
                    ?team dbo:position dbr:2020–21_Ligue_1.
                    ?team dbo:team ?club.
                    ?club dbp:fullname ?teamName.
                    FILTER(strlen(?teamName) != 0).
                    FILTER(contains(lcase(?teamName),lcase("${param}"))).
        }
        `
    }

    static searchPlayer = (param) => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select ?lienDuJoueur, STR(?nomDuJoueur) as ?nomDuJoueur
        where {
            ?team dbo:position dbr:2020–21_Ligue_1.
            bind( "null"  as ?default_name).
            ?team dbp:name ?joueurs.
            optional {
                ?joueurs rdfs:label ?nomsJoueurs.
                FILTER(langMatches(lang(?nomsJoueurs),"en"))
            }
            bind(coalesce(?nomsJoueurs, ?default_name) as ?nomsJoueursNoString)
            bind(IF(?nomsJoueursNoString = ?default_name,?joueurs,?nomsJoueurs) AS ?nomDuJoueur)
            bind(IF(?nomsJoueursNoString = ?default_name,?default_name,?joueurs) AS ?lienDuJoueur)
            FILTER(contains(lcase(STR(?nomDuJoueur)),lcase("${param}")))
        } 
        `;
    }

    static pagePlayer = (param) => {
        return `
            PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX dbr: <http://dbpedia.org/resource/>
            PREFIX dbp: <http://dbpedia.org/property/>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            select STR(?nom) as ?nomJoueur, STR(?date) as ?dateDeNaissance, STR(?description) as ?descriptionJoueur, STR(?taille) as ?tailleJoueur, STR(?nomClub) as ?historiqueClubJoueur, STR(?poste) as ?posteJoueur, STR(?nomEquipeNationaleNoString) as ?nomEquipeNationale
            where {
                dbr:${param} dbp:name ?nom;
                dbo:birthDate ?date;
                dbo:abstract ?description;
                dbo:position ?position;
                dbp:nationalteam ?equipeNationale;
                dbp:height ?taille;
                dbo:team ?listeEquipe.
                ?equipeNationale rdfs:label ?nomEquipeNationaleNoString.
                ?listeEquipe dbp:fullname ?nomClub.
                ?position rdfs:label ?poste.
                FILTER(langMatches(lang(?poste),"fr"))
                FILTER(langMatches(lang(?description),"fr"))
                FILTER(langMatches(lang(?nomEquipeNationaleNoString),"fr"))
            } 
        `;
    }

    static compareClub = (param) => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select ?resultat as ?classement, (?nombreButsEncaissesExterieur + ?nombreButsEncaissesDomicile) as ?nombresButsEncaisses,  (?nombreButsMarquesExterieur + ?nombreButsMarquesDomicile) as ?nombresButsMarques, ?victoires, ?defaites,
        ?matchsNuls, ?nombreDePlacesDansLeStade, STR(?plusLargeVictoire_noString) as ?plusLargeVictoire, STR(?plusLargeDefaite_noString) as ?plusLargeDefaite
        where {
            dbr:${param} dbp:leagueResult ?resultat;
            dbp:aga ?nombreButsEncaissesExterieur;
            dbp:agf ?nombreButsMarquesExterieur;
            dbp:hga ?nombreButsEncaissesDomicile;
            dbp:hgf ?nombreButsMarquesDomicile;
            dbo:ground ?stade.

            {
                SELECT ?defaites WHERE { dbr:${param} dbp:l ?defaites} ORDER BY DESC(?defaites) LIMIT 1
            }
            {
                SELECT ?vic'toires WHERE { dbr:${param} dbp:w ?victoires} ORDER BY DESC(?victoires) LIMIT 1
            }
            {
                SELECT ?matchsNuls WHERE { dbr:${param} dbp:d ?matchsNuls} ORDER BY DESC(?matchsNuls) LIMIT 1
            }

            ?stade dbo:seatingCapacity ?nombreDePlaces.
            BIND(STR(?nombreDePlaces) as ?nombreDePlacesDansLeStade).
            bind( "pas de données"  as ?default_win).
            optional {
                dbr:${param} dbp:largestWin ?bigWin.
            }
            bind(coalesce(?bigWin, ?default_win) as ?plusLargeVictoire_noString)

            bind( "pas de données"  as ?default_loss).
            optional {
                dbr:${param} dbp:largestLoss ?bigLoss.
            }
            bind(coalesce(?bigLoss, ?default_loss) as ?plusLargeDefaite_noString)
        }
        `;
    }

}
