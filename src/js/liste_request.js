export class listeRequest{
    static allSeasons = () => {
        return `
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select ?competition
        where {
        ?competition dbp:competition dbr:Ligue_1.
        }
        `;
    }

    static palmaresLigue1 = (param) => {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        select distinct
        STR(?winners) as ?TitleWins  
        where{  
        ?teamlink rdfs:label ?team;
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
        dbo:manager ?coach.
        
        bind( "pas de données" as ?default_stade).
        optional {
        dbr:${param} dbo:ground ?stadeFound.
        }
        bind(coalesce(?stadeFound, ?default_stade) as ?stade)
        
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
        const yearSeason = sessionStorage.getItem('yearSeason')
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdfs: <https://www.w3.org/2000/01/rdf-schema#/>        
        select  ?team ?teamName where {
                    ?team dbo:position dbr:${yearSeason}.
                    ?team dbo:team ?club.
                    ?club dbp:fullname ?teamName.
                    FILTER(strlen(?teamName) != 0).
        }`
    }

    static listJoueurLien = () => {
        const yearSeason = sessionStorage.getItem('yearSeason')
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select ?lienDuJoueur, STR(?nomDuJoueur) as ?nomDuJoueur
        where {
            ?team dbo:position dbr:${yearSeason}.
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

    static rank_club = () => {
        const yearSeason = sessionStorage.getItem('yearSeason')
    return `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbp: <http://dbpedia.org/property/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    select xsd:integer(?rankstr) as ?Rank STR(?realname) as ?Clubs
    where {
        ?team dbo:position dbr:${yearSeason};
        dbp:leagueResult ?rankstr.
        ?team dbo:team ?realteam.
        ?realteam dbp:clubname ?realname.
        }
    ORDER BY ?Rank
    `
    }

    static qualifiedEurope = () => {
        const yearSeason = sessionStorage.getItem('yearSeason')
        return `
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select distinct  
        STR(?ChampionsLeague) as ?ChampionsLeague  
        STR(?EuropaLeague) as ?EuropaLeague  
        STR(?EuropaConferenceLeague) as ?EuropaConferenceLeague  
        Where{   
        dbr:${yearSeason} dbp:continentalcup1Qualifiers ?ChampionsLeaguelink; 
        dbp:continentalcup2Qualifiers ?EuropaLeaguelink. 
        ?ChampionsLeaguelink rdfs:label ?ChampionsLeague. 
        ?EuropaLeaguelink rdfs:label ?EuropaLeague. 
        bind( "pas de données" as ?default_EuropaConferenceLeague).
        optional {
        dbr:${yearSeason} dbp:continentalcup3Qualifiers ?EuropaConferenceLeaguelinkFound.
        ?EuropaConferenceLeaguelinkFound rdfs:label ?EuropaConferenceLeagueFound. 
        }
        bind(coalesce(?EuropaConferenceLeagueFound, ?default_EuropaConferenceLeague) as ?EuropaConferenceLeague)
        FILTER(lang(?ChampionsLeague)="en" && lang(?EuropaLeague)="en" && lang(?EuropaConferenceLeague)="en")  
        }  
        `
    }

    static statistics = () => {
        const yearSeason = sessionStorage.getItem('yearSeason')
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        select STR(?nomMeilleurButeur) as ?meilleurButeur, 
        STR(?biggestHomeWin) as ?plusLargeVictoireDomicile, 
        STR(?biggestAwayWin) as ?plusLargeVictoireExterieur, 
        STR(?plusLongueSerieSansDefaite_noString) as ?plusLongueSerieSansDefaite, 
        STR(?plusLongueSerieSansVictoire_noString) as ?plusLongueSerieSansVictoire, 
        STR(?plusLongueSerieDefaite_noString) as ?plusLongueSerieDefaite, 
        STR(?plusLongueSerieVictoire_noString) as ?plusLongueSerieVictoire, 
        STR(?highScore) as ?plusGrosScore
        where {
        dbr:${yearSeason} dbp:leagueTopscorer ?topButeur;
        dbp:biggestHomeWin ?biggestHomeWin;
        dbp:biggestAwayWin ?biggestAwayWin;
        dbp:highestScoring ?highScore;
        dbp:longestLosses ?longestLooses;
        dbp:longestUnbeaten ?longestUnbeaten;
        dbp:longestWins ?longestWins;
        dbp:longestWinless ?longestWinless.
        ?topButeur dbp:name ?nomMeilleurButeur.
        
        optional {
        ?longestWinless dbp:fullname ?winlessName.
        }
        bind(coalesce(?winlessName, ?longestWinless) as ?plusLongueSerieSansVictoire_noString)
        FILTER(strlen(STR(?plusLongueSerieSansVictoire_noString)) != 0)
        
        optional {
        ?longestUnbeaten dbp:fullname ?unbeatenName.
        }
        bind(coalesce(?unbeatenName, ?longestUnbeaten) as ?plusLongueSerieSansDefaite_noString)
        FILTER(strlen(STR(?plusLongueSerieSansDefaite_noString)) != 0)
        
        optional {
        ?longestWins dbp:fullname ?winsName.
        }
        bind(coalesce(?winsName, ?longestWins) as ?plusLongueSerieVictoire_noString)
        FILTER(strlen(STR(?plusLongueSerieVictoire_noString)) != 0)
        
        optional {
        ?longestLooses dbp:fullname ?loosesName.
        }
        bind(coalesce(?loosesName, ?longestLooses) as ?plusLongueSerieDefaite_noString)
        FILTER(strlen(STR(?plusLongueSerieDefaite_noString)) != 0)
        
        FILTER(!STRSTARTS(?highScore,"--") && strlen(STR(?highScore)) != 0)
        FILTER(SUBSTR(STR(?biggestHomeWin), 0,1)!="-" && strlen(STR(?biggestHomeWin)) != 0)
        FILTER(SUBSTR(STR(?biggestAwayWin), 0,1)!="-" && strlen(STR(?biggestAwayWin)) != 0)
        } 
        `
    }

    static searchTeam = (param) => {
        const yearSeason = sessionStorage.getItem('yearSeason')

        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdfs: <https://www.w3.org/2000/01/rdf-schema#/>        
        select  ?team ?teamName where {
                    ?team dbo:position dbr:${yearSeason}.
                    ?team dbo:team ?club.
                    ?club dbp:fullname ?teamName.
                    FILTER(strlen(?teamName) != 0).
                    FILTER(contains(lcase(?teamName),lcase("${param}"))).
        }
        `
    }

    static searchPlayer = (param) => {
        const yearSeason = sessionStorage.getItem('yearSeason')

        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        select ?lienDuJoueur, STR(?nomDuJoueur) as ?nomDuJoueur
        where {
            ?team dbo:position dbr:${yearSeason}.
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
        select STR(?resultat) as ?classement, STR(?nom) as ?nom, (?nombreButsEncaissesExterieur + ?nombreButsEncaissesDomicile) as ?nombresButsEncaisses,  (?nombreButsMarquesExterieur + ?nombreButsMarquesDomicile) as ?nombresButsMarques, STR(?victoires) as ?victoires, STR(?defaites) as ?defaites,
        STR(?matchsNuls) as ?matchsNuls, ?nombreDePlacesDansLeStade, STR(?plusLargeVictoire_noString) as ?plusLargeVictoire, STR(?plusLargeDefaite_noString) as ?plusLargeDefaite
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
            optional {
            
                {
                    SELECT ?defaites_found WHERE { dbr:${param} dbp:l ?defaites_found } ORDER BY DESC(?defaites_found) LIMIT 1
                }
                {
                    SELECT ?victoires_found WHERE { dbr:${param} dbp:w ?victoires_found} ORDER BY DESC(?victoires_found) LIMIT 1
                }
                {
                    SELECT ?matchsNuls_found WHERE { dbr:${param} dbp:d ?matchsNuls_found} ORDER BY DESC(?matchsNuls_found) LIMIT 1
                }
            }
            bind(coalesce(?defaites_found, "pas de données") as ?defaites)
            bind(coalesce(?victoires_found, "pas de données") as ?victoires)
            bind(coalesce(?matchsNuls_found, "pas de données") as ?matchsNuls)
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
