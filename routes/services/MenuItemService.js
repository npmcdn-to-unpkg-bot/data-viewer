var express = require('express');
var router = express.Router();
var logger = require('log4js').getLogger();

var menuItemService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/MenuItemService.js');

/* GET All menuitems for one system */
router.get('/menuItemService/:systemId', function(req, res, next) {
	menuItemService.getMenuItemsWithFunctions(req.params.systemId, function(err, menuItems) {
		res.end(JSON.stringify(menuItems));
	})
});

/* DELETE one menuitem */
router.delete('/menuItemService/:menuItemId', function(req, res, next) {
	console.log("PARAM="+req.params.menuItemId);
	menuItemService.deleteMenuItem(req.params.menuItemId, function(err) {
		if(err) {
			res.status(500).send({ error: "Delete failed." });
		} else {
			res.send({success : true});
			res.end();
		}
	})
});



module.exports = router;
