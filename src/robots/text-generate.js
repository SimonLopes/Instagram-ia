const { genAI, model } = require("../credentials/gemini")

async function generateText(prompt) {
    
    function removerCaracteres(texto) {
        let textoLimpo = texto.replace(/[*'"]/g, '');
        textoLimpo = textoLimpo.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '');
        return textoLimpo;
    }

    const result = await model.generateContent(prompt);
    return removerCaracteres(result.response.text())
}

module.exports = generateText