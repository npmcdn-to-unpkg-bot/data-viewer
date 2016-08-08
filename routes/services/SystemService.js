var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logger = require('log4js').getLogger();

var systemService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/SystemService.js');

var config = require.main.require('./config.json');

var options = {
		  server: { poolSize: 1 },
		  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
		  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } },
		  ssl: 'true'
		}

/* GET All Systems */
router.get('/systemService', function(req, res, next) {
	systemService.getAllSystems(function(err, systems) {
			res.end(JSON.stringify(systems));
	})
});

/* GET One system */
router.get('/systemService/:id', function(req, res, next) {
	systemService.getSystem(req.params.id, function (err, systemInfo) {
		res.end(JSON.stringify(systemInfo));
	});
});

module.exports = router;