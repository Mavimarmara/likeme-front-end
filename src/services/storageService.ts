import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@likeme:auth_token';
const USER_KEY = '@likeme:user';

export interface StoredUser {
  email: string;
  name?: string;
  picture?: string;
  nickname?: string;
}

class StorageService {
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw new Error('Falha ao salvar token');
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  async setUser(user: StoredUser): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  async getUser(): Promise<StoredUser | null> {
    try {
      const userString = await AsyncStorage.getItem(USER_KEY);
      if (userString) {
        return JSON.parse(userString) as StoredUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  }

  async clearAll(): Promise<void> {
    try {
      await this.removeToken();
      await this.removeUser();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export default new StorageService();

