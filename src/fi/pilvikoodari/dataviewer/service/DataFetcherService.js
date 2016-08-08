var logger = require('log4js').getLogger();

var menuItemService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/MenuItemService.js');

var weatherCamModule  = require.main.require('./src/fi/pilvikoodari/dataviewer/modules/WeatherCam.js');


module.exports = {
    // RETRUNS PROMISE
    fetchData : function fetchData(menuItemId) {
        return new Promise(function (resolve, reject) {
            var allFunctionsData = [];

            menuItemService.getMenuItemWithFunctions(menuItemId, function(err, item) {
                if(!err) {
                    var promises = item.functions.map((funct) => {
                        return handleItem(funct, allFunctionsData);
                        });
                    Promise.all(promises).then(function() {
                         resolve(allFunctionsData)}
                         );
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
        if(functionDTO.moduleid==='weathercam') {
            // WeatherCamModule.getData also returns Promise:
            weatherCamModule.getData(functionDTO).then(
                function success(data) {
                    allFunctionsData.push(data);
                    resolve();
                },
                function failed() {
                    reject();
                }
            )
        } else {
            logger.info("No module for " + functionDTO.moduleid);
            reject();
        }
    })
} 
