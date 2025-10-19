import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ClosetManager } from '@/utils/closet-manager';

interface Outfit {
  top?: string;
  bottom?: string;
  shoes?: string;
}

export default function OutfitsScreen() {
  const [currentOutfit, setCurrentOutfit] = useState<Outfit>({});

  const generateOutfit = async () => {
    try { w
      const tops = await ClosetManager.getItemsByType('top');
      const bottoms = await ClosetManager.getItemsByType('bottom');
      const shoes = await ClosetManager.getItemsByType('shoes');

      const randomTop = tops[Math.floor(Math.random() * tops.length)];
      const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
      const randomShoes = shoes[Math.floor(Math.random() * shoes.length)];

      setCurrentOutfit({
        top: randomTop?.uri,
        bottom: randomBottom?.uri,
        shoes: randomShoes?.uri,
      });
    } catch (error) {
      console.error('Error generating outfit:', error);
      Alert.alert('Error', 'Failed to generate outfit. Make sure you have added some clothes to your closet!');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Mix & Match Outfits</ThemedText>
        <ScrollView style={styles.outfitContainer}>
          {currentOutfit.top && (
            <Image source={{ uri: currentOutfit.top }} style={styles.clothingItem} contentFit="cover" />
          )}
          {currentOutfit.bottom && (
            <Image source={{ uri: currentOutfit.bottom }} style={styles.clothingItem} contentFit="cover" />
          )}
          {currentOutfit.shoes && (
            <Image source={{ uri: currentOutfit.shoes }} style={styles.clothingItem} contentFit="cover" />
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button title="Generate New Outfit" onPress={generateOutfit} />
          <Link href="/(tabs)/closet" asChild>
            <Button title="Go to Closet" />
          </Link>
        </View>
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
    marginBottom: 20,
  },
  outfitContainer: {
    flex: 1,
    marginVertical: 20,
  },
  clothingItem: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    gap: 10,
    marginTop: 20,
  },
});
