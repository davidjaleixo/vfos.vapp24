var dal = require('../DAL');
var predict = require('predict');
const config = require('../config.json');


/**email stuff */
var email = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
/**email stuff */

const output = [
    { code: 0, message: "Inside thresholds", type: "predicted" },
    { code: 1, message: "bigger than the confidence margins configured", type: "predicted" },
    { code: 2, message: "outside thresholds", type: "predicted" },
    { code: 3, message: "outside thresholds", type: "measured" },
    { code: 4, message: "There is no enough data", type: "predicted" },
]
var readHTMLfile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
}
var handleNotification = function (input, domain, userid) {
    if (input.result.code != 0 && input.result.code != 4) {
        let transporter = email.createTransport({
            service: 'gmail',
            auth: {
                user: config.email.USEREMAIL,
                pass: config.email.USERPWD
            }
        })
        readHTMLfile(__dirname + '/../email_tpl.html', function (err, html) {
            if (err) {
                //console.log(err);
            } else {
                let template = handlebars.compile(html);

                //get project name and account emails
                dal.projects.getById(userid, input.idprojects, function (errProject, thisproject) {
                    if (errProject) {
                        console.log("Unable to retrieve project ", input.idprojects, "data")
                    } else {
                        //get account emails
                        dal.users.getByProject(input.idprojects, function (errEmails, userinproject) {
                            if (errEmails) {
                                console.log("Unable to retrieve emails from project", thisproject.name);
                            } else {
                                for (let index = 0; index < userinproject.length; index++) {
                                    // listemails.push(userinproject[index].username);
                                    let replacements = {
                                        EMAILTITLE: "Concrete Feedback Notification",
                                        EMAILPREHEADER: "Concrete Feedback Notification",
                                        EMAILBODY: "Dear " + userinproject[index].username + ", You've received this e-mail because one Slump test sample related to the project " + thisproject.name + " presents a " + input.result.type + " value " + input.result.message + ". For further information please refer to the application link below.",
                                        EMAILC2AHREF: "http://" + domain + "/home/notifications",
                                        EMAILC2ANAME: "Check your notifications",
                                        EMAILAPPNAME: "Concrete Feedback"
                                    }
                                    let replacedhtml = template(replacements);
                                    transporter.sendMail({ from: config.email.USEREMAIL, to: userinproject[index].username, subject: 'Notification related to project ' + thisproject.name, html: replacedhtml }, function (error, info) {
                                        if (!error) {
                                            console.log("Email sent to", info.accepted);
                                        } else {
                                            console.log(error);
                                        }
                                    })

                                    //create notifications
                                    //, slumptestid: slumpresults[slumpresults.length - 1].idslumptests
                                    dal.notification.create(userinproject[index].idaccounts, input.slumptestid, new Date().toUTCString(), function(errNotification, ResultNofitication){
                                        if(!errNotification){
                                            console.log("Notification created for user",  userinproject[index].username);
                                        }else{
                                            console.log("Notification not created for user", userinproject[index].username);
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
        })
    }
}

module.exports = {
    //declive
    //req.body.projectId
    //req.body.supplierId
    //req.body.compositionId

    // ------
    // output:
    // result: 0 - SUCCESS - inside margins
    // result: 1 - WARNING - inside margins but overcoming the confidence margin defined at config.json
    // result: 2 - DANGER - outside margins
    // result: 3 - Not enough data.

    predictNext(req, res) {
        console.log("Predicting next measurement... from ");
        if (req.body.project && req.body.supplier && req.body.composition) {

            dal.slumps.getByProjectAndCompositionAndSupplier(req.body.project, req.body.composition, req.body.supplier, function (err, slumpresults) {
                if (!err) {
                    //console.log("we have ", slumpresults.length, "samples to work with");
                    //create the linear regression
                    let firstinput = [];
                    let secondinput = [];
                    if (slumpresults.length >= config.prediction.amount_samples) {
                        //console.log("we have too much material to work with. Reducing amount of samples to ",config.prediction.amount_samples )
                        //we have too much material to work with
                        for (let index = (slumpresults.length - config.prediction.amount_samples); index < slumpresults.length; index++) {
                            firstinput.push(parseInt(slumpresults[index].value));
                            secondinput.push(index + 1);
                        }
                    } else {
                        if (slumpresults.length < config.prediction.amount_samples) {
                            //we dont have enough material
                            console.log({ result: output[4] })

                            //check the latest slump test value if between the threshold to fire notification
                            if (parseInt(slumpresults[slumpresults.length - 1].value) <= parseInt(slumpresults[0].tholdmin) || parseInt(slumpresults[0].tholdmax) <= parseInt(slumpresults[slumpresults.length - 1].value)) {
                                // latest slump test outside threshold
                                console.log("Latest slump test outside threshold");
                                handleNotification({ result: output[3], prediction: slumpresults[slumpresults.length - 1].value, idcompositions: req.body.composition, idsuppliers: req.body.supplier, idprojects: req.body.project, maxmargin: slumpresults[0].tholdmax, minmargin: slumpresults[0].tholdmin, slumptestid: slumpresults[slumpresults.length - 1].idslumptests }, req.hostname, req.user.id)
                            }
                            return
                        }
                    }
                    //console.log("Continuing....");
                    // for (let index = 0; index < slumpresults.length; index++) {
                    //     firstinput.push(parseInt(slumpresults[index].value));
                    //     secondinput.push(index+1);
                    // }
                    console.log("first input:", firstinput);
                    console.log("second input:", secondinput);
                    var lr = predict.linearRegression(firstinput, secondinput)
                    let nextValue = lr.predict(slumpresults.length + 1);
                    //console.log("next",slumpresults.length+1,  "predictable value will be", nextValue);
                    let minmargin = parseInt(slumpresults[0].tholdmin) * (1 + config.prediction.desv_min);
                    let maxmargin = parseInt(slumpresults[0].tholdmax) * (1 - config.prediction.desv_max);
                    //console.log("minmargin",minmargin, "from", 1 + config.prediction.desv_min);
                    //console.log("maxmargin",maxmargin, "from", 1 - config.prediction.desv_max);
                    //console.log("validating:");
                    console.log(parseInt(slumpresults[0].tholdmax), "-", parseInt(nextValue), "-", parseInt(slumpresults[0].tholdmin));

                    //check the latest slump test value if between the threshold to fire notification
                    if (parseInt(slumpresults[slumpresults.length - 1].value) <= parseInt(slumpresults[0].tholdmin) || parseInt(slumpresults[0].tholdmax) <= parseInt(slumpresults[slumpresults.length - 1].value)) {
                        // latest slump test outside threshold
                        console.log("Latest slump test outside threshold");
                        handleNotification({ result: output[3], prediction: nextValue, idcompositions: req.body.composition, idsuppliers: req.body.supplier, idprojects: req.body.project, maxmargin: slumpresults[0].tholdmax, minmargin: slumpresults[0].tholdmin, slumptestid: slumpresults[slumpresults.length - 1].idslumptests }, req.hostname, req.user.id)
                    }



                    if (parseInt(nextValue) <= parseInt(slumpresults[0].tholdmin) || parseInt(slumpresults[0].tholdmax) <= parseInt(nextValue)) {
                        //prediction outside threshold
                        console.log({ result: output[2], prediction: nextValue, idcompositions: req.body.composition, idsuppliers: req.body.supplier, idprojects: req.body.project, maxmargin: slumpresults[0].tholdmax, minmargin: slumpresults[0].tholdmin })
                        handleNotification({ result: output[2], prediction: nextValue, idcompositions: req.body.composition, idsuppliers: req.body.supplier, idprojects: req.body.project, maxmargin: slumpresults[0].tholdmax, minmargin: slumpresults[0].tholdmin, slumptestid: slumpresults[slumpresults.length - 1].idslumptests }, req.hostname, req.user.id)
                    } else {
                        if ((parseInt(nextValue) <= parseInt(minmargin)) || (parseInt(maxmargin) <= parseInt(nextValue))) {
                            //prediction between acceptable margins
                            console.log({ result: output[1], prediction: nextValue, idcompositions: req.body.composition, idsuppliers: req.body.supplier, idprojects: req.body.project, maxmargin: maxmargin, minmargin: minmargin })
                            handleNotification({ result: output[1], prediction: nextValue, idcompositions: req.body.composition, idsuppliers: req.body.supplier, idprojects: req.body.project, maxmargin: maxmargin, minmargin: minmargin, slumptestid: slumpresults[slumpresults.length - 1].idslumptests }, req.hostname, req.user.id)
                        } else {
                            //the prediction next value prediction is inside
                            console.log({ result: output[0], prediction: nextValue, idcompositions: req.body.composition, idsuppliers: req.body.supplier, idprojects: req.body.project, maxmargin: slumpresults[0].tholdmax, minmargin: slumpresults[0].tholdmin })
                            handleNotification({ result: output[0], prediction: nextValue, idcompositions: req.body.composition, idsuppliers: req.body.supplier, idprojects: req.body.project, maxmargin: slumpresults[0].tholdmax, minmargin: slumpresults[0].tholdmin, slumptestid: slumpresults[slumpresults.length - 1].idslumptests }, req.hostname, req.user.id)
                        }
                    }
                } else {
                    console.log("prediction error", err);
                }
            })
        } else {
            console.log("missing fields", err);
        }
    }
}