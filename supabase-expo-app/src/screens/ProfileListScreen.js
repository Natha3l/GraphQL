import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROFILES, DELETE_PROFILE, UPDATE_PROFILE } from '../graphql/queries';
import { supabase } from '../lib/supabase';
import ProfileItem from '../components/ProfileItem';

export default function ProfileListScreen() {
  const { data, loading, error, refetch } = useQuery(GET_PROFILES);
  const [deleteProfile] = useMutation(DELETE_PROFILE);
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  
  // État pour le modal d'édition
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    username: '',
    website: '',
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  const handleDeleteProfile = async (id) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce profil ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProfile({
                variables: { id },
                refetchQueries: [{ query: GET_PROFILES }],
              });
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le profil');
              console.error('Delete error:', error);
            }
          },
        },
      ]
    );
  };

  const handleUpdateProfile = (profile) => {
    setEditingProfile(profile);
    setEditForm({
      full_name: profile.full_name || '',
      username: profile.username || '',
      website: profile.website || '',
    });
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editingProfile) return;

    try {
      // Créer l'objet avec seulement les champs modifiés
      const updates = {};
      if (editForm.full_name !== editingProfile.full_name) {
        updates.full_name = editForm.full_name.trim();
      }
      if (editForm.username !== editingProfile.username) {
        updates.username = editForm.username.trim();
      }
      if (editForm.website !== editingProfile.website) {
        updates.website = editForm.website.trim();
      }

      if (Object.keys(updates).length > 0) {
        await updateProfile({
          variables: { 
            id: editingProfile.id, 
            updates 
          },
          refetchQueries: [{ query: GET_PROFILES }],
        });
      }

      setEditModalVisible(false);
      setEditingProfile(null);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le profil');
      console.error('Update error:', error);
    }
  };

  const renderProfile = ({ item }) => (
    <ProfileItem
      profile={item}
      onDelete={() => handleDeleteProfile(item.id)}
      onUpdate={() => handleUpdateProfile(item)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text>Chargement des profils...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.error}>Erreur: {error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liste des Profils ({data?.profilesCollection?.edges?.length || 0})</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data?.profilesCollection?.edges || []}
        keyExtractor={(item) => item.node.id}
        renderItem={({ item }) => renderProfile({ item: item.node })}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun profil trouvé</Text>
          </View>
        }
      />

      {/* Modal d'édition */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le profil</Text>
            
            <Text style={styles.inputLabel}>Nom complet:</Text>
            <TextInput
              style={styles.input}
              value={editForm.full_name}
              onChangeText={(text) => setEditForm(prev => ({...prev, full_name: text}))}
              placeholder="Nom complet"
            />

            <Text style={styles.inputLabel}>Nom d'utilisateur:</Text>
            <TextInput
              style={styles.input}
              value={editForm.username}
              onChangeText={(text) => setEditForm(prev => ({...prev, username: text}))}
              placeholder="username"
            />

            <Text style={styles.inputLabel}>Site web:</Text>
            <TextInput
              style={styles.input}
              value={editForm.website}
              onChangeText={(text) => setEditForm(prev => ({...prev, website: text}))}
              placeholder="https://example.com"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  error: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  // Styles pour le modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});