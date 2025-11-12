const API_URL = 'http://localhost:8080';

// Função para obter o token guardado
function getAuthToken() {
    try {
        const auth = JSON.parse(localStorage.getItem('filminis_auth'));
        return auth?.token || null;
    } catch {
        return null;
    }
}

async function apiClient(endpoint, { body, ...customConfig } = {}) {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro ${response.status}`);
        }
        
        // Retorna JSON para POST, PATCH, DELETE, GET
        return await response.json();

    } catch (err) {
        console.error('Falha na API:', err.message);
        throw err; // Re-lança o erro para o componente tratar
    }
}

apiClient.get = (endpoint, config) => apiClient(endpoint, { ...config, method: 'GET' });
apiClient.post = (endpoint, body, config) => apiClient(endpoint, { ...config, method: 'POST', body });
apiClient.patch = (endpoint, body, config) => apiClient(endpoint, { ...config, method: 'PATCH', body });
apiClient.delete = (endpoint, config) => apiClient(endpoint, { ...config, method: 'DELETE' });

// Função de Login (não envia token)
apiClient.login = (email, senha) => {
    return fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    }).then(async res => {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Credenciais inválidas');
        }
        return data;
    });
};

export default apiClient;