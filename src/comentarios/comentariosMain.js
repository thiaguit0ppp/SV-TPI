const router = require("express").Router();
const db = require("../config/db");
const { validarUsuario } = require("../middlewares/auth");

router.get("/", async (req, res) => {
    try {
        const sql = "SELECT * FROM comentarios WHERE eliminado = 0";
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

router.post("/", validarUsuario([2 , 3, 4]), async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const { comentario, es_negocio, resena_id } = req.body;
        
        const sql = "INSERT INTO comentarios (comentario, es_negocio, resena_id, usuario_id) VALUES (?, ?, ?, ?)";
        
        db.query(sql, [comentario, es_negocio, resena_id, usuario_id])
            .then(([rows]) => {
                res.status(201).json({ message: "Comentario creado con éxito", id: rows.insertId });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", validarUsuario([2, 3, 4]), async (req, res) => {
    try {
        const id_user = req.user.id;
        const { id } = req.params;
        const { comentario } = req.body;
        
        const sql = "UPDATE comentarios SET comentario = ? WHERE id = ? AND usuario_id = ?";
        
        db.query(sql, [comentario, id, id_user])
            .then(() => {
                res.status(200).json({ message: "Comentario actualizado con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", validarUsuario([1]), async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "UPDATE comentarios SET eliminado = 1 WHERE id = ?";

        db.query(sql, [id])
            .then(() => {
                res.status(200).json({ message: "Comentario eliminado con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;