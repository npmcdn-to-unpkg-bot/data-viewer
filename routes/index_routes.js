var express = require('express');
var router = express.Router();

var pagemetadata =  {
	pagetitle : 'Avoimen datan palvelut'
}
	
var functiontitle_start = 'Aloitus'

/* GET inex.html page. */
router.get('/', function(req, res, next) {
  res.render('index', { pagemetadata: pagemetadata, functiontitle : functiontitle_start });
});

module.exports = router;
