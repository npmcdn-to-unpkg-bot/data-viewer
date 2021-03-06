var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuItemSchema = new Schema({
	systemId : Schema.Types.ObjectId,
	parentItemId : Schema.Types.ObjectId,
	text : String,
	functions : [{ type: Schema.Types.ObjectId, ref: 'functions' }]
});

var MenuItemDTO = mongoose.model('menuitems', menuItemSchema);

module.exports = MenuItemDTO;