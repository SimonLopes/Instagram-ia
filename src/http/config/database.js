const { Pool } = require('pg');

// Configuração do banco de dados
const pool = new Pool({
    host: process.env.DB_HOST ? process.env.DB_HOST : '127.0.0.1',
    user: process.env.DB_USER ? process.env.DB_USER : 'postgres',
    password: '12345678',
    database: process.env.DB_NAME ? process.env.DB_NAME : 'instagram-ia',
    port: process.env.DB_PORT || 5432
});

module.exports = pool;
