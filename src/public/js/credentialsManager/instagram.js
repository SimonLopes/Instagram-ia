
document.addEventListener('DOMContentLoaded', async (event) => {
    const userId = localStorage.getItem('user_id');

    try {
        const response = await fetch(`/api/instagram-credentials/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const credentials = await response.json();

            for (let i = 0; i < credentials.length; i++) {
                const element = credentials[i];
                addCredentialToTable(element);
            }

        } else {
            alert('Erro ao obter credenciais');
        }
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});


document.getElementById('addCredentialForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const userId = localStorage.getItem('user_id');
    const userIdInstagram = document.getElementById('userId').value;
    const accessToken = document.getElementById('accessToken').value;

    try {
        const response = await fetch('/api/instagram-credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, userIdInstagram, accessToken }),
        });

        if (response.ok) {
            const credential = await response.json();
            console.log(credential)

            addCredentialToTable(credential);
            // Limpa os campos após a adição
            document.getElementById('userId').value = '';
            document.getElementById('accessToken').value = '';
        } else {
            alert('Erro ao adicionar credencial ' + JSON.stringify(response));
        }
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});

function addCredentialToTable(credential) {
    console.log(credential)
    const tableBody = document.getElementById('credentialsTable').querySelector('tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${credential.instagram_credentials_id}</td>
        <td>${credential.user_id}</td>
        <td>${credential.instagram_user_id}</td>
        <td>${credential.is_active ? 'Ligado' : 'Desligado'}</td>
        <td>
            <button class="btn-toggle" onclick="toggleCredential(${credential.active_credential_id}, ${credential.is_active})">${credential.is_active ? 'Desligar' : 'Ligar'}</button>
            <button class="btn-remove" onclick="showConfirmationModal(${credential.instagram_credentials_id})"><i class="fas fa-trash-alt"></i></button>
        </td>
    `;

    tableBody.appendChild(row);
}

async function toggleCredential(id, currentStatus) {

    try {
        const response = await fetch(`/api/instagram-credentials/${id}/toggle`, {
            method: 'PATCH',
        });
        
        if (response.ok) {
            const updatedCredential = await response.json();
            updateCredentialRow(updatedCredential);
        } else {
            alert('Erro ao alterar o status da credencial');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}


// Função para atualizar a linha da credencial
function updateCredentialRow(credential) {
    const rows = document.querySelectorAll('#credentialsTable tbody tr');
    rows.forEach(row => {
        if (row.cells[0].textContent == credential.instagram_credentials_id) {
            row.cells[3].textContent = credential.is_active ? 'Ligado' : 'Desligado';
            row.cells[4].innerHTML = `<button class="btn-toggle" onclick="toggleCredential(${credential.id}, ${credential.is_active})">${credential.is_active ? 'Desligar' : 'Ligar'}</button>
                                      <button class="btn-remove" onclick="showConfirmationModal(${credential.instagram_credentials_id})"><i class="fas fa-trash-alt"></i></button>`;
        }
    });
}
function showConfirmationModal(credentialId) {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'block';

    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Quando clicar em confirmar, remover a credencial
    confirmBtn.onclick = function () {
        removeCredential(credentialId);
        modal.style.display = 'none';
    };

    // Quando clicar em cancelar, fechar o modal
    cancelBtn.onclick = function () {
        modal.style.display = 'none';
    };
}

async function removeCredential(id) {
    try {
        const response = await fetch(`/api/instagram-credentials/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            const rows = document.querySelectorAll('#credentialsTable tbody tr');
            console.log(rows)
            rows.forEach(row => {
                if (row.cells[0].textContent == id) {
                    row.remove();
                }
            });
        } else {
            alert('Erro ao remover a credencial');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }

}
