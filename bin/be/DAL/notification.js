var storage = require('./storageRequester');

module.exports = {

    create: function (idaccount, idslumptest, slumptestdate, cb) {
        let data = [{
            idaccounts: idaccount,
            idslumptests: idslumptest,
            date: slumptestdate,
            read: false
        }];
        storage('POST', "/tables/notifications/rows", data, function (error, response, body) {
            if (!error) {
                cb(false, { message: "Notification is created" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    getByAccount: function(accountid, cb){
        storage('GET', "/tables/list_notifications/rows?filter=idaccounts="+accountid, {}, function(error, response, body){
            if (!error) {
                cb(false, JSON.parse(body).list_of_rows)
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}