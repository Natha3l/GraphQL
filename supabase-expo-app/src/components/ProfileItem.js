import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

export default function ProfileItem({ profile, onDelete, onUpdate }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {profile.avatar_url ? (
          <Image 
            source={{ uri: profile.avatar_url }} 
            style={styles.avatar}
          />
        ) : (
          <View style={styles.defaultAvatar}>
            <Text style={styles.avatarText}>
              {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 
               profile.username ? profile.username.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.fullName}>
            {profile.full_name || 'Nom non défini'}
          </Text>
          {profile.username && (
            <Text style={styles.username}>@{profile.username}</Text>
          )}
        </View>

        {profile.website && (
          <Text style={styles.website} numberOfLines={1}>
            🌐 {profile.website}
          </Text>
        )}

        <Text style={styles.lastUpdate}>
          Mis à jour: {formatDate(profile.updated_at)}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={onUpdate}>
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  nameContainer: {
    marginBottom: 4,
  },
  fullName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  username: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  website: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 4,
  },
  lastUpdate: {
    fontSize: 11,
    color: '#999',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ffe6e6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
  },
});