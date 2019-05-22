var dal = require('../DAL');

module.exports = {
    validate: function (req, res) {
        console.log("Validating the notifications")
        console.log("Body", req.body);
        //body: {value, equipment, project, threshold}
        if (req.body.threshold) {
            if (req.body.value > parseInt(req.body.threshold)) {
                console.log("bigger");
                //create notification for each user

                dal.users.getByProject(req.body.project, function (err, projectUsers) {
                    console.log("HEEEEEE");
                    if (!err) {
                        console.log("our users: ", projectUsers);
                        //get the latest slumptest for this project
                        dal.slumps.getLastByProject(req.body.project, function (err2, lastSlumptest) {
                            if (!err2) {
                                console.log("Found ", projectUsers.length, " users to be notified related to slumptest ", lastSlumptest.idslumptests);

                                projectUsers.forEach(function (eachUser) {
                                    dal.notification.create(eachUser.idaccounts, lastSlumptest.idslumptests, lastSlumptest.date, function (err3, answer) {
                                        if (!err3) {
                                            console.log("Notification recorded for user ", eachUser.idaccounts, "-", eachUser.username)
                                        } else {
                                            console.log("Notification not recorded for user ", eachUser.idaccounts, "-", eachUser.username)
                                        }
                                    })
                                });
                            } else {
                                console.log("Validate Notification: ", err2)
                            }
                        })
                    } else {
                        console.log("Validate Notification: ", err)
                    }
                })
            } else {
                //there is no notification needed to be displayed
                console.log("Slumptest value lower then threshold. Discarding...")
            }
        }
    },

    get: function (req, res) {
        dal.notification.getByAccount(req.user.id, function (err, answer) {
            if (!err) {
                
                res.status(201).json(answer);
            } else {
                res.status(500).end();
            }
        })
    }
}