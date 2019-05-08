var storage = require('./storageRequester');

module.exports = {
    getByProjectId: function (projectid, cb) {
        storage('GET', "/tables/equipments/rows?filter=idprojects=" + "'" + projectid + "'", {}, function (error, response, body) {
            if (!error) {
                if (response.statusCode == 200) {
                    json = JSON.parse(response.body);
                    cb(false, json.list_of_rows);
                } else {
                    json = JSON.parse(response.body);
                    cb(false, json.message);
                }
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    create: function (eqname, projectId, cb) {
        console.log("project id : ", projectId);
        storage('POST', "/tables/equipments/rows", [{ name: eqname, idprojects: projectId }], function (error, response, body) {
            if (!error) {
                cb(false, {message: "Equipment created"});
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function (id, cb) {
        console.log("deleting id ", id);
        storage('DELETE', "/tables/equipments/rows?filter=idequipments=" + id, {}, function (error, response, body) {
            if (!error) {
                cb(false, {message: "Equipment deleted"});
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}