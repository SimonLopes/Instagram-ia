const fs = require('fs');
const { join } = require('path');

async function imageRoutes(fastify, options) {
  fastify.get('/imagem', (request, reply) => {
    const buffer = fs.readFileSync(join(__dirname, '../../public/images/imagem-com-texto.jpg'));
    reply.type('image/jpg');
    reply.send(buffer);
  });
}

module.exports = imageRoutes;
