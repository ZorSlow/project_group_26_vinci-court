# 🎾 Vinci Court — Gestion de Complexe Sportif

**Vinci Court** est une application web full-stack moderne permettant la gestion complète d'un club de tennis : de la réservation de terrains à l'organisation de tournois, en passant par le suivi avec des coachs professionnels.

> [!IMPORTANT]
> **Démo en ligne :** [Visiter le site sur Render](https://project-group-26-vinci-court.onrender.com)

---

## 🚀 Fonctionnalités Clés

- **👤 Gestion Utilisateurs** : Système complet d'inscription et de connexion avec hachage sécurisé des mots de passe.
- **📅 Réservations** : Module de réservation de terrains avec vérification des disponibilités en temps réel.
- **🏆 Tournois** : Consultation des détails, dates et gestion des inscriptions aux événements sportifs.
- **🎾 Annuaire des Coachs** : Liste détaillée des coachs avec biographies et spécialités.
- **🛡️ Espace Admin** : Interface centralisée pour la gestion des terrains et des membres.

---

## 🛠️ Stack Technique

- **Backend** : Node.js & Express.js
- **Frontend** : Handlebars (HBS) & CSS3 (Design moderne et responsive)
- **Base de données** : SQLite via `better-sqlite3`
- **Sécurité** : Chiffrement `bcrypt` et gestion de sessions via `express-session`.

---

## 📂 Architecture du Projet (MVC)

Le projet est structuré selon le pattern **Modèle-Vue-Contrôleur** pour garantir un code propre et maintenable :

- 📁 `models/` : Requêtes SQL et accès aux données.
- 📁 `routes/` : Contrôleurs et logique métier (traitement des requêtes).
- 📁 `views/` : Templates dynamiques (Handlebars) pour l'interface utilisateur.
- 📁 `public/` : Ressources statiques (Styles CSS, images, scripts client).

---

## ⚙️ Installation et Lancement (Local)

Suivez ces étapes pour faire tourner le projet sur votre machine :

### 1. Cloner le dépôt
`
git clone [https://github.com/ZorSlow/project_group_26_vinci-court.git](https://github.com/ZorSlow/project_group_26_vinci-court.git)
cd project_group_26_vinci-court
`
### Configuration de la Base de Données
Renommez `bd_install-french.sql ` en` db_install.sql` à la racine, puis lancez le script d'installation :

Windows (Git Bash) : `bash install-windows.sh`

macOS / Linux : `bash install-unix.sh`

###  Démarrage
`Bash
npm install
npm start
L'application sera accessible sur http://localhost:3000.`

### 🔒 Focus sur la Sécurité
Protection des routes : Utilisation de middlewares pour restreindre l'accès aux pages sensibles.

Intégrité des données : Validation des entrées formulaires côté serveur.

Liens Relatifs : Architecture réseau optimisée pour un déploiement sécurisé en production (pas de fuite d'IP ou de localhost).

### 👥 Équipe & Contact
Boubacar Bah - LinkedIn | GitHub

Bilal Amaziane - GitHub

Abdellah El Haddaoui - GitHub
