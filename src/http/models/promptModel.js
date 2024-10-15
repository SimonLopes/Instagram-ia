const db = require('../config/database');

class Prompt {
    static async create(prompt_text, prompt_image, user_id) {
        const { rows } = await db.query(
            'INSERT INTO prompts (prompt_text, prompt_image, user_id) VALUES ($1, $2, $3) RETURNING *',
            [prompt_text, prompt_image, user_id]
        );
        
        return rows[0];
    }

    static async getAll() {
        const { rows } = await db.query('SELECT * FROM prompts');
        return rows;
    }

    static async getAllByUser(user_id) {
        const { rows } = await db.query('SELECT p.id AS prompt_id, p.prompt_text, p.prompt_image, ARRAY_AGG(ic.id) FILTER (WHERE ic.id IS NOT NULL) AS instagram_credentials_ids, ARRAY_AGG(ic.instagram_user_id) FILTER (WHERE ic.instagram_user_id IS NOT NULL) AS instagram_user_ids FROM prompts p LEFT JOIN instagram_credentials ic ON ic.prompt_id = p.id AND ic.user_id = $1 WHERE p.user_id = $1 GROUP BY p.id, p.prompt_text, p.prompt_image;', [user_id]);
        return rows;
    }

    static async getById(id) {
        const { rows } = await db.query('SELECT * FROM prompts WHERE id = $1', [id]);
        return rows[0];
    }

    static async update(id, prompt_text, prompt_image) {
        const { rows } = await db.query(
            'UPDATE prompts SET prompt_text = $1, prompt_image = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [prompt_text, prompt_image, id]
        );
        return rows[0];
    }
    

    static async delete(id) {
        const { rowCount } = await db.query('DELETE FROM prompts WHERE id = $1', [id]);
        return rowCount > 0; // Retorna true se a exclusão foi bem-sucedida
    }
}

module.exports = Prompt;
