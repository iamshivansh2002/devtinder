authRoute-----
-POST signup
-POST /login
-POST /logout

profileRouter-----
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

concectionRequestRouter-------
-POST /request/send/status/:userID
-POST /request/review/status/:userID

userRaouter------------
-GET /user/requests/received
-GET /user/connection
-GET /user/feed 

Status: ignore, interested, accepted, rejected