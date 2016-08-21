var express = require('express');
var router = express.Router();

var dataFetcherService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/DataFetcherService.js');
var menuItemService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/MenuItemService.js');
var systemService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/SystemService.js');

/* GET Listing page */
router.get('/menu/:systemId', function(req, res, next) {
  systemService.getSystem(req.params.systemId, function(err, system) {
    if(!err) 
       res.render('menu', { systemId: req.params.systemId, title : system.name });
     else {
       logger.error(err);
       res.render('menu', { systemId: req.params.systemId });
    }
     
  });
});

/* GET item page */
router.get('/menu/open/:menuItemId', function(req, res, next) {
  menuItemService.getMenuItemWithFunctions(req.params.menuItemId, function(err, item) {
    if(!err) {
  
      // Fetch data speficied in parameters and send data to 'open'' -page
      dataFetcherService.fetchData(req.params.menuItemId)
        .then(
        
          function success(dataToShow) {
            res.render('open', { data: dataToShow, systemId : item.toObject().systemId, menuItemText : item.toObject().text});
          }, 
        
          function failed() {
            logger.error('Open menuitem failed: ' + req.params.menuItemId);
            res.render('open', {data : [], systemId : item.toObject().systemId});
          })
        .catch(function() {
          logger.error("Open menuItem failed: " + req.params.menuItemId);
        });
     }
  });// getMenuItemWithFunctions
});  

module.exports = router;
