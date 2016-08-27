var express = require('express');
var router = express.Router();

// GET admin page for all systems
router.get('/admin/systems', function(req, res, next) {
  res.render('adminsystems');
});

// GET admin page for one system
router.get('/admin/system/:systemId', function(req, res, next) {
  res.render('adminsystem', { systemId: req.params.systemId });
});

// GET admin page for one menuitem
router.get('/admin/menuitem/:menuItemId', function(req, res, next) {
  res.render('adminmenuitem', { menuItemId: req.params.menuItemId });
});

module.exports = router;