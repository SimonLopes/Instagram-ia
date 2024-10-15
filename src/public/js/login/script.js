
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {

            localStorage.setItem('token', result.token);
            localStorage.setItem('user_id', result.userId);
            window.location.href = '/dashboard'; // Redireciona para a página principal ou dashboard
        } else {
            alert(`Erro: ${result.error}`);
        }
    } catch (error) {
        alert('Erro ao fazer login: ' + error.message);
    }
});
