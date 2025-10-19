import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ClothingItem {
  id: string;
  uri: string;
  type: 'top' | 'bottom' | 'shoes';
  category: string;
  color: string;
}

const STORAGE_KEY = 'closet_items';

export const ClosetManager = {
  async addItem(item: Omit<ClothingItem, 'id'>): Promise<ClothingItem> {
    const newItem: ClothingItem = {
      ...item,
      id: Date.now().toString(),
    };

    try {
      const existingItems = await this.getAllItems();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...existingItems, newItem]));
      return newItem;
    } catch (error) {
      console.error('Error adding item to closet:', error);
      throw error;
    }
  },

  async getAllItems(): Promise<ClothingItem[]> {
    try {
      const items = await AsyncStorage.getItem(STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error getting closet items:', error);
      return [];
    }
  },

  async getItemsByType(type: ClothingItem['type']): Promise<ClothingItem[]> {
    const items = await this.getAllItems();
    return items.filter(item => item.type === type);
  },

  async removeItem(id: string): Promise<void> {
    try {
      const items = await this.getAllItems();
      const filteredItems = items.filter(item => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
    } catch (error) {
      console.error('Error removing item from closet:', error);
      throw error;
    }
  },
};