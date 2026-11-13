const express = require("express");
const app = express();

const usuariosRouter = require("./usuarios/usuariosMain");
const categoriasRouter = require("./categorias/categoriasMain");
const negociosRouter = require("./negocios/mainNegocios")
const ubicacionesNegociosRouter = require("./ubicaciones/ubicacionesNegociosMain");
const ubicacionesUsuariosRouter = require("./ubicaciones/ubicacionesUsuariosMain");

app.use(express.json());

app.use("/api/usuarios", usuariosRouter);
app.use("/api/categorias", categoriasRouter);
app.use("/api/negocios", negociosRouter)
app.use("/api/ubicacionesNegocios", ubicacionesNegociosRouter);
app.use("/api/ubicacionesUsuarios", ubicacionesUsuariosRouter);

app.get("/",(req,res) =>{
    res.send("Bienvenidos a la api de Mi Emprendimiento")
})

module.exports = app;