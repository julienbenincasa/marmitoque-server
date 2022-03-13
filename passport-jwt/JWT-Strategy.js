require('dotenv').config()
const axios = require('axios')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
}

//création de la JwtStrategy d'authentification
const jwtStrategy = new JwtStrategy(jwtOptions, async function(payload, next) {
      const user =  await axios.get('https://recipes-94c9.restdb.io/rest/cooks?q={\"_id\": \"' + payload.id + '\"}',
      {headers:{"x-apikey":"bb176f1b0465574c4ec90cc442aedeea5d90e"}})
  
      if (user) {
        next(null, user)
      } else {
        next(null, false)
      }
})

module.exports = jwtStrategy;
