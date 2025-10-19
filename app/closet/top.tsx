import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ClosetManager, ClothingItem } from '@/utils/closet-manager';
import { Image } from 'expo-image';
import React from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TopClosetScreen() {
  const [tops, setTops] = React.useState<ClothingItem[]>([]);
  const [selected, setSelected] = React.useState<ClothingItem | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    ClosetManager.getItemsByType('top').then(setTops);
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
      <ThemedText style={styles.title}>Tops</ThemedText>
      <FlatList
        data={tops}
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
    width: 80,
    height: 80,
    borderRadius: 10,
    margin: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: 300,
  },
  largeImage: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  closeButton: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
  },
});