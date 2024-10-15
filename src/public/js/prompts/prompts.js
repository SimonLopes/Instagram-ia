document.addEventListener('DOMContentLoaded', async (event) => {
    const userId = localStorage.getItem('user_id');

    try {
        const response = await API.fetch(`/api/instagram-credentials/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responsePrompts = await API.fetch(`/api/prompts/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                
            },
        });

        if (response.ok) {

            const credentialsUser = await response.json();
            const prompts = await responsePrompts.json();
            addCredentialToSelect(credentialsUser);

            for (let i = 0; i < prompts.length; i++) {
                const prompt = prompts[i];
                addPromptToTable(prompt);
            }

        } else {
            alert('Erro ao obter prompts');
        }
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});


document.getElementById('addPromptForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const userId = localStorage.getItem('user_id');
    const promptText = document.getElementById('promptText').value;
    const promptImage = document.getElementById('promptImage').value;
    var $select = $('#multiple-select')
    var selectsIntagramId = $select.multipleSelect('getSelects')


    try {
        const response = await API.fetch(`/api/prompts/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt_text: promptText, prompt_image: promptImage, instagram_credentials_id: selectsIntagramId }),
        });

        
        if (response.ok) {
            const prompt = await response.json();
            console.log(prompt)
            addPromptToTable(prompt);
            document.getElementById('promptText').value = '';
            document.getElementById('promptImage').value = '';
        } else {
            alert('Erro ao adicionar prompt ' + JSON.stringify(response));
        }
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});

function addCredentialToSelect(igId) {
    const data = igId.map(item => ({
        text: item.instagram_user_id,
        value: item.instagram_credentials_id
    }));
    $('#multiple-select').multipleSelect({
        selectAll: false,
        data
    })    
}

function addPromptToTable(prompt) {
    console.log(prompt)
    const tableBody = document.getElementById('promptsTable').querySelector('tbody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${prompt.prompt_id}</td>
        <td>${prompt.prompt_text}</td>
        <td>${prompt.prompt_image}</td>
        <td id="instagramUserIdCell-${prompt.prompt_id}">
            ${prompt.instagram_user_ids ? prompt.instagram_user_ids : '<span style="color: red">Nenhum</span>'}
        </td>
        <td>
            <button class="btn-toggle" id="btn-edit-${prompt.prompt_id}" onclick="showSelect(${prompt.prompt_id}, [${prompt.instagram_credentials_ids}])">Alterar</button>
            <button class="btn-remove" onclick="showConfirmationModal(${prompt.prompt_id})"><i class="fas fa-trash-alt"></i></button>
        </td>
    `;

    tableBody.appendChild(row);
}

async function showSelect(promptId, instagram_credentials_ids) {
    const cell = document.getElementById(`instagramUserIdCell-${promptId}`);
    const previousValue = cell.innerHTML;
    cell.setAttribute('data-previous-value', previousValue);

    $(`#btn-edit-${promptId}`).prop('disabled', true);
    const selectHTML = `
        <div class="select-input-prompt" style="margin-bottom: 10px;">
            <select multiple="multiple" class="credential-prompt-select" id="credential-prompt-select-${promptId}" data-width="100%">
            </select>
        </div>
        <button onclick="saveSelection(${promptId})">Salvar</button>
        <button onclick="cancelSelection(${promptId})">Cancelar</button>
    `;
    

    cell.innerHTML = selectHTML;

    try {
        const userId = localStorage.getItem('user_id');
        const response = await API.fetch(`/api/instagram-credentials/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const credentials = await response.json();
            populateSelectWithCredentials(promptId, credentials, instagram_credentials_ids);
        } else {
            console.error('Erro ao obter as credenciais do Instagram.');
        }
    } catch (error) {
        console.error('Erro ao carregar as credenciais:', error);
    }
}

function populateSelectWithCredentials(promptId, credentials, instagram_credentials_ids) {    
    const data = credentials.map(item => ({
        text: item.instagram_user_id,
        value: item.instagram_credentials_id
    }));
    $(`#credential-prompt-select-${promptId}`).multipleSelect({
        selectAll: false,
        data,
    })
    $(`#credential-prompt-select-${promptId}`).multipleSelect('setSelects', instagram_credentials_ids)
}

async function saveSelection(promptId) {
    const $select = $(`#credential-prompt-select-${promptId}`);
    const credentialsSelected = $select.multipleSelect('getSelects');

    try {
        const response = await API.fetch(`/api/instagram-credentials/prompt`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ids: credentialsSelected,
                prompt_id: promptId
            })
        });

        if (response.ok) {
            $(`#btn-edit-${promptId}`).prop('disabled', false);
            location.reload(); // Recarrega a página para atualizar as informações
        } else {
            console.error('Erro ao alterar as credenciais do Instagram.');
        }
    } catch (error) {
        console.error('Erro ao alterar as credenciais:', error);
    }
}

function cancelSelection(promptId) {
    const cell = document.getElementById(`instagramUserIdCell-${promptId}`);
    const previousValue = cell.getAttribute('data-previous-value');  // Store the original value if necessary
    cell.innerHTML = previousValue ? previousValue : '<span style="color: red">Nenhum</span>';
    $(`#btn-edit-${promptId}`).prop('disabled', false);
}

function showConfirmationModal(promptId) {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'block';

    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Quando clicar em confirmar, remover a credencial
    confirmBtn.onclick = function () {
        removePrompt(promptId);
        modal.style.display = 'none';
    };

    // Quando clicar em cancelar, fechar o modal
    cancelBtn.onclick = function () {
        modal.style.display = 'none';
    };
}

async function removePrompt(id) {
    try {
        const response = await API.fetch(`/api/prompts/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            const rows = document.querySelectorAll('#promptsTable tbody tr');
            rows.forEach(row => {
                if (row.cells[0].textContent == id) {
                    row.remove();
                }
            });
        } else {
            alert('Erro ao remover a prompt');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }

}
