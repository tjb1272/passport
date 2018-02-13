const express = require('express');
const router = express.Router();

router.get('/register', function(req, res) {
    res.render('register');
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/register', function(req, res) {
    res.render('login');
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    console.log(name);
});

module.exports = router;