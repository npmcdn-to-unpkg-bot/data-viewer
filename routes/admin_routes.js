var express = require('express');
var router = express.Router();

var passport = require('passport');

var UserDTO = require.main.require("./models/User.js");

var menuItemService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/MenuItemService.js');
var functionService = require.main.require('./src/fi/pilvikoodari/dataviewer/service/FunctionService.js');


// GET admin page for all systems
router.get('/admin', isLoggedIn, function(req, res, next) {
  res.render('adminsystems');
});

// GET admin page for all systems
router.get('/admin/systems', isLoggedIn, function(req, res, next) {
  res.render('adminsystems');
});

// GET admin page for one system
router.get('/admin/system/:systemId', isLoggedIn, function(req, res, next) {
  res.render('adminsystem', { systemId: req.params.systemId });
});

// GET admin page for NEW system
router.get('/admin/system/', isLoggedIn, function(req, res, next) {
  res.render('adminsystem', { systemId: '' });
});

// GET admin page for one menuitem
router.get('/admin/menuitem/:menuItemId', isLoggedIn, function(req, res, next) {
  menuItemService.getMenuItemWithFunctions(req.params.menuItemId, function(err, item) {
    if(err) {
      res.render('adminmenuitem', { menuItemId: req.params.menuItemId, systemId : '', parentId : '' });
    } else {
      res.render('adminmenuitem', { menuItemId: req.params.menuItemId,  systemId: item.toObject().systemId, parentId: item.toObject().parentItemId} );
    }
  })
});

// GET admin page for NEW menuitem with parent
router.get('/admin/add/menuitem/:systemId/parent/:parentId', isLoggedIn, function(req, res, next) {
  res.render('adminmenuitem', { systemId : req.params.systemId, parentId : req.params.parentId });
});

// GET admin page for NEW menuitem (root)
router.get('/admin/add/menuitem/:systemId', isLoggedIn, function(req, res, next) {
  res.render('adminmenuitem', { systemId: req.params.systemId, parentId : '' });
});


// GET admin page for one function
router.get('/admin/function/:functionId',  isLoggedIn, function(req, res, next) {
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
router.get('/admin/add/function/:menuItemId', isLoggedIn, function(req, res, next) {
      res.render('adminfunction', { functionId: '',
        menuItemId: req.params.menuItemId });
});


// GET admin login page
router.get('/login', function(req, res, next) {
  res.render('adminlogin', { message: req.flash('loginMessage') });
});

// POST login form
router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/admin',
        failureRedirect : '/login', 
        failureFlash : true
}));


// GET for admin logout: log out and move to root of services
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


// ADD NEW USER : UNCOMMENT THIS TO ADD USER(S) USING URL 
/*
router.get('/adduser/:username/:password', function(req, res, next) {
  var newUser = new UserDTO();
  newUser.username    = req.params.username;
  newUser.password = newUser.generateHash(req.params.password);
  newUser.save(function(err) {
    if(err) {
      console.log("User save failed.");
    } else {
      console.log("User " + newUser._id +"saved!");
    }
  });
  res.redirect('/');
});
*/

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

module.exports = router;