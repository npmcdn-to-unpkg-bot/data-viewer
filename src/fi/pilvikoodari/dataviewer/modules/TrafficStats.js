var logger = require('log4js').getLogger();
var unirest = require('unirest');
var parsexmlstring = require('xml2js').parseString;
var util = require('util')


module.exports = { 

    // getData returns Promise
    getData : function getData(functionDTO) {
        return new Promise(function(resolve, reject) {
            if(!functionDTO.moduleparameters.LAM) {
                logger.error('Traffic static module parameter missing: LAM. functionId=' + functionId);
                reject();
            }
            unirest.get('http://tie.digitraffic.fi/sujuvuus/ws/lamData')
            .end(function(res) {
                if (res.error) {
                    logger.error('Traffic stats query failed: ', res.error)
                    reject();
                } else {
                    parsexmlstring(res.body, function(err, result) {
                        if(err) {
                            logger.error("XML parsing error. " + error.message);
                        } else {

                            var datas = result['soap:Envelope']['soap:Body'][0]['LamDataResponse'][0].lamdynamicdata[0].lamdata;
                            
                            for(var i=0;i<datas.length;i++) {
                                if(datas[i].lamid==functionDTO.moduleparameters.LAM) {
                                    var currentdata = datas[i];
                                    data = {
                                        ordernumber : functionDTO.ordernumber,
                                        lamdata : {
                                            lamid : currentdata.lamid,
                                            time : currentdata.measurementtime[0].localtime,
                                            trafficvolume1 : currentdata.trafficvolume1,
                                            trafficvolume2 : currentdata.trafficvolume2,
                                            averagespeed1 : currentdata.averagespeed1,
                                            averagespeed2 : currentdata.averagespeed2
                                        }
                                    }
                                    resolve(data);
                                    break;
                                }
                            }
                            // not found?
                           data = {
                            ordernumber : functionDTO.ordernumber,
                            text : '[liikennetietoja ei löytynyt]]' 
                           };
                           resolve(data);
                        }
                    });
                }
            }); // end of unirest request

        });// Promise
    } //getData
} // module.exports