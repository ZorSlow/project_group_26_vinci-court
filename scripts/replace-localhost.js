const fs = require('fs').promises;
const path = require('path');

const ROOT = path.join(__dirname, '..'); // racine du projet
const TARGET_DIR = path.join(ROOT); // balayage depuis la racine
const EXTENSIONS = new Set(['.hbs', '.js', '.html']);
const DRY_RUN = process.argv.includes('--dry-run');
const NO_BACKUP = process.argv.includes('--no-backup'); // optionnel

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      // ignorer node_modules et .git pour vitesse/sécurité
      if (e.name === 'node_modules' || e.name === '.git') continue;
      files.push(...await walk(full));
    } else if (e.isFile() && EXTENSIONS.has(path.extname(e.name))) {
      files.push(full);
    }
  }
  return files;
}

async function processFile(file) {
  const content = await fs.readFile(file, 'utf8');

  // Remplacement global ciblé : transforme les URLs de développement en liens relatifs.
  // Exemple : "http://localhost:3000/abc" -> "/abc", "http://localhost:3000/" -> "/"
  const re = /http:\/\/localhost:3000\/?/g;
  const matches = content.match(re);
  if (!matches) return null;

  const newContent = content.replace(re, '/');

  if (DRY_RUN) {
    return { file, count: matches.length, changed: true };
  }

  // sauvegarde avant écriture (sauf si --no-backup)
  if (!NO_BACKUP) {
    try {
      await fs.writeFile(file + '.bak', content, 'utf8');
    } catch (err) {
      console.error('Impossible de créer la sauvegarde pour', file, err);
      throw err;
    }
  }

  await fs.writeFile(file, newContent, 'utf8');
  return { file, count: matches.length, changed: true };
}

(async () => {
  try {
    const files = await walk(TARGET_DIR);
    const results = [];
    for (const f of files) {
      const r = await processFile(f);
      if (r) results.push(r);
    }

    if (results.length === 0) {
      console.log('Aucun fichier .hbs/.js/.html contenant "http://localhost:3000" trouvé.');
      return;
    }

    for (const r of results) {
      console.log(`${DRY_RUN ? '[DRY RUN]' : '[MODIFIED]'} ${path.relative(ROOT, r.file)} — remplacements: ${r.count}`);
    }

    console.log(DRY_RUN ? 'Dry run terminé. Exécute sans --dry-run pour appliquer les changements.' : 'Remplacement terminé. Vérifiez les fichiers modifiés et supprimez les .bak si souhaité.');
    console.log('Conseil : committez avant exécution et vérifiez git diff après.');
  } catch (err) {
    console.error('Erreur:', err);
    process.exit(1);
  }
})();