import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  FlatList,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { 
  Card, 
  Button, 
  Chip, 
  Divider, 
  ActivityIndicator, 
  Searchbar,
  RadioButton,
  List,
  Modal,
  Portal
} from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useQuery } from 'react-query';

import { MainStackParamList } from '../navigation/AppNavigator';
import { InsurancePlan } from '../types/insurance';
import { api } from '../services/api';
import { COLORS } from '../utils/theme';

type InsurancePlansScreenNavigationProp = StackNavigationProp<MainStackParamList, 'InsurancePlans'>;

const InsurancePlansScreen = () => {
  const navigation = useNavigation<InsurancePlansScreenNavigationProp>();
  
  // State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlans, setSelectedPlans] = useState<number[]>([]);
  const [compareModalVisible, setCompareModalVisible] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'price' | 'coverage' | 'rating'>('price');
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    minCoverage: 0,
    adventureActivities: false,
    covidCoverage: false
  });
  
  // Fetch plans
  const { 
    data: plans, 
    isLoading, 
    isError, 
    refetch
  } = useQuery<InsurancePlan[]>(
    ['plans'], 
    async () => {
      const response = await api.get('/api/insurance-plans');
      return response.data;
    }
  );
  
  // Filter and sort plans
  const filteredPlans = React.useMemo(() => {
    if (!plans) return [];
    
    // Apply search
    let result = plans;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        plan => 
          plan.name.toLowerCase().includes(query) || 
          plan.provider.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters.minCoverage > 0) {
      result = result.filter(plan => plan.medicalCoverage >= filters.minCoverage);
    }
    
    if (filters.adventureActivities) {
      result = result.filter(plan => plan.adventureActivities);
    }
    
    if (filters.covidCoverage) {
      result = result.filter(plan => plan.covidCoverage);
    }
    
    // Sort results
    switch (sortBy) {
      case 'price':
        return [...result].sort((a, b) => a.basePrice - b.basePrice);
      case 'coverage':
        return [...result].sort((a, b) => b.medicalCoverage - a.medicalCoverage);
      case 'rating':
        return [...result].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      default:
        return result;
    }
  }, [plans, searchQuery, sortBy, filters]);
  
  // Toggle plan selection for comparison
  const togglePlanSelection = (planId: number) => {
    if (selectedPlans.includes(planId)) {
      setSelectedPlans(selectedPlans.filter(id => id !== planId));
    } else {
      // Only allow up to 3 plans to be compared
      if (selectedPlans.length < 3) {
        setSelectedPlans([...selectedPlans, planId]);
      }
    }
  };
  
  // Selected plans for comparison
  const plansToCompare = React.useMemo(() => {
    if (!plans) return [];
    return plans.filter(plan => selectedPlans.includes(plan.id));
  }, [plans, selectedPlans]);
  
  // Format price
  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
  };
  
  // Format coverage
  const formatCoverage = (coverage: number): string => {
    return coverage >= 1000000 
      ? `$${(coverage / 1000000).toFixed(1)}M` 
      : `$${(coverage / 1000).toFixed(0)}K`;
  };
  
  // Navigate to checkout
  const goToCheckout = (planId: number) => {
    navigation.navigate('Checkout', { planId });
  };
  
  // Render insurance plan card
  const renderPlanCard = ({ item }: { item: InsurancePlan }) => {
    const isSelected = selectedPlans.includes(item.id);
    
    return (
      <Card style={[styles.planCard, isSelected ? styles.selectedCard : {}]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.providerContainer}>
              {/* This would be an actual image in a real app */}
              <View style={styles.providerLogo}>
                <Text style={styles.providerInitial}>{item.provider.charAt(0)}</Text>
              </View>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{item.provider}</Text>
                <Text style={styles.planName}>{item.name}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.selectButton, isSelected ? styles.selectedButton : {}]}
              onPress={() => togglePlanSelection(item.id)}
            >
              <MaterialCommunityIcons 
                name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"} 
                size={24} 
                color={isSelected ? COLORS.primary : COLORS.gray} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome 
                  key={star}
                  name={parseFloat(item.rating) >= star ? "star" : "star-o"} 
                  size={16} 
                  color={COLORS.secondary} 
                  style={styles.star}
                />
              ))}
            </View>
            <Text style={styles.reviewCount}>({item.reviews})</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.coverageContainer}>
            <View style={styles.coverageItem}>
              <Text style={styles.coverageLabel}>Cobertura Médica</Text>
              <Text style={styles.coverageValue}>{formatCoverage(item.medicalCoverage)}</Text>
            </View>
            
            <View style={styles.coverageItem}>
              <Text style={styles.coverageLabel}>Cancelación</Text>
              <Text style={styles.coverageValue}>
                {typeof item.tripCancellation === 'string' 
                  ? item.tripCancellation 
                  : 'Incluido'}
              </Text>
            </View>
            
            <View style={styles.coverageItem}>
              <Text style={styles.coverageLabel}>Equipaje</Text>
              <Text style={styles.coverageValue}>{formatPrice(item.baggageProtection)}</Text>
            </View>
          </View>
          
          <View style={styles.featuresContainer}>
            {item.adventureActivities && (
              <Chip icon="hiking" style={styles.featureChip}>Deportes</Chip>
            )}
            {item.covidCoverage && (
              <Chip icon="virus" style={styles.featureChip}>COVID-19</Chip>
            )}
            {item.emergencyEvacuation && (
              <Chip icon="helicopter" style={styles.featureChip}>Evacuación</Chip>
            )}
          </View>
        </Card.Content>
        
        <Card.Actions style={styles.cardActions}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio</Text>
            <Text style={styles.priceValue}>{formatPrice(item.basePrice)}</Text>
          </View>
          
          <Button 
            mode="contained" 
            onPress={() => goToCheckout(item.id)}
            style={styles.buyButton}
          >
            Comprar
          </Button>
        </Card.Actions>
      </Card>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Planes de Seguro</Text>
        
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar por nombre o proveedor"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <MaterialCommunityIcons name="filter-variant" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Ordenar por:</Text>
          <View style={styles.sortButtons}>
            <Button 
              mode={sortBy === 'price' ? 'contained' : 'outlined'}
              onPress={() => setSortBy('price')}
              style={styles.sortButton}
              compact
            >
              Precio
            </Button>
            <Button 
              mode={sortBy === 'coverage' ? 'contained' : 'outlined'}
              onPress={() => setSortBy('coverage')}
              style={styles.sortButton}
              compact
            >
              Cobertura
            </Button>
            <Button 
              mode={sortBy === 'rating' ? 'contained' : 'outlined'}
              onPress={() => setSortBy('rating')}
              style={styles.sortButton}
              compact
            >
              Calificación
            </Button>
          </View>
        </View>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando planes de seguro...</Text>
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={50} color={COLORS.error} />
          <Text style={styles.errorText}>Error al cargar los planes de seguro</Text>
          <Button mode="contained" onPress={() => refetch()} style={styles.retryButton}>
            Reintentar
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredPlans}
          renderItem={renderPlanCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.plansList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="shield-off" size={50} color={COLORS.gray} />
              <Text style={styles.emptyText}>
                No se encontraron planes que coincidan con tu búsqueda
              </Text>
              <Button 
                mode="outlined" 
                onPress={() => {
                  setSearchQuery('');
                  setFilters({
                    minCoverage: 0,
                    adventureActivities: false,
                    covidCoverage: false
                  });
                }}
              >
                Limpiar filtros
              </Button>
            </View>
          }
        />
      )}
      
      {/* Compare button */}
      {selectedPlans.length > 1 && (
        <View style={styles.compareButtonContainer}>
          <Button 
            mode="contained" 
            onPress={() => setCompareModalVisible(true)}
            style={styles.compareButton}
            icon="compare"
          >
            Comparar ({selectedPlans.length})
          </Button>
        </View>
      )}
      
      {/* Compare modal */}
      <Portal>
        <Modal
          visible={compareModalVisible}
          onDismiss={() => setCompareModalVisible(false)}
          contentContainerStyle={styles.compareModal}
        >
          <View style={styles.compareModalHeader}>
            <Text style={styles.compareModalTitle}>Comparación de Planes</Text>
            <TouchableOpacity onPress={() => setCompareModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.compareModalContent}>
            {/* Plans header */}
            <View style={styles.compareRow}>
              <View style={styles.compareFeatureCell} />
              {plansToCompare.map((plan) => (
                <View key={plan.id} style={styles.comparePlanCell}>
                  <Text style={styles.comparePlanName} numberOfLines={2}>
                    {plan.provider}: {plan.name}
                  </Text>
                </View>
              ))}
            </View>
            
            <Divider style={styles.compareDivider} />
            
            {/* Price */}
            <View style={styles.compareRow}>
              <View style={styles.compareFeatureCell}>
                <Text style={styles.compareFeatureTitle}>Precio</Text>
              </View>
              {plansToCompare.map((plan) => (
                <View key={plan.id} style={styles.comparePlanCell}>
                  <Text style={styles.comparePlanValue}>{formatPrice(plan.basePrice)}</Text>
                </View>
              ))}
            </View>
            
            {/* Medical Coverage */}
            <View style={styles.compareRow}>
              <View style={styles.compareFeatureCell}>
                <Text style={styles.compareFeatureTitle}>Cobertura Médica</Text>
              </View>
              {plansToCompare.map((plan) => (
                <View key={plan.id} style={styles.comparePlanCell}>
                  <Text style={styles.comparePlanValue}>
                    {formatCoverage(plan.medicalCoverage)}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Trip Cancellation */}
            <View style={styles.compareRow}>
              <View style={styles.compareFeatureCell}>
                <Text style={styles.compareFeatureTitle}>Cancelación</Text>
              </View>
              {plansToCompare.map((plan) => (
                <View key={plan.id} style={styles.comparePlanCell}>
                  <Text style={styles.comparePlanValue}>
                    {typeof plan.tripCancellation === 'string' 
                      ? plan.tripCancellation 
                      : 'Incluido'}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Baggage Protection */}
            <View style={styles.compareRow}>
              <View style={styles.compareFeatureCell}>
                <Text style={styles.compareFeatureTitle}>Equipaje</Text>
              </View>
              {plansToCompare.map((plan) => (
                <View key={plan.id} style={styles.comparePlanCell}>
                  <Text style={styles.comparePlanValue}>
                    {formatPrice(plan.baggageProtection)}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Emergency Evacuation */}
            <View style={styles.compareRow}>
              <View style={styles.compareFeatureCell}>
                <Text style={styles.compareFeatureTitle}>Evacuación</Text>
              </View>
              {plansToCompare.map((plan) => (
                <View key={plan.id} style={styles.comparePlanCell}>
                  <Text style={styles.comparePlanValue}>
                    {plan.emergencyEvacuation 
                      ? formatPrice(plan.emergencyEvacuation) 
                      : 'No incluido'}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Adventure Activities */}
            <View style={styles.compareRow}>
              <View style={styles.compareFeatureCell}>
                <Text style={styles.compareFeatureTitle}>Deportes</Text>
              </View>
              {plansToCompare.map((plan) => (
                <View key={plan.id} style={styles.comparePlanCell}>
                  {plan.adventureActivities ? (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
                  ) : (
                    <Ionicons name="close-circle" size={20} color={COLORS.error} />
                  )}
                </View>
              ))}
            </View>
            
            {/* COVID Coverage */}
            <View style={styles.compareRow}>
              <View style={styles.compareFeatureCell}>
                <Text style={styles.compareFeatureTitle}>COVID-19</Text>
              </View>
              {plansToCompare.map((plan) => (
                <View key={plan.id} style={styles.comparePlanCell}>
                  {plan.covidCoverage ? (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
                  ) : (
                    <Ionicons name="close-circle" size={20} color={COLORS.error} />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
          
          <View style={styles.compareModalActions}>
            <Button 
              mode="outlined" 
              onPress={() => setCompareModalVisible(false)}
              style={styles.compareModalButton}
            >
              Cerrar
            </Button>
          </View>
        </Modal>
      </Portal>
      
      {/* Filter modal */}
      <Portal>
        <Modal
          visible={filterModalVisible}
          onDismiss={() => setFilterModalVisible(false)}
          contentContainerStyle={styles.filterModal}
        >
          <View style={styles.filterModalHeader}>
            <Text style={styles.filterModalTitle}>Filtrar Planes</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterModalContent}>
            <List.Section>
              <List.Subheader>Cobertura Médica Mínima</List.Subheader>
              <RadioButton.Group
                onValueChange={(value) => setFilters({...filters, minCoverage: parseInt(value)})}
                value={filters.minCoverage.toString()}
              >
                <RadioButton.Item label="Cualquiera" value="0" />
                <RadioButton.Item label="Al menos $50,000" value="50000" />
                <RadioButton.Item label="Al menos $100,000" value="100000" />
                <RadioButton.Item label="Al menos $500,000" value="500000" />
                <RadioButton.Item label="Al menos $1,000,000" value="1000000" />
              </RadioButton.Group>
              
              <List.Subheader>Características</List.Subheader>
              <List.Item
                title="Cobertura para Deportes de Aventura"
                left={() => (
                  <List.Icon icon="hiking" />
                )}
                right={() => (
                  <Switch
                    value={filters.adventureActivities}
                    onValueChange={(value) => setFilters({...filters, adventureActivities: value})}
                  />
                )}
              />
              <List.Item
                title="Cobertura para COVID-19"
                left={() => (
                  <List.Icon icon="virus" />
                )}
                right={() => (
                  <Switch
                    value={filters.covidCoverage}
                    onValueChange={(value) => setFilters({...filters, covidCoverage: value})}
                  />
                )}
              />
            </List.Section>
          </View>
          
          <View style={styles.filterModalActions}>
            <Button 
              mode="outlined" 
              onPress={() => {
                setFilters({
                  minCoverage: 0,
                  adventureActivities: false,
                  covidCoverage: false
                });
              }}
              style={styles.filterModalButton}
            >
              Limpiar
            </Button>
            <Button 
              mode="contained" 
              onPress={() => setFilterModalVisible(false)}
              style={styles.filterModalButton}
            >
              Aplicar
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

// Import Switch here to avoid TypeScript errors in the React Native type definitions
import { Switch } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchbar: {
    flex: 1,
    backgroundColor: COLORS.background,
    elevation: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 40,
  },
  filterButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 10,
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    marginRight: 5,
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
  retryButton: {
    backgroundColor: COLORS.primary,
  },
  plansList: {
    padding: 15,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: 20,
  },
  planCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  providerInitial: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
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
  selectButton: {
    padding: 5,
  },
  selectedButton: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  divider: {
    marginVertical: 10,
  },
  coverageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  coverageItem: {
    flex: 1,
    alignItems: 'center',
  },
  coverageLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  coverageValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureChip: {
    margin: 2,
    backgroundColor: COLORS.primaryLight + '20',
  },
  cardActions: {
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  priceContainer: {
    justifyContent: 'center',
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
  buyButton: {
    backgroundColor: COLORS.primary,
  },
  compareButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  compareButton: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 4,
  },
  compareModal: {
    backgroundColor: COLORS.white,
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  compareModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  compareModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  compareModalContent: {
    padding: 15,
  },
  compareRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  compareFeatureCell: {
    width: '35%',
    paddingRight: 10,
  },
  compareFeatureTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  comparePlanCell: {
    flex: 1,
    alignItems: 'center',
  },
  comparePlanName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  comparePlanValue: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
  compareDivider: {
    marginBottom: 15,
  },
  compareModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  compareModalButton: {
    marginLeft: 10,
  },
  filterModal: {
    backgroundColor: COLORS.white,
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  filterModalContent: {
    padding: 15,
  },
  filterModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  filterModalButton: {
    marginLeft: 10,
  },
});

export default InsurancePlansScreen;