// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

async function authMiddleware(request, reply) {
    try {
        const token = request.cookies.token; // Obtém o token do cookie

        if (!token) {
            return reply.status(401).send({ message: 'Token não encontrado' });
        }

        // Verifica o token usando jwt.verify
        const decoded = jwt.verify(token, JWT_SECRET);

        // Anexa os dados do usuário à requisição
        request.user = decoded;
    } catch (err) {
        console.log(err);
        reply.status(401).send({ message: 'Não autorizado' });
    }
}

module.exports = authMiddleware;
