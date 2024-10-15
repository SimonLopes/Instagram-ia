const Prompt = require('../models/promptModel');
const InstagramCredential = require('../models/instagramCredentialsModel');

class PromptController {
    static async createPrompt(req, res) {
        const { user_id } = req.params;
        const { prompt_text, prompt_image, instagram_credentials_id } = req.body;

        try {
            const newPrompt = await Prompt.create(prompt_text, prompt_image, user_id);
            const instagram_credentials_ids = [];
            const instagram_user_ids = [];

            for (const ig_id of instagram_credentials_id) {
                await InstagramCredential.updatePrompt(ig_id, { prompt_id: newPrompt.id });

                const igCredential = await InstagramCredential.findById(ig_id);

                instagram_credentials_ids.push(igCredential.id);
                instagram_user_ids.push(igCredential.instagram_user_id);
            }

            // Responde com os dados formatados
            res.status(201).send({
                prompt_id: newPrompt.id,
                prompt_text: newPrompt.prompt_text,
                prompt_image: newPrompt.prompt_image,
                instagram_credentials_ids,
                instagram_user_ids
            });
        } catch (error) {
            console.error(error); // Log do erro para depuração
            res.status(500).send({ error: 'Erro ao criar o prompt.' });
        }
    }


    static async getAll(req, res) {
        try {
            const prompts = await Prompt.getAll();
            res.status(200).json(prompts);
        } catch (error) {
            console.error('Erro ao obter prompts:', error);
            res.status(500).json({ error: 'Erro ao obter os prompts.' });
        }
    }

    static async getAllByUser(req, res) {
        const { user_id } = req.params;
        try {
            const prompts = await Prompt.getAllByUser(user_id);

            if (prompts.length > 0) {
                res.status(200).send(prompts);
            } else {

                res.status(404).send({ error: 'Nenhum prompt encontrado.' });
            }

        } catch (error) {
            console.error('Erro ao obter prompts:', error);
            res.status(500).json({ error: 'Erro ao obter os prompts.' });
        }
    }

    static async getById(req, res) {
        const { id } = req.params;
        try {
            const prompt = await Prompt.getById(id);
            if (!prompt) {
                return res.status(404).json({ error: 'Prompt não encontrado.' });
            }
            res.status(200).json(prompt);
        } catch (error) {
            console.error('Erro ao obter o prompt:', error);
            res.status(500).json({ error: 'Erro ao obter o prompt.' });
        }
    }

    static async update(req, res) {
        const { id } = req.params;
        const { prompt_text, prompt_image } = req.body;
        try {
            const updatedPrompt = await Prompt.update(id, prompt_text, prompt_image);
            if (!updatedPrompt) {
                return res.status(404).json({ error: 'Prompt não encontrado.' });
            }
            res.status(200).json(updatedPrompt);
        } catch (error) {
            console.error('Erro ao atualizar o prompt:', error);
            res.status(500).json({ error: 'Erro ao atualizar o prompt.' });
        }
    }

    static async delete(req, res) {
        const { id } = req.params;
        try {
            const deleted = await Prompt.delete(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Prompt não encontrado.' });
            }
            res.status(204).send(); // No content
        } catch (error) {
            console.error('Erro ao deletar o prompt:', error);
            res.status(500).json({ error: 'Erro ao deletar o prompt.' });
        }
    }
}

module.exports = PromptController;
