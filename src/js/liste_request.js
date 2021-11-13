export class listeRequest{
    static pageClub = (param) => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select STR(?nom) as ?nom, STR(?descriptionNoString) as ?description,?resultat as ?classement, STR(?stadeName) as ?nomStade, ?meilleurButeurLink, STR(?meilleurButeur) as ?meilleurButeur, ?nombreDePlacesDansLeStade, STR(?nameCoach) as ?nomEntraineur,STR(?nomsJoueurs) as ?joueursNoms, ?joueurs as ?joueursLink, STR(?plusLargeVictoire_noString) as ?plusLargeVictoire, STR(?plusLargeDefaite_noString) as ?plusLargeDefaite, STR(?presidentChoisiv3) as ?nomPresident
        where {
        dbr:${param} dbp:leagueResult ?resultat;
        dbo:team ?nomLink;
        dbp:leagueTopscorer ?meilleurButeurLink;
        dbo:manager ?coach;
        dbp:name ?joueurs;
        dbo:ground ?stade.
        
        bind( "pas de données" as ?default_nom).
        optional {
        ?nomLink dbp:fullname ?nomFound.
        }
        bind(coalesce(?nomFound, ?default_nom) as ?nom)
        
        bind( "pas de données" as ?default_meilleurButeur).
        optional {
        ?meilleurButeurLink dbp:fullname ?meilleurButeurFound.
        }
        bind(coalesce(?meilleurButeurFound, ?default_meilleurButeur) as ?meilleurButeur)
        
        bind( "pas de données" as ?default_nomsJoueurs).
        optional {
        ?joueurs dbp:name ?nomsJoueursFound.
        }
        bind(coalesce(?nomsJoueursFound, ?default_nomsJoueurs) as ?nomsJoueurs)
        filter(!contains(STR(?nomsJoueurs),"http://dbpedia.org/resource/Order_of_Merit_(Portugal)"))
        
        bind( "pas de données" as ?default_nameCoach).
        optional {
        ?coach dbp:name ?nameCoachFound.
        }
        bind(coalesce(?nameCoachFound, ?default_nameCoach) as ?nameCoach)
        
        bind( "pas de données" as ?default_nombreDePlaces).
        optional {
        ?stade dbo:seatingCapacity ?nombreDePlacesFound.
        }
        bind(coalesce(?nombreDePlacesFound, ?default_nombreDePlaces) as ?nombreDePlaces)
        
        bind(STR(?nombreDePlaces) as ?nombreDePlacesDansLeStade).
        
        bind( "pas de données" as ?default_win).
        optional {
        dbr:${param} dbp:largestWin ?bigWin.
        }
        bind(coalesce(?bigWin, ?default_win) as ?plusLargeVictoire_noString)
        
        bind( "pas de données" as ?default_stadeName).
        optional {
        ?stade dbp:fullname ?stadeNameFound.
        }
        optional {
        ?stade dbp:name ?stadeNameFound.
        }
        bind(coalesce(?stadeNameFound, ?default_stadeName) as ?stadeName)
        
        bind( "pas de données"  as ?default_descriptionNoString).
        optional {
        dbr:${param} dbo:abstract ?descriptionNoStringFound.
        }
        bind(coalesce(?descriptionNoStringFound, ?default_descriptionNoString) as ?descriptionNoString)
        filter(langMatches(lang(?descriptionNoString),"fr"))
        
        bind( "pas de données"  as ?default_loss).
        optional {
        dbr:${param} dbp:largestLoss ?bigLoss.
        }
        bind(coalesce(?bigLoss, ?default_loss) as ?plusLargeDefaite_noString)
        
        bind( "pas de données"  as ?default_president).
        optional {
        dbr:${param} dbp:chairman ?presidentFound.
        }
        bind(coalesce(?presidentFound, ?default_president) as ?presidentDBP)
      
        optional {
        dbr:${param} dbo:chairman ?presidentDBO.
        }
        bind(coalesce(?presidentDBO, ?presidentDBP) as ?presidentChoisi)
        
        optional {
        dbr:${param} dbo:chairman ?presidentDBOCurrent.
        ?presidentDBOCurrent dbp:name ?nameDbo.
        }
        bind(coalesce(?nameDbo, ?presidentChoisi) as ?presidentChoisiv2)
        
        optional {
        dbr:${param} dbp:chairman ?presidentDBPCurrent.
        ?presidentDBPCurrent dbp:name ?nameDbp.
        }
        bind(coalesce(?nameDbp, ?presidentChoisiv2) as ?presidentChoisiv3)
        }`;
    }

    static palmaresLigue1 = (param) => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        select distinct
        STR(?winners) as ?TitleWins  
        where{  
        ?teamlink dbo:season dbr:2020–21_Ligue_1; 
        rdfs:label ?team; 
        ^dbp:winners ?winnerslink.
        ?winnerslink rdfs:label ?winners. 
        FILTER(SUBSTR(STR(?winners), strlen(STR(?winners)),1)="1" && lang(?winners)="en" && lang(?team) ="en") 
        FILTER(contains(?team, '${param}'))
        }`;
    }

    static pageClubSansJoueurs = (param) => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select STR(?nom) as ?nom, STR(?descriptionNoString) as ?description,?resultat as ?classement, STR(?stadeName) as ?nomStade, ?meilleurButeurLink, STR(?meilleurButeur) as ?meilleurButeur, ?nombreDePlacesDansLeStade, STR(?nameCoach) as ?nomEntraineur, STR(?plusLargeVictoire_noString) as ?plusLargeVictoire, STR(?plusLargeDefaite_noString) as ?plusLargeDefaite, STR(?presidentChoisiv3) as ?nomPresident
        where {
        dbr:${param} dbp:leagueResult ?resultat;
        dbo:team ?nomLink;
        dbp:leagueTopscorer ?meilleurButeurLink;
        dbo:manager ?coach;
        dbo:ground ?stade.
        
        bind( "pas de données" as ?default_nom).
        optional {
        ?nomLink dbp:fullname ?nomFound.
        FILTER(strlen(STR(?nomFound))>1)
        }
        bind(coalesce(?nomFound, ?default_nom) as ?nom)
        
        bind( "pas de données" as ?default_meilleurButeur).
        optional {
        ?meilleurButeurLink dbp:fullname ?meilleurButeurFound.
        }
        bind(coalesce(?meilleurButeurFound, ?default_meilleurButeur) as ?meilleurButeur)
        
        bind( "pas de données" as ?default_nameCoach).
        optional {
        ?coach dbp:name ?nameCoachFound.
        }
        bind(coalesce(?nameCoachFound, ?default_nameCoach) as ?nameCoach)
        
        bind( "pas de données" as ?default_nombreDePlaces).
        optional {
        ?stade dbo:seatingCapacity ?nombreDePlacesFound.
        }
        bind(coalesce(?nombreDePlacesFound, ?default_nombreDePlaces) as ?nombreDePlaces)
        
        bind(STR(?nombreDePlaces) as ?nombreDePlacesDansLeStade).
        
        bind( "pas de données" as ?default_win).
        optional {
        dbr:${param} dbp:largestWin ?bigWin.
        }
        bind(coalesce(?bigWin, ?default_win) as ?plusLargeVictoire_noString)
        
        bind( "pas de données" as ?default_stadeName).
        optional {
        ?stade dbp:fullname ?stadeNameFound.
        }
        optional {
        ?stade dbp:name ?stadeNameFound.
        }
        bind(coalesce(?stadeNameFound, ?default_stadeName) as ?stadeName)
        
        bind( "pas de données"  as ?default_descriptionNoString).
        optional {
        dbr:${param} dbo:abstract ?descriptionNoStringFound.
        }
        bind(coalesce(?descriptionNoStringFound, ?default_descriptionNoString) as ?descriptionNoString)
        filter(langMatches(lang(?descriptionNoString),"fr"))
        
        bind( "pas de données"  as ?default_loss).
        optional {
        dbr:${param} dbp:largestLoss ?bigLoss.
        }
        bind(coalesce(?bigLoss, ?default_loss) as ?plusLargeDefaite_noString)
        
        bind( "pas de données"  as ?default_president).
        optional {
        dbr:${param} dbp:chairman ?presidentFound.
        }
        bind(coalesce(?presidentFound, ?default_president) as ?presidentDBP)
      
        optional {
        dbr:${param} dbo:chairman ?presidentDBO.
        }
        bind(coalesce(?presidentDBO, ?presidentDBP) as ?presidentChoisi)
        
        optional {
        dbr:${param} dbo:chairman ?presidentDBOCurrent.
        ?presidentDBOCurrent dbp:name ?nameDbo.
        }
        bind(coalesce(?nameDbo, ?presidentChoisi) as ?presidentChoisiv2)
        
        optional {
        dbr:${param} dbp:chairman ?presidentDBPCurrent.
        ?presidentDBPCurrent dbp:name ?nameDbp.
        }
        bind(coalesce(?nameDbp, ?presidentChoisiv2) as ?presidentChoisiv2bis)
        
        optional {
        dbr:${param} dbp:chairman ?presidentDBPCurrentLabel.
            ?presidentDBPCurrentLabel rdfs:label ?nameLabel.
            filter(langMatches(lang(?nameLabel),"fr"))
        }
        bind(coalesce(?nameLabel, ?presidentChoisiv2bis) as ?presidentChoisiv3)
        FILTER(strlen(STR(?presidentChoisiv3))>1)

        

        }`;
    }

    static pageClubJoueurs = (param) => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select STR(?nomsJoueurs) as ?joueursNoms, ?joueurs as ?joueursLink
        where {
        dbr:${param} dbp:name ?joueurs.
        
        bind( "pas de données" as ?default_nomsJoueurs).
        optional {
        ?joueurs dbp:name ?nomsJoueursFound.
        }
        bind(coalesce(?nomsJoueursFound, ?default_nomsJoueurs) as ?nomsJoueurs)
        filter(!contains(STR(?nomsJoueurs),"http://dbpedia.org/resource/Order_of_Merit_(Portugal)"))
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

    static rank_club = () => {
    return `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbp: <http://dbpedia.org/property/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    select xsd:integer(?rankstr) as ?Rank STR(?realname) as ?Clubs
    where {
        ?team dbo:position dbr:2020–21_Ligue_1;
        dbp:leagueResult ?rankstr.
        ?team dbo:team ?realteam.
        ?realteam dbp:clubname ?realname.
        }
    ORDER BY ?Rank
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


    static rank_club = () => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        select xsd:integer(?rankstr) as ?Rank STR(?realname) as ?Clubs
        where {
            ?team dbo:position dbr:2020–21_Ligue_1;
            dbp:leagueResult ?rankstr.
            ?team dbo:team ?realteam.
            ?realteam dbp:clubname ?realname.
            }
        ORDER BY ?Rank
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

    static pagePlayer = (parameter) => {
        let param= decodeURI(parameter);
        return `
            PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX dbr: <http://dbpedia.org/resource/>
            PREFIX dbp: <http://dbpedia.org/property/>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            select STR(?nom) as ?nomJoueur, STR(?date) as ?dateDeNaissance, STR(?description) as ?descriptionJoueur, STR(?taille) as ?tailleJoueur, STR(?nomClub) as ?historiqueClubJoueur, STR(?poste) as ?posteJoueur, STR(?nomEquipeNationaleNoString) as ?nomEquipeNationale
            where {
                
                bind( "pas de données"  as ?default_nationalteam).
                optional {
                dbr:${param} dbp:nationalteam ?equipeNationale.
                ?equipeNationale rdfs:label ?nomEquipeNationaleNoStringg.
                }
                bind(coalesce(?nomEquipeNationaleNoStringg, ?default_nationalteam) as ?nomEquipeNationaleNoString)
                
                bind( "pas de données"  as ?default_nom).
                optional {
                dbr:${param} dbp:name ?name.
                }
                bind(coalesce(?name, ?default_nom) as ?nom)
                
                bind( "pas de données"  as ?default_date).
                optional {
                dbr:${param} dbo:birthDate ?Date.
                }
                bind(coalesce(?Date, ?default_date) as ?date)
                
                
                bind( "pas de données"  as ?default_description).
                optional {
                dbr:${param} dbo:abstract ?Description.
                }
                bind(coalesce(?Description, ?default_description) as ?description)
                
                bind( "pas de données"  as ?default_poste).
                optional {
                dbr:${param} dbo:position ?position.
                ?position rdfs:label ?Poste.
                }
                bind(coalesce(?Poste, ?default_poste) as ?poste)
                
                
                
                bind( "pas de données"  as ?default_taille).
                optional {
                dbr:${param} dbp:height ?Taille.
                }
                bind(coalesce(?Taille, ?default_taille) as ?taille)
                
                
                bind( "pas de données"  as ?default_nomClub).
                optional {
                dbr:${param} dbo:team ?listeEquipe.
                                ?listeEquipe dbp:fullname ?NomClub.
                }
                bind(coalesce(?NomClub, ?default_nomClub) as ?nomClub)
                
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
        select ?resultat as ?classement, STR(?nom) as ?nom, (?nombreButsEncaissesExterieur + ?nombreButsEncaissesDomicile) as ?nombresButsEncaisses,  (?nombreButsMarquesExterieur + ?nombreButsMarquesDomicile) as ?nombresButsMarques, ?victoires, ?defaites,
        ?matchsNuls, ?nombreDePlacesDansLeStade, STR(?plusLargeVictoire_noString) as ?plusLargeVictoire, STR(?plusLargeDefaite_noString) as ?plusLargeDefaite
        where {
            dbr:${param} dbp:leagueResult ?resultat;
            dbo:team ?nomLink;
            dbp:aga ?nombreButsEncaissesExterieur;
            dbp:agf ?nombreButsMarquesExterieur;
            dbp:hga ?nombreButsEncaissesDomicile;
            dbp:hgf ?nombreButsMarquesDomicile;
            dbo:ground ?stade.
            
            bind( "pas de données" as ?default_nom).
            optional {
            ?nomLink dbp:fullname ?nomFound.
            }
            bind(coalesce(?nomFound, ?default_nom) as ?nom)

            {
                SELECT ?defaites WHERE { dbr:${param} dbp:l ?defaites} ORDER BY DESC(?defaites) LIMIT 1
            }
            {
                SELECT ?victoires WHERE { dbr:${param} dbp:w ?victoires} ORDER BY DESC(?victoires) LIMIT 1
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
