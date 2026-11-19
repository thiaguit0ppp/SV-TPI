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


router.put("/:id", validarUsuario([1]), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, dni, email, fecha_nacimiento, password, rol_id } = req.body;
        const sql = "UPDATE usuarios SET nombre = ?, apellido = ?, dni = ?, email = ?, fecha_nacimiento = ?, password_hash = ?, rol_id = ? WHERE id = ?";
        const hashedPassword = await hashPassword(password);
        db.query(sql, [nombre, apellido, dni, email, fecha_nacimiento, hashedPassword, rol_id, id])
            .then(() => {
                res.status(200).json({ message: "Usuario actualizado con éxito" })
            })
            .catch((error) => {
                res.status(500).json({ error: error.message })
            })
    } catch (error) {
        res.status(500).json({ error: error.message })
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