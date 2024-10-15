const fastify = require('fastify')();
const fastifyStatic = require('@fastify/static');
const { join } = require('path');
const cors = require('@fastify/cors')
const fastifyCookie = require("@fastify/cookie")
const fastifyJwt = require('@fastify/jwt');

const appRoutes = require('./routes/appRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const instagramRoutes = require('./routes/instagramCredentialsRoutes');
const promptRoutes = require('./routes/promptRoutes');
const imageRoutes = require('./routes/imageRoutes');

fastify.register(fastifyJwt, {
    secret: 'minha-chave-secreta',
});

fastify.register(fastifyCookie);

fastify.register(cors, {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

// fastify.addHook('onRequest', async (request, reply) => {
//     const publicRoutes = ['/login', '/register', '/api/login'];
//     const staticPaths = ['/public/css', '/public/js', '/public/images', '/public/plugins', '/public/']; // Ajuste os caminhos conforme necessário

//     if (!publicRoutes.includes(request.url) && !staticPaths.some(path => request.url.startsWith(path))) {
//         try {
//             const token = request.cookies.token;
//             console.log(request.jwtVerify(token))
//             await request.jwtVerify(token);
//         } catch (err) {
            
//             reply.status(401).send({ message: 'Não autorizado' });
//         }
//     }
// });

fastify.register(fastifyStatic, {
    root: join(__dirname, '../public'),
    prefix: '/public/',
});

fastify.register(appRoutes);
fastify.register(imageRoutes);
fastify.register(instagramRoutes);
fastify.register(promptRoutes);
fastify.register(userRoutes);
fastify.register(dashboardRoutes);


module.exports = fastify;
