var logger = require('log4js').getLogger();

var menuItemService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/MenuItemService.js');

var weatherCamModule  = require.main.require('./src/fi/pilvikoodari/dataviewer/modules/WeatherCam.js');
var simpleTextModule  = require.main.require('./src/fi/pilvikoodari/dataviewer/modules/SimpleText.js');
var trafficStatsModule  = require.main.require('./src/fi/pilvikoodari/dataviewer/modules/TrafficStats.js');

module.exports = {
    // RETRUNS PROMISE
    fetchData : function fetchData(menuItemId) {
        return new Promise(function (resolve, reject) {
            var allFunctionsData = [];

            menuItemService.getMenuItemWithFunctions(menuItemId, function(err, item) {
                if(!err) {

                    var promises = item.functions.map((funct) => {
                        return handleItem(funct.toObject(), allFunctionsData);
                        });

                    Promise.all(promises).then(function() {
                         resolve(allFunctionsData)},  reason => reject());

                } else {
                    reject();
                }
            })
         }) //Promise         
    }

} // exports

// RETURNS PROMISE
function handleItem(functionDTO, allFunctionsData) {
    return new Promise(function(resolve, reject) {

        var succ = function success(data) {
            allFunctionsData.push(data);
            resolve();
        }

        var fail = function failed() {
            reject();
        }

        if(functionDTO.moduleid==='weathercam') {
            weatherCamModule.getData(functionDTO).then(succ,fail);            
        } else if(functionDTO.moduleid==='simpletext') {
            simpleTextModule.getData(functionDTO).then(succ,fail);
        } else if(functionDTO.moduleid==='trafficstats') {
            trafficStatsModule.getData(functionDTO).then(succ,fail);
        } else {
            logger.warn("No module for " + functionDTO.moduleid);
            reject();
        }
    })
} 
