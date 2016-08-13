var logger = require('log4js').getLogger();

var FunctionDTO = require.main.require("./models/Function.js");

var baseURL = 'http:\/\/weathercam.digitraffic.fi\/'

module.exports = { 

    // getData returns Promise
    getData : function getData(functionDTO) {
        return new Promise(function(resolve, reject) {
            // There is camera id in parameters.
            // Form URL to camera picture and return URL.
            if(!functionDTO.moduleparameters.presetid) {
                logger.error('Weather camera function parameters do not had presetid! functionId=' + functionId);
                reject();
            }
            var url = baseURL + functionDTO.moduleparameters.presetid + '.jpg';
            data = {
                    ordernumber : functionDTO.ordernumber,
                    img : { src: url } 
                };
                resolve(data);
        });// Promise
    } //getData
} // module.exports