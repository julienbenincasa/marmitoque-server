const express = require('express')
const router = express.Router()
const axios = require('axios')
const cors = require('cors')

router.use(cors())

router.use(express.json())
router.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//récupérer un cuistot
router.get('/:id', async (req, res) => {
	const cook = await axios.get('https://recipes-94c9.restdb.io/rest/cooks/'+ req.params.id,
								{headers:{"x-apikey":"bb176f1b0465574c4ec90cc442aedeea5d90e"}})
	res.json(cook.data)
})

//créer un cuistot
router.post('/', async (req, res) => {
	const isEmailTaken = await axios.get('https://recipes-94c9.restdb.io/rest/cooks?q={\"email\":\"'+ req.body.email +'\"}',
								  {headers:{'x-apikey': 'bb176f1b0465574c4ec90cc442aedeea5d90e'}})

	//check si l'email est déjà utilisé
	if(isEmailTaken.data.length !== 0) {
		res.status(401).json({ error: 'Email is already taken.' })
		return
	}

	const isPseudoTaken = await axios.get('https://recipes-94c9.restdb.io/rest/cooks?q={\"pseudo\":\"'+ req.body.pseudo +'\"}',
								  {headers:{'x-apikey': 'bb176f1b0465574c4ec90cc442aedeea5d90e'}})

	//check si le pseudo est déjà utilisé
	if(isPseudoTaken.data.length !== 0) {
		res.status(401).json({ error: 'Pseudo is already taken.' })
		return
	}

	//création du compte
	const newCook = await axios.post('https://recipes-94c9.restdb.io/rest/cooks', req.body,
								  {headers:{'x-apikey': 'bb176f1b0465574c4ec90cc442aedeea5d90e'}})
	  res.json(newCook.data)
})

module.exports = router