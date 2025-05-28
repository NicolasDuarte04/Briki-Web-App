import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Animated,
  SafeAreaView,
  Alert
} from 'react-native';
import { TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { ThemedText } from '@/components/ThemedText';
import { fonts } from '@/constants/Styles';
import { countries } from '@/utils/countries';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import { useThemeColor } from '../hooks/useThemeColor';
import { useThemeContext } from '../context/ThemeContext';

const countryOptions = Array.isArray(countries) 
  ? countries.map(country => ({
      label: country.name,
      value: country.code
    }))
  : [];

const COVERAGE_OPTIONS = [
  { id: 'medical', label: 'Medical Coverage' },
  { id: 'cancellation', label: 'Trip Cancellation' },
  { id: 'baggage', label: 'Baggage Loss' },
  { id: 'delay', label: 'Trip Delay' },
];

export default function TripInfoScreen() {
  const router = useRouter();
  const { theme } = useThemeContext();
  const isDarkMode = theme === 'dark';
  
  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'border');
  const accentColor = useThemeColor({}, 'accent');
  const placeholderColor = useThemeColor({}, 'placeholder');
  
  // Brand colors
  const BRAND = {
    primary: '#4B76E5',
    primaryDark: '#3D68D8',
    secondary: '#F8B400',
    success: '#34C759',
    danger: '#FF3B30',
  };
  
  // Compute derived colors for dark mode
  const primaryTransparent = isDarkMode 
    ? 'rgba(75, 118, 229, 0.2)'
    : 'rgba(75, 118, 229, 0.1)';
  const switchTrackColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#D1D1D6';
  const switchThumbColor = isDarkMode ? '#222' : 'white';
  const counterBgColor = isDarkMode ? '#3D68D8' : '#4B76E5';
  const counterDisabledColor = isDarkMode ? 'rgba(75, 118, 229, 0.5)' : '#B1C3F2';
  
  const [originCountry, setOriginCountry] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 7))
  );
  const [travelers, setTravelers] = useState(1);
  const [primaryAge, setPrimaryAge] = useState('');
  const [ageError, setAgeError] = useState('');
  const [hasMedicalConditions, setHasMedicalConditions] = useState(false);
  const [coveragePriorities, setCoveragePriorities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState({
    departure: false,
    return: false
  });
  
  // Animation
  const buttonScale = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleDateChange = (type: 'departure' | 'return', date: Date | undefined) => {
    if (!date) return;

    if (type === 'departure') {
      setDepartureDate(date);
      // If return date is before the new departure date, adjust it
      if (returnDate < date) {
        // Set return date to departure date + 1 day
        const newReturnDate = new Date(date);
        newReturnDate.setDate(date.getDate() + 1);
        setReturnDate(newReturnDate);
      }
    } else {
      setReturnDate(date);
    }
    setShowDatePicker({ departure: false, return: false });
  };

  // Check for age validation
  useEffect(() => {
    if (primaryAge) {
      const age = parseInt(primaryAge, 10);
      if (age <= 17) {
        setAgeError('Travelers must be 18 years or older to purchase insurance.');
      } else {
        setAgeError('');
      }
    } else {
      setAgeError('');
    }
  }, [primaryAge]);

  const isFormValid = () => {
    return originCountry && 
           destinationCountry && 
           departureDate && 
           returnDate && 
           primaryAge && 
           !ageError;
  };

  useEffect(() => {
    // Button animation when form validity changes
    Animated.spring(buttonScale, {
      toValue: isFormValid() ? 1 : 0.97,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [originCountry, destinationCountry, departureDate, returnDate, primaryAge, ageError]);

  const onContinue = async () => {
    if (!isFormValid()) return;
    
    // Age restriction check
    const age = parseInt(primaryAge, 10);
    if (age <= 17) {
      if (Platform.OS === 'web') {
        alert('You must be 18 years or older to purchase travel insurance.');
      } else {
        Alert.alert(
          'Age Restriction',
          'You must be 18 years or older to purchase travel insurance.',
          [{ text: 'OK', style: 'default' }]
        );
      }
      return;
    }

    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLoading(true);
    try {
      router.push({
        pathname: '/available-plans',
        params: {
          fromCountry: originCountry,
          toCountry: destinationCountry,
          departureDate: departureDate.toISOString(),
          returnDate: returnDate.toISOString(),
          travelers: travelers.toString(),
          primaryAge,
          hasMedicalConditions: hasMedicalConditions ? '1' : '0',
          coveragePriorities: coveragePriorities.join(',')
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderDatePicker = (type: 'departure' | 'return') => {
    const date = type === 'departure' ? departureDate : returnDate;
    const show = type === 'departure' ? showDatePicker.departure : showDatePicker.return;

    return (
      <View style={styles.datePickerContainer}>
        <ThemedText style={styles.dateLabel}>
          {type === 'departure' ? 'Departure Date' : 'Return Date'}
        </ThemedText>
        <TouchableOpacity 
          style={styles.dateInputContainer}
          onPress={() => {
            // Close other date picker if open
            setShowDatePicker({
              departure: type === 'departure' ? !showDatePicker.departure : false,
              return: type === 'return' ? !showDatePicker.return : false
            });
            
            // Scroll to make date picker visible if opened
            if (type === 'return' && !showDatePicker.return) {
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          }}
          activeOpacity={0.7}>
          <View style={styles.dateContent}>
            <ThemedText style={styles.dateText}>
              {format(date, 'MMM dd, yyyy')}
            </ThemedText>
            <Ionicons 
              name="calendar-outline" 
              size={22} 
              color="#4B76E5" 
              style={styles.calendarIcon} 
            />
          </View>
        </TouchableOpacity>

        {Platform.OS !== 'web' && show && (
          <View style={styles.nativeDatePickerContainer}>
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? "inline" : "default"}
              onChange={(event, selectedDate) => {
                handleDateChange(type, selectedDate);
              }}
              minimumDate={
                type === 'return' 
                  ? new Date(departureDate.getTime() + 86400000) // departure + 1 day
                  : new Date()
              }
            />
          </View>
        )}

        {Platform.OS === 'web' && show && (
          <input
            type="date"
            value={format(date, 'yyyy-MM-dd')}
            min={
              type === 'return' 
                ? format(new Date(departureDate.getTime() + 86400000), 'yyyy-MM-dd')
                : format(new Date(), 'yyyy-MM-dd')
            }
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              handleDateChange(type, newDate);
            }}
            style={styles.webDateInput}
          />
        )}
      </View>
    );
  };

  const toggleCoveragePriority = (id: string) => {
    setCoveragePriorities(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <ScrollView 
        ref={scrollViewRef}
        style={[styles.container, { backgroundColor }]} 
        contentContainerStyle={styles.scrollContentContainer}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={24} color="#4B76E5" />
              </TouchableOpacity>
              <ThemedText style={styles.header}>Trip Details</ThemedText>
            </View>

            <View style={styles.form}>
              <View style={styles.section}>
                <ThemedText style={styles.sectionLabel}>Origin & Destination</ThemedText>
                <View style={styles.dropdownContainer}>
                  <ThemedText style={styles.inputLabel}>Country of Origin</ThemedText>
                  <RNPickerSelect
                    onValueChange={value => setOriginCountry(value || '')}
                    items={countryOptions}
                    value={originCountry || ''}
                    placeholder={{ label: 'Select Origin Country', value: '' }}
                    style={pickerSelectStyles}
                    Icon={() => <Ionicons name="chevron-down" size={20} color="#4B76E5" />}
                  />
                </View>

                <View style={styles.dropdownContainer}>
                  <ThemedText style={styles.inputLabel}>Destination</ThemedText>
                  <RNPickerSelect
                    onValueChange={value => setDestinationCountry(value || '')}
                    items={countryOptions}
                    value={destinationCountry || ''}
                    placeholder={{ label: 'Select Destination Country', value: '' }}
                    style={pickerSelectStyles}
                    Icon={() => <Ionicons name="chevron-down" size={20} color="#4B76E5" />}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <ThemedText style={styles.sectionLabel}>Travel Dates</ThemedText>
                {renderDatePicker('departure')}
                {renderDatePicker('return')}
              </View>

              <View style={styles.section}>
                <ThemedText style={styles.sectionLabel}>Travelers</ThemedText>
                <ThemedText style={styles.inputLabel}>Number of Travelers</ThemedText>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={[styles.counterButton, travelers <= 1 && styles.counterButtonDisabled]}
                    onPress={() => setTravelers(Math.max(1, travelers - 1))}
                    disabled={travelers <= 1}
                    activeOpacity={0.7}>
                    <ThemedText style={styles.counterButtonText}>-</ThemedText>
                  </TouchableOpacity>
                  <ThemedText style={styles.counterText}>{travelers}</ThemedText>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setTravelers(travelers + 1)}
                    activeOpacity={0.7}>
                    <ThemedText style={styles.counterButtonText}>+</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.section}>
                <ThemedText style={styles.sectionLabel}>Primary Traveler Details</ThemedText>
                <View style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>Age</ThemedText>
                  <TextInput
                    mode="outlined"
                    value={primaryAge}
                    onChangeText={text => setPrimaryAge(text.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad"
                    style={[styles.textInput, { backgroundColor: cardBackgroundColor }]}
                    placeholder="Enter primary traveler's age"
                    placeholderTextColor={placeholderColor}
                    outlineColor={borderColor}
                    activeOutlineColor={BRAND.primary}
                    contentStyle={[styles.inputContent, { color: textColor }]}
                    error={!!ageError}
                  />
                  {ageError ? (
                    <ThemedText style={styles.errorText}>{ageError}</ThemedText>
                  ) : null}
                </View>

                <View style={styles.toggleContainer}>
                  <View>
                    <ThemedText style={styles.toggleLabel}>Pre-existing Medical Conditions</ThemedText>
                    <ThemedText style={styles.toggleDescription}>
                      This affects coverage eligibility
                    </ThemedText>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.switchTrack,
                      hasMedicalConditions && styles.switchTrackActive
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setHasMedicalConditions(!hasMedicalConditions)}
                  >
                    <Animated.View 
                      style={[
                        styles.switchThumb,
                        hasMedicalConditions && styles.switchThumbActive
                      ]} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.section, styles.lastSection]}>
                <ThemedText style={styles.sectionLabel}>Coverage Priorities</ThemedText>
                <ThemedText style={styles.coverageDescription}>
                  Select what matters most for your coverage
                </ThemedText>
                {COVERAGE_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.checkboxContainer}
                    onPress={() => toggleCoveragePriority(option.id)}
                    activeOpacity={0.7}>
                    <View style={[
                      styles.checkbox,
                      coveragePriorities.includes(option.id) && styles.checkboxChecked
                    ]}>
                      {coveragePriorities.includes(option.id) && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                    <ThemedText style={styles.checkboxLabel}>{option.label}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>

              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  style={[
                    styles.continueButton, 
                    !isFormValid() && styles.continueButtonDisabled
                  ]}
                  onPress={onContinue}
                  disabled={!isFormValid() || isLoading}
                  activeOpacity={0.7}>
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <ThemedText style={styles.continueButtonText}>
                        Find Available Plans
                      </ThemedText>
                      <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8FA',
  },
  webDateInput: {
    height: 45,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    fontSize: 16,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8FA',
  },
  scrollContentContainer: {
    paddingBottom: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(75, 118, 229, 0.1)',
  },
  header: {
    ...fonts.bold,
    fontSize: 28,
    color: '#000000',
  },
  form: {
    gap: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#4B76E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lastSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 18,
    ...fonts.semibold,
    color: '#000000',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    ...fonts.medium,
    color: '#71727A',
    marginBottom: 8,
  },
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 1000,
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    ...fonts.medium,
    color: '#71727A',
    marginBottom: 8,
  },
  dateInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E5E5EA',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
    ...fonts.regular
  },
  calendarIcon: {
    marginLeft: 12,
  },
  nativeDatePickerContainer: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    height: 50,
  },
  inputContent: {
    fontSize: 16,
    ...fonts.regular,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8FA',
    borderRadius: 12,
    padding: 8,
  },
  counterButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4B76E5',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonDisabled: {
    backgroundColor: '#B1C3F2',
  },
  counterButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    ...fonts.bold,
    paddingBottom: Platform.OS === 'ios' ? 2 : 0,
  },
  counterText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    ...fonts.semibold,
    color: '#000000',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8FA',
    padding: 16,
    borderRadius: 12,
  },
  toggleLabel: {
    fontSize: 16,
    ...fonts.medium,
    color: '#000000',
  },
  toggleDescription: {
    fontSize: 13,
    color: '#71727A',
    marginTop: 4,
  },
  switchTrack: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1D1D6',
    padding: 3,
  },
  switchTrackActive: {
    backgroundColor: '#4B76E5',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  coverageDescription: {
    fontSize: 14,
    color: '#71727A',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4B76E5',
    backgroundColor: 'transparent',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4B76E5',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000000',
    ...fonts.medium
  },
  continueButton: {
    backgroundColor: '#4B76E5',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
    shadowColor: '#4B76E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#B1C3F2',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    ...fonts.semibold,
  },
  buttonIcon: {
    marginLeft: 8,
  }
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    color: '#000000',
    paddingRight: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    color: '#000000',
    paddingRight: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    elevation: 1,
  },
  inputWeb: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    color: '#000000',
    paddingRight: 40,
    height: 50,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    top: 15,
    right: 12,
  },
  placeholder: {
    color: '#A0A0A0',
  },
};