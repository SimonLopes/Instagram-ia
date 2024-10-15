const fastifyApp = require('./app');
const initRobot = require('../robots/init-robot')

const cron = require('node-cron');


async function startServerHTTP() {
    try {
        fastifyApp.listen({
            host: '0.0.0.0',
            port: process.env.PORT ? Number(process.env.PORT) : 3333
        }, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`Servidor rodando em: ${address}`);
        })
    } catch (err) {
        fastifyApp.log.error(err);
        process.exit(1);
    }
}

cron.schedule('0 */3 * * *', () => {
    console.log('Executando a função init a cada 3 horas');
    initRobot();
});

initRobot();

startServerHTTP();