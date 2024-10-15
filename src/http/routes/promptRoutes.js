const path = require('path');
const fs = require('fs');
const promptController = require('../controllers/promptController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

async function promptRoutes(fastify, options) {
    // Rotas da API protegidas
    fastify.post('/api/prompts/:user_id', { preHandler: authMiddleware }, promptController.createPrompt);
    fastify.get('/api/prompts/user/:user_id', { preHandler: authMiddleware }, promptController.getAllByUser);
    fastify.put('/api/prompts/:id', { preHandler: authMiddleware }, promptController.update);
    fastify.delete('/api/prompts/:id', { preHandler: authMiddleware }, promptController.delete);

    // Rota para servir a página HTML
    fastify.get('/prompts', (request, reply) => {
        const filePath = path.join(__dirname, '../../public/views/prompts.html');
        
        // Verifica se o arquivo existe antes de tentar enviá-lo
        if (fs.existsSync(filePath)) {
            reply.type('text/html').send(fs.readFileSync(filePath));
        } else {
            reply.status(404).send({ message: 'Página não encontrada' });
        }
    });
}

module.exports = promptRoutes;
