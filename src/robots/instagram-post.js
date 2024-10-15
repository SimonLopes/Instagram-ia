const axios = require('axios');
const fs = require('fs');
const {userId, accessToken} = require('../credentials/meta')

async function publishImage(legenda, imageUrl) {
    try {
        // Passo 1: Criar um container de mídia
        const containerResponse = await axios.post(`https://graph.facebook.com/v12.0/${userId}/media`, {
            image_url: imageUrl,
            caption: legenda,
            access_token: accessToken
        });

        const creationId = containerResponse.data.id;

        const publishResponse = await axios.post(`https://graph.facebook.com/v12.0/${userId}/media_publish`, {
            creation_id: creationId,
            access_token: accessToken
        });

        console.log('Publicação feita com sucesso:', publishResponse.data);
    } catch (error) {
        console.error('Erro ao publicar:', error.response ? error.response.data : error.message);
    }
}

module.exports = publishImage;
