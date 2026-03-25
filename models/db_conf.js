const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'project.db');

// créer le dossier parent si nécessaire
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

// créer un fichier vide si nécessaire
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '');

// ouvrir la base
const db = new Database(dbFile);

module.exports = db;
