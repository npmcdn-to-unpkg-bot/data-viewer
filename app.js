var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var log4js = logger = require('log4js').getLogger();
var path = require('path');
var passport = require('passport');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var app = express();
var router = express.Router();

var routesIndex = require('./routes/index_routes.js')
var routesSystemMenu = require('./routes/menu_routes.js')
var routesAdmin = require('./routes/admin_routes.js')

var db = require('./models/db.js');

require('./config/passport')(passport);

var routesSystemServices = require('./routes/services/SystemService.js')
var menuitemServices = require('./routes/services/MenuItemService.js')
var functionServices = require('./routes/services/functionService.js')

// Morgan log to log4js:
var morganLogger = morgan("combined", {
  stream: {
    write: function(str) { /*log4js.debug(str); */} // enable to log http requests
  }
});
app.use(morganLogger);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// required for passport authentication
app.use(expressSession({ secret: 'ghsgihsgiohgiohsioghsgsdhgioph' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(flash());

// TODO: move to router file?
app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/admin',
        failureRedirect : '/login',
        failureFlash : true // allow flash messages
}));

// ^v ADD NEW ROUTER FILES HERE ^v
app.use('/', 	routesIndex, routesSystemMenu, 
							routesSystemServices, menuitemServices, 
							functionServices, routesAdmin)

// View engine setup (JADE)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

//ERROR HANDLERS:
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});

logger.info('Starting server...');
var server = app.listen(8080, function () {
  var port = server.address().port;
  logger.info('Server listening on port %s', port);
});
