var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logger = require('log4js').getLogger();

var systemService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/SystemService.js');

var ObjectId = require('mongoose').Types.ObjectId; 

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

/* PUT One system */
router.put('/systemService/:id', function(req, res, next) {
	systemService.updateSystem(req.params.id, req.body, function (err, systemInfo) {
		res.end(JSON.stringify(systemInfo));
	});
});

/* POST One NEW system */
router.post('/systemService', function(req, res, next) {
	systemService.saveSystem(req.params.id, req.body, function (err, systemInfo) {
		if(err) {
			logger.error(err);
			res.status(500).send({ error: "Save failed." });
		}
		res.end(JSON.stringify(systemInfo));
	});
});

/* DELETE One system */
router.delete('/systemService/:id', function(req, res, next) {
	systemService.removeSystem(req.params.id, function (err) {
		if(err) {
			logger.error(err);
			res.status(500).send({ error: "Delete failed." });
		} else {
			res.send({success : true});
			res.end();
		}
	});
});


module.exports = router;