// script.js

// Função para lidar com o registro
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registro bem-sucedido! Você pode fazer login agora.');
            window.location.href = 'login'; // Redireciona para a página de login
        } else {
            alert(`Erro: ${result.error}`);
        }
    } catch (error) {
        alert('Erro ao registrar: ' + error.message);
    }
});