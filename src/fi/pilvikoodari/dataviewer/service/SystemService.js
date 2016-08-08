var logger = require('log4js').getLogger();

var SystemDTO = require.main.require("./models/System.js");

module.exports = { 

    getAllSystems : function getAllSystems(callback) {
        SystemDTO.find(function (err, systemInfos) {
            if(!err) {
                systemInfos = systemInfos.sort(function (si1, si2) {
                    return (si1.name.localeCompare(si2.name));
                });
                callback(err, systemInfos);
        } else {
                logger.error(err);
                callback(err);
            }
        });
    }
    ,
    getSystem : function getSystem(id, callback) {
        SystemDTO.findOne({"_id" : id}, function (err, systemInfo) {
            if(!err) {
                callback(err, systemInfo);
            } else {
                logger.error(err);
                callback(err);
            }
	    });
    }
 
}

