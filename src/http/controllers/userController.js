
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


// Listar todos os usuários
async function getAllUsers(req, reply) {
    try {
        const users = await User.findAll();
        reply.send(users);
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao obter usuários' });
    }
}

// Buscar usuário por ID
async function getUserById(req, reply) {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (user) {
            reply.send(user);
        } else {
            reply.status(404).send({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao obter usuário' });
    }
}

// Criar um novo usuário
async function createUser(req, reply) {
    try {
        const { name, email, password } = req.body;
        const newUser = await User.create({ name, email, password });
        reply.status(201).send(newUser);
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao criar usuário' });
    }
}

// Atualizar um usuário existente
async function updateUser(req, reply) {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const updatedUser = await User.update(id, { name, email, password });
        if (updatedUser) {
            reply.send(updatedUser);
        } else {
            reply.status(404).send({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao atualizar usuário' });
    }
}

// Deletar um usuário
async function deleteUser(req, reply) {
    try {
        const { id } = req.params;
        const deleted = await User.delete(id);
        if (deleted) {
            reply.send({ message: 'Usuário deletado com sucesso' });
        } else {
            reply.status(404).send({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao deletar usuário' });
    }
}

async function register(req, reply) {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.register(username, email, hashedPassword);
        reply.code(201).send({ message: 'Usuário registrado com sucesso', userId: user.id });
        
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
}

async function login(req, reply) {
    const { email, password } = req.body;
   try {
        const user = await User.findByEmail(email);
        if (!user) {
            reply.code(401).send({ error: 'Email ou senha inválidos' });
            return;
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            reply.code(401).send({ error: 'Email ou senha inválidos' });
            return;
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        reply.setCookie('token', token, {maxAge: 60 * 60, httpOnly: true, secure: false, sameSite: 'Strict', path: '/' })
        reply.send({ token, userId: user.id });
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}



module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    register,
    login,
};
