const express = require("express");
const app = express();

const usuariosRouter = require("./usuarios/usuariosMain");
const categoriasRouter = require("./categorias/categoriasMain");

app.use(express.json());

app.use("/usuarios", usuariosRouter);
app.use("/categorias", categoriasRouter);

app.get("/",(req,res) =>{
    res.send("Bienvenidos a la api de Mi Emprendimiento")
})

module.exports = app;