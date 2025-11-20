import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@likeme:auth_token';
const USER_KEY = '@likeme:user';
const REGISTER_COMPLETED_AT_KEY = '@likeme:register_completed_at';
const OBJECTIVES_SELECTED_AT_KEY = '@likeme:objectives_selected_at';

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

  async setRegisterCompletedAt(date: string | null): Promise<void> {
    try {
      if (date) {
        await AsyncStorage.setItem(REGISTER_COMPLETED_AT_KEY, date);
      } else {
        await AsyncStorage.removeItem(REGISTER_COMPLETED_AT_KEY);
      }
    } catch (error) {
      console.error('Error saving register completed at:', error);
    }
  }

  async getRegisterCompletedAt(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REGISTER_COMPLETED_AT_KEY);
    } catch (error) {
      console.error('Error getting register completed at:', error);
      return null;
    }
  }

  async setObjectivesSelectedAt(date: string | null): Promise<void> {
    try {
      if (date) {
        await AsyncStorage.setItem(OBJECTIVES_SELECTED_AT_KEY, date);
      } else {
        await AsyncStorage.removeItem(OBJECTIVES_SELECTED_AT_KEY);
      }
    } catch (error) {
      console.error('Error saving objectives selected at:', error);
    }
  }

  async getObjectivesSelectedAt(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(OBJECTIVES_SELECTED_AT_KEY);
    } catch (error) {
      console.error('Error getting objectives selected at:', error);
      return null;
    }
  }

  async clearAll(): Promise<void> {
    try {
      await this.removeToken();
      await this.removeUser();
      await AsyncStorage.removeItem(REGISTER_COMPLETED_AT_KEY);
      await AsyncStorage.removeItem(OBJECTIVES_SELECTED_AT_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export default new StorageService();

