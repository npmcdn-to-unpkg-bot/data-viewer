var express = require('express');
var router = express.Router();

// GET admin page for systems
router.get('/admin/systems', function(req, res, next) {
  res.render('adminsystems');
});

// GET admin page for systems menuitems
router.get('/admin/system/:systemId', function(req, res, next) {
  res.render('adminsystem', { systemId: req.params.systemId });
});

module.exports = router;
