import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { 
  Card, 
  Button, 
  Avatar, 
  Divider, 
  List, 
  Switch 
} from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../utils/theme';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo cerrar sesión. Intenta de nuevo más tarde.',
        [{ text: 'OK' }]
      );
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: handleLogout }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
        </View>
        
        <View style={styles.profileCard}>
          <Avatar.Text 
            size={80} 
            label={user?.username?.charAt(0).toUpperCase() || 'U'} 
            style={styles.avatar}
            color={COLORS.white}
            backgroundColor={COLORS.primary}
          />
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Viajes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Seguros</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Destinos</Text>
            </View>
          </View>
        </View>
        
        <Card style={styles.infoCard}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Ajustes de la aplicación</List.Subheader>
              
              <List.Item
                title="Modo oscuro"
                left={() => <List.Icon icon="moon-waning-crescent" />}
                right={() => (
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    color={COLORS.primary}
                  />
                )}
              />
              
              <List.Item
                title="Notificaciones"
                left={() => <List.Icon icon="bell" />}
                right={() => (
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    color={COLORS.primary}
                  />
                )}
              />
              
              <Divider style={styles.divider} />
              
              <List.Subheader>Cuenta</List.Subheader>
              
              <List.Item
                title="Editar perfil"
                left={() => <List.Icon icon="account-edit" />}
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => Alert.alert('Pronto disponible', 'Esta funcionalidad estará disponible en próximas actualizaciones.')}
              />
              
              <List.Item
                title="Método de pago"
                left={() => <List.Icon icon="credit-card" />}
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => Alert.alert('Pronto disponible', 'Esta funcionalidad estará disponible en próximas actualizaciones.')}
              />
              
              <List.Item
                title="Historial de viajes"
                left={() => <List.Icon icon="airplane" />}
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => Alert.alert('Pronto disponible', 'Esta funcionalidad estará disponible en próximas actualizaciones.')}
              />
              
              <List.Item
                title="Pólizas activas"
                left={() => <List.Icon icon="shield-check" />}
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => Alert.alert('Pronto disponible', 'Esta funcionalidad estará disponible en próximas actualizaciones.')}
              />
              
              <Divider style={styles.divider} />
              
              <List.Subheader>Soporte</List.Subheader>
              
              <List.Item
                title="Ayuda y soporte"
                left={() => <List.Icon icon="help-circle" />}
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => Alert.alert('Pronto disponible', 'Esta funcionalidad estará disponible en próximas actualizaciones.')}
              />
              
              <List.Item
                title="Términos y condiciones"
                left={() => <List.Icon icon="file-document" />}
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => Alert.alert('Pronto disponible', 'Esta funcionalidad estará disponible en próximas actualizaciones.')}
              />
              
              <List.Item
                title="Política de privacidad"
                left={() => <List.Icon icon="shield-account" />}
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => Alert.alert('Pronto disponible', 'Esta funcionalidad estará disponible en próximas actualizaciones.')}
              />
            </List.Section>
          </Card.Content>
        </Card>
        
        <Button 
          mode="outlined" 
          onPress={confirmLogout}
          style={styles.logoutButton}
          labelStyle={styles.logoutButtonLabel}
          icon="logout"
        >
          Cerrar sesión
        </Button>
        
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Briki v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  profileCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    marginBottom: 15,
  },
  avatar: {
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoCard: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  divider: {
    marginVertical: 10,
  },
  logoutButton: {
    marginHorizontal: 15,
    marginBottom: 20,
    borderColor: COLORS.error,
  },
  logoutButtonLabel: {
    color: COLORS.error,
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default ProfileScreen;