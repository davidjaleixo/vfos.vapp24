var dal = require('../DAL');

module.exports = {
    create: function (req, res) {
        if(req.body.name && req.body.projectid){
            dal.equipments.create(req.body.name, req.body.projectid, function(err,response){
                if(!err){
                    res.status(201).end();
                }else{
                    res.status(500).json(err);
                }
            })
        }else{
            res.status(422).json({message: "Missing required fields"})
        }
    },
    get: function (req, res) {
        if (req.query.project) {
            //get equipments from project
            dal.equipments.getByProjectId(req.query.project, function (err, answer) {
                if (!err) {
                    res.status(200).send(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            //get all equipments
            //not implemented - TODO
            res.status(501).end();
        }
    },
    delete: function(req,res){
        if(req.query.id){
            dal.equipments.delete(req.query.id, function(err,response){
                if(!err){
                    res.status(200).end();
                }else{
                    res.status(500).end();
                }
            })
        }else{
            res.status(422).json({message: "Missing required parameter"});
        }
    }
}