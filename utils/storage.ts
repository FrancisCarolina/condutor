import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Salva o token e o ID do usuário no armazenamento local.
 * @param token Token de autenticação
 * @param userId ID do usuário
 */
export async function logar(token: string, userId: number) {
    try {
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userId', userId.toString()); // Converte para string
    } catch (error) {
        console.error('Erro ao salvar os dados de login:', error);
    }
}

/**
 * Remove o token e o ID do usuário do armazenamento local.
 */
export async function deslogar() {
    try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userId');
    } catch (error) {
        console.error('Erro ao deslogar:', error);
    }
}

/**
 * Verifica se o usuário está logado (se existe um token).
 * @returns True se o token existir, false caso contrário.
 */
export async function verificaSeLogado(): Promise<boolean> {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return !!token; // Retorna true se o token existir
    } catch (error) {
        console.error('Erro ao verificar login:', error);
        return false;
    }
}

/**
 * Obtém o ID do usuário do armazenamento local.
 * @returns ID do usuário (como string ou null)
 */
export async function obterUserId(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem('userId');
    } catch (error) {
        console.error('Erro ao obter o ID do usuário:', error);
        return null;
    }
}

export async function obterToken(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem('authToken');
    } catch (error) {
        console.error('Erro ao obter o token do usuário:', error);
        return null;
    }
}