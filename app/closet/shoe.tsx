import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ClosetManager, ClothingItem } from '@/utils/closet-manager';
import { Image } from 'expo-image';
import React from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ShoeClosetScreen() {
  const [shoes, setShoes] = React.useState<ClothingItem[]>([]);
  const [selected, setSelected] = React.useState<ClothingItem | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    ClosetManager.getItemsByType('shoes').then(setShoes);
  }, []);

  const openModal = (item: ClothingItem) => {
    setSelected(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
  };

  const renderItem = ({ item }: { item: ClothingItem }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} contentFit="cover" />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Shoes</ThemedText>
      <FlatList
        data={shoes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContent}
      />
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {selected && (
              <Image source={{ uri: selected.uri }} style={styles.largeImage} contentFit="cover" />
            )}
            <ThemedText style={styles.modalType}>{selected?.type}</ThemedText>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <ThemedText style={styles.closeText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
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
  listContent: {
    paddingVertical: 20,
    gap: 10,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    margin: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  largeImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});