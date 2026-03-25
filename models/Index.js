const db = require('../models/db_conf');

//compte Nombres des prochains tournois
module.exports.countUpcomingTournaments = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const stmt = db.prepare('SELECT COUNT(*) AS count FROM tournaments WHERE date_tournament > ?');
    const info = stmt.get(currentDate);
    return info.count;

}

module.exports.nbrCourt = () => {
    return db.prepare('SELECT count(tennis_court_id) AS nombreDeReservation FROM bookings WHERE date_booking > DATE(\'now\')').all();
}

module.exports.nbrMessage = () => {
    return db.prepare("SELECT COUNT(*) AS messagesEnvoyes FROM messages  WHERE date_hour_message >= DATE('now','-7 days')   AND date_hour_message < DATE('now');").all();
}