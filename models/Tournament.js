// file Tournaments.js
const db = require('../models/db_conf.js');

//ajouter un tournoi
module.exports.add = (uniqueName, userIdTournament, dateTournaments, nbMaxParticipants, imageBanner) => {
    const stmt = db.prepare('INSERT INTO tournaments(name,creator,date_tournament,nb_max_participants,banner_image_path) VALUES (?,?,?,?,?)');
    const info = stmt.run(uniqueName, userIdTournament, dateTournaments, nbMaxParticipants, imageBanner);
    console.log('tournoi mode save' + info.changes)
}
//recherche si le nom d'un tournoi est unique 
module.exports.isUniqueName = (uniqueName) => {
    const t = db.prepare('SELECT count(*) AS count FROM tournaments t WHERE name = ?').get(uniqueName);
    return t.count === 0;
}
//triage des tournois selon la date croissante 
module.exports.sortDateTournaments = () => {
    const tournaments = db.prepare('SELECT tournament_id AS tournamentId, name AS uniqueName, date_tournament AS dateTournaments, nb_max_participants AS nbMaxParticipants  FROM tournaments ORDER BY date_tournament ASC ').all();
    for (let i = 0; i < tournaments.length; i++) {
        tournaments[i].dateTournaments = new Date(tournaments[i].dateTournaments).toISOString().split('T')[0];
    }
    return tournaments;
}
module.exports.search = (uniqueName) => {
    const t = db.prepare('SELECT tournament_id AS tournamentId, name AS uniqueName, date_tournament AS dateTournaments, creator AS nameCreator, nb_max_participants AS nbMaxParticipants, banner_image_path AS imageBanner FROM tournaments WHERE name GLOB ?').all(uniqueName + '*');
    if (t) t.dateTournaments = new Date(t.dateTournaments);
    console.log(t)
    return t;
}
//rechehe de l'id 
module.exports.findById = (id) => {
    // Récupérer les détails du tournoi
    const tournamentDetails = db.prepare(`
SELECT
    
    t.name AS uniqueName,
    t.date_tournament AS dateTournaments,
    u.firstname AS firstnameCreator,
    u.surname AS surnameCreator,
    t.nb_max_participants AS nbMaxParticipants,
    t.banner_image_path AS imageBanner,
    t.tournament_id AS tournamentId
    
FROM 
    tournaments t,users u
WHERE t.creator= u.user_id 
     AND t.tournament_id = ? 
 `).get(id);
    //Si aucun tournoi n'est trouvé,renvoyer null
    if (!tournamentDetails) {
        return null;

    }
    // Compter le nombre d'inscrits
    const countInscrits = db.prepare(`
     SELECT 
         COUNT(user_id) AS nombre_inscrits
    FROM 
        registrations
    WHERE tournament_id = ?
`).get(id);
    // Ajouter le nombre d'inscrits aux détails du tournoi
    if (tournamentDetails && countInscrits) {
        tournamentDetails.nombre_inscrits = countInscrits.nombre_inscrits || 0;
        tournamentDetails.dateTournaments = new Date(tournamentDetails.dateTournaments).toISOString().split('T')[0];

    }
    return tournamentDetails
};
// cette methode verifie si un utilisateur est inscrit à un tournoi
module.exports.isUserRegistered = (tournamentId, userId) => {
    const stmt = db.prepare('SELECT 1 FROM registrations WHERE tournament_id = ? AND user_id = ?');
    const registration = stmt.all(tournamentId, userId);
    console.log(registration)
    return registration.length > 0;
};

/**
 * Enregistre un utilisateur à un tournoi
 * @param {number} userId - l'id de l'utilisateur
 * @param {number} tournamentId - l'id de tournament
 * @param {Object} - un objet qui indique le succés ou l'echec de l'opération
 */
module.exports.registerUser = (userId, tournamentId) => {
    if (this.isUserRegistered(tournamentId, userId)) {
        return { success: false }

    } else {

        const insert = db.prepare('INSERT INTO registrations(user_id, tournament_id) VALUES(?,?)');
        const result = insert.run(userId, tournamentId)
        if (result.changes > 0) {
            return { success: true };
        }
        return { success: false };
    }
};
//desinscrire un utilisateur à un tournoi
module.exports.unRegisterUser = (userId, tournamentId) => {
    const insert = db.prepare('DELETE FROM registrations WHERE user_id= ? AND tournament_id = ?');
    const result = insert.run(userId, tournamentId)
    if (result.changes > 0) {
        return { success: true };

    }
    return { success: false };
};

