var express = require('express');
var router = express.Router();
var ctl = require('./controllers');

router.route('/test').get(function(req,res){
    res.json({hello:'world'})
})

//API ROUTES

//router.route('/login').post(ctl.auth.login);
router.route('/register').post(ctl.auth.register);

module.exports = router;