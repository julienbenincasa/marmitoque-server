const express = require('express')
const router = express.Router()
const axios = require('axios')
const passport = require('passport')
const jwtStrategy = require('../passport-jwt/JWT-Strategy')


router.use(express.json())
router.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//initialisation de passport et import de la stratégie custom
router.use(passport.initialize())
passport.use('myJwtStrategy',jwtStrategy)

function getRecipe(id) {
	return axios.get('https://recipes-94c9.restdb.io/rest/recipes/' + id,
		{headers:{"x-apikey":"bb176f1b0465574c4ec90cc442aedeea5d90e"}})

}

//récupérer une recette
router.get('/:id', async (req, res) => {
	const recipe = await getRecipe(req.params.id)
	res.json(recipe.data)
})

//récupérer la liste des recettes 
router.get('/', async (req, res) => {
	const recipes = await axios.get('https://recipes-94c9.restdb.io/rest/recipes',
                                  {headers:{"x-apikey":"bb176f1b0465574c4ec90cc442aedeea5d90e"}})
	res.json(recipes.data)
})

//ajouter une recette
router.post('/', passport.authenticate('myJwtStrategy', { session: false }), async (req, res) => {
  const newRecipe = await axios.post('https://recipes-94c9.restdb.io/rest/recipes',
								req.body,
								{headers:{'x-apikey': 'bb176f1b0465574c4ec90cc442aedeea5d90e'}})
	res.json(newRecipe.data)
})

//modifier une recette
router.put('/:id', passport.authenticate('myJwtStrategy', { session: false }), async (req, res) => {
	const recipe = await getRecipe(req.params.id)

	//check si l'utilisateur n'est pas le créateur de la recette
	if(recipe.data.creator_id !== req.user.data[0]._id) {
		res.status(401).json({ error: 'Unauthorized.' })
    	return
	}

	const editRecipe = await axios.put('https://recipes-94c9.restdb.io/rest/recipes/' + req.params.id,
									req.body,
									{headers:{"x-apikey":"bb176f1b0465574c4ec90cc442aedeea5d90e"}})
	res.json(editRecipe.data)
})

//supprimer une recette
router.delete('/:id', passport.authenticate('myJwtStrategy', { session: false }), async (req, res) => {
	const recipe = await getRecipe(req.params.id)

	//check si l'utilisateur n'est pas le créateur de la recette
	if(recipe.data.creator_id !== req.user.data[0]._id) {
		res.status(401).json({ error: 'Unauthorized.' })
    	return
	}
	
	const delRecipe = await axios.delete('https://recipes-94c9.restdb.io/rest/recipes/' + req.params.id,
										{headers:{"x-apikey":"bb176f1b0465574c4ec90cc442aedeea5d90e"}})
	res.json(delRecipe.data)
})

//recettes de l'utilisateur connecté
router.get('/of/user', passport.authenticate('myJwtStrategy', { session: false }), async (req, res) => {
	const myRecipes = await axios.get('https://recipes-94c9.restdb.io/rest/recipes?q={\"creator_id\":\"' + req.user.data[0]._id + '\"}',
                                  {headers:{"x-apikey":"bb176f1b0465574c4ec90cc442aedeea5d90e"}})
	res.json(myRecipes.data)
})

module.exports = router