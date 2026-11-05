const jwt = require("jsonwebtoken")
const { TOKEN_SECRET } = process.env;

function verificarToken(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).send("Token no proporcionado")
    }

    const token = authorization.replace(/^Bearer\s+/i, "");

    try {
        const datos = jwt.verify(token, TOKEN_SECRET);
        req.user = datos;
        next()
    } catch (error) {
        console.error(error);
        res.status(403).send("error en el token")
    }
}

function generarToken(datos) {
    const token = jwt.sign(datos, TOKEN_SECRET, { expiresIn: "24h" });
    return token;
}

module.exports = { verificarToken, generarToken }