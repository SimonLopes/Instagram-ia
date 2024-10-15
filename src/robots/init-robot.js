const { join } = require('path');

const createImageIA = require("./image-generate");
const imageDownload = require('./image-download')
const captionGenerate = require('./caption-generate')
const textGenerate = require('./text-generate')
const textToImage = require('./text-to-image')
const imageEditing = require('./image-editing')
const instagramPosting = require('./instagram-post')


async function processImage(mode = 'release', generateNewImage = false, width, height, localImagePath, outputImagePath, promptImage, promptText) {

    const today = new Date();

    const dayOfWeek = today.getDay();
    const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const dayName = daysOfWeek[dayOfWeek];

    let topText = dayName;
    let bottomText = '';

    if (mode === 'debug') {
        console.log(`DEBUG MODE:
      \x1b[33m
      width = \x1b[36m ${width}
      \x1b[33m
      height = \x1b[36m ${height}
      \x1b[33m
      localImagePath = \x1b[36m ${localImagePath}
      \x1b[33m
      outputImagePath = \x1b[36m ${outputImagePath}
      \x1b[0m
    `);
    }

    if (generateNewImage) {
        const imageData = await createImageIA(promptImage, width, height, mode); // URL da imagem sem copyright
        const imageUrl = await imageData.images[0].url
        const getImage = await imageDownload(imageUrl, localImagePath)
        if (mode === 'debug') {
            console.log(imageData)
            console.log(`IMAGE URL: ${imageUrl}`)
            console.log(`IMAGE DOWNLOAD: ${getImage}`)
        }
    }

    const getText = await textGenerate(promptText)

    const promptCaption = "gere uma legenda curta para a seguinte sentenca: " + getText + " inserindo 15 tags referente a ela, formatado com a frase, 5 quebras de linhas com um ponto em cada linha e as tags por final";
    const getCaption = await captionGenerate(promptCaption)
    bottomText = getText
    const imageText = await textToImage(width, height, topText, bottomText)
    const editImage = await imageEditing(localImagePath, width, height, imageText, outputImagePath)

    if (mode === 'debug') {
        console.log(`

      topText: ${topText}
      bottomText: ${bottomText}
      
      captionGenerate: ${getCaption}
      textGenerate: ${getText}
      textToImage: ${imageText}
      imageEditing: ${JSON.stringify(editImage)}
      imageSaving: ${uploadResponse}

      \x1b[32m
      FINISH DEBUG AND PROCESS
      \x1b[0m

    `);
    }
    if (mode === 'debug') {
        console.log(`Image has been edited and saved to: ${outputImagePath}`);
    } else if (mode === 'release') {
        console.log('Image processing complete in release mode.');
    }
    return { editImage, getText, getCaption };

}


async function init() {



    const width = 1280;
    const height = 1280;

    const localImagePath = join(__dirname, 'imagem-baixada.jpg');
    const outputImagePath = join(__dirname, './upload/imagem-com-texto.jpg');

    const promptImage = "A bright and inspiring landscape that radiates happiness and lightness. The scene features a meadow. Soft sunlight bathes the entire area, casting a warm glow, creating a sense of calm and serenity. The overall atmosphere is uplifting, positive, and filled with a sense of joyful tranquility."//"a dark and shadowy figure of a wizard, an image darkened with a lot of shadows (with fires)";
    const promptText = "Olá chat, a partir de agora eu quero que você gere apenas uma frase inspiradora para o dia";

    const generateNewImage = true;

    processImage(process.argv[2] || 'release', generateNewImage, width, height, localImagePath, outputImagePath, promptImage, promptText) // Pode chamar com "node script.js debug" ou "node script.js release"
        .then(result => {
            const posting = instagramPosting(result.getCaption, 'https://instagram-ia.onrender.com/imagem')
            console.log(posting);
        })
        .catch(err => {
            console.error('Error:', err);
        });
}


module.exports = init