const express = require('express');
const router = express.Router();
const Coach = require("../models/Coach.js");

const multer = require ('multer');
const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, 'public/images');
},
filename: function (req, file, cb) {
const date = new Date();
const uniquePrefix = date.getFullYear() + '-' + (date.getMonth() + 1) +
'-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() +
44
'-' + date.getSeconds();
cb(null, uniquePrefix + '-' + file.originalname);
}
})
const upload = multer({ storage: storage });


router.get('/listcoaches',(req,res)=>{
    const coachList = Coach.listCoach();
    res.render('coaches/listcoaches.hbs', {listeCoach : coachList});
});

router.get('/biopage', (req, res) => {
    const idCoach = req.query.coach;
    const detailsCoach = Coach.findCoachId(idCoach);
    const errorMessage = "L'utilisateur n'est pas existant ou n'est pas un coach.";
    errorsList = [];
    
    if (!detailsCoach) {
        errorsList.push({errorMessage});
        res.render('coaches/listcoaches.hbs', {errors: errorsList});
    };
    
    let matchingUser = req.session.user && req.session.user.user_id == idCoach;

    res.render('coaches/biopage.hbs', { coach: detailsCoach, idCoach: idCoach, matchingUser: matchingUser});
    });

router.get('/modifybio', (req, res) => {
    if (!req.session.user || req.session.user.status !== 'coach') {
        res.redirect('/coaches/listcoaches');
    }

    const idCoach = req.query.coach;
    const coach = Coach.findId(idCoach);
    const idCoach2 = parseInt(idCoach);
    const coach2 = Coach.findId(idCoach2);

    if (req.session.user.user_id !== idCoach2) {
        return res.redirect('/coaches/listcoaches');
    }

    
    res.render('coaches/modifybio.hbs', { coach: coach, idCoach : idCoach, coach2: coach2, idCoach2: idCoach2 });
});

router.post('/modifybio', (req, res) => {
    const idCoach = req.query.coach;
    const biography = req.body.biography;
    let picture_path = req.body.picture_path;

    const coach = Coach.findCoachId(idCoach);
    const actual_picture = coach.picture_path;

    if(!picture_path){
        picture_path = actual_picture;
    } else if (!picture_path.startsWith('/')) {
        picture_path = '/images/' + picture_path;
    }

    Coach.modifyBio(idCoach, biography, picture_path);
    res.redirect(`/coaches/biopage?coach=${idCoach}`); 
});


module.exports = router;