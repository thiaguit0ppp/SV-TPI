const db = require("../config/db");

async function obtenerDetalles(id_pedido) {
    try {
        const sql = "SELECT * FROM detalle_pedidos WHERE pedido_id = ?";
        const [rows] = await db.query(sql, [id_pedido]);
        return rows;
    } catch (error) {
        throw new Error(`Error al obtener los detalles del pedido: ${error.message}`);
    }
}

async function crearDetalles(pedidoId, detalles) {
    try {
        if (!pedidoId) {
            throw new Error("El parámetro pedidoId es obligatorio.");
        }
        if (!Array.isArray(detalles) || detalles.length === 0) {
            throw new Error("El parámetro detalles debe ser un array de objetos válido.");
        }

        const values = detalles.map((det) => [
            det.cantidad,
            det.precio_unitario,
            det.producto_id,
            pedidoId
        ]);

        const sql = "INSERT INTO detalle_pedidos (cantidad, precio_unitario, producto_id, pedido_id) VALUES ?";//Bulk insert
        const [result] = await db.query(sql, [values]);

        return {
            message: "Detalles creados con éxito",
            registrosInsertados: result.affectedRows,
            primerIdGenerado: result.insertId
        };
    } catch (error) {
        throw new Error(`Error al crear los detalles del pedido: ${error.message}`);
    }
}

module.exports = {
    crearDetalles,
    obtenerDetalles
}