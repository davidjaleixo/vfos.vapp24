/** made by david.aleixo@knowledgebiz.pt */

var request = require('request');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var config = require('../config.json');
var storage = require('./storageRequester');

var _genSalt = function (password) {
    return crypto.randomBytes(16).toString('hex');
}
var _genHash = function (salt, password) {
    return crypto.pbkdf2Sync(password, salt, 1000, 16, 'sha512').toString('hex');
}

var _genJwt = function (user) {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    let idAccounts
    if (user.id) {
        idAccounts = user.id
    } else {
        idAccounts = 0
    }
    return jwt.sign({
        id: idAccounts,
        username: user.username,
        role: user.idroles,
        exp: parseInt(expiry.getTime() / 1000)
    }, config.jwt.secret);
}

module.exports = {
    generateJwt: function (user) {
        return _genJwt(user);
    },
    validPassword: function (user, password) {
        return user.userhash === crypto.pbkdf2Sync(password, user.usersalt, 1000, 16, 'sha512').toString('hex')
    },
    create: function (user, password, cb) {
        storage('GET', "/tables/accounts/rows?filter=userName='" + user + "'", {} , function (err, response, body) {
            if (error) {
                cb(true, "Relational Storage Component not responding");
            } else {
                if (res.statusCode == 200) {
                    json = JSON.parse(response.body);
                    result = json.list_of_rows
                    if (result.length > 0) {
                        cb(false, "Email already Exists");
                    } else {
                        //Auth
                        //Possible idRoles 
                        //1 - Contractor
                        //2 - Admin
                        //3 - Provider
                        userSalt = genSalt(password);
                        userHash = genHash(userSalt, password);
                        let newuser = [{
                            userName: user,
                            userHash: userHash,
                            userSalt: userSalt,
                            idRoles: 2
                        }]

                        storage('POST', '/tables/accounts/rows', newuser, function (error, response, body) {
                            console.log("Received response: " + JSON.stringify(response));
                            if (!error) {
                                if (response.statusCode == 201) {
                                    //Generate jwt
                                    cb(false, _genJwt({ username: user, idroles: 2 }))
                                } else {
                                    json = JSON.parse(response.body);
                                    cb(false, json.message);
                                }
                            } else {
                                cb(true, "Relational Storage Component not responding");
                            }
                        })
                    }
                }else{
                    cb(false, JSON.parse(response.body).message)
                }
            }
        })
    },
    getbyUserName : function (username, cb){
		
        storage('GET', "/tables/accounts/rows?filter=userName="+"'"+username+"'", {}, function (error, response,body) {
			console.log("Received response: " + JSON.stringify(response));
			if (!error) {	
				if(response.statusCode == 200){
					json = JSON.parse(response.body);
					cb(false,json.list_of_rows[0]);
				}else{
					json = JSON.parse(response.body);
					cb(false,json.message);
				}
			}else{
				cb(true,"Relational Storage Component not responding");
			}
		})
	}
}