const router = require("express").Router();
const db = require("../config/db");
const { validarCredenciales, hashPassword } = require("./login");
const { generarToken, validarUsuario } = require("../middlewares/auth");

router.get("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await validarCredenciales(email, password);
        const token = generarToken({ id: user.id, email: user.email, rol_id: user.rol_id });
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
});

router.get("/", validarUsuario([1]), async (req, res) => {
    try {
        const sql = "SELECT * FROM usuarios WHERE eliminado = 0";
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


router.get("/empleados/solicitudes", validarUsuario([3]), async (req, res) => {
    try {
        const id = req.user.id;

        // Obtener solicitudes pendientes del empleado
        const sql = `
            SELECT
                en.id AS id_solicitud,
                en.estado,
                en.created_at,
                n.id AS id_negocio,
                n.nombre AS nombre_negocio,
                n.imagen_url,
                n.numero_contacto,
                n.biografia
            FROM empleados_negocios en
            INNER JOIN negocios n ON en.negocio_id = n.id
            WHERE en.usuario_id = ?
              AND en.estado = 'pendiente'
              AND n.eliminado = 0
            ORDER BY en.created_at DESC
        `;

        const [rows] = await db.query(sql, [id]);
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});


router.post("/", async (req, res) => {
    try {
        const { nombre, apellido, dni, email, fecha_nacimiento, password, rol_id } = req.body;
        const hashedPassword = await hashPassword(password);
        const sql = "INSERT INTO usuarios (nombre, apellido, dni, email, fecha_nacimiento, password_hash, rol_id, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [nombre, apellido, dni, email, fecha_nacimiento, hashedPassword, rol_id, "url_imagen"])
            .then(([rows]) => {
                res.status(201).json({ message: "Usuario creado con éxito", id: rows.insertId })
            })
            .catch((error) => {
                res.status(500).json({ error: error.message })
            })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});


router.post("/empleados/solicitud", validarUsuario([2]), async (req, res) => {
    try {
        const { email, id_negocio } = req.body;

        // Validar datos obligatorios
        if (!email || !id_negocio) {
            return res.status(400).json({
                error: "El email y el id del negocio son obligatorios"
            });
        }

        // Verificar que el negocio pertenezca al vendedor autenticado
        const [negocios] = await db.query(
            `SELECT id FROM negocios
             WHERE id = ? AND user_vendedor = ? AND eliminado = 0`,
            [id_negocio, req.user.id]
        );

        if (negocios.length === 0) {
            return res.status(404).json({
                error: "No se encontró el negocio o no tienes permisos sobre él"
            });
        }

        // Buscar al empleado por email
        const [usuarios] = await db.query(
            "SELECT id FROM usuarios WHERE email = ? AND eliminado = 0",
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                error: "No se encontró un usuario con ese email"
            });
        }

        const id_empleado = usuarios[0].id;

        // Comprobar si ya existe una vinculación
        const [vinculaciones] = await db.query(
            `SELECT id, estado FROM empleados_negocios
             WHERE usuario_id = ? AND negocio_id = ?`,
            [id_empleado, id_negocio]
        );

        if (vinculaciones.length > 0) {
            return res.status(409).json({
                error: "Ya existe una solicitud o vinculación con este negocio",
                estado: vinculaciones[0].estado
            });
        }

        // Crear solicitud de vinculación
        await db.query(
            `INSERT INTO empleados_negocios (usuario_id, negocio_id, estado)
             VALUES (?, ?, 'pendiente')`,
            [id_empleado, id_negocio]
        );

        return res.status(200).json({
            message: "Solicitud enviada correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});


router.put("/", validarUsuario([2, 3, 4]), async (req, res) => {
    try {
        const id = req.user.id;
        const { nombre, apellido, dni, email, fecha_nacimiento, password } = req.body;
        const sql = "UPDATE usuarios SET nombre = ?, apellido = ?, dni = ?, email = ?, fecha_nacimiento = ?, password_hash = ? WHERE id = ?";
        const hashedPassword = await hashPassword(password);

        await db.query(sql, [nombre, apellido, dni, email, fecha_nacimiento, hashedPassword, id]);

        res.status(200).json({ message: "Usuario actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/empleados/respuesta", validarUsuario([3]), async (req, res) => {
    try {
        const id_empleado = req.user.id;
        const { id_negocio, respuesta } = req.body;
        const respuestasValidas = ["aceptada", "rechazada"];

        // Validar datos obligatorios
        if (!id_negocio) {
            return res.status(400).json({
                error: "El id del negocio es obligatorio"
            });
        }

        if (!respuesta) {
            return res.status(400).json({
                error: "La respuesta es obligatoria"
            });
        }

        if (!respuestasValidas.includes(respuesta)) {
            return res.status(400).json({
                error: "Respuesta no valida"
            });
        }

        // Buscar la solicitud pendiente
        const sql = `
            SELECT id
            FROM empleados_negocios
            WHERE usuario_id = ?
              AND negocio_id = ?
              AND estado = 'pendiente'
        `;

        const [solicitudes] = await db.query(sql, [
            id_empleado,
            id_negocio
        ]);

        if (solicitudes.length === 0) {
            return res.status(404).json({
                error: "No existe una solicitud pendiente para este negocio"
            });
        }

        // Actualizar solicitud
        await db.query(
            `UPDATE empleados_negocios
             SET estado = ?
             WHERE id = ?`,
            [respuesta, solicitudes[0].id]
        );

        const message = respuesta === "aceptada"
            ? "Te has vinculado correctamente al negocio"
            : "Has rechazado la solicitud correctamente";

        return res.status(200).json({
            message
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});


router.put("/empleados/desvincular", validarUsuario([2]), async (req, res) => {
    try {
        const { email, id_negocio } = req.body;

        // Validar datos obligatorios
        if (!email || !id_negocio) {
            return res.status(400).json({
                error: "El email y el id del negocio son obligatorios"
            });
        }

        // Verificar que el negocio pertenezca al vendedor autenticado
        const [negocios] = await db.query(
            `SELECT id FROM negocios
             WHERE id = ? AND user_vendedor = ? AND eliminado = 0`,
            [id_negocio, req.user.id]
        );

        if (negocios.length === 0) {
            return res.status(404).json({
                error: "No se encontró el negocio o no tienes permisos sobre él"
            });
        }

        // Buscar al empleado por email
        const [usuarios] = await db.query(
            `SELECT id FROM usuarios
             WHERE email = ? AND eliminado = 0`,
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                error: "No se encontró un usuario con ese email"
            });
        }

        const id_empleado = usuarios[0].id;

        // Verificar que exista una vinculación aceptada
        const [vinculaciones] = await db.query(
            `SELECT id FROM empleados_negocios
             WHERE usuario_id = ?
               AND negocio_id = ?
               AND estado = 'aceptada'`,
            [id_empleado, id_negocio]
        );

        if (vinculaciones.length === 0) {
            return res.status(404).json({
                error: "El empleado no está vinculado a este negocio"
            });
        }

        // Desvincular al empleado
        await db.query(
            `UPDATE empleados_negocios
            SET estado = 'expulsada'
            WHERE usuario_id = ?
            AND negocio_id = ?
            AND estado = 'aceptada'`,
            [id_empleado, id_negocio]
        );

        return res.status(200).json({
            message: "Empleado desvinculado correctamente del negocio"
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});


router.delete("/:id", validarUsuario([1]), async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "UPDATE usuarios SET eliminado = 1 WHERE id = ?";

        db.query(sql, [id])
            .then(() => {
                res.status(200).json({ message: "Usuario eliminado con éxito" })
            })
            .catch((error) => {
                res.status(500).json({ error: error.message })
            })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

module.exports = router;