var mongoose = require('mongoose');
var logger = require('log4js').getLogger();

var config = require.main.require('./config.json');
var db_url = config.db_url;

var connection = mongoose.connection;

var options = {
		  server: {poolSize: 1 ,  socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
		  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } },
		  ssl: 'true'
		};

mongoose.connect(db_url);

mongoose.connection.on('connected', function () {  
	  logger.info('Connected to database');
	}); 

	// If the connection throws an error
	mongoose.connection.on('error',function (err) {  
	  logger.info('Database connection error: ' + err);
	}); 

	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {  
	  logger.info('Database connection closed.'); 
	});
 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    process.exit(0); 
  }); 
  
});

require('./../models/System.js');
require('./../models/MenuItem.js');
require('./../models/Function.js');
require('./../models/User.js');