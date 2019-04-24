var dal = require('../DAL');


module.exports = {
    register: function(req,res){
        dal.accounts.create(req.body.userName, req.body.pwd, function(e, answer){
            if(!e){
                res.status(201).send({message: answer})
            }else{
                res.status(500).send({message: answer})
            }
        })
    }
}