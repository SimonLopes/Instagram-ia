const path = require('path');

const textGenerate = async (width, height, topText, bottomText) => {

  const fontPath1 = path.resolve(__dirname, '../fonts', 'Roboto-Bold.ttf');
  console.log(fontPath1);

  const maxTextWidth = width * 0.9; // Define o limite máximo de 90% da largura da imagem

  // Quebrar o texto em linhas para o topo e a parte inferior
  const topTextLines = wrapText(topText, maxTextWidth);
  const bottomTextLines = wrapText(bottomText, maxTextWidth);

  const svgText = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @font-face {
          font-family: 'Roboto';
          src: url('./fonts/Roboto-Bold.ttf') format('truetype');
        }
        .text {
          font-family: 'Tahoma';
          font-weight: 700;
          fill: white;
          stroke: black;
          stroke-width: 2px;
          font-size: 70px;
          fill: white;
          text-anchor: middle;
          padding: 40px;
        }
      </style>
      <rect width="${width}" height="${height}" fill="transparent" />
      <!-- Texto superior centralizado -->
      ${generateTextSVG(topTextLines, 15, width)}
      <!-- Texto inferior centralizado -->
      ${generateTextSVG(bottomTextLines, 90, width, true)}
    </svg>`;

  return svgText;
};

// Função para quebrar o texto em múltiplas linhas
const wrapText = (text, maxTextWidth) => {
  const charWidth = 35; // Largura média de um caractere em pixels
  const maxCharsPerLine = Math.floor(maxTextWidth / charWidth); // Máximo de caracteres por linha

  const words = text.split(' '); // Quebra o texto em palavras
  let lines = [];
  let currentLine = [];

  words.forEach(word => {
    const currentLineLength = currentLine.join(' ').length;
    if (currentLineLength + word.length <= maxCharsPerLine) {
      currentLine.push(word);
    } else {
      lines.push(currentLine.join(' '));
      currentLine = [word];
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }

  return lines;
};

// Função para gerar o SVG para cada linha de texto
const generateTextSVG = (lines, yPercentage, width, isBottom = false) => {
  const lineHeight = 10; // Espaço entre as linhas
  let textSVG = '';

  lines.forEach((line, index) => {
    const yPosition = isBottom
      ? `${yPercentage - (lines.length - 1 - index) * (lineHeight / 2)}%`
      : `${yPercentage + index * (lineHeight / 2)}%`;

    textSVG += `<text x="50%" y="${yPosition}" class="text" font-family="Roboto, sans-serif">${line}</text>`;
  });

  return textSVG;
};

module.exports = textGenerate;
