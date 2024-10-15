const { genAI, model } = require("../credentials/gemini")

async function generateCaption(prompt) {
    
    function removerCaracteres(texto) {
        let textoLimpo = texto.replace(/[*'"]/g, '');
        return textoLimpo;
    }

    const result = await model.generateContent(prompt);
    return removerCaracteres(result.response.text())
}

module.exports = generateCaption