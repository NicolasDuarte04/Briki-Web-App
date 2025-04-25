import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { 
  Card, 
  TextInput, 
  Button, 
  Checkbox, 
  Chip, 
  Divider, 
  ActivityIndicator, 
  Snackbar,
  HelperText
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useMutation } from 'react-query';

import { MainStackParamList } from '../navigation/AppNavigator';
import { Trip } from '../types/insurance';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { COLORS } from '../utils/theme';

type TripInfoScreenNavigationProp = StackNavigationProp<MainStackParamList, 'TripInfo'>;

const TripInfoScreen = () => {
  const navigation = useNavigation<TripInfoScreenNavigationProp>();
  const { user } = useAuth();
  
  // Form state
  const [origin, setOrigin] = useState<string>('colombia');
  const [destination, setDestination] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now
  const [travelers, setTravelers] = useState<string>('1');
  const [primaryAge, setPrimaryAge] = useState<string>('30');
  const [hasMedicalConditions, setHasMedicalConditions] = useState<boolean>(false);
  const [priorities, setPriorities] = useState<string[]>([]);
  
  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // UI state
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [snackVisible, setSnackVisible] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>('');

  // Create trip mutation
  const createTripMutation = useMutation<Trip, Error, Omit<Trip, 'id' | 'createdAt'>>(
    async (tripData) => {
      const response = await api.post('/api/trips', tripData);
      return response.data;
    },
    {
      onSuccess: () => {
        setSnackMessage('Información del viaje guardada correctamente');
        setSnackVisible(true);
        
        // Navigate to insurance plans screen after a short delay
        setTimeout(() => {
          navigation.navigate('InsurancePlans');
        }, 1500);
      },
      onError: (error) => {
        setSnackMessage('Error al guardar la información del viaje: ' + error.message);
        setSnackVisible(true);
      }
    }
  );

  // Destination options
  const destinations = [
    { label: 'Seleccionar destino', value: '' },
    { label: 'Estados Unidos', value: 'estados_unidos' },
    { label: 'España', value: 'espana' },
    { label: 'México', value: 'mexico' },
    { label: 'Japón', value: 'japon' },
    { label: 'Italia', value: 'italia' },
    { label: 'Francia', value: 'francia' },
    { label: 'Reino Unido', value: 'reino_unido' },
    { label: 'Alemania', value: 'alemania' },
    { label: 'Brasil', value: 'brasil' },
    { label: 'Argentina', value: 'argentina' },
    { label: 'Chile', value: 'chile' },
    { label: 'Perú', value: 'peru' },
  ];

  // Priority options
  const priorityOptions = [
    { label: 'Cobertura médica', value: 'medical' },
    { label: 'Cancelación de viaje', value: 'cancellation' },
    { label: 'Equipaje', value: 'baggage' },
    { label: 'Deportes extremos', value: 'extreme_sports' },
    { label: 'Mejor precio', value: 'best_price' },
  ];

  // Handle date changes
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      
      // If end date is before start date, update end date
      if (endDate < selectedDate) {
        setEndDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)); // 1 day after start date
      }
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  // Toggle priority selection
  const togglePriority = (value: string) => {
    if (priorities.includes(value)) {
      setPriorities(priorities.filter(p => p !== value));
    } else {
      setPriorities([...priorities, value]);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!destination) {
      newErrors.destination = 'Por favor selecciona un destino';
    }
    
    if (isNaN(parseInt(travelers)) || parseInt(travelers) < 1) {
      newErrors.travelers = 'El número de viajeros debe ser al menos 1';
    }
    
    if (endDate <= startDate) {
      newErrors.endDate = 'La fecha de regreso debe ser posterior a la fecha de salida';
    }
    
    if (isNaN(parseInt(primaryAge)) || parseInt(primaryAge) < 1) {
      newErrors.primaryAge = 'Por favor ingresa una edad válida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (!user?.id) {
      setSnackMessage('Debes iniciar sesión para guardar tu viaje');
      setSnackVisible(true);
      return;
    }
    
    const tripData: Omit<Trip, 'id' | 'createdAt'> = {
      userId: user.id,
      origin,
      destination,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      travelers: parseInt(travelers),
      primaryAge: parseInt(primaryAge),
      hasMedicalConditions,
      priorities,
    };
    
    createTripMutation.mutate(tripData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Información del Viaje</Text>
            <Text style={styles.headerSubtitle}>
              Necesitamos algunos detalles para recomendarte el mejor seguro para tu viaje
            </Text>
          </View>
          
          <Card style={styles.formCard}>
            <Card.Content>
              {/* Origin */}
              <Text style={styles.inputLabel}>País de Origen</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={origin}
                  onValueChange={(value) => setOrigin(value)}
                  style={styles.picker}
                  enabled={!createTripMutation.isLoading}
                >
                  <Picker.Item label="Colombia" value="colombia" />
                  <Picker.Item label="México" value="mexico" />
                  <Picker.Item label="Argentina" value="argentina" />
                  <Picker.Item label="Chile" value="chile" />
                  <Picker.Item label="Perú" value="peru" />
                </Picker>
              </View>
              
              {/* Destination */}
              <Text style={styles.inputLabel}>País de Destino</Text>
              <View style={[styles.pickerContainer, errors.destination ? styles.inputError : null]}>
                <Picker
                  selectedValue={destination}
                  onValueChange={(value) => setDestination(value)}
                  style={styles.picker}
                  enabled={!createTripMutation.isLoading}
                >
                  {destinations.map((item) => (
                    <Picker.Item key={item.value} label={item.label} value={item.value} />
                  ))}
                </Picker>
              </View>
              {errors.destination && (
                <HelperText type="error" visible={!!errors.destination}>
                  {errors.destination}
                </HelperText>
              )}
              
              {/* Trip Dates */}
              <View style={styles.dateContainer}>
                <View style={styles.dateInput}>
                  <Text style={styles.inputLabel}>Fecha de Salida</Text>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowStartDatePicker(true)}
                    disabled={createTripMutation.isLoading}
                  >
                    <Text style={styles.dateText}>
                      {startDate.toLocaleDateString()}
                    </Text>
                    <MaterialCommunityIcons name="calendar" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.dateInput}>
                  <Text style={styles.inputLabel}>Fecha de Regreso</Text>
                  <TouchableOpacity 
                    style={[styles.dateButton, errors.endDate ? styles.inputError : null]}
                    onPress={() => setShowEndDatePicker(true)}
                    disabled={createTripMutation.isLoading}
                  >
                    <Text style={styles.dateText}>
                      {endDate.toLocaleDateString()}
                    </Text>
                    <MaterialCommunityIcons name="calendar" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                  {errors.endDate && (
                    <HelperText type="error" visible={!!errors.endDate}>
                      {errors.endDate}
                    </HelperText>
                  )}
                </View>
              </View>
              
              {/* Date Pickers - Only shown when needed */}
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                  minimumDate={new Date()}
                />
              )}
              
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
                  minimumDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)} // 1 day after start date
                />
              )}
              
              {/* Travelers */}
              <Text style={styles.inputLabel}>Número de Viajeros</Text>
              <TextInput
                value={travelers}
                onChangeText={setTravelers}
                keyboardType="numeric"
                style={styles.textInput}
                mode="outlined"
                error={!!errors.travelers}
                disabled={createTripMutation.isLoading}
              />
              {errors.travelers && (
                <HelperText type="error" visible={!!errors.travelers}>
                  {errors.travelers}
                </HelperText>
              )}
              
              {/* Age */}
              <Text style={styles.inputLabel}>Edad del Viajero Principal</Text>
              <TextInput
                value={primaryAge}
                onChangeText={setPrimaryAge}
                keyboardType="numeric"
                style={styles.textInput}
                mode="outlined"
                error={!!errors.primaryAge}
                disabled={createTripMutation.isLoading}
              />
              {errors.primaryAge && (
                <HelperText type="error" visible={!!errors.primaryAge}>
                  {errors.primaryAge}
                </HelperText>
              )}
              
              {/* Medical Conditions */}
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={hasMedicalConditions ? 'checked' : 'unchecked'}
                  onPress={() => setHasMedicalConditions(!hasMedicalConditions)}
                  disabled={createTripMutation.isLoading}
                />
                <Text style={styles.checkboxLabel}>
                  Tengo condiciones médicas preexistentes
                </Text>
              </View>
              
              {/* Priorities */}
              <Text style={styles.inputLabel}>¿Qué es más importante para ti? (opcional)</Text>
              <View style={styles.prioritiesContainer}>
                {priorityOptions.map((priority) => (
                  <Chip
                    key={priority.value}
                    selected={priorities.includes(priority.value)}
                    onPress={() => togglePriority(priority.value)}
                    style={[
                      styles.priorityChip,
                      priorities.includes(priority.value) ? styles.selectedChip : null
                    ]}
                    textStyle={priorities.includes(priority.value) ? styles.selectedChipText : null}
                    disabled={createTripMutation.isLoading}
                  >
                    {priority.label}
                  </Chip>
                ))}
              </View>
            </Card.Content>
            
            <Divider style={styles.divider} />
            
            <Card.Actions style={styles.cardActions}>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
                disabled={createTripMutation.isLoading}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                loading={createTripMutation.isLoading}
                disabled={createTripMutation.isLoading}
              >
                Continuar
              </Button>
            </Card.Actions>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={3000}
      >
        {snackMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  formCard: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 15,
    color: COLORS.text,
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        paddingHorizontal: 10,
      },
    }),
  },
  picker: {
    height: 50,
    width: '100%',
  },
  textInput: {
    backgroundColor: COLORS.white,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    width: '48%',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    padding: 12,
    backgroundColor: COLORS.white,
  },
  dateText: {
    color: COLORS.text,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: COLORS.text,
    flex: 1,
  },
  prioritiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  priorityChip: {
    margin: 4,
    backgroundColor: COLORS.background,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
  },
  selectedChipText: {
    color: COLORS.white,
  },
  divider: {
    marginVertical: 15,
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
});

export default TripInfoScreen;