var logger = require('log4js').getLogger();

var FunctionDTO = require.main.require("./models/Function.js");
var MenuItemDTO = require.main.require("./models/MenuItem.js");

var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = { 

    removeFunction : function removeFunction(id, callback) {
        // STEP 1: Remove function
        FunctionDTO.findByIdAndRemove(id, function (err, deleted) {
            if(err) {
                callback(err);
            } else {
                // STEP 2: remove function id from menuitems
                MenuItemDTO.findById({"_id" : deleted.menuitemid}, function(err, item) {
                    if(err) {
                        callback(err);
                    } else {
                        for(var i = 0; i< item.functions.length; i++) {
                            if(item.functions[i].equals(deleted._id)) {
                                item.functions.splice(i, 1);
                            }
                        }
                        item.save(function(err, saved) {
                            callback(err);
                        });
                    }
                });
            }             
        });
    },

    updateFunction : function updateFunction(id, newdata, callback) {
        FunctionDTO.findOne({"_id" : id}, function (err, loaded) {
            if(!err) {
                var item = loaded.toObject();
                for (var property in item) {
                    if (item.hasOwnProperty(property)) {
                        if(newdata.hasOwnProperty(property)) {
                            if(property=='moduleparameters') {
                                try {
                                    loaded[property] = JSON.parse(newdata[property]);
                                    if(!loaded.hasParameters())
                                        throw new Error('Parameters parse failed.');
                                } catch (e) {
                                    callback(e);
                                    return;
                                }
                            } else {
                                loaded[property]=newdata[property];
                            }
                        }
                    }
                }
                loaded.save();
                callback(err, loaded);
            } else {
                logger.error(err);
                callback(err);
            }
        });
    },

    getFunction : function getFunction(id, callback) {
        FunctionDTO.findById({"_id" : ObjectId(id)}, function (err, item) {
            if(!err) {
                callback(err, item);
            } else {
                logger.error(err);
                callback(err);
            }
        });
    },

    saveFunction : function saveFunction(newdata, callback) {
        new Promise(function(resolve, reject) 
        {
            // STEP 1: Save function
            var func = new FunctionDTO(newdata);
            func.menuitemid = new ObjectId(newdata.menuitemid);
            func._id = new ObjectId();
            try {
                func.moduleparameters = JSON.parse(newdata.moduleparameters);
                if(!func.hasParameters())
                    throw new Error('Parameters parse failed.');
            } catch (e) {
                throw new Error('JSON parse failed.');
            }
            func.save(function(err) {
                if(err) {
                    logger.error(err);
                    throw new Error('Save failed.');
                } else {
                    resolve(func);
                }
            });
        }).then(
            function funcSavedSuccesfully(func) {
                // STEP 2: add function to menuitem function array
                MenuItemDTO.findById({"_id" : ObjectId(func.menuitemid.toString())},
                    function(err, mi) {
                    if(err || mi===null) {
                        // menuitem notfound???
                        logger.error('Function save: menuitem not found? ' + err);
                        throw new Error('MenuItem not found.');
                    } else {
                        mi.functions.push(new ObjectId(func._id));
                        mi.save(function(err) {
                            if(err) {
                                logger.error(err);
                                callback(err);
                            } else {
                                callback(err, func);
                            }
                        });
                    }
                });
            } // resolve function
        ).catch(function(error) {
            logger.error(error);
            callback(error);
        });
    }
}