export class listeRequest{
    static pageClub = (nomClub) => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select ?nom, STR(?descriptionNoString) as ?description,?resultat as ?classement, ?stade, ?meilleurButeur, ?nombreDePlacesDansLeStade, STR(?nameCoach) as ?nomEntraineur,STR(?nomsJoueurs) as ?joueurs, STR(?plusLargeVictoire_noString) as ?plusLargeVictoire, STR(?plusLargeDefaite_noString) as ?plusLargeDefaite
        where {
        dbr:2020–21_${nomClub}_season dbp:leagueResult ?resultat;
        dbo:team ?nom;
        dbo:abstract ?descriptionNoString;
        dbp:leagueTopscorer ?meilleurButeur;
        dbo:manager ?coach;
        dbp:name ?joueurs;
        dbo:ground ?stade.
        ?joueurs dbp:name ?nomsJoueurs.
        ?coach dbp:name ?nameCoach.
        ?stade dbo:seatingCapacity ?nombreDePlaces.
        BIND(STR(?nombreDePlaces) as ?nombreDePlacesDansLeStade).
        FILTER(langMatches(lang(?descriptionNoString),"fr"))
        
        bind( "pas de données"  as ?default_win).
        optional {
        dbr:2020–21_${nomClub}_season dbp:largestWin ?bigWin.
        }
        bind(coalesce(?bigWin, ?default_win) as ?plusLargeVictoire_noString)
        
        bind( "pas de données"  as ?default_loss).
        optional {
        dbr:2020–21_${nomClub}_season dbp:largestLoss ?bigLoss.
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
}
