const app = require("./app");
require("dotenv").config()
const PORT = process.env.PORT || 3000;

app.listen(PORT,() =>{
    console.log(`Servidor corriendo en: http://localhost:${PORT}`)
})

const db = require("./config/db");

 db.getConnection()
    .then(() => console.log("✅ DB conectada con éxito a ctpoba.edu.ar"))
    .catch((err) => console.error("❌ Error conectando a la DB:", err.message));
