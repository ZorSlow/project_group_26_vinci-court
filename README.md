🎾 Vinci Court — Gestion de Complexe Sportif
Vinci Court est une application web full-stack permettant la gestion complète d'un club de tennis : de la réservation de terrains à l'organisation de tournois, en passant par le suivi avec des coachs professionnels.

🚀 Fonctionnalités Clés
Gestion Utilisateurs : Système complet d'inscription et de connexion avec sessions sécurisées.

Réservations : Module de réservation de terrains avec vérification des disponibilités.

Tournois : Inscription des joueurs aux événements et affichage des détails spécifiques.

Annuaire des Coachs : Consultation des profils et biographies détaillées des entraîneurs.

Espace Admin : Gestion centralisée des ressources (terrains, tournois, membres).

🛠️ Stack Technique
Backend : Node.js & Express.js

Frontend : Moteur de templating Handlebars (HBS) & CSS3 (Design Responsive)

Base de données : SQLite via better-sqlite3

Sécurité : Hachage des mots de passe avec bcrypt et gestion de sessions avec express-session.

📂 Architecture du Projet (MVC)
Le projet est structuré selon le pattern Modèle-Vue-Contrôleur pour une maintenance facilitée :

📂 /models : Logique de données et interactions avec la base SQLite.

📂 /routes : Contrôleurs gérant la logique métier et les redirections.

📂 /views : Templates HBS pour le rendu dynamique des pages.

📂 /public : Assets statiques (CSS, images optimisées, JS client).

⚙️ Installation et Lancement (Local)
1. Cloner le dépôt
Bash
git clone https://github.com/ZorSlow/project_group_26_vinci-court.git
cd project_group_26_vinci-court
2. Configuration de la Base de Données
Renommez bd_install-french.sql en db_install.sql à la racine, puis lancez le script d'installation :

Windows (Git Bash) : bash install-windows.sh

macOS / Linux : bash install-unix.sh

3. Démarrage
Bash
npm install
npm start
L'application sera accessible sur http://localhost:3000.

🔒 Focus sur la Sécurité
Protection des routes : Utilisation de middlewares pour restreindre l'accès aux pages sensibles.

Intégrité des données : Validation des entrées formulaires côté serveur.

Liens Relatifs : Architecture réseau optimisée pour un déploiement sécurisé en production (pas de fuite d'IP ou de localhost).

👥 Équipe & Contact
Boubacar Bah - LinkedIn | GitHub

Bilal Amaziane - GitHub

Abdellah El Haddaoui - GitHub