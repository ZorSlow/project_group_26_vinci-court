# Projet web 2024 - Groupe 26

Ce repository GitHub reprend le boilerplate du code de votre projet web, ou la base à partir de laquelle vous allez déveloper.

## Apprentissage de Git et GitHub

Suivez le document proposé sur moodle pour apprendre à utiliser Git et GitHub durant votre projet.

## Installation du projet

Si ce n'est pas encore fait, renommez l'un de fichiers `bd_install-french.sql` ou `db_install-english.sql` en `db_install.sql`, selon la langue que vous avez choisie pour l'interface de votre site web.

Lancez ensuite le script qui va créer le fichier de base de données et installer les dépendances de l'application. Commencez par ouvrir un terminal. Attention, il faut utiliser le terminal Git Bash sur Windows, au lieu de cmd ou de PowerShell.

Si vous êtes sur windows, lancez la commande :

```sh
bash install-windows.sh
```

Si vous êtes sur macOS ou linux, lancez la commande :

```sh
bash install-unix.sh
```

## Lancer le projet

Une fois que le projet est préparé tel qu'expliqué dans la section précédente, vous pouvez le lancer avec la commande suivante :

```sh
npm start
```

## Préparation de la soumission

Lorsque vous voudrez soumettre votre projet, utilisez la commande suivante dans un terminal (Git Bash et pas cmd ou PowerShell sur Windows) ouvert à la racine du projet :

```bash
bash prepare_submission.sh
```

Si votre projet est fonctionnel, cette commande crée un fichier `project_group_XX_FRISTNAME_LASTNAME.zip`. Autrement, la commande affiche une erreur dans le terminal.

# Vinci Court — Gestion de tournois

Courte description
- Application web de gestion de terrains et tournois (inscriptions, réservations, gestion coachs et joueurs).
- Projet réalisé en équipe dans le cadre d'un module web — code propre, architecture MVC, attention à la sécurité et à l'UX.

Démo
- Capture d'écran : ./public/images/screenshot.png
- Lien de la démo : https://github.com/ZorSlow/project_group_26_vinci-court

Fonctionnalités principales
- Gestion des utilisateurs (inscription / connexion / rôles)
- Création et gestion de tournois
- Réservation de terrains
- Interface administrateur pour gérer coachs et disponibilités
- Upload d'images et validations côté serveur

Stack technique
- Node.js 18, Express, Handlebars (hbs)
- Base SQLite (better-sqlite3) pour stockage local
- Authentification : bcrypt + express-session
- Outils : nodemon, eslint

Prérequis (local)
- Node >= 18 (utiliser nvm)
- Git, sqlite3 (CLI utile)
- macOS / Linux / Windows (Git Bash)

Installation rapide
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/vinci-court.git
cd vinci-court
# version recommandée de Node
nvm use 18 || nvm install 18
npm install
# initialiser la base (fichier SQL fourni)
mkdir -p db
sqlite3 db/database.sqlite3 < db_install.sql
npm start
```

Commandes utiles
- Lancer le serveur : npm start
- Linter : npm test
- Créer la DB depuis le script : bash install-unix.sh (mac/linux) ou bash install-windows.sh

Points à lire pour le recruteur
- Architecture : dossier /models, /routes, /views
- Sécurité : hachage des mots de passe (bcrypt), validation des entrées (validator)
- Extensibilité : points d'extension pour ajout d'API REST ou intégration front moderne

Contribuer / Contact
- Auteur : Boubacar Bah, Bilal Amaziane ,Abdellah El Haddaoui — GitHub: https://github.com/zorSlow
- Email : boubacar_bah@outlook.be
- Pour une démo ou accès au code complet, contacter via GitHub/Email.

