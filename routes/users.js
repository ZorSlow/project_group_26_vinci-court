const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const Tournament = require("../models/Tournament.js")
const validator = require('validator');
const session = require('express-session');

router.get('/login', (req, res) => {
    res.render('users/login.hbs', { error: req.session.error });
    req.session.error = null;
});

router.post('/login', (req, res) => {
    const user = User.login(req.body.email, req.body.password);
    if (user) {
        req.session.user = user;
        if (req.session.isUserCoach = (user.status=="coach")) {
            res.redirect('/');
        }

       
        res.redirect('/');
    } else {
        req.session.error = 'Invalid email or password';
        res.redirect('/users/login');
    }
});

router.get('/register', (req, res) => {
    res.render('users/register.hbs', {errors: req.session.errors});
    req.session.errors = null;
});

router.post('/register', (req, res) => {
    let errors = [];
    if (!validator.isStrongPassword(req.body.password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })) {
        errors.push("Le mot de passe n'est pas assez fort : 8 caractères minimum, une lettre minuscule, une lettre majuscule et un chiffre minimum !");
    }
    if (req.body.password != req.body.passwordConfirmation) {
        errors.push("Les mots de passes ne correspondent pas.");
    }

    if (!req.body.email.endsWith('vinci.be')){
        errors.push("L'adresse mail doit se terminer par vinci.be");
    }

    if (User.find(req.body.email)) {
        errors.push("Email/Utilisateur déjà présent en DB.");
    }

    if (errors.length == 0) {
        User.create(req.body.firstname, req.body.surname, req.body.email, req.body.password);
        req.session.connected = true;
        res.redirect("/users/login");
    } else {
        console.log('erreurs =' + errors);
        req.session.errors = errors;
        res.redirect('/users/register');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;