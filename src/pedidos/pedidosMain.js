const router = require("express").Router();
const db = require("../config/db");
const { validarUsuario } = require("../middlewares/auth");
const { crearDetalles , obtenerDetalles } = require("./detalles_pedidos")

router.get("/", validarUsuario([2, 3]),async (req, res) => {
    try {
        const { negocio_id } = req.body;
        const sql = "SELECT * FROM pedidos WHERE eliminado = 0 AND negocio_id = ?";
        db.query(sql,[negocio_id])
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
        const cliente_id = req.user.id;
        const { negocio_id, productos } = req.body;

        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ error: "Debe enviar al menos un producto en el pedido." });
        }

        // Si no se envía un estado inicial, por defecto la base de datos usará 'entrante'
        const sql = "INSERT INTO pedidos (cliente_id, negocio_id) VALUES (?, ?)";
        const [rows] = await db.query(sql, [cliente_id, negocio_id]);
        const pedidoId = rows.insertId;

        const resultadoDetalles = await crearDetalles(pedidoId, productos);

        res.status(201).json({
            message: "Pedido creado con éxito",
            id: pedidoId,
            detalles: resultadoDetalles
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", validarUsuario([2, 3]), async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        const sql = "UPDATE pedidos SET estado = ? WHERE id = ?";
        
        db.query(sql, [estado, id])
            .then(() => {
                res.status(200).json({ message: "Estado del pedido actualizado con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", validarUsuario([1, 2, 3]), async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "UPDATE pedidos SET eliminado = 1 WHERE id = ?";

        db.query(sql, [id])
            .then(() => {
                res.status(200).json({ message: "Pedido eliminado con éxito" });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;