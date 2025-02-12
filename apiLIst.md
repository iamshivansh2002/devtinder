authRoute-----
-POST signup
-POST /login
-POST /logout

profileRouter-----
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

cooncectionRequestRouter-------
-POST /request/send/interested/:userID
-POST /request/send/ignored/:userID
-POST /request/review/accepted/:requestID
-POST /request/review/rejected/:requestID

userRaouter------------
-GET /user/connection
-GET /user/requests
-GET /user/feed 

Status: ignore, interested, accepted, rejected