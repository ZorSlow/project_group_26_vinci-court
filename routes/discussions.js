const express = require('express');
const router = express.Router();
const Discussions = require('../models/Discussion.js');

router.get('/', (req, res) => {
    if (!req.session.user) {
        res.redirect('/coaches');
    }

    if(req.session.user.status === 'coach'){
        const discussions = Discussions.getCoachUnrepliedDiscussions(req.session.user.user_id);
        res.render('discussions/coachdiscussions.hbs', {discussions});
    } else {
        const discussions = Discussions.getUserDiscussions(req.session.user.user_id);
        res.render('discussions/userdiscussions.hbs', {discussions});
    }
});

router.post('/response', (req, res) => {
    const idResponse = req.query.response;
    if (req.session.user && req.session.user.status === 'coach') {
        Discussions.sendResponse(idResponse, req.body.response);
    }
    console.log(idResponse);
    res.redirect('/discussions');
});

router.post('/sendToCoach', (req, res) => {
    const idUser = req.session.user.user_id;
    const idCoach = req.body.idCoach;
    const message = req.body.message;
    
    Discussions.sendMessageToCoach(idUser, idCoach, message);
    res.redirect('/discussions'); 
});

module.exports = router;