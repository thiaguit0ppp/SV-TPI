const router = require("express").Router();
const db = require("../config/db");
const { validarCredenciales, hashPassword } = require("./login");
const { generarToken } = require("../middlewares/auth");

router.get("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await validarCredenciales(email, password);
        const token = generarToken({ id: user.id, email: user.email, rol_id: user.rol_id });
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(401).send({ err: error.message })
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
                res.status(500).send({ err: error.message })
            })
    } catch (error) {
        res.status(500).send({ err: error.message })
    }
});

router.put("/:id", async (req, res) => {
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
                res.status(500).send({ err: error.message })
            })
    } catch (error) {
        res.status(500).send({ err: error.message })
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "UPDATE usuarios SET eliminado = 1 WHERE id = ?";

        db.query(sql, [id])
            .then(() => {
                res.status(200).json({ message: "Usuario eliminado con éxito" })
            })
            .catch((error) => {
                res.status(500).send({ err: error.message })
            })
    } catch (error) {
        res.status(500).send({ err: error.message })
    }
});

module.exports = router;