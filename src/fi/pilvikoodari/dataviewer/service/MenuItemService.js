var logger = require('log4js').getLogger();

var MenuItemDTO = require.main.require("./models/MenuItem.js");
var FunctionDTO = require.main.require("./models/Function.js");

var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = { 

    getMenuItems : function getMenuItems(systemId, callback) {
        MenuItemDTO.find({"systemId" : ObjectId(systemId)}, function (err, menuItems) {
            if(!err) {
                unsorted = [];
                sorted = [];
                menuItems.forEach(i => {unsorted.push(i.toObject());});
                sortMenuItems(unsorted, sorted);
                callback(err, sorted);
            } else {
                logger.error(err);
                callback(err);
            }
        });
    },
    
    getMenuItemsWithFunctions : function getMenuItemsWithFunctions(systemId, callback) {
        MenuItemDTO.find({"systemId" : ObjectId(systemId)}).
        populate("functions").exec(function (err, menuItems) {
            if(!err) {
                unsorted = [];
                sorted = [];
                menuItems.forEach(i => { unsorted.push(i.toObject()); } );
                sortMenuItems(unsorted, sorted);
                callback(err, sorted);
            } else {
                logger.error(err);
                callback(err);
            }
        });
    },

    getMenuItemWithFunctions : function getMenuItemWithFunctions(menuItemId, callback) {
        MenuItemDTO.findById({"_id" : ObjectId(menuItemId)}).
        populate("functions").exec(function (err, item) {
            if(!err) {
                callback(err, item);
            } else {
                logger.error(err);
                callback(err);
            }
        });
    },

    deleteMenuItem : function deleteMenuItem(menuItemId, callback) {
        new Promise(function(resolve, reject) {
        // STEP1: delete menuitem functions:
            FunctionDTO.find({menuitemid : ObjectId(menuItemId)}).remove(function (err) {
                if(!err) 
                    resolve();
                else
                    reject(err);
            });    
        }).then (
            function functionDeletedSuccesfully() {
                // STEP2: delete menu item itself
                MenuItemDTO.findByIdAndRemove(menuItemId, function(err) {
                    if(err) {
                        logger.error(err);
                        callback(err);
                    } else {
                        callback();
                    }
                });
            },

            // FUNCTIOS DELETE FAILED:
            reason => {
                logger.error(reason);
                logger.error(reason,message);
                callback(reason);
            }
        ) // Promise
    }, // deleteMenuItem

    updateMenuItem : function updateMenuItem(id, newdata, callback) {
        MenuItemDTO.findOne({"_id" : id}, function (err, loaded) {
            if(!err) {
                var item = loaded.toObject();
                for (var property in item) {
                   if (item.hasOwnProperty(property)) {
                       if(newdata.hasOwnProperty(property)) {
                           if(typeof item[property]=='object' && newdata[property]=="")
                             loaded[property]=null;
                           else
                            loaded[property]=newdata[property];
                       }
                    }
                }
                loaded.save(function(err, saved, num) {
                    callback(err, saved);
                });
            } else {
                logger.error(err);
                callback(err);
            }
	    });
    },

    saveMenuItem : function saveMenuItem(newdata, callback) {
        var item = new MenuItemDTO(newdata);
        item.systemId = new ObjectId(newdata.systemId);
        if(newdata.parentItemId!='')
            item.parentItemId = new ObjectId(newdata.parentItemId);
        else
            item.parentItemId = null;
        item._id = new ObjectId();
        item.save(function(err, saved) {
            if(err) {
                logger.error(err);
            }
            callback(err, saved);
        });
    }
}

function sortMenuItems(menuItemsUnsorted, sorted) {
    // Find root first:
    var rootItems = [];
    for(var r=0;r<menuItemsUnsorted.length;r++) {
        if(!menuItemsUnsorted[r].parentItemId)
            rootItems.push(menuItemsUnsorted[r]);
    }
    if(rootItems.length>0) {
        for(var k=0;k<rootItems.length;k++) {
            addRootAndChilds(rootItems[k], menuItemsUnsorted, sorted, 0);
        }
    }
}

function addRootAndChilds(rootItem, allItems, sorted, identation) {
    // Find childs
    var childs = [];
    for(var i=0;i<allItems.length;i++) {
        if(allItems[i].parentItemId && allItems[i].parentItemId.toString()==rootItem._id.toString()) {
            childs.push(allItems[i]);
        }
    }
    // Sort childs
    childs = childs.sort(function(a,b){
        return (a.text.localeCompare(b.text));
    });
    
    // Add root and then add childs recursively
    rootItem.identation = identation;
    sorted.push(rootItem);
    if(childs.length > 0) {
        for(var j=0;j<childs.length;j++) {
        addRootAndChilds(childs[j], allItems, sorted, identation+1);
        }
    }
}
