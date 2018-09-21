// importing the required modules
// 1.http - To create the http server and handle the reqeusts and return the responses
// 2.url - To  parse the url mentioned in the uri
//  3.string_decoder - To decode the data sent across the intenet to the server as payload
// 4.fs -(file system) -To read and write files both synchronously and assynchronously
// 5.https - To create https server
var http=require('http');
var https=require('https');
var url=require('url');
var stringDecoder=require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');
var handlers=require('./handlers');
var helpers = require('./helpers');
var path=require('path');
var userService=require('./userService');
var loginService=require('./loginService');
var menuService=require('./menuService');
var cartService=require('./cartService');
var orderService=require('./orderService');
var paymentService=require('./paymentService');
var server={};


// Instantiating the http server and server is listening on port 3000:)

server.httpServer = http.createServer(function(req,res){
    server.unifiedServer(req,res);
  });


  // Instantiate the HTTPS server
  server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname +'/../https/key.pem')),
  'cert': fs.readFileSync(path.join(__dirname +'/../https/cert.pem'))

  };
  server.httpsServer = https.createServer(server.httpsServerOptions,function(req,res){
    server.unifiedServer(req,res);
  });
  
  
  server.unifiedServer=function(request,response){
        //Parses the url i.e( gets the url) ,true for getting the query string also (http://localhost:3000?query='hello') 
   
        var parsedUrl=url.parse(request.url,true);

        //Getting the path or route entered in the url
        var path=parsedUrl.pathname;
        var trimmedPath=path.replace(/^\/+|\/+$/g, '');
    
         // Get the query string as an object
        var queryStringObject = parsedUrl.query;

        // Get the HTTP method
        var method = request.method.toLowerCase();

        //Get the headers as an object
        var headers = request.headers;     
        
        //Getting the payload if any sent by the post method
        var decoder=new stringDecoder('utf-8');
      
        var buffer='';
        //As long as  there is a request to the server append the data sent to the buffer
        //When receiving a POST or PUT request, the request body might be important to our application. Getting at the body data is a little more involved than accessing request headers. The request object that's passed in to a handler implements the ReadableStream interface. 
        // We can grab the data right out of the stream by listening to the stream's 'data' and 'end' events.
        //    The chunk emitted in each 'data' event is a Buffer. If you know it's going to be string data, the best thing to do is collect the data in an array, then at the 'end', concatenate and stringify it.
        
        
        request.on('data',(data)=>{
            //write()	Returns the specified buffer as a string   
            buffer+=decoder.write(data);
        });
        
        request.on('end',()=>{
        //end()	Returns what remains of the input stored in the internal buffer
           buffer+=decoder.end();
          
        //Check the router for matching handel.If one is not found, use the notFound handler instead.
        var choosenHandler= (typeof(server.router[trimmedPath])!='undefined') ? server.router[trimmedPath] : handlers.notFound;
        
                   
        var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' :helpers.parsedJSONToObject(buffer)
        };
        
        choosenHandler(data,function(statusCode,payload){
                        //Logic for checking whether a number is sent as statusCode,if not set it to 200 
                        statusCode= typeof(statusCode) =='number' ? statusCode : 200                   
                       
                      
                        // Use the status code returned from the handler, or set the default status code to 200
                        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

                        // Use the payload returned from the handler, or set the default payload to an empty object
                        payload = typeof(payload) == 'object'? payload : {};

                        // Convert the payload to a string
                        var payloadString = JSON.stringify(payload);

                        // Return the response
                        response.setHeader('Content-Type', 'application/json');
                        response.writeHead(statusCode);
                        response.end(payloadString);
                        console.log("Returning this response: ",statusCode,payloadString);

                        


                    });

    });
};





// Define the request router
server.router={
    'ping':handlers.ping,
    'user': userService.handleRequest,
    'login': loginService.handleRequest,
    'menu':menuService.handleRequest,
    'cart':cartService.handleRequest,
    'order':orderService.handleRequest,
    'paymentHistory':paymentService.handleRequest
    
    
};

//Server initalization function
server.init=function(){
    //Start the http server on port 3000
    server.httpServer.listen(config.httpPort,function(){
        console.log('The HTTP server is running on port '+config.httpPort);
      });
      
    // Start the HTTPS server on port 3001
    server.httpsServer.listen(config.httpsPort,function(){
    console.log('The HTTPS server is running on port '+config.httpsPort);
   });
   

};







//Export the server object
module.exports=server;