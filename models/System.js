var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var systemSchema = new Schema({
	name : String,
	title : String,
	notes : String
});

var SystemDTO = mongoose.model('systems', systemSchema);

module.exports = SystemDTO;