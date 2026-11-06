const jwt = require("jsonwebtoken")
const { TOKEN_SECRET } = process.env;

function validarUsuario(rolesPermitidos = []) {
    return (req, res, next) => {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({ error: "token no proporcionado" })
        }

        const token = authorization.replace(/^Bearer\s+/i, "");

        try {
            const datos = jwt.verify(token, TOKEN_SECRET);
            if(!rolesPermitidos.includes(datos.rol) && rolesPermitidos.length > 0) {
                return res.status(403).json({ error: "No tienes permisos para realizar esta acción" });
            }
            req.user = datos;
            next()
        } catch (error) {
            console.error(error);
            res.status(403).json({ error: "Token inválido" });
        }
    }
}

function generarToken(datos) {
    const token = jwt.sign(datos, TOKEN_SECRET, { expiresIn: "24h" });
    return token;
}

module.exports = { validarUsuario, generarToken }