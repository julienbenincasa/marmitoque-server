const express = require("express")
const app = express()

const PORT = process.env.PORT || 5000 // this is very important

//import des routes
const recipesRoutes = require("./routes/Recipes")
const cooksRoutes = require("./routes/Cooks")
const authRoutes = require("./routes/Auth")

//et activation
app.use("/recipes",recipesRoutes)
app.use("/cooks",cooksRoutes)
app.use("/auth",authRoutes)

app.listen(PORT, () => {
    console.log("Server running")
})