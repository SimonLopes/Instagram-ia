const InstagramCredentials = require('../models/instagramCredentialsModel');

// Listar todas as credenciais
async function getAllCredentials(req, reply) {
    try {
        const credentials = await InstagramCredentials.findAll();
        reply.send(credentials);
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao obter credenciais' });
    }
}

async function getAllCredentialsByUserId(req, reply) {
    try {
        const { id } = req.params;
        const credentials = await InstagramCredentials.findAllByUserId(id);
        reply.send(credentials);
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao obter credenciais' });
    }
}


// Buscar credencial por ID
async function getCredentialById(req, reply) {
    try {
        const { id } = req.params;
        const credential = await InstagramCredentials.findById(id);
        if (credential) {
            reply.send(credential);
        } else {
            reply.status(404).send({ error: 'Credencial não encontrada' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao obter credencial' });
    }
}

// Criar uma nova credencial
async function createCredential(req, reply) {
    try {
        const { userId, userIdInstagram, accessToken } = req.body;

        const newCredential = await InstagramCredentials.create(userId, userIdInstagram, accessToken);
        reply.status(201).send(newCredential);
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao criar credencial' });
    }
}

// Atualizar uma credencial existente
async function updateCredential(req, reply) {
    try {
        const { id } = req.params;
        const { user_id, instagram_user_id, access_token } = req.body;
        const updatedCredential = await InstagramCredentials.update(id, { user_id, instagram_user_id, access_token });
        if (updatedCredential) {
            reply.send(updatedCredential);
        } else {
            reply.status(404).send({ error: 'Credencial não encontrada' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao atualizar credencial' });
    }
}


async function updateCredentialPrompt(req, reply) {
    try {
        const { ids, prompt_id } = req.body;

        if (!Array.isArray(ids)) {
            return reply.status(400).send({ error: 'O array de instagram_credentials_ids é inválido.' });
        }

        // Atualizar a tabela para remover todas as relações com o prompt_id fornecido
        await InstagramCredentials.removePromptFromCredentials(prompt_id);

        // Recriar as relações somente para os IDs selecionados
        const updatePromises = ids.map(async (credentialId) => {
            const updatedCredential = await InstagramCredentials.updatePrompt(credentialId, { prompt_id });
            return updatedCredential;
        });

        const updatedCredentials = await Promise.all(updatePromises);

        reply.status(200).send(updatedCredentials);
    } catch (error) {
        console.error('Erro ao atualizar credenciais:', error);
        reply.status(500).send({ error: 'Erro ao atualizar as credenciais.' });
    }
}
// Deletar uma credencial
async function deleteCredential(req, reply) {
    try {
        const { id } = req.params;
        const deleted = await InstagramCredentials.delete(id);
        if (deleted) {
            reply.send({ message: 'Credencial deletada com sucesso' });
        } else {
            reply.status(404).send({ error: 'Credencial não encontrada' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao deletar credencial' });
    }
}

async function toggleCredential(req, reply) {
    const { id } = req.params;
    try {
        const updatedCredential = await InstagramCredentials.toggleStatus(id);
        reply.send(updatedCredential);
    } catch (error) {
        reply.status(500).send({ error: 'Erro ao alternar status da credencial' });
    }
}


module.exports = {
    getAllCredentials,
    getAllCredentialsByUserId,
    getCredentialById,
    createCredential,
    updateCredential,
    deleteCredential,
    toggleCredential,
    updateCredentialPrompt
};
