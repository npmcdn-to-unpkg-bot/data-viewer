var express = require('express');
var router = express.Router();
var logger = require('log4js').getLogger();

var functionService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/FunctionService.js');

/* GET One function */
router.get('/functionService/:id', function(req, res, next) {
	functionService.getFunction(req.params.id, function (err, func) {
		res.end(JSON.stringify(func));
	});
});

/* DELETE one function */
router.delete('/functionService/:id', function(req, res, next) {
	functionService.removeFunction(req.params.id, function(err) {
		if(err) {
			res.status(500).send({ error: "Delete failed." });
		} else {
			res.send({success : true});
			res.end();
		}
	})
});


/* PUT One function */
router.put('/functionService/:id', function(req, res, next) {
	functionService.updateFunction(req.params.id, req.body, function (err, menuItem) {
		if(err) {
			res.status(500).send({ error: "Update failed." });
		} else {
			res.send({success : true});
			res.end();
		};
	});
});

module.exports = router;

