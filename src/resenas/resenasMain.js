const router = require("express").Router();
const db = require("../config/db");
const { validarUsuario } = require("../middlewares/auth");

router.get("/", async (req, res) => {
    try {
        const sql = "SELECT * FROM resenas WHERE eliminado = 0";
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

router.post("/", validarUsuario([4]), async (req, res) => {
    try {
        const cliente_id = req.user.id
        const { puntuacion, texto, img, producto_id} = req.body;
        const sql = "INSERT INTO resenas (puntuacion, texto, img, producto_id, cliente_id) VALUES (?, ?, ?, ?, ?)";
        
        db.query(sql, [puntuacion, texto, img, producto_id, cliente_id])
            .then(([rows]) => {
                res.status(201).json({ message: "Reseña creada con éxito", id: rows.insertId });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", validarUsuario([4]), async (req, res) => {
    try {
        const id_user = req.user.id
        const { id } = req.params;
        const { puntuacion, texto, img } = req.body;
        const sql = "UPDATE resenas SET puntuacion = ?, texto = ?, img = ? WHERE id = ? AND cliente_id = ?";
        
        db.query(sql, [puntuacion, texto, img, id, id_user])
            .then(() => {
                res.status(200).json({ message: "Reseña actualizada con éxito" });
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
        const sql = "UPDATE resenas SET eliminado = 1 WHERE id = ?";

        db.query(sql, [id])
            .then(() => {
                res.status(200).json({ message: "Reseña eliminada con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;