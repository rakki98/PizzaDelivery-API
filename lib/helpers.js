//Container for all the handlers


var helpers={}
var crypto=require('crypto');
var config=require('./config')
var querystring = require('querystring');
var https=require("https")


//Create a SHA256 hash
helpers.hash=function(str){
    if(typeof(str)=='string' && str.length>0){
     var hash=crypto.createHash('sha256',config.hashingSecret).update(str).digest('hex');
     return hash;
    }
    else
    return false;
}
//Parse a JSON string to an object
helpers.parsedJSONToObject=function(str)
{
    try{
     var obj=JSON.parse(str);
     return obj;
    }
    catch(e){
    return {};
}
};
//Create a random string 
helpers.createRandomString=function(strLength){
    strLength=typeof(strLength) =='number' && strLength>0 ? strLength : false;
    if(strLength)
    {
      var possibleCharacters='abcdefghijklmnopqrstuvwxyz1234567890';
      //start the final string 
      var str=''
      for(i=1;i<=strLength;i++)
      {
          var random=possibleCharacters.charAt(Math.floor(Math.random()* possibleCharacters.length));
          str+=random;
      }
      return str;
    }
    else
    {
        return false;
    }

}
//To check whether password contains a upper case letter
helpers.uppercase=function(password){
    var regex = /^(?=.*[A-Z]).+$/;

    if( regex.test(password) ) {
        return true;
    }
    else
    {return false;}
   
};
//To check whether password contains a lower case letter

helpers.lowercase=function(password){
    var regex = /^(?=.*[a-z]).+$/;

    if( regex.test(password) ) {
        return true;
    }
    else
    {return false;}
   
   
};
//To check whether password contains a special character

helpers.specialCharacters=function(password){
    var regex = /^(?=.*[0-9_\W]).+$/;

    if( regex.test(password) ) {
        return true;
    }
    else
    {return false;}
   
};
//To validate the password
helpers.validatePassword=function(password){
  var upperCase= helpers.uppercase(password);
  var lowerCase=helpers.lowercase(password);
  var specialCharacters=helpers.specialCharacters(password);
  
  if(upperCase && lowerCase  && specialCharacters)
  {
      return true;
  }
  else
  {return false;
    }

};  
// Payment by stripe API
  helpers.stripe = function(amount,currency,description,source,callback){
    // Configure the request payload
    var payload = {
      'amount' : amount,
      'currency' : currency,
      'description' : description,
      'source' : source,
    }
  
    // Stringify the payload
    var stringPayload = querystring.stringify(payload);
  
    // Configure the request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.stripe.com',
      'method' : 'POST',
      'auth' : config.stripe.secretKey,
      'path' : '/v1/charges',
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length' : Buffer.byteLength(stringPayload)
      }
    }
  
    // Instantiate the request object
    var req = https.request(requestDetails,function(res){
      // Grab the status of the sent request
      var status = res.statusCode;
      // Callback successfully if the request went through
      if(status==200 || status==201){
        callback(false);
      } else {
        callback('Status code return was '+status);
      }
    });
  
    // Bind to the error event so it doesn't get the thrown
    req.on('error',function(e){
      callback(e);
    });
  
    // Add the payload
    req.write(stringPayload);
  
    // End the request
    req.end();
  }
  
  // Send the email by mailgun API
  helpers.mailgun = function(to,subject,text,callback){
    // Configure the request payload
    var payload = {
      'from' : config.mailgun.sender,
      'to' : to,
      'subject' : subject,
      'text' : text
    }
  
    // Stringify the payload
    var stringPayload = querystring.stringify(payload);
  
    // Configure the request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.mailgun.net',
      'method' : 'POST',
      'auth' : config.mailgun.apiKey,
      'path' : '/v3/'+config.mailgun.domainName+'/messages',
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length' : Buffer.byteLength(stringPayload)
      }
    }
  
    // Instantiate the request object
    var req = https.request(requestDetails,function(res){
      // Grab the status of the sent request
      var status = res.statusCode;
      // Callback successfully if the request went through
      if(status==200 || status==201){
        callback(false);
      } else {
        callback('Status code return was '+status);
      }
    });
  
    // Bind to the error event so it doesn't get the thrown
    req.on('error',function(e){
      callback(e);
    });
  
    // Add the payload
    req.write(stringPayload);
  
    // End the request
    req.end();
  }
// Export the module
module.exports=helpers;