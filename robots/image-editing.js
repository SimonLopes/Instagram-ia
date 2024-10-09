const sharp = require('sharp');

const imageEditing = async (imagePath, width, height, svgText, outputImagePath) => {
    const image = sharp(imagePath);

    const resizedImage = await image.resize(width, height).toBuffer();

    const imageWithText = await sharp(resizedImage)
        .composite([
        {
            input: Buffer.from(svgText),
            top: 0,
            left: 0,
        },
        ])
        .toFile(outputImagePath);

    console.log(`Imagem com texto gerada em: ${outputImagePath}`);

    return imageWithText
}

module.exports = imageEditing;