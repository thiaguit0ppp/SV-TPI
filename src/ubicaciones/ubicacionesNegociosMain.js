const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { validarUsuario } = require('../middlewares/auth');

router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM ubicaciones_negocios';
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
    
router.post('/', validarUsuario([2]), async (req, res) => {
    try {
        console.log("LLEGO")
        const { nombre_direccion, provincia, ciudad, calle, numero, num_dpto, piso, referencia } = req.body;
        const sql = 'INSERT INTO ubicaciones_negocios (nombre_direccion, provincia, ciudad, calle, numero, depto, piso, referencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [nombre_direccion, provincia, ciudad, calle, numero, num_dpto, piso, referencia])
            .then(([result]) => {  
                res.status(201).json({ message: "Ubicación del negocio creada con éxito", id: result.insertId });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', validarUsuario([2]), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_direccion, provincia, ciudad, calle, numero, num_dpto, piso, referencia } = req.body;
        const sql = 'UPDATE ubicaciones_negocios SET nombre_direccion = ?, provincia = ?, ciudad = ?, calle = ?, numero = ?, depto = ?, piso = ?, referencia = ? WHERE id = ?';
        db.query(sql, [nombre_direccion, provincia, ciudad, calle, numero, num_dpto, piso, referencia, id])
            .then(() => {
                res.status(200).json({ message: "Ubicación del negocio actualizada con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', validarUsuario([2]), async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM ubicaciones_negocios WHERE id = ?';
        db.query(sql, [id])
            .then(() => {
                res.status(200).json({ message: "Ubicación del negocio eliminada con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;