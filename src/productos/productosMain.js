const router = require("express").Router();
const db = require("../config/db");
const { validarUsuario } = require("../middlewares/auth");

router.get("/", async (req, res) => {
    try {
        const sql = "SELECT * FROM productos WHERE eliminado = 0";
        db.query(sql)
            .then(([rows]) => {
                res.status(200).json(rows);
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", validarUsuario([2,3]), async (req, res) => {
    try {
        const { nombre, precio, puntuacion_media, esta_disponible, descripcion, categoria_id, negocio_id, imagen_url } = req.body;
        const sql = "INSERT INTO productos (nombre, precio, puntuacion_media, esta_disponible, descripcion, categoria_id, negocio_id, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        db.query(sql, [nombre, precio, puntuacion_media, esta_disponible, descripcion, categoria_id, negocio_id, imagen_url])
            .then(([rows]) => {
                res.status(201).json({ message: "Producto creado con éxito", id: rows.insertId });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", validarUsuario([1,2,3]), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, puntuacion_media, esta_disponible, descripcion, categoria_id, negocio_id, imagen_url } = req.body;
        const sql = "UPDATE productos SET nombre = ?, precio = ?, puntuacion_media = ?, esta_disponible = ?, descripcion = ?, categoria_id = ?, imagen_url = ? WHERE id = ? AND negocio_id = ?";
        
        db.query(sql, [nombre, precio, puntuacion_media, esta_disponible, descripcion, categoria_id, imagen_url, id, negocio_id])
            .then(() => {
                res.status(200).json({ message: "Producto actualizado con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", validarUsuario([1,2,3]), async (req, res) => {
    try {
        const { id } = req.params;
        const { negocio_id } = req.body
        const sql = "UPDATE productos SET eliminado = 1 WHERE id = ? AND negocio_id = ?";

        db.query(sql, [id, negocio_id])
            .then(() => {
                res.status(200).json({ message: "Producto eliminado con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;