const db = require("../config/db");
const bcrypt = require("bcrypt");

async function validarCredenciales(email, password) {
    const sql = "SELECT * FROM usuarios WHERE email = ?";
    const [user] = await db.query(sql, [email]);
    if (user.length === 0 || user[0].eliminado == 1) throw new Error('Este email no existe');
    const passwordValida = await bcrypt.compare(password, user[0].password_hash);
    if (!passwordValida) throw new Error('Contraseña incorrecta');
    return user[0];
}

async function hashPassword(password) {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error al hashear la contraseña");
    }
}

module.exports = { validarCredenciales, hashPassword };