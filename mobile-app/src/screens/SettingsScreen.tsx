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
  Switch,
  RadioButton,
  TextInput
} from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../utils/theme';

const SettingsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [smsNotifications, setSmsNotifications] = React.useState(true);
  const [language, setLanguage] = React.useState('es');
  const [currency, setCurrency] = React.useState('usd');
  const [dateFormat, setDateFormat] = React.useState('dmy');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showTabs, setShowTabs] = React.useState('account'); // account, notifications, payment, security, language

  const handleSaveSettings = () => {
    Alert.alert(
      'Éxito',
      'La configuración ha sido guardada.',
      [{ text: 'OK' }]
    );
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }

    Alert.alert(
      'Éxito',
      'Tu contraseña ha sido actualizada.',
      [{ text: 'OK' }]
    );

    // Reset fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const renderTab = () => {
    switch (showTabs) {
      case 'account':
        return (
          <Card style={styles.card}>
            <Card.Title title="Información de la cuenta" />
            <Card.Content>
              <TextInput
                label="Nombre completo"
                value={user?.name || ''}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Nombre de usuario"
                value={user?.username || ''}
                mode="outlined"
                style={styles.input}
                disabled
              />
              <TextInput
                label="Correo electrónico"
                value={user?.email || ''}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
              />
              <TextInput
                label="Teléfono"
                value=""
                placeholder="Ingresa tu número de teléfono"
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
              />

              <View style={styles.profilePictureSection}>
                <Text style={styles.sectionTitle}>Foto de perfil</Text>
                <View style={styles.profilePictureContainer}>
                  <Avatar.Text
                    size={60}
                    label={user?.username?.charAt(0).toUpperCase() || 'U'}
                    color={COLORS.white}
                    backgroundColor={COLORS.primary}
                  />
                  <View style={styles.profilePictureButtons}>
                    <Button mode="contained" style={styles.uploadButton}>
                      Subir foto
                    </Button>
                    <Text style={styles.helperText}>JPG, GIF o PNG. 1MB máx.</Text>
                  </View>
                </View>
              </View>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button mode="outlined" style={styles.actionButton}>
                Cancelar
              </Button>
              <Button 
                mode="contained" 
                style={styles.actionButton}
                onPress={handleSaveSettings}
              >
                Guardar cambios
              </Button>
            </Card.Actions>
          </Card>
        );
      
      case 'notifications':
        return (
          <Card style={styles.card}>
            <Card.Title title="Preferencias de notificaciones" />
            <Card.Content>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notificaciones por correo</Text>
                <List.Item
                  title="Recordatorios de viaje"
                  description="Recibir recordatorios sobre tus próximos viajes"
                  right={() => (
                    <Switch
                      value={emailNotifications}
                      onValueChange={setEmailNotifications}
                      color={COLORS.primary}
                    />
                  )}
                />
                <List.Item
                  title="Actualizaciones de pólizas"
                  description="Recibir actualizaciones sobre tus pólizas de seguro"
                  right={() => (
                    <Switch
                      value={emailNotifications}
                      onValueChange={setEmailNotifications}
                      color={COLORS.primary}
                    />
                  )}
                />
                <List.Item
                  title="Marketing y promociones"
                  description="Recibir ofertas especiales y descuentos"
                  right={() => (
                    <Switch
                      value={false}
                      onValueChange={() => {}}
                      color={COLORS.primary}
                    />
                  )}
                />
              </View>

              <Divider style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notificaciones SMS</Text>
                <List.Item
                  title="Alertas de viaje"
                  description="Recibir notificaciones SMS para actualizaciones importantes de viaje"
                  right={() => (
                    <Switch
                      value={smsNotifications}
                      onValueChange={setSmsNotifications}
                      color={COLORS.primary}
                    />
                  )}
                />
                <List.Item
                  title="Advertencias de viaje"
                  description="Recibir alertas sobre avisos de viaje"
                  right={() => (
                    <Switch
                      value={smsNotifications}
                      onValueChange={setSmsNotifications}
                      color={COLORS.primary}
                    />
                  )}
                />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notificaciones en la aplicación</Text>
                <List.Item
                  title="Notificaciones de la aplicación"
                  description="Habilitar o deshabilitar todas las notificaciones en la aplicación"
                  right={() => (
                    <Switch
                      value={notifications}
                      onValueChange={setNotifications}
                      color={COLORS.primary}
                    />
                  )}
                />
              </View>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button mode="outlined" style={styles.actionButton}>
                Cancelar
              </Button>
              <Button 
                mode="contained" 
                style={styles.actionButton}
                onPress={handleSaveSettings}
              >
                Guardar cambios
              </Button>
            </Card.Actions>
          </Card>
        );
      
      case 'payment':
        return (
          <Card style={styles.card}>
            <Card.Title title="Métodos de pago" />
            <Card.Content>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Métodos de pago guardados</Text>
                <Card style={styles.paymentCard}>
                  <Card.Content style={styles.paymentCardContent}>
                    <View style={styles.paymentInfo}>
                      <MaterialCommunityIcons name="credit-card" size={24} color={COLORS.primary} />
                      <View style={styles.paymentDetails}>
                        <Text style={styles.paymentTitle}>Visa terminada en 4242</Text>
                        <Text style={styles.paymentSubtitle}>Expira 12/24</Text>
                      </View>
                    </View>
                    <View style={styles.paymentActions}>
                      <Button mode="outlined" compact>Editar</Button>
                      <Button mode="outlined" compact style={{marginLeft: 8}} textColor={COLORS.error}>Eliminar</Button>
                    </View>
                  </Card.Content>
                </Card>
                <Button 
                  mode="contained" 
                  icon="plus"
                  style={styles.addPaymentButton}
                  onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto.')}
                >
                  Añadir método de pago
                </Button>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dirección de facturación</Text>
                <TextInput
                  label="Dirección"
                  value=""
                  placeholder="Ingrese su dirección"
                  mode="outlined"
                  style={styles.input}
                />
                <View style={styles.row}>
                  <TextInput
                    label="Ciudad"
                    value=""
                    placeholder="Ingrese su ciudad"
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                  />
                  <TextInput
                    label="Estado/Provincia"
                    value=""
                    placeholder="Ingrese su estado"
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                  />
                </View>
                <View style={styles.row}>
                  <TextInput
                    label="Código postal"
                    value=""
                    placeholder="Ingrese su código postal"
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                    keyboardType="number-pad"
                  />
                  <TextInput
                    label="País"
                    value=""
                    placeholder="Ingrese su país"
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                  />
                </View>
              </View>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button mode="outlined" style={styles.actionButton}>
                Cancelar
              </Button>
              <Button 
                mode="contained" 
                style={styles.actionButton}
                onPress={handleSaveSettings}
              >
                Guardar cambios
              </Button>
            </Card.Actions>
          </Card>
        );
      
      case 'security':
        return (
          <Card style={styles.card}>
            <Card.Title title="Configuración de seguridad" />
            <Card.Content>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cambiar contraseña</Text>
                <TextInput
                  label="Contraseña actual"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  mode="outlined"
                  style={styles.input}
                  secureTextEntry
                />
                <TextInput
                  label="Nueva contraseña"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  mode="outlined"
                  style={styles.input}
                  secureTextEntry
                />
                <TextInput
                  label="Confirmar nueva contraseña"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  mode="outlined"
                  style={styles.input}
                  secureTextEntry
                />
                <Button 
                  mode="contained" 
                  style={styles.marginTop}
                  onPress={handleChangePassword}
                >
                  Actualizar contraseña
                </Button>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Autenticación de dos factores</Text>
                <List.Item
                  title="Habilitar autenticación de dos factores"
                  description="Añade una capa extra de seguridad a tu cuenta"
                  right={() => (
                    <Switch
                      value={false}
                      onValueChange={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto.')}
                      color={COLORS.primary}
                    />
                  )}
                />
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    La autenticación de dos factores añade una capa extra de seguridad a tu cuenta al requerir más que solo una contraseña para iniciar sesión.
                  </Text>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacidad</Text>
                <List.Item
                  title="Seguimiento de actividad"
                  description="Permitir a Briki rastrear el uso de la aplicación para mejores recomendaciones"
                  right={() => (
                    <Switch
                      value={true}
                      onValueChange={() => {}}
                      color={COLORS.primary}
                    />
                  )}
                />
                <List.Item
                  title="Compartir datos"
                  description="Compartir datos de uso anónimos para ayudar a mejorar la aplicación"
                  right={() => (
                    <Switch
                      value={true}
                      onValueChange={() => {}}
                      color={COLORS.primary}
                    />
                  )}
                />
              </View>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button mode="outlined" style={styles.actionButton}>
                Cancelar
              </Button>
              <Button 
                mode="contained" 
                style={styles.actionButton}
                onPress={handleSaveSettings}
              >
                Guardar cambios
              </Button>
            </Card.Actions>
          </Card>
        );
      
      case 'language':
        return (
          <Card style={styles.card}>
            <Card.Title title="Región e idioma" />
            <Card.Content>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferencias de idioma</Text>
                <Text style={styles.label}>Idioma de la aplicación</Text>
                <RadioButton.Group onValueChange={value => setLanguage(value)} value={language}>
                  <RadioButton.Item label="English" value="en" />
                  <RadioButton.Item label="Español" value="es" />
                  <RadioButton.Item label="Português" value="pt" />
                </RadioButton.Group>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Configuración regional</Text>
                <Text style={styles.label}>Zona horaria</Text>
                <RadioButton.Group onValueChange={() => {}} value="utc-5">
                  <RadioButton.Item label="Eastern Time (UTC-5)" value="utc-5" />
                  <RadioButton.Item label="Central Time (UTC-6)" value="utc-6" />
                  <RadioButton.Item label="Pacific Time (UTC-8)" value="utc-8" />
                  <RadioButton.Item label="Bogotá (UTC-5)" value="bog-5" />
                  <RadioButton.Item label="Ciudad de México (UTC-6)" value="mx-6" />
                </RadioButton.Group>
                
                <Text style={styles.label}>Moneda</Text>
                <RadioButton.Group onValueChange={value => setCurrency(value)} value={currency}>
                  <RadioButton.Item label="USD ($)" value="usd" />
                  <RadioButton.Item label="EUR (€)" value="eur" />
                  <RadioButton.Item label="COP ($)" value="cop" />
                  <RadioButton.Item label="MXN ($)" value="mxn" />
                </RadioButton.Group>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Formato de fecha y hora</Text>
                <Text style={styles.label}>Formato de fecha</Text>
                <RadioButton.Group onValueChange={value => setDateFormat(value)} value={dateFormat}>
                  <RadioButton.Item label="MM/DD/AAAA" value="mdy" />
                  <RadioButton.Item label="DD/MM/AAAA" value="dmy" />
                  <RadioButton.Item label="AAAA-MM-DD" value="ymd" />
                </RadioButton.Group>
                
                <Text style={styles.label}>Formato de hora</Text>
                <RadioButton.Group onValueChange={() => {}} value="24h">
                  <RadioButton.Item label="12 horas (AM/PM)" value="12h" />
                  <RadioButton.Item label="24 horas" value="24h" />
                </RadioButton.Group>
              </View>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button mode="outlined" style={styles.actionButton}>
                Cancelar
              </Button>
              <Button 
                mode="contained" 
                style={styles.actionButton}
                onPress={handleSaveSettings}
              >
                Guardar cambios
              </Button>
            </Card.Actions>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          <TouchableOpacity
            style={[styles.tab, showTabs === 'account' && styles.activeTab]}
            onPress={() => setShowTabs('account')}
          >
            <MaterialCommunityIcons 
              name="account" 
              size={20} 
              color={showTabs === 'account' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text style={[styles.tabText, showTabs === 'account' && styles.activeTabText]}>
              Cuenta
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, showTabs === 'notifications' && styles.activeTab]}
            onPress={() => setShowTabs('notifications')}
          >
            <MaterialCommunityIcons 
              name="bell" 
              size={20} 
              color={showTabs === 'notifications' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text style={[styles.tabText, showTabs === 'notifications' && styles.activeTabText]}>
              Notificaciones
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, showTabs === 'payment' && styles.activeTab]}
            onPress={() => setShowTabs('payment')}
          >
            <MaterialCommunityIcons 
              name="credit-card" 
              size={20} 
              color={showTabs === 'payment' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text style={[styles.tabText, showTabs === 'payment' && styles.activeTabText]}>
              Pagos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, showTabs === 'security' && styles.activeTab]}
            onPress={() => setShowTabs('security')}
          >
            <MaterialCommunityIcons 
              name="shield-check" 
              size={20} 
              color={showTabs === 'security' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text style={[styles.tabText, showTabs === 'security' && styles.activeTabText]}>
              Seguridad
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, showTabs === 'language' && styles.activeTab]}
            onPress={() => setShowTabs('language')}
          >
            <MaterialCommunityIcons 
              name="earth" 
              size={20} 
              color={showTabs === 'language' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text style={[styles.tabText, showTabs === 'language' && styles.activeTabText]}>
              Idioma
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <ScrollView style={styles.content}>
        {renderTab()}
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
  tabsContainer: {
    backgroundColor: COLORS.white,
    marginBottom: 15,
  },
  tabsScrollContent: {
    paddingHorizontal: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary + '20', // Add 20% opacity
  },
  tabText: {
    marginLeft: 6,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  card: {
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.text,
  },
  divider: {
    marginVertical: 15,
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
    marginTop: 10,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  actionButton: {
    marginLeft: 10,
  },
  marginTop: {
    marginTop: 15,
  },
  profilePictureSection: {
    marginTop: 10,
  },
  profilePictureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePictureButtons: {
    marginLeft: 15,
  },
  uploadButton: {
    marginBottom: 6,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  paymentCard: {
    marginBottom: 15,
  },
  paymentCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDetails: {
    marginLeft: 10,
  },
  paymentTitle: {
    fontWeight: '500',
  },
  paymentSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  paymentActions: {
    flexDirection: 'row',
  },
  addPaymentButton: {
    marginTop: 5,
  },
  infoBox: {
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#795548',
  },
});

export default SettingsScreen;