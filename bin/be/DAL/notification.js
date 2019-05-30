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
    },
    read: function(notificationId, cb){
        storage('PATCH', "/tables/notifications/rows?filter=idnotification=" + notificationId, {read: true}, function(error, response, body){
            if(!error){
                cb(false, {message: "Notifications was marked as read"})
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    unread: function(notificationId, cb){
        storage('PATCH', "/tables/notifications/rows?filter=idnotification=" + notificationId, {read: false}, function(error, response, body){
            if(!error){
                cb(false, {message: "Notifications was marked as unread"})
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
    
}