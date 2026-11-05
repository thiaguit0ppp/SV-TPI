const router = require("express").Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
    try {
        const sql = "SELECT * FROM categorias";
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

router.post("/", async (req, res) => {
    try {
        const { nombre } = req.body;
        const sql = "INSERT INTO categorias (nombre_cat) VALUES (?)";
        db.query(sql, [nombre])
            .then(([rows]) => {
                res.status(201).json({ message: "Categoría creada exitosamente", categoria: { id: rows.insertId, nombre } });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const sql = "UPDATE categorias SET nombre_cat = ? WHERE id = ?";
        db.query(sql, [nombre, id])
            .then(() => {
                res.status(200).json({ message: "Categoría actualizada exitosamente" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "UPDATE categorias SET eliminado = 1 WHERE id = ?";
        db.query(sql, [id])
            .then(() => {
                res.status(200).json({ message: "Categoría eliminada exitosamente" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;