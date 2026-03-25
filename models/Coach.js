const db = require('../models/db_conf.js');


module.exports.listCoach = () => {
    const stmt = db.prepare('SELECT * FROM users WHERE status = ? ORDER BY surname ASC');
    return stmt.all('coach');
};

module.exports.findId = (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE user_id = ?');
    return stmt.get(id);
};

module.exports.findCoachId = (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE user_id = ? AND status = ?');
    return stmt.get(id, 'coach');
};

module.exports.modifyBio = (id, biography, picture_path) => {
    const stmt = db.prepare('UPDATE users SET biography = ?, picture_path = ? WHERE user_id = ?');
    return stmt.run(biography, picture_path, id);
};  