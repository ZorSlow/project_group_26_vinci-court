const express = require('express');
const router = express.Router();

const Court = require('../models/Court.js');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const date = new Date();
        const uniquePrefix = date.getFullYear() + '-' + (date.getMonth() + 1) + 
        '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + 
        '-' + date.getSeconds();
        cb(null, uniquePrefix + '-' + file.originalname);
    }
})
const upload = multer({ storage: storage });

router.get('/',(req,res,next)=>{
    const listCourt = Court.list();
    res.render('courts/courts.hbs',{listCourt});
});

router.get('/details',(req,res)=>{
    const terrainIdParam = req.query.id
    const detailsCourt = Court.findById(terrainIdParam);
    const startDate = new Date();
    
    const syear = startDate.getFullYear();
    const smonth = `0${startDate.getMonth() + 1}`.slice(-2);
    const sday = `0${startDate.getDate() + 1}`.slice(-2);

    const sformattedDate = `${syear}-${smonth}-${sday}`;

    const endDate = new Date((new Date()).setDate(startDate.getDate() + 7));
    const eyear = endDate.getFullYear();
    const emonth = `0${endDate.getMonth() + 1}`.slice(-2);
    const eday = `0${endDate.getDate()}`.slice(-2);
    const eformattedDate = `${eyear}-${emonth}-${eday}`;
       
    res.render('courts/details.hbs',{detailsCourt,startDate: sformattedDate,endDate: eformattedDate});
   
});

router.get('/bookings',(req,res,next)=>{
        const user_id = req.session.user.user_id;
        const terrainTable = Court.search(user_id);
        
        const terrainNameParam = req.query.name
        const nameCourt = Court.findByName(terrainNameParam);
        console.log(nameCourt);

         res.render('courts/bookings.hbs',{terrain: terrainTable,nameCourt});
});

router.post('/book',(req,res,next)=>{
    console.log(req.body);
    const recuperation = {
        date_booking: req.body.date_booking,
        tennis_court_id: req.body.tennis_court_id,
        user_id: req.body.user_id,
    };
    Court.add(recuperation)
    res.redirect('/courts/bookings');
});

router.post('/unbook',(req,res,next)=>{
    Court.delete(req.body.date_booking,req.body.tennis_court_id);
    res.redirect('/courts/bookings');
});

router.get('/update',(req,res,next)=>{
    
    const terrainIdParam = req.query.id;
    console.log("hello")
    console.log(req.query)
    const detailsCourt = Court.findById(terrainIdParam);
    console.log(detailsCourt)
    res.render('courts/update.hbs',{detailsCourt});
});

router.post('/update',(req,res,next)=>{
        const idCourt = req.body.tennis_court_id;
        const court = Court.findById(idCourt);
        const actual_picture = court.picture_path;

        let picture_path = req.body.picture_path;

        if(!picture_path){
           picture_path = actual_picture;
        }else if (!picture_path.startsWith('/')){
            picture_path = '/images/' +picture_path;
        }
        console.log(req.body.tennis_court_id,"ici le console log");
        
        const save ={
            tennis_court_id : req.body.tennis_court_id,
            name :req.body.name,
            flooring_type : req.body.flooring_type,
            location : req.body.location,
            picture_path : picture_path
        };
        console.log(save.tennis_court_id,'id route ici');
        
        const duplicateName = Court.duplicateName(save.name,save.tennis_court_id);
        const duplicateLocation = Court.duplicateLocation(save.location,save.tennis_court_id);
         if(duplicateName || duplicateLocation){
            const errorMessage = {};
            if(duplicateName){
                errorMessage.name = 'Ce nom est déjà utilisé'
            }
            if(duplicateLocation){
                errorMessage.location = 'cette endroit est déjà'
            }
           
            res.render('courts/update.hbs',{save,errorMessage});
         }else{
            Court.save(save, user_id);
            res.redirect('/courts/details?id=' +req.body.tennis_court_id);
        };
});
module.exports = router;