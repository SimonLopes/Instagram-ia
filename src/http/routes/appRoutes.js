
const path = require('path');
const fs = require('fs');

async function appRoutes(fastify, options) {
    
    fastify.get('/components/*', (request, reply) => {
        const filePath = path.join(__dirname, '../../public/views/components', request.params['*']);
        reply.type('text/html').send(fs.readFileSync(filePath));
    });
    
}

module.exports = appRoutes;
