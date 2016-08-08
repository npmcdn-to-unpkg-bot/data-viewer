var logger = require('log4js').getLogger();

var FunctionDTO = require.main.require("./models/Function.js");

var baseURL = 'http:\/\/weathercam.digitraffic.fi\/'

module.exports = { 

    // getData returns Promise
    getData : function getData(functionId) {
        return new Promise(function(resolve, reject) {
            // There is camera id in parameters.
            // Form URL to get camera picture
            FunctionDTO.findById(functionId, function(err, funct) {
                if(!err) {
                    if(!funct.moduleparameters.presetid) {
                        logger.error('Weather camera function parameters do not had presetid! functionId=' + functionId);
                        reject();
                    }
                    var url = baseURL + funct.moduleparameters.presetid + '.jpg';
                    data = {
                            ordernumber : funct.ordernumber,
                            img : { src: url } 
                        };
                        resolve(data);
                } else {
                    logger.error("Function not found by id: " + functionId);
                    reject();
                }
            }); // findById
        });// Promise
    } //getData
} // module.exports