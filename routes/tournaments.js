const express = require('express');
const router = express.Router();

const Tournament = require("../models/Tournament.js")
const validator = require('validator');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
})
upload = multer({ storage: storage })

/* GET tournaments index. */
router.get('/', (req, res) => {
    const tournamentsTable = Tournament.sortDateTournaments();
    res.render('tournaments/index.hbs', { tournamentsTable, errors: req.query.errors });
});
router.get('/details', (req, res) => {
    // conversion du paramètre i de la requete en entier
    const tournoiIdParam = parseInt(req.query.id, 10);
    // Recherche du tournoi par son ID
    const tournoiFound = Tournament.findById(tournoiIdParam);
    console.log(tournoiIdParam);
    //LOG pour le débogage
    console.log('tournoiFound :', tournoiFound);

    if (!tournoiFound) {
        req.session.errorTournamentlist = 'tournoi non trouvé';
        return res.render('tournaments/details.hbs', { errorTournamentlist: req.session.errorTournamentlist });

    }

    //Vérification que le tournoi trouvé a une date et traitement des informations 
    if (tournoiFound && tournoiFound.dateTournaments) {
        // Verification de l'état de connexion de l'utilisateur
        const userIsLoggedIn = req.session.user !== undefined;
        let userId;
        let userIsRegistered = false;
        //verification si l'utilisateur est connecter avant d'acceder à user_id
        if (userIsLoggedIn) {
            userId = req.session.user.user_id;
            userIsRegistered = Tournament.isUserRegistered(tournoiIdParam, userId);
        }

        // comparaison des dates pour savoir si le tournoi est passé ou non
        const currentDate = new Date();
        const tournamentDate = new Date(tournoiFound.dateTournaments);
        const tournamentNotPassed = tournamentDate > currentDate;
        // vérification si le nombre maximum de participants n'est pas atteint
        const maxParticipantsNotReached = tournoiFound.nombre_inscrits < tournoiFound.nbMaxParticipants;

        //console log pour le débogage
        console.log('userIsLoggedIn:', userIsLoggedIn);
        console.log('tournamentNotPassed:', tournamentNotPassed);
        console.log('maxParticipantssNotReached', maxParticipantsNotReached);
        console.log('userIsRegistered:', userIsRegistered);


        res.render('tournaments/details.hbs', {
            tournament: tournoiFound,
            userIsLoggedIn: userIsLoggedIn,
            userIsNotRegistered: !userIsRegistered,
            tournamentNotPassed: tournamentNotPassed,
            maxParticipantsNotReached: maxParticipantsNotReached,

        });

    }
});

/* GET register tournament. */
router.post('/register', (req, res) => {
    // Récuperation ID et utilisateur du tournoi du corps de la requete et la session
    const tournamentId = req.body.tournamentId;
    const userId = req.session.user.user_id;
   

    const result = Tournament.registerUser(userId, tournamentId);

    if (result.success) {
        console.log("Error lors de l'inscription")
        res.redirect('/tournaments/details?id=' + tournamentId);

    } else {

        res.redirect('/tournaments/details?id=' + tournamentId);
    }
});
/* POST unregister tournament. */
router.post('/unregister', (req, res) => {
    // Récuperation ID et utilisateur du tournoi du corps de la requete et la session
    const tournamentId = req.body.tournamentId;
    console.log(req.body)
    const userId = req.session.user.user_id;


    // tentative desinscrire de l'utilisateur au tournoi
    const result = Tournament.unRegisterUser(userId, tournamentId);
    if (result.success) {
        res.redirect('/tournaments/details?id=' + tournamentId);

    } else {
        res.redirect('/tournaments/details?id=' + tournamentId);
    }
});
/* GET create tournament. */
router.get('/create', (req, res) => {
    console.log('GET CREATE TOURnament')
    //message d'erreur d'accés du url /tournament/create  
    if (!req.session.user || req.session.user.status !== "coach") {
        req.session.errorTournamentCreate = 'Accés non autorisé';

    }

    res.render('tournaments/create.hbs', { errorTournamentCreate: req.session.errorTournamentCreate, minDate: new Date().toISOString().slice(0, 10) });
});

/* POST create tournament. */
router.post('/create', upload.single('imageTournamentBanner'), (req, res) => {
    //verification du role de coach 

    console.log('POST CREATE TOURnament')
    let { uniqueNameTournament, dateTournament, nbMaxParticipantsTournament } = req.body;
    dateTournament = new Date(dateTournament);
    if (!uniqueNameTournament || !dateTournament || !nbMaxParticipantsTournament) {
        req.session.errorTournamentCreate = 'Tous les champs sont requis';
        res.redirect('/tournaments/create');
    }
    //validation de la date dans le futur
    const currentDate = new Date();
    if (dateTournament <= currentDate) {
        req.session.errorTournamentCreate = 'la date doit etre dans le futur';
        res.redirect('/tournaments/create');

    }
    const nbMaxParticipants = parseInt(req.body.nbMaxParticipantsTournament);
    if (!Number.isInteger(nbMaxParticipants) || nbMaxParticipants < 2) {
        req.session.errorTournamentCreate = 'Le nombre max de participants doit etre un entier supérieur à 2';
        res.redirect('/tournaments/create');
    }
    const user = req.session.user;
    const userIdTournament = user.user_id;
    let filename = null;
    //verification banniere
    if (req.file === undefined) filename = null;

    else filename = '/images/' + req.file.filename;
    console.log(filename);
    console.log("test :", req.body.uniqueNameTournament, userIdTournament, req.body.dateTournament, req.body.nbMaxParticipantsTournament, filename);
    if (!Tournament.isUniqueName(req.body.uniqueNameTournament)) {
        req.session.errorTournamentCreate = 'Le nom du tournoi estt déjà présent';

        return res.redirect('/tournaments/create');
    }

    Tournament.add(req.body.uniqueNameTournament, userIdTournament, req.body.dateTournament, req.body.nbMaxParticipantsTournament, filename);

    res.redirect('/tournaments');



});

module.exports = router;