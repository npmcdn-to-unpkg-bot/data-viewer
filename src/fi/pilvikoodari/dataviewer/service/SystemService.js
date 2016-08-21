var logger = require('log4js').getLogger();

var SystemDTO = require.main.require("./models/System.js");
var MenuItemDTO = require.main.require("./models/MenuItem.js");
var FunctionDTO = require.main.require("./models/Function.js");

var ObjectId = require('mongoose').Types.ObjectId; 


var menuItemService = require.main.require("./src/fi/pilvikoodari/dataviewer/service//MenuItemService.js"); 

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
    },

    removeSystem : function removeSystem(systemId, callback) {

        new Promise(function(resolve, reject) 
        {
            menuItemService.getMenuItems(systemId, function(err, items) {
                if(!err) {

                    // STEP 1: Delete functions from all menuitems of this system:
                    var promisesForFunctions = items.map((item) => {
                            return removeMenuItemFunctions(item._id);
                    }, this);
                    Promise.all(promisesForFunctions).then(
                        function itemFunctionsDeleted() {
                            resolve();
                        }, 
                        function functionDeleteFailed(reason) {
                            logger.error(reason);
                            logger.error(reason.message);
                            reject(reason);
                        });
                }
            });
        }).then(
            function FunctionsDeleted() {
                // STEP 2: Delete systems menuitems:
                MenuItemDTO.find({systemId : ObjectId(systemId)}).remove(function (err) {
                    if(!err) {
                        // STEP 3: delete the system itself
                        SystemDTO.findByIdAndRemove(systemId, function(err) {
                            if(err) {
                                logger.error(err);
                                callback(err);
                            } else {
                                callback();
                            }
                        });      
                    } else {
                        logger.info("MI POISTO FAIL");
                        logger.error(err);
                        callback(err);
                    }
                })// MenuItemDTO.remove()
            }, // functionsDeleted

            reason=> function FunctionsDeleteFailed(reason) {
                logger.error(reason);
                callback(reason);
            }
        )
    }
}


function removeMenuItemFunctions(menuItemId) {
    var ObjectId = require('mongoose').Types.ObjectId; 
    return new Promise(function (resolve, reject) {
            FunctionDTO.find({ menuitemid: ObjectId(menuItemId) }).remove(function(err) {
            if(err) {
                reject(err);
            }  else {
                resolve();
            } 
        
        });
    });
}

