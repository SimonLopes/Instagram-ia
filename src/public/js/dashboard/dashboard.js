// Simulando os dados
const data = {
    totalImages: 5,
    totalCredentials: 10,
    totalPrompts: 3,
    images: [
        'image1.jpg', // Adicione caminhos reais das imagens
        'image2.jpg',
        'image3.jpg',
        'image4.jpg',
        'image5.jpg'
    ]
};

// src/public/js/dashboard/dashboard.js
Auth.requireAuth();
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await API.fetch('/api/users');
        if (response.ok) {
            const users = await response.json();
        } else {
            console.error('Erro ao buscar usuários');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

// Atualizando o dashboard com os dados
document.getElementById('totalImages').innerText = data.totalImages;
document.getElementById('totalCredentials').innerText = data.totalCredentials;
document.getElementById('totalPrompts').innerText = data.totalPrompts;

// Preenchendo a galeria de imagens
const imageGallery = document.getElementById('imageGallery');
data.images.forEach(image => {
    const imgElement = document.createElement('img');
    imgElement.src = image; // Adicione um caminho válido para a imagem
    imgElement.alt = 'Imagem Gerada';
    imageGallery.appendChild(imgElement);
});
