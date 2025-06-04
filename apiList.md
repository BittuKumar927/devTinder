# DevTinder APIs

authRouter
- POST /signup
- POST /login
- POST /logout

Profile Router
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectRequestRouter
- POST /request/send/interested/:userid
- POST /request/send/ingnored/:userid
// made :status dynamic api

- POST /request/review/accepted/:requestid
- POST /request/review/rejected/:requestid

Status: ignore, interested, accepted, rejected

userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed -Gets you the profile of other users on platform