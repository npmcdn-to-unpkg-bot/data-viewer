var logger = require('log4js').getLogger();

var FunctionDTO = require.main.require("./models/Function.js");

module.exports = { 

    // getData returns Promise
    getData : function getData(functionDTO) {
        return new Promise(function(resolve, reject) {
            if(!functionDTO.moduleparameters.text) {
                logger.error('Simpel text module parameter missing: text. functionId=' + functionId);
                reject();
            }
            data = {
                    ordernumber : functionDTO.ordernumber,
                    text : functionDTO.moduleparameters.text 
                };
            resolve(data);
        });// Promise
    } //getData
} // module.exports