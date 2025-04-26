import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { 
  Card, 
  Button, 
  TextInput, 
  Divider, 
  List, 
  Checkbox
} from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useQuery, useMutation } from 'react-query';

import { MainStackParamList } from '../navigation/AppNavigator';
import { InsurancePlan, Trip } from '../types/insurance';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { COLORS } from '../utils/theme';

type CheckoutScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Checkout'>;
type CheckoutScreenRouteProp = RouteProp<MainStackParamList, 'Checkout'>;

const CheckoutScreen = () => {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const route = useRoute<CheckoutScreenRouteProp>();
  const { user } = useAuth();
  const { planId } = route.params;
  
  // States
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  
  // Fetch insurance plan
  const { 
    data: plan, 
    isLoading: isPlanLoading, 
    isError: isPlanError 
  } = useQuery<InsurancePlan>(
    ['plan', planId], 
    async () => {
      const response = await api.get(`/api/insurance-plans/${planId}`);
      return response.data;
    }
  );
  
  // Fetch user's trips
  const { 
    data: trips, 
    isLoading: isTripsLoading, 
    isError: isTripsError 
  } = useQuery<Trip[]>(
    ['trips'], 
    async () => {
      const response = await api.get('/api/trips');
      return response.data;
    },
    {
      enabled: !!user,
    }
  );
  
  // Create order mutation
  const createOrderMutation = useMutation(
    async () => {
      if (!selectedTrip || !plan) {
        throw new Error('Información faltante');
      }
      
      const response = await api.post('/api/orders', {
        planId: plan.id,
        tripId: selectedTrip.id,
        totalPrice: calculateTotalPrice(),
      });
      
      return response.data;
    },
    {
      onSuccess: () => {
        // Show success message and navigate to home
        Alert.alert(
          '¡Compra exitosa!',
          'Tu seguro de viaje ha sido adquirido exitosamente. Recibirás los detalles en tu correo electrónico.',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Main') 
            }
          ]
        );
      },
      onError: (error: any) => {
        Alert.alert(
          'Error',
          error.message || 'Hubo un error al procesar tu compra. Por favor intenta de nuevo.',
          [{ text: 'OK' }]
        );
      }
    }
  );
  
  // Set initial values
  useEffect(() => {
    if (user) {
      setName(user.username);
      setEmail(user.email || '');
    }
    
    if (trips && trips.length > 0) {
      setSelectedTrip(trips[0]);
    }
  }, [user, trips]);
  
  // Format functions
  const formatCardNumber = (value: string) => {
    // Remove non digits
    const cleaned = value.replace(/\D/g, '');
    // Limit to 16 digits
    const limited = cleaned.substring(0, 16);
    // Format with spaces
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    return formatted;
  };
  
  const formatExpiryDate = (value: string) => {
    // Remove non digits
    const cleaned = value.replace(/\D/g, '');
    // Limit to 4 digits
    const limited = cleaned.substring(0, 4);
    
    if (limited.length > 2) {
      return limited.substring(0, 2) + '/' + limited.substring(2);
    }
    
    return limited;
  };
  
  // Handle card number input
  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };
  
  // Handle expiry date input
  const handleExpiryDateChange = (text: string) => {
    const formatted = formatExpiryDate(text);
    setExpiryDate(formatted);
  };
  
  // Calculate total price
  const calculateTotalPrice = (): number => {
    if (!plan || !selectedTrip) return 0;
    
    const duration = Math.ceil(
      (new Date(selectedTrip.endDate).getTime() - new Date(selectedTrip.startDate).getTime()) 
      / (1000 * 60 * 60 * 24)
    );
    
    const travelers = selectedTrip.travelers || 1;
    
    return plan.basePrice * duration * travelers;
  };
  
  // Check if form is valid
  const isFormValid = (): boolean => {
    return (
      name.trim() !== '' &&
      email.trim() !== '' &&
      cardNumber.replace(/\s/g, '').length === 16 &&
      expiryDate.length === 5 &&
      cvv.length === 3 &&
      termsAccepted &&
      !!selectedTrip
    );
  };
  
  // Handle checkout
  const handleCheckout = () => {
    if (!isFormValid()) {
      Alert.alert(
        'Información incompleta',
        'Por favor completa todos los campos requeridos.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Show confirmation dialog
    Alert.alert(
      'Confirmar compra',
      `¿Estás seguro que deseas adquirir el seguro de viaje por ${formatPrice(calculateTotalPrice())}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => createOrderMutation.mutate() }
      ]
    );
  };
  
  // Format price
  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
  };
  
  // Loading state
  if (isPlanLoading || isTripsLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando información del seguro...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Error state
  if (isPlanError || isTripsError || !plan) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={50} color={COLORS.error} />
          <Text style={styles.errorText}>Error al cargar la información necesaria</Text>
          <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
            Volver
          </Button>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Finalizar Compra</Text>
        </View>
        
        {/* Plan Summary */}
        <Card style={styles.planCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Resumen del Seguro</Text>
            
            <View style={styles.planHeader}>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{plan.provider}</Text>
                <Text style={styles.planName}>{plan.name}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Precio base</Text>
                <Text style={styles.priceValue}>{formatPrice(plan.basePrice)}</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.coverageItem}>
              <View style={styles.coverageLabelContainer}>
                <MaterialCommunityIcons name="medical-bag" size={16} color={COLORS.primary} />
                <Text style={styles.coverageLabel}>Cobertura Médica</Text>
              </View>
              <Text style={styles.coverageValue}>
                {plan.medicalCoverage >= 1000000 
                  ? `$${(plan.medicalCoverage / 1000000).toFixed(1)}M` 
                  : `$${(plan.medicalCoverage / 1000).toFixed(0)}K`}
              </Text>
            </View>
            
            <View style={styles.coverageItem}>
              <View style={styles.coverageLabelContainer}>
                <MaterialCommunityIcons name="calendar-remove" size={16} color={COLORS.primary} />
                <Text style={styles.coverageLabel}>Cancelación</Text>
              </View>
              <Text style={styles.coverageValue}>
                {typeof plan.tripCancellation === 'string' 
                  ? plan.tripCancellation 
                  : 'Incluido'}
              </Text>
            </View>
            
            <View style={styles.coverageItem}>
              <View style={styles.coverageLabelContainer}>
                <MaterialCommunityIcons name="bag-checked" size={16} color={COLORS.primary} />
                <Text style={styles.coverageLabel}>Equipaje</Text>
              </View>
              <Text style={styles.coverageValue}>{formatPrice(plan.baggageProtection)}</Text>
            </View>
            
            {plan.adventureActivities && (
              <View style={styles.featuresContainer}>
                <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.success} />
                <Text style={styles.featureText}>Deportes de aventura incluidos</Text>
              </View>
            )}
            
            {plan.emergencyEvacuation && (
              <View style={styles.featuresContainer}>
                <MaterialCommunityIcons name="ambulance" size={20} color={COLORS.success} />
                <Text style={styles.featureText}>Evacuación de emergencia incluida</Text>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Trip Selection */}
        <Card style={styles.formCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Seleccionar Viaje</Text>
            
            {trips && trips.length > 0 ? (
              <List.Section>
                {trips.map(trip => (
                  <List.Item
                    key={trip.id}
                    title={`${trip.origin} → ${trip.destination}`}
                    description={`${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()} (${trip.travelers} viajeros)`}
                    left={() => <List.Icon icon="airplane" />}
                    right={() => (
                      <RadioButton
                        value={trip.id.toString()}
                        status={selectedTrip?.id === trip.id ? 'checked' : 'unchecked'}
                        onPress={() => setSelectedTrip(trip)}
                      />
                    )}
                    onPress={() => setSelectedTrip(trip)}
                    style={selectedTrip?.id === trip.id ? styles.selectedTrip : {}}
                  />
                ))}
              </List.Section>
            ) : (
              <View style={styles.noTripsContainer}>
                <Text style={styles.noTripsText}>
                  No tienes viajes registrados. Debes crear un viaje primero.
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => navigation.navigate('TripInfo')}
                  style={styles.createTripButton}
                >
                  Crear Viaje
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Payment Form */}
        <Card style={styles.formCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Información de Pago</Text>
            
            <TextInput
              label="Nombre completo"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <View style={styles.cardContainer}>
              <View style={styles.cardNumberContainer}>
                <TextInput
                  label="Número de tarjeta"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={19} // 16 digits + 3 spaces
                  left={<TextInput.Icon icon="credit-card" />}
                />
              </View>
            </View>
            
            <View style={styles.cardDetailsContainer}>
              <TextInput
                label="Fecha (MM/YY)"
                value={expiryDate}
                onChangeText={handleExpiryDateChange}
                mode="outlined"
                style={[styles.input, styles.cardDetail]}
                keyboardType="numeric"
                maxLength={5} // MM/YY
              />
              
              <TextInput
                label="CVV"
                value={cvv}
                onChangeText={setCvv}
                mode="outlined"
                style={[styles.input, styles.cardDetail]}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity 
              style={styles.termsContainer} 
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <Checkbox
                status={termsAccepted ? 'checked' : 'unchecked'}
                onPress={() => setTermsAccepted(!termsAccepted)}
              />
              <Text style={styles.termsText}>
                Acepto los términos y condiciones del seguro de viaje
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
        
        {/* Order Summary */}
        <Card style={styles.formCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
            
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryLabel}>Destino</Text>
              <Text style={styles.orderSummaryValue}>{selectedTrip?.destination || '-'}</Text>
            </View>
            
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryLabel}>Fechas</Text>
              <Text style={styles.orderSummaryValue}>
                {selectedTrip 
                  ? `${new Date(selectedTrip.startDate).toLocaleDateString()} - ${new Date(selectedTrip.endDate).toLocaleDateString()}` 
                  : '-'}
              </Text>
            </View>
            
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryLabel}>Viajeros</Text>
              <Text style={styles.orderSummaryValue}>{selectedTrip?.travelers || '-'}</Text>
            </View>
            
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryLabel}>Duración</Text>
              <Text style={styles.orderSummaryValue}>
                {selectedTrip 
                  ? `${Math.ceil((new Date(selectedTrip.endDate).getTime() - new Date(selectedTrip.startDate).getTime()) / (1000 * 60 * 60 * 24))} días` 
                  : '-'}
              </Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total a pagar</Text>
              <Text style={styles.totalValue}>{formatPrice(calculateTotalPrice())}</Text>
            </View>
          </Card.Content>
          
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="outlined" 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              disabled={createOrderMutation.isLoading}
            >
              Volver
            </Button>
            <Button 
              mode="contained" 
              onPress={handleCheckout}
              style={styles.checkoutButton}
              loading={createOrderMutation.isLoading}
              disabled={createOrderMutation.isLoading || !isFormValid()}
            >
              Confirmar Compra
            </Button>
          </Card.Actions>
        </Card>
        
        <View style={styles.secureInfoContainer}>
          <MaterialCommunityIcons name="shield-lock" size={16} color={COLORS.textSecondary} />
          <Text style={styles.secureInfoText}>
            Tus datos de pago están protegidos con encriptación de grado bancario.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Import RadioButton here to avoid TypeScript errors in the React Native type definitions
import { RadioButton } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    color: COLORS.error,
    textAlign: 'center',
  },
  backButton: {
    marginRight: 10,
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
  planCard: {
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  formCard: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.text,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  planName: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  divider: {
    marginVertical: 10,
  },
  coverageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  coverageLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverageLabel: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 6,
  },
  coverageValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  featuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
    paddingVertical: 4,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  selectedTrip: {
    backgroundColor: COLORS.primaryLight + '20',
  },
  noTripsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noTripsText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  createTripButton: {
    backgroundColor: COLORS.primary,
  },
  input: {
    marginBottom: 15,
    backgroundColor: COLORS.white,
  },
  cardContainer: {
    flexDirection: 'row',
  },
  cardNumberContainer: {
    flex: 1,
  },
  cardDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDetail: {
    width: '48%',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  termsText: {
    flex: 1,
    marginLeft: 5,
    fontSize: 14,
    color: COLORS.text,
  },
  orderSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  orderSummaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  orderSummaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardActions: {
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 15,
  },
  checkoutButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
  },
  secureInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginBottom: 20,
  },
  secureInfoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 5,
    textAlign: 'center',
  },
});

export default CheckoutScreen;