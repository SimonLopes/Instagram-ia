const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

async function uploadImageToServer(imagePath) {
    const serverUrl = `https://${process.env.URL_SERVER}.com/upload`
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    try {
        const response = await axios.post(serverUrl, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar a imagem para o servidor:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = uploadImageToServer;