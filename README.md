# marmitoque-server
API Server for marmitoque project  
  
# How use the project
This project is currently deployed using Heroku : https://marmitoque-server.herokuapp.com/  
(no current welcome page but you can try routes listed below)

# Ressources

Cooks (users)  
Recipes

# Routes 

GET     /recipes/id       Requires recipes's id  
GET     /recipes  
POST    /recipes          Requires valid JSON object (name,description,creator_id) and jwt (registered user check)  
PUT     /recipes/id       Requires valid JSON object (name,description,creator_id) and recipe's id in url and jwt (owner check)  
DELETE  /recipes/id       Requires recipe's id in url and jwt (owner check)  
GET     /recipes/of/user  Requires jwt  
  
GET     /cooks/id         Requires cook's id  
POST    /cooks            Requires valid JSON object (pseudo,email,password)  
  
POST    /auth/login       Requires valid JSON object (email,password)  
GET     /auth/me          Requies jwt  

