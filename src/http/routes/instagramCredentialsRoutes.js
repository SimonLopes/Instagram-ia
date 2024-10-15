const path = require('path');
const fs = require('fs');

const instagramCredentialsController = require('../controllers/instagramCredentialsController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

async function instagramCredentialsRoutes(fastify, options) {
    fastify.get('/instagram-credentials', {preHandler: authMiddleware}, instagramCredentialsController.getAllCredentials); // Listar todas as credenciais
    fastify.get('/instagram-credentials/:id', {preHandler: authMiddleware}, instagramCredentialsController.getCredentialById); // Buscar credencial por ID
    fastify.post('/instagram-credentials', {preHandler: authMiddleware}, instagramCredentialsController.createCredential); // Criar uma nova credencial
    fastify.put('/instagram-credentials/:id', {preHandler: authMiddleware}, instagramCredentialsController.updateCredential); // Atualizar uma credencial existente
    fastify.put('/api/instagram-credentials/prompt', {preHandler: authMiddleware}, instagramCredentialsController.updateCredentialPrompt);
    fastify.delete('/api/instagram-credentials/:id', {preHandler: authMiddleware}, instagramCredentialsController.deleteCredential); // Deletar uma credencial
    fastify.get('/api/instagram-credentials/:id', {preHandler: authMiddleware}, instagramCredentialsController.getAllCredentialsByUserId);
    fastify.post('/api/instagram-credentials', {preHandler: authMiddleware}, instagramCredentialsController.createCredential);
    fastify.patch('/api/instagram-credentials/:id/toggle', {preHandler: authMiddleware}, instagramCredentialsController.toggleCredential);

    fastify.get('/credentials/instagram', (request, reply) => {
        const filePath = path.join(__dirname, '../../public/views/instagram-credentials.html');
        reply.type('text/html').send(fs.readFileSync(filePath));
    });
    // Rota para servir arquivos JavaScript
    fastify.get('/js/credentialsManager/*', (request, reply) => {
        const filePath = path.join(__dirname, '../../public/js/credentialsManager', request.params['*']); // Usando '*' para capturar o restante do caminho
        reply.type('application/javascript').send(fs.readFileSync(filePath));
    });

}

module.exports = instagramCredentialsRoutes;
