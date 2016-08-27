var logger = require('log4js').getLogger();

var FunctionDTO = require.main.require("./models/Function.js");

var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = { 

    removeFunction : function removeFunction(id, callback) {
        FunctionDTO.findByIdAndRemove(id, function (err) {
             callback(err);
        });
    },

    updateFunction : function updateFunction(id, newdata, callback) {
        console.log("NEW DATA : " + newdata);
        FunctionDTO.findOne({"_id" : id}, function (err, loaded) {
            if(!err) {
                var item = loaded.toObject();
                for (var property in item) {
                    if (item.hasOwnProperty(property)) {
                        if(newdata.hasOwnProperty(property)) {
                            if(property=='moduleparameters') {
                                loaded[property]=JSON.parse(newdata[property]);
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
    }
}