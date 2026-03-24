import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';
import type { StoredUser } from '@/types/auth';

const TOKEN_KEY = '@likeme:auth_token';
const USER_KEY = '@likeme:user';
const REGISTER_COMPLETED_AT_KEY = '@likeme:register_completed_at';
const WELCOME_SCREEN_ACCESSED_AT_KEY = '@likeme:welcome_screen_accessed_at';
const OBJECTIVES_SELECTED_AT_KEY = '@likeme:objectives_selected_at';
const SELECTED_OBJECTIVES_IDS_KEY = '@likeme:selected_objectives_ids';
const ANAMNESIS_COMPLETED_AT_KEY = '@likeme:anamnesis_completed_at';
const CART_ITEMS_KEY = '@likeme:cart_items';
const PRIVACY_POLICY_ACCEPTED_AT_KEY = '@likeme:privacy_policy_accepted_at';
const COMMUNITY_WELCOME_DISMISSED_KEY = '@likeme:community_welcome_dismissed';
const COMMUNITY_SHOPPING_TIP_DISMISSED_KEY = '@likeme:community_shopping_tip_dismissed';
const COMMUNITY_FAVORITE_IDS_KEY = '@likeme:community_favorite_ids';

class StorageService {
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      logger.error('Error saving token:', error);
      throw new Error('Falha ao salvar token');
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      logger.error('Error getting token:', error);
      return null;
    }
  }

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      logger.error('Error removing token:', error);
    }
  }

  async setUser(user: StoredUser): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      logger.error('Error saving user:', error);
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
      logger.error('Error getting user:', error);
      return null;
    }
  }

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      logger.error('Error removing user:', error);
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
      logger.error('Error saving register completed at:', error);
    }
  }

  async getRegisterCompletedAt(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REGISTER_COMPLETED_AT_KEY);
    } catch (error) {
      logger.error('Error getting register completed at:', error);
      return null;
    }
  }

  async getWelcomeScreenAccessedAt(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(WELCOME_SCREEN_ACCESSED_AT_KEY);
    } catch (error) {
      logger.error('Error getting welcome screen accessed at:', error);
      return null;
    }
  }

  async setWelcomeScreenAccessedAt(date: string | null): Promise<void> {
    try {
      if (date) {
        await AsyncStorage.setItem(WELCOME_SCREEN_ACCESSED_AT_KEY, date);
      } else {
        await AsyncStorage.removeItem(WELCOME_SCREEN_ACCESSED_AT_KEY);
      }
    } catch (error) {
      logger.error('Error saving welcome screen accessed at:', error);
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
      logger.error('Error saving objectives selected at:', error);
    }
  }

  async getObjectivesSelectedAt(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(OBJECTIVES_SELECTED_AT_KEY);
    } catch (error) {
      logger.error('Error getting objectives selected at:', error);
      return null;
    }
  }

  async setSelectedObjectivesIds(ids: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(SELECTED_OBJECTIVES_IDS_KEY, JSON.stringify(ids));
    } catch (error) {
      logger.error('Error saving selected objectives ids:', error);
    }
  }

  async getSelectedObjectivesIds(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(SELECTED_OBJECTIVES_IDS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      logger.error('Error getting selected objectives ids:', error);
      return [];
    }
  }

  async setAnamnesisCompletedAt(date: string | null): Promise<void> {
    try {
      if (date) {
        await AsyncStorage.setItem(ANAMNESIS_COMPLETED_AT_KEY, date);
      } else {
        await AsyncStorage.removeItem(ANAMNESIS_COMPLETED_AT_KEY);
      }
    } catch (error) {
      logger.error('Error saving anamnesis completed at:', error);
    }
  }

  async getAnamnesisCompletedAt(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ANAMNESIS_COMPLETED_AT_KEY);
    } catch (error) {
      logger.error('Error getting anamnesis completed at:', error);
      return null;
    }
  }

  async setPrivacyPolicyAcceptedAt(date: string | null): Promise<void> {
    try {
      if (date) {
        await AsyncStorage.setItem(PRIVACY_POLICY_ACCEPTED_AT_KEY, date);
      } else {
        await AsyncStorage.removeItem(PRIVACY_POLICY_ACCEPTED_AT_KEY);
      }
    } catch (error) {
      logger.error('Error saving privacy policy accepted at:', error);
    }
  }

  async getPrivacyPolicyAcceptedAt(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(PRIVACY_POLICY_ACCEPTED_AT_KEY);
    } catch (error) {
      logger.error('Error getting privacy policy accepted at:', error);
      return null;
    }
  }

  async getCartItems(): Promise<any[]> {
    try {
      const cartItemsString = await AsyncStorage.getItem(CART_ITEMS_KEY);
      if (cartItemsString) {
        return JSON.parse(cartItemsString);
      }
      return [];
    } catch (error) {
      logger.error('Error getting cart items:', error);
      return [];
    }
  }

  async setCartItems(items: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      logger.error('Error saving cart items:', error);
    }
  }

  async addToCart(item: any): Promise<void> {
    try {
      const cartItems = await this.getCartItems();
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex >= 0) {
        // Se o item já existe, aumenta a quantidade
        cartItems[existingItemIndex].quantity = (cartItems[existingItemIndex].quantity || 1) + 1;
      } else {
        // Adiciona novo item
        cartItems.push({ ...item, quantity: 1 });
      }

      await this.setCartItems(cartItems);
    } catch (error) {
      logger.error('Error adding to cart:', error);
    }
  }

  async removeCartItem(itemId: string): Promise<void> {
    try {
      const cartItems = await this.getCartItems();
      const filteredItems = cartItems.filter((item) => item.id !== itemId);
      await this.setCartItems(filteredItems);
    } catch (error) {
      logger.error('Error removing cart item:', error);
    }
  }

  async clearCart(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CART_ITEMS_KEY);
    } catch (error) {
      logger.error('Error clearing cart:', error);
    }
  }

  async getCommunityWelcomeDismissed(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(COMMUNITY_WELCOME_DISMISSED_KEY);
      return value === 'true';
    } catch (error) {
      logger.error('Error getting community welcome dismissed:', error);
      return false;
    }
  }

  async setCommunityWelcomeDismissed(dismissed: boolean): Promise<void> {
    try {
      if (dismissed) {
        await AsyncStorage.setItem(COMMUNITY_WELCOME_DISMISSED_KEY, 'true');
      } else {
        await AsyncStorage.removeItem(COMMUNITY_WELCOME_DISMISSED_KEY);
      }
    } catch (error) {
      logger.error('Error saving community welcome dismissed:', error);
    }
  }

  async getCommunityShoppingTipDismissed(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(COMMUNITY_SHOPPING_TIP_DISMISSED_KEY);
      return value === 'true';
    } catch (error) {
      logger.error('Error getting community shopping tip dismissed:', error);
      return false;
    }
  }

  async setCommunityShoppingTipDismissed(dismissed: boolean): Promise<void> {
    try {
      if (dismissed) {
        await AsyncStorage.setItem(COMMUNITY_SHOPPING_TIP_DISMISSED_KEY, 'true');
      } else {
        await AsyncStorage.removeItem(COMMUNITY_SHOPPING_TIP_DISMISSED_KEY);
      }
    } catch (error) {
      logger.error('Error saving community shopping tip dismissed:', error);
    }
  }

  async getFavoriteCommunityIds(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(COMMUNITY_FAVORITE_IDS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string' && id.length > 0) : [];
    } catch (error) {
      logger.error('Error getting favorite community ids:', error);
      return [];
    }
  }

  async isCommunityFavorite(communityId: string): Promise<boolean> {
    if (!communityId) return false;
    const ids = await this.getFavoriteCommunityIds();
    return ids.includes(communityId);
  }

  async setCommunityFavorite(communityId: string, favorite: boolean): Promise<void> {
    if (!communityId) {
      logger.warn('setCommunityFavorite chamado sem communityId');
      return;
    }
    try {
      const ids = await this.getFavoriteCommunityIds();
      const set = new Set(ids);
      if (favorite) {
        set.add(communityId);
      } else {
        set.delete(communityId);
      }
      const next = [...set];
      if (next.length === 0) {
        await AsyncStorage.removeItem(COMMUNITY_FAVORITE_IDS_KEY);
      } else {
        await AsyncStorage.setItem(COMMUNITY_FAVORITE_IDS_KEY, JSON.stringify(next));
      }
    } catch (error) {
      logger.error('Error saving community favorite:', { communityId, favorite, error });
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    try {
      await this.removeToken();
      await this.removeUser();
      await AsyncStorage.removeItem(REGISTER_COMPLETED_AT_KEY);
      await AsyncStorage.removeItem(WELCOME_SCREEN_ACCESSED_AT_KEY);
      await AsyncStorage.removeItem(OBJECTIVES_SELECTED_AT_KEY);
      await AsyncStorage.removeItem(SELECTED_OBJECTIVES_IDS_KEY);
      await AsyncStorage.removeItem(ANAMNESIS_COMPLETED_AT_KEY);
      await AsyncStorage.removeItem(PRIVACY_POLICY_ACCEPTED_AT_KEY);
      await AsyncStorage.removeItem(COMMUNITY_WELCOME_DISMISSED_KEY);
      await AsyncStorage.removeItem(COMMUNITY_SHOPPING_TIP_DISMISSED_KEY);
      await AsyncStorage.removeItem(COMMUNITY_FAVORITE_IDS_KEY);
      await this.clearCart();
    } catch (error) {
      logger.error('Error clearing storage:', error);
    }
  }
}

export default new StorageService();
