
const path = require('path');
const fs = require('fs');

const userController = require('../controllers/userController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

async function userRoutes(fastify, options) {
    
    fastify.get('/users', { preHandler: authMiddleware }, userController.getAllUsers); // Listar todos os usuários
    fastify.get('/users/:id', { preHandler: authMiddleware }, userController.getUserById); // Buscar usuário por ID
    fastify.post('/users', { preHandler: authMiddleware }, userController.createUser); // Criar um novo usuário
    fastify.put('/users/:id', { preHandler: authMiddleware }, userController.updateUser); // Atualizar um usuário existente
    fastify.delete('/users/:id', { preHandler: authMiddleware }, userController.deleteUser); // Deletar um usuário
    
    // rotas publicas
    fastify.post('/api/register', userController.register);
    fastify.post('/api/login', userController.login);
   
    
    fastify.get('/register', (request, reply) => {
        const filePath = path.join(__dirname, '../../public/views/register.html');
        reply.type('text/html').send(fs.readFileSync(filePath));
    });
    
    // Rota para servir a página de login
    fastify.get('/login', (request, reply) => {
        const filePath = path.join(__dirname, '../../public/views/login.html');
        reply.type('text/html').send(fs.readFileSync(filePath));
    });
}

module.exports = userRoutes;
