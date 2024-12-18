// URL base da API
const baseURL = 'http://localhost:8080';

export default async function getDados(endpoint) {
    try {
        const response = await fetch(`${baseURL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erro ao acessar o endpoint ${endpoint}:`, error);
        
        return null; 
    }
}
