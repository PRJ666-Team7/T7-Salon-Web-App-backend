const passport = require("passport");
const passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: process.env.TOKEN_SECRET
};

passport.use(
    'jwt',
    new JwtStrategy(jwtOptions, (jwt_payload, next) => {
      try {
        console.log("jwt", jwt_payload)
        if (jwt_payload) {
          next(null, { 
            usr_id: jwt_payload.usr_id,
            email: jwt_payload.email,
            fname: jwt_payload.fname,
            lname: jwt_payload.lname,
            phone: jwt_payload.phone,
            isAdmin: jwt_payload.isAdmin
          })
        } else {
          done(null, false, {message: 'no_user'});
        }
      } catch (err) {
        done(err);
      }
    })
  );