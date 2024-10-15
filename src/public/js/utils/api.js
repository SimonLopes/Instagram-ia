
const API = {
    fetch: async (url, options = {}) => {

        options.headers = {
            ...options.headers,
        };
        options = {
            ...options,
            method: options.method || 'GET',
            headers: options.headers,
            body: options.body || null
        }
        options.credentials = 'include'

        console.log(options)
        const response = await fetch(url, options);
        console.log(response)
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = '/login';
            throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }

        return response;
    }
};