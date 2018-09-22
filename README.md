# PizzaDelivery-API

Service offered by the API are :-

1.route :/user

a)method :post .
Users can create an account for the services offerd by the API by providing following information.
-name
-email
-password
-address
-pinCode

b.method : get

Users can get his/her account details provided he/she is logged in

c.method : put

Users can update their account details like address,pinCode,name,password.Email cannot be updated because it acts as a primary key.

d.method : delete

 Logged in user can delete his/her account
 
 2.route : /login
 
 a.method:post
  
  User can create a token for his account by providing email and password
  
  b.method:get
  
  User can get his token by providing email
  
  c.method:put
  
  User can extend the expiry period of token by specifying extend to true in the payload
  
  d:method:delete
  
  User can delete his/her token by providing his/her email id
  
  3.route : /menu
  
  a.method: post
  
  Only Admin or chef can add items to the menu list.
  
  b.method : get
  
  Logged in user can get the details of the items present in the menu.
  
  4.route : /cart
  
  a.method: post
  
  Logged in user can add items to his/her cart by specifying the item id and quantity.
  
  b.method: get
  
  Logged in user can get his/her cart details.
  
  c:method:put
  
  Logged in user can update a particulart cart object by the quantity by specifying which items needs to be updated by providing id.
  
  d:method: delete
  
  Logged in user can delete a cart object by providing the id of the item that needs to be deleted.
  
  4:route : /order
  
  a. method : post
  
  Logged in user can issue for the order of his cart.Logged in user need to pay the biil through Stripe api if the transaction is successful an email to the user will be sent regarding the order through Mailgun api.
  
  
  5:route : /paymentHistory
  
  a. method : post
  
  Logged in user can get his/her transaction details which includes timestamp of each of the transacctions.
  
  Additional Functionality.
  
  Background worker will be constantly monitoring the tokens.Once the token period has expired the token will be deleted. 
 
