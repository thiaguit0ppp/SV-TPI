const router = require("express").Router();
const db = require("../config/db");
const { validarUsuario } = require("../middlewares/auth");

router.get("/", async (req, res) => {
    try {
        const sql = "SELECT * FROM negocios WHERE eliminado = 0";
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

router.post("/", validarUsuario([2]), async (req, res) => {
    try {
        const { nombre, imagen_url, numero_contacto, biografia, ubicacion_id } = req.body;
        const user_vendedor = req.user.id
        const sql = "INSERT INTO negocios (nombre, imagen_url, numero_contacto, biografia, user_vendedor, ubicacion_id) VALUES (?, ?, ?, ?, ?, ?)";
        
        db.query(sql, [nombre, imagen_url, numero_contacto, biografia, user_vendedor, ubicacion_id])
            .then(([rows]) => {
                res.status(201).json({ message: "Negocio creado con éxito", id: rows.insertId });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", validarUsuario([2]), async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.user.id
        const { nombre, imagen_url, numero_contacto, biografia, user_vendedor, ubicacion_id } = req.body;
        const sql = "UPDATE negocios SET nombre = ?, imagen_url = ?, numero_contacto = ?, biografia = ?, ubicacion_id = ? WHERE id = ? AND user_vendedor = ?";
        
        db.query(sql, [nombre, imagen_url, numero_contacto, biografia, ubicacion_id, id, id_usuario])
            .then(() => {
                res.status(200).json({ message: "Negocio actualizado con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", validarUsuario([2]), async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.user.id;
        const sql = "UPDATE negocios SET eliminado = 1 WHERE id = ? AND user_vendedor = ?";

        db.query(sql, [id, id_usuario])
            .then(() => {
                res.status(200).json({ message: "Negocio eliminado con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;