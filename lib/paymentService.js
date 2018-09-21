/**
 * Following is the responsibilityof this file.
 * to display the paymentHistory of the logged in user
 * 
 **/

var _data=require('./data');
var loginService=require('./loginService')


var paymentHistory={}
//method to handle all the requests

paymentHistory.handleRequest=function(data,callback){
   var acceptableMethod = ['post'];
   if(acceptableMethod.indexOf(data.method) > -1){
    paymentHistory._paymentHistorys[data.method](data,callback);
   } else {
     callback(400,{'Error':'Method not supported'});
   }
 };
 //Container for the method supported 
 paymentHistory._paymentHistorys={}
/** paymentHistory - post
* Responsibililty : To display the paymentHistory of the logged in user
* Required data(mandatory fields): oken,email
* Desciption of each fields :
* -email - To identify the user
*  -token -to vaildate the user
* Optional data: none
**/
 paymentHistory._paymentHistorys.post=function(data,callback){
    var email=typeof(data.headers.email)=="string" && data.headers.email.trim().length > 0 ? data.headers.email.trim() : false;
    var token = typeof(data.headers.token) == "string" && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
    if(email && token )
    {  //Verify whether the token provided belongs to that particular email
      loginService.verifyToken(token,email,function(valid){
       //if token is valid then proceed
      if(valid){
    _data.read('paymentHistory',email,function(err,data){
        if(!err && data)
        {callback(200,data);}
        else
        callback(400);
    })  
 }
 else{
 callback(400,{'error':'invalid'})
    }
    });
    }
}

//Export the moudle
module.exports=paymentHistory;