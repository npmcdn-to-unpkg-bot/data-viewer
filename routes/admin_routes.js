var express = require('express');
var router = express.Router();

var menuItemService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/MenuItemService.js');
var functionService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/FunctionService.js');


// GET admin page for all systems
router.get('/admin', function(req, res, next) {
  res.render('adminsystems');
});

// GET admin page for all systems
router.get('/admin/systems', function(req, res, next) {
  res.render('adminsystems');
});

// GET admin page for one system
router.get('/admin/system/:systemId', function(req, res, next) {
  res.render('adminsystem', { systemId: req.params.systemId });
});

// GET admin page for NEW system
router.get('/admin/system/', function(req, res, next) {
  res.render('adminsystem', { systemId: '' });
});

// GET admin page for one menuitem
router.get('/admin/menuitem/:menuItemId', function(req, res, next) {
  menuItemService.getMenuItemWithFunctions(req.params.menuItemId, function(err, item) {
    if(err) {
      res.render('adminmenuitem', { menuItemId: req.params.menuItemId, systemId : '', parentId : '' });
    } else {
      res.render('adminmenuitem', { menuItemId: req.params.menuItemId,  systemId: item.toObject().systemId, parentId: item.toObject().parentItemId} );
    }
  })
});

// GET admin page for NEW menuitem with parent
router.get('/admin/add/menuitem/:systemId/parent/:parentId', function(req, res, next) {
  res.render('adminmenuitem', { systemId : req.params.systemId, parentId : req.params.parentId });
});

// GET admin page for NEW menuitem (root)
router.get('/admin/add/menuitem/:systemId', function(req, res, next) {
  res.render('adminmenuitem', { systemId: req.params.systemId, parentId : '' });
});


// GET admin page for one function
router.get('/admin/function/:functionId', function(req, res, next) {
  functionService.getFunction(req.params.functionId, function(err, func) {
    if(err) {
      res.render('adminfunction', { functionId: req.params.functionId,
        menuItemId: '' });
    } else {
      res.render('adminfunction', { functionId: req.params.functionId,
        menuItemId: func.menuitemid });
    }
  });  
});


// GET admin page for NEW function
router.get('/admin/add/function/:menuItemId', function(req, res, next) {
      res.render('adminfunction', { functionId: '',
        menuItemId: req.params.menuItemId });
});


module.exports = router;