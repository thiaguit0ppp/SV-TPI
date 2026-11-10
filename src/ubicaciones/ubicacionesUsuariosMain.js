const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { validarUsuario } = require('../middlewares/auth');

router.use(validarUsuario([4]));

router.get('/', async (req, res) => {
    try {
        const id_usuario = req.user.id;
        const sql = 'SELECT * FROM ubicaciones_usuarios WHERE usuario_id = ?';
        db.query(sql, [id_usuario])
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
    
router.post('/', async (req, res) => {
    try {
        const { nombre_direccion, provincia, ciudad, calle, numero, num_dpto, piso, referencia } = req.body;
        const id_usuario = req.user.id;
        
        const sql = 'INSERT INTO ubicaciones_usuarios (nombre_direccion, provincia, ciudad, calle, numero, depto, piso, referencia, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [nombre_direccion, provincia, ciudad, calle, numero, num_dpto, piso, referencia, id_usuario])
            .then(([result]) => {  
                res.status(201).json({ message: "Ubicación del usuario creada con éxito", id: result.insertId });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.user.id;
        
        const { nombre_direccion, provincia, ciudad, calle, numero, num_dpto, piso, referencia } = req.body;
        const sql = 'UPDATE ubicaciones_usuarios ubi SET nombre_direccion = ?, provincia = ?, ciudad = ?, calle = ?, numero = ?, depto = ?, piso = ?, referencia = ? WHERE ubi.usuario_id = ? AND ubi.id = ?;';
        db.query(sql, [nombre_direccion, provincia, ciudad, calle, numero, num_dpto, piso, referencia, id_usuario, id])
            .then(() => {
                res.status(200).json({ message: "Ubicación del usuario actualizada con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.user.id;

        const sql = 'DELETE FROM ubicaciones_usuarios WHERE usuario_id = ? AND id = ?';
        db.query(sql, [id_usuario, id])
            .then(() => {
                res.status(200).json({ message: "Ubicación del usuario eliminada con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;