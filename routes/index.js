const express = require('express');
const router = express.Router();


const Index =require('../models/Index.js')

router.get('/', (req, res) => {
    const userId = req.session.userId;

    const nbrCourt = Index.nbrCourt(userId)[0].nombreDeReservation;
    console.log("parma"+ Index.nbrCourt(userId));
    const nbrMessage = Index.nbrMessage();
    const upcomingTournamentsCount = Index.countUpcomingTournaments();
    res.render('index.hbs',{ upcomingTournamentsCount,nbrCourt,nbrMessage});
});
  
module.exports = router;