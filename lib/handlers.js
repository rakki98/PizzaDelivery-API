// Contains general handlers  that will be requested by the end users
// Define all the handlers
var handlers={};
// Ping
handlers.ping = function(data,callback){
    callback(200);
};

// Not-Found
handlers.notFound = function(data,callback){
  callback(404);
};

// Export the module
module.exports=handlers;