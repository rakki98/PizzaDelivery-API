/*
* Primary file for the Pizza Api
*
*/

//Dependencies
//1.server - includes all the methods for starting the server

var server=require('./lib/server');
var workers=require('./lib/workers')

//Declare the app

var app={}

//App init function
app.init=function(){
    //start the server
     server.init();
    //start the workers
    workers.init();

};

//Execute the init function
app.init();

//Export the app
module.export=app;