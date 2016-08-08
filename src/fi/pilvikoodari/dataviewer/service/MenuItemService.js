var logger = require('log4js').getLogger();

var MenuItemDTO = require.main.require("./models/MenuItem.js");

module.exports = { 

    getMenuItems : function getMenuItems(systemId, callback) {
        MenuItemDTO.find({"systemId" : systemId}, function (err, menuItems) {
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
        MenuItemDTO.find({"systemId" : systemId}).
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
        MenuItemDTO.findById({"_id" : menuItemId}).
        populate("functions").exec(function (err, item) {
            if(!err) {
                callback(err, item);
            } else {
                logger.error(err);
                callback(err);
            }
        });
    }
}

function sortMenuItems(menuItemsUnsorted, sorted) {
    // Find root first:
    var rootItem;
    for(var r=0;r<menuItemsUnsorted.length;r++) {
        if(!menuItemsUnsorted[r].parentItemId)
            rootItem = menuItemsUnsorted[r];
    }
    if(rootItem)
        addRootAndChilds(rootItem, menuItemsUnsorted, sorted, 0);
}

function addRootAndChilds(rootItem, allItems, sorted, identation) {
    // Find childs
    var childs = [];
    for(var i=0;i<allItems.length;i++) {
        if(allItems[i].parentItemId==rootItem._id) {
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
