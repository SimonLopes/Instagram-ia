const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    // Listar todos os usuários
    static async findAll() {
        const { rows } = await db.query('SELECT * FROM users');
        return rows;
    }

    // Buscar usuário por ID
    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return rows[0];
    }

    // Criar um novo usuário
    static async create({ name, email, password }) {
        const { rows } = await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        return rows[0];
    }

    // Atualizar um usuário existente
    static async update(id, { name, email, password }) {
        const { rows } = await db.query(
            'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
            [name, email, password, id]
        );
        return rows[0];
    }

    // Deletar um usuário
    static async delete(id) {
        const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [id]);
        return rowCount > 0;
    }

    static async register(username, email, password) {
        try {
            const result = await db.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
                [username, email, password]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error('Erro ao registrar usuário ' + error);
        }
    }
    static async findByEmail(email) {
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return rows[0];
    }

    // static async login(email, password) {
    //     try {
    //         const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    //         const user = result.rows[0];
    //         const a = await bcrypt.compare(password, user.password)
    //         console.log(user.password)

    //         if (user && await bcrypt.compare(password, user.password)) {
    //             return user;
    //         } else {
    //             throw new Error('Credenciais inválidas');
    //         }
    //     } catch (error) {
    //         throw new Error(error);
    //     }
    // }
}

module.exports = User;
