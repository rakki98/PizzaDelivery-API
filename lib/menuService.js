/**
 * Following is  the responsibilities of this file.
 * Provides all the details of the available pizzas iff the user is logged in
 **/
//Dependencies 

 var _data=require('./data');
 var loginService=require('./loginService')



 var menu={}

 //method to handle the request

 menu.handleRequest=function(data,callback){
  var acceptableMethods = ['post','put','delete','get'];
  if(acceptableMethods.indexOf(data.method) > -1){
  
  
      menu._menus[data.method](data,callback);
    } else {
      callback(400,{'Error':'Method not supported'});
    }
  };
//Container to handle all the methods
menu._menus={};
/** menu - get
* Responsibililty : To provide the end user with the menu
* Required data(mandatory fields): none
* Optional data: none
**/

menu._menus.get=function(data,callback){
  
    _data.read('menu','pizza',function(err,data)
    { 
        if(!err && data )
        {
           callback(200,data);
        }
        else
        {
            callback(400,{'Error':'Items Does not exist contact the admin or chef to get the list of items'});
        }
    });
};

/** menu - post
* Responsibililty : To provide the admin to add some more items 
* Required data(mandatory fields): token ,admin mail id
* Optional data: none
**/

menu._menus.post=function(data,callback){
//Get the email and id from the headers
  var email=typeof(data.headers.email)=="string" && data.headers.email.trim().length > 0 ? data.headers.email.trim() : false;
  var token = typeof(data.headers.token) == "string" && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
  //Check if both headers are provided

  if(email && token)
  {  //Verify whether the token provided belongs to that particular email
    loginService.verifyToken(token,email,function(tokenValid,err){
      console.log(tokenValid,err)
     //if token is valid then proceed
    if(tokenValid){
      //Lookup the user to check whether he is admin to add items
      _data.read('users',email,function(err,userData){
        //if no error and userData exists then proceed
        if(!err && userData)
        { //if he is admin then proceed 
          console.log(userData.isAdmin)
          if(userData.isAdmin){
          //Get the pizza deteails from the payload
          var id=typeof(data.payload.id) == "string" && data.payload.id.trim().length == 5 ?  data.payload.id.trim() : false;
          var title=typeof(data.payload.title) == "string" && data.payload.title.trim().length>0 ?  data.payload.title.trim() : false;
          var price=typeof(data.payload.price) == "number"  ?  data.payload.price : false;        
          //Check if all the fields are provided
          if(id && title && price)
          {
            var pizzaObject={
                "id":id,
                "title":title,
                "price":price
                      }
            var pizza={}
            pizza.items=[];
            pizza.items.push(pizzaObject);
            
            _data.create('menu','pizza',pizza,function(err){
              if(!err)
              {callback(200);
              }
              else
              {
               //if error occurs that means user already exist add the new cart object to existing cart
               _data.read('menu','pizza',function(err,pizza){
                if(!err && pizza)
                {         //To check whether the pizza object with the particular id already exist
                          //if it exist admin cannot add the item to the menu
                   var flag=1;
                   var pizzaObjects=pizza.items;
                   for(var i=0;i<pizzaObjects.length;i++)
                   {
                       if(pizzaObjects[i].id==id)
                       {
                           
                           flag=0;
                           break;
                       }
                       
                   }
                   if(flag){  
                       pizza.items.push(pizzaObject);
                       _data.update('menu','pizza',pizza,function(err){
                           if(!err){
                               // Return the data about the new check
                               callback(200,pizza);
                           } else {
                               callback(500,{'Error' : 'Could not update the user with the new check.'});
                           }
                           });
                       }                                    
                   else{
                              callback(403,{'error':'item already exist '});
                   }                                                                   
               }
               else{
                    callback(400);
               }
           })
            }
          })
          }
          else
          {
            callback(400,{'error':'missing requrired fields'});
          }
        }
           else
           {
             callback(403,{'error':'unauthtorized access'});
           }         
        }
      });
    }
    else{
      callback(403,{"Error" : " token is invalid."});           
    }
    });
  }
  else{
    callback(404,{"Error" : "Missing required token in header, or email."});    
  }
};

// Export the module
 module.exports=menu;



