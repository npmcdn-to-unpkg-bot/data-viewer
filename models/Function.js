var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var functionSchema = new Schema({
	menuitemid : Schema.Types.ObjectId,
	ordernumber : Number,
    moduleid : String,
	moduleparameters: {
        cameraid : String,
        presetid : String,
        roadstationid : String,
        LAM : String
        },
    menuitem : [{ type: Schema.Types.ObjectId, ref: 'menuitems' }]
});

var FunctionDTO = mongoose.model('functions', functionSchema);

module.exports = FunctionDTO;