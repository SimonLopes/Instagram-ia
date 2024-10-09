const axios = require('axios');
const fs = require('fs');

async function downloadImage(imageUrl, outputPath) {
    const response = await axios({
        url: imageUrl,
        responseType: 'arraybuffer',
    });
    fs.writeFileSync(outputPath, response.data);

    return response
}

module.exports = downloadImage;