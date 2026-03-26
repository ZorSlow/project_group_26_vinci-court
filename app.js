const express = require('express');
const session = require('express-session');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const hbs = require('hbs');
const fs = require('fs').promises;

/**
 * The {{#exists}} helper checks if a variable is defined.
 */
hbs.registerHelper('exists', function (variable, options) {
  if (typeof variable !== 'undefined') {
    return options.fn(this);
  } else {
    // options.inverse == else block
    return options.inverse(this);
  }
});

hbs.registerHelper('and', function(a, b) {
  return a && b;
})

/**
 * eq checks if value are equal
 */
hbs.registerHelper('eq', function (a, b) {
  if (a === b) {
    return true;
  } else {
    return false;
  }
});
// TODO Require your controllers here

const indexRouter = require('./routes/index.js');
const usersRouter = require('./routes/users.js');
const tournamentsRouter = require('./routes/tournaments.js');
const courtsRouter = require('./routes/courts.js');
const coachesRouter = require('./routes/coaches.js');
const discussionsRouter = require('./routes/discussions.js');

const app = express();
const port = process.env.PORT || 3000;

// Setup views folder and handlebar engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev')); // Log each request
app.use(express.urlencoded({ extended: false })); // Decode form values
app.use(express.static(path.join(__dirname, 'public'))); // Get static files from public folder

// use of sessions
app.use(session({ secret: "TODO: CHANGE YOUR SECRET!", resave: false, saveUninitialized: false }));
// use of session variables in views via res.locals
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

// TODO Call your controllers here

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tournaments', tournamentsRouter);
app.use('/courts',courtsRouter);
app.use('/coaches',coachesRouter);
app.use('/discussions',discussionsRouter);


// Create error on page not found
app.use((req, res, next) => next(createError(404)));

// Show error hbs page
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error.hbs', { error });
});

// Launch server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

/**
 * Section utilitaire : remplacement des URLs de développement dans les vues
 *
 * Ce script parcourt récursivement le dossier `views` et remplace dans les
 * attributs `href` et `action` toute occurrence de "/"
 * par "/" afin d'utiliser des liens relatifs (utile avant déploiement).
 *
 * Usage :
 *  - Dry run (ne modifie pas les fichiers) :
 *      node app.js --dry-run
 *  - Appliquer les modifications :
 *      node app.js
 *
 * Remarques importantes :
 *  - Le script est exécuté à la fin de ce fichier (après le démarrage du serveur).
 *    Pour éviter toute exécution accidentelle en production, il est recommandé de
 *    déplacer ce code dans scripts/replace-localhost.js et l'exécuter manuellement.
 *  - Toujours commit/sauvegarder avant d'exécuter afin de pouvoir revenir en arrière.
 */
const ROOT = path.join(__dirname, '..');
const VIEWS_DIR = path.join(ROOT, 'views');
const DRY_RUN = process.argv.includes('--dry-run');

async function walk(dir) {
  let files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await walk(res));
    } else if (entry.isFile() && res.endsWith('.hbs')) {
      files.push(res);
    }
  }
  return files;
}

async function processFile(file) {
  let content = await fs.readFile(file, 'utf8');

  // Replace only when inside href= or action= attribute (supports single/double quotes and optional spaces)
  const re = /(\b(?:href|action)\s*=\s*["'])http:\/\/localhost:3000\//g;
  const newContent = content.replace(re, '$1/');

  if (newContent !== content) {
    if (DRY_RUN) {
      console.log('[DRY RUN] would modify:', path.relative(ROOT, file));
    } else {
      await fs.writeFile(file, newContent, 'utf8');
      console.log('Modified:', path.relative(ROOT, file));
    }
  }
}

(async () => {
  try {
    const files = await walk(VIEWS_DIR);
    if (files.length === 0) {
      console.log('Aucun fichier .hbs trouvé dans views.');
      return;
    }
    for (const f of files) await processFile(f);
    console.log(DRY_RUN ? 'Dry run terminé.' : 'Remplacement terminé.');
  } catch (err) {
    console.error('Erreur:', err);
    process.exit(1);
  }
})();

/**
 * Remarque :
 * La logique de remplacement des URLs de développement a été extraite vers
 * scripts/replace-localhost.js afin d'éviter toute exécution automatique au
 * démarrage du serveur (production).
 *
 * Pour l'utiliser depuis la racine du projet :
 *  - Dry run (affiche les fichiers qui seraient modifiés) :
 *      node scripts/replace-localhost.js --dry-run
 *  - Appliquer les modifications :
 *      node scripts/replace-localhost.js
 *
 * Conseil : commit/save avant d'exécuter pour pouvoir revenir en arrière.
 */
