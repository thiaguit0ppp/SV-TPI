const express = require("express");
const app = express();

const usuariosRouter = require("./usuarios/usuariosMain");
const categoriasRouter = require("./categorias/categoriasMain");
const ubicacionesNegociosRouter = require("./ubicaciones/ubicacionesNegociosMain");
const ubicacionesUsuariosRouter = require("./ubicaciones/ubicacionesUsuariosMain");

app.use(express.json());

app.use("/usuarios", usuariosRouter);
app.use("/categorias", categoriasRouter);
app.use("/ubicacionesNegocios", ubicacionesNegociosRouter);
app.use("/ubicacionesUsuarios", ubicacionesUsuariosRouter);

app.get("/",(req,res) =>{
    res.send("Bienvenidos a la api de Mi Emprendimiento")
})

module.exports = app;