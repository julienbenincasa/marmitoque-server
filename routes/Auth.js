require('dotenv').config()
const express = require('express')
const axios = require('axios')
const router = express.Router()
const passport = require('passport')
const jwtStrategy = require('../passport-jwt/JWT-Strategy')
const jwt = require('jsonwebtoken')
const cors = require('cors')

router.use(cors())

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

//initialisation de passport et import de la stratégie custom
router.use(passport.initialize())
passport.use('myJwtStrategy',jwtStrategy)

//login route
router.post('/login', async (req, res) => {
  const {email,password} = req.body;

  if (!email || !password) {
    res.status(401).json({ error: 'Email or password was not provided.' })
    return
  }

  const cook = await axios.get('https://recipes-94c9.restdb.io/rest/cooks?q={\"email\": \"' + email + '\"}',
                                  {headers:{"x-apikey":"bb176f1b0465574c4ec90cc442aedeea5d90e"}})

  /*if (!cook || cook.data[0].password !== password) {
    res.status(401).json({ error: 'Email / password do not match.' })
    return
  }*/

  if (cook.data.length !== 0) {
    if (cook.data[0].password !== password) {
      res.status(401).json({ error: 'Email / password do not match.' })
      return
    }
  } else {
    res.status(401).json({ error: 'Email / password do not match.' })
    return
  }

  //génération du jwt
  const userJwt = jwt.sign({ id: cook.data[0]._id }, process.env.SECRET, {expiresIn:'30m'})

  res.json({ jwt: userJwt })
})

module.exports = router