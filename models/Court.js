const db = require('./db_conf');

module.exports.list = () =>{
    return db.prepare(`SELECT * FROM tennis_courts ORDER BY name ;`).all();
};
module.exports.findById = (id) => {
    return db.prepare(`SELECT * FROM tennis_courts WHERE tennis_court_id = ?`).get(id);
};
module.exports.save = (court)=>{
    console.log(court.tennis_court_id,'id ici');
    console.log(court.picture_path,'image ici');
    return db.prepare(`UPDATE tennis_courts SET name = ?, flooring_type = ?, location = ?, picture_path = ? WHERE tennis_court_id = ?`).run(court.name,court.flooring_type,court.location,court.picture_path,court.tennis_court_id); 
};
module.exports.duplicateName = (name, currentCourtId) => {
    const stmt = db.prepare('SELECT COUNT() AS count FROM tennis_courts WHERE name = ? AND tennis_court_id != ?').get(name, currentCourtId);
    return stmt.count > 0;
};
  
module.exports.duplicateLocation = (location, currentCourtId) => {
    const result = db.prepare('SELECT COUNT() AS count FROM tennis_courts WHERE location = ? AND tennis_court_id != ?').get(location, currentCourtId);
    return result.count > 0;
};
module.exports.search = (user_id) =>{
    return db.prepare(`SELECT * FROM bookings b, tennis_courts t WHERE b.tennis_court_id = t.tennis_court_id AND b.user_id = ? ORDER BY date_booking;`).all(user_id);
};
module.exports.add = (court) => {
    const stmt_insert = db.prepare('INSERT INTO bookings (date_booking, tennis_court_id, user_id) VALUES (?, ?, ?)');
    const info = stmt_insert.run(court.date_booking, court.tennis_court_id, court.user_id);
    console.log("ajoute reservations"+info.changes);
};
module.exports.delete = (date_booking,tennis_court_id) =>{
    const info = db.prepare(`DELETE FROM bookings WHERE date_booking = ? AND tennis_court_id = ?;`).run(date_booking,tennis_court_id);
};
module.exports.findByName = (name)=>{
 return db.prepare(`SELECT name FROM tennis_courts WHERE tennis_court_id = ?;`).get(name);
};
//module.exports.list = (user_id)=>{
  //  return db.prepare(`SELECT * FROM bookings WHERE user_id = ?;`).all(user_id);
//}
module.exports.findId = (id) =>{
    return db.prepare(`SELECT * FROM users WHERE user_id = ? ;`).get(id)
};