const express = require("express");
const app = express();

app.get("/",(req,res) =>{
    res.send("Bienvenidos a la api de Mi Emprendimiento")
})

module.exports = app;