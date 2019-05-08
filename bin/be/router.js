var express = require('express');
var router = express.Router();
var ctl = require('./controllers');

router.route('/test').get(function(req,res){
    res.json({hello:'world'})
})

//API ROUTES

//authentication
router.route('/register').post(ctl.auth.register);
router.route('/login').post(ctl.auth.login);

//projects
router.route('/projects').get(ctl.projects.get);
router.route('/projects').post(ctl.projects.create);
router.route('/projects').patch(ctl.projects.update);
router.route('/projects').delete(ctl.projects.delete);

//equipments
router.route('/equipments').get(ctl.equipments.get);
router.route('/equipments').post(ctl.equipments.create);
router.route('/equipments').delete(ctl.equipments.delete);

//users
router.route('/users').get(ctl.users.get);
router.route('/users').post(ctl.users.create);
router.route('/users').delete(ctl.users.delete);

//accounts
router.route('/accounts').get(ctl.accounts.get);

module.exports = router;