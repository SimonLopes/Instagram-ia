
const path = require('path');
const fs = require('fs');

async function dashboardRoutes(fastify, options) {
    
    fastify.get('/dashboard', (request, reply) => {
        const filePath = path.join(__dirname, '../../public/views/dashboard.html');
        reply.type('text/html').send(fs.readFileSync(filePath));
    });
    
    
}

module.exports = dashboardRoutes;
