const db = require('./db_conf.js');

module.exports.getCoachUnrepliedDiscussions = (idCoach) => {
    const stmt = db.prepare(`SELECT ms.*, us.firstname, us.surname FROM messages ms, users us WHERE ms.sender_id = us.user_id AND ms.receiver_id = ? AND ms.response_text IS NULL ORDER BY ms.date_hour_message DESC`);
    return stmt.all(idCoach);
};

module.exports.getUserDiscussions = (idUser) => {
    const stmt = db.prepare(`SELECT ms.*, us.firstname, us.surname FROM messages ms, users us WHERE ms.receiver_id = us.user_id AND ms.sender_id = ? ORDER BY ms.date_hour_message DESC`);
    return stmt.all(idUser);
};

module.exports.sendResponse = (idMessage, response) => {
    const stmt = db.prepare('UPDATE messages SET response_text = ? WHERE message_id = ?');
    stmt.run(response, idMessage);
};

module.exports.sendMessageToCoach = (idUser, idCoach, message) => {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' '); 
    const stmt = db.prepare('INSERT INTO messages (sender_id, receiver_id, message_text, date_hour_message) VALUES (?, ?, ?, ?)');
    stmt.run(idUser, idCoach, message, date);
};