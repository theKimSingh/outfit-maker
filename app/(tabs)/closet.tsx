import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ClosetManager, ClothingItem } from '@/utils/closet-manager';
import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

export default function ClosetScreen() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [tops, setTops] = useState<ClothingItem[]>([]);
  const [bottoms, setBottoms] = useState<ClothingItem[]>([]);
  const [shoes, setShoes] = useState<ClothingItem[]>([]);

  useEffect(() => {
    loadClosetItems();
  }, []);

  const loadClosetItems = async () => {
    const closetItems = await ClosetManager.getAllItems();
    setItems(closetItems);
    setTops(closetItems.filter(item => item.type === 'top'));
    setBottoms(closetItems.filter(item => item.type === 'bottom'));
    setShoes(closetItems.filter(item => item.type === 'shoes'));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // Show a dialog to select the type of clothing
      Alert.alert(
        'Select Clothing Type',
        'What type of clothing item is this?',
        [
          {
            text: 'Top',
            onPress: () => addClothingItem(result.assets[0].uri, 'top'),
          },
          {
            text: 'Bottom',
            onPress: () => addClothingItem(result.assets[0].uri, 'bottom'),
          },
          {
            text: 'Shoes',
            onPress: () => addClothingItem(result.assets[0].uri, 'shoes'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      );
    }
  };

  const addClothingItem = async (uri: string, type: ClothingItem['type']) => {
    await ClosetManager.addItem({
      uri,
      type,
      category: 'casual', // Default category
      color: 'unknown', // TODO: Implement color detection
    });
    loadClosetItems();
  };

  const removeItem = async (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your closet?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await ClosetManager.removeItem(id);
            loadClosetItems();
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: ClothingItem }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onLongPress={() => removeItem(item.id)}
    >
      <Image source={{ uri: item.uri }} style={styles.clothingItem} />
      <ThemedText style={styles.itemType}>{item.type}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>My Closet</ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <ThemedText style={styles.addButtonText}>+ Add Clothing Item</ThemedText>
        </TouchableOpacity>
        <Link href="/closet/top" asChild>
          <TouchableOpacity style={styles.folder}>
            <ThemedText style={styles.folderText}>Tops</ThemedText>
          </TouchableOpacity>
        </Link>
        <Link href="/closet/bottom" asChild>
          <TouchableOpacity style={styles.folder}>
            <ThemedText style={styles.folderText}>Bottoms</ThemedText>
          </TouchableOpacity>
        </Link>
        <Link href="/closet/shoe" asChild>
          <TouchableOpacity style={styles.folder}>
            <ThemedText style={styles.folderText}>Shoes</ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  folder: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  folderText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContent: {
    paddingVertical: 20,
    gap: 10,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
  },
  clothingItem: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  itemType: {
    textAlign: 'center',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
});