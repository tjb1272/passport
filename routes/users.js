const express = require('express');
const router = express.Router();

router.get('/account', function(req, res) {
    res.render('account');
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/account', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equales(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        res.render('account', {
            errors:errors
        });
    } else {
        var newUser = new userInfo({
            username: username,
            password: password
        });
        User.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log (user);
        });
        req.flash('success_msg', 'You have successfully registered')
        res.redirect('/users/login');
    }
});

module.exports = router;
