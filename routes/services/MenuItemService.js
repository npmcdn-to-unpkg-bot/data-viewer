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

/* GET One menuitem */
router.get('/menuItemService/item/:id', function(req, res, next) {
	menuItemService.getMenuItemWithFunctions(req.params.id, function (err, menuItem) {
		res.end(JSON.stringify(menuItem));
	});
});

/* PUT One menuitem */
router.put('/menuItemService/item/:id', function(req, res, next) {
	menuItemService.updateMenuItem(req.params.id, req.body, function (err, menuItem) {
		if(err) {
			res.status(500).send({ error: "Update failed." });
		} else {
			res.send({success : true});
			res.end();
		};
	});
});

module.exports = router;
