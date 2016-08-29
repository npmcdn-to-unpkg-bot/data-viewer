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
        }
});

functionSchema.methods.hasParameters = function() {
    if(this.moduleparameters.cameraid==null && 
        this.moduleparameters.presetid==null &&
        this.moduleparameters.roadstationid==null && 
        this.moduleparameters.LAM==null)
        return false;
    return true;
}

var FunctionDTO = mongoose.model('functions', functionSchema);

module.exports = FunctionDTO;