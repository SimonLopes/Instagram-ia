const db = require('../config/database');

class InstagramCredentials {
    // Listar todas as credenciais
    static async findAll() {
        const { rows } = await db.query('SELECT * FROM instagram_credentials');
        return rows;
    }

    static async findAllByUserId(user_id){
        const {rows} = await db.query("SELECT ac.id AS active_credential_id, ac.user_id, ic.id AS instagram_credentials_id, ic.instagram_user_id, ac.is_active FROM active_credentials ac JOIN instagram_credentials ic ON ac.instagram_credentials_id = ic.id WHERE ac.user_id = $1", [user_id]);
        
        return rows;
    }

    // Buscar credencial por ID
    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM instagram_credentials WHERE id = $1', [id]);
        return rows[0];
    }

    // Criar uma nova credencial
    static async create(user_id, instagram_user_id, access_token) {
        try {
            // Inserindo nova credencial do Instagram
            const { rows } = await db.query(
                'INSERT INTO instagram_credentials (user_id, instagram_user_id, access_token) VALUES ($1, $2, $3) RETURNING *',
                [user_id, instagram_user_id, access_token]
            );

            const newCredential = rows[0];

            const activeCredentialResult = await db.query(
                'INSERT INTO active_credentials (user_id, instagram_credentials_id, is_active) VALUES ($1, $2, $3) RETURNING *, id AS active_credential_id',
                [user_id, newCredential.id, true] 
            );

            const newActiveCredentials = activeCredentialResult.rows[0];

            return {
                ...newCredential,
                ...newActiveCredentials
            };
        } catch (error) {
            console.error('Erro ao criar credencial:', error);
            throw new Error('Não foi possível criar a credencial do Instagram.');
        }
    }

    // Atualizar uma credencial existente
    static async update(id, { user_id, instagram_user_id, access_token }) {
        const { rows } = await db.query(
            'UPDATE instagram_credentials SET user_id = $1, instagram_user_id = $2, access_token = $3 WHERE id = $4 RETURNING *',
            [user_id, instagram_user_id, access_token, id]
        );
        return rows[0];
    }

    static async updatePrompt(id, { prompt_id }) {
        const { rows } = await db.query(
            'UPDATE instagram_credentials SET prompt_id = $1 WHERE id = $2 RETURNING *',
            [prompt_id, id]
        );
        return rows[0];
    }
    static async removePromptFromCredentials(prompt_id) {
        await db.query(
            'UPDATE instagram_credentials SET prompt_id = NULL WHERE prompt_id = $1',
            [prompt_id]
        );
    }

    // Deletar uma credencial
    static async delete(id) {
        const { rowCount } = await db.query('DELETE FROM instagram_credentials WHERE id = $1', [id]);
        return rowCount > 0;
    }

    static async toggleStatus(id) {
        const result = await db.query(
            'UPDATE active_credentials SET is_active = NOT is_active WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
}

module.exports = InstagramCredentials;
