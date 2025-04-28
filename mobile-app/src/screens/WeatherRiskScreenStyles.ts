import { StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS } from '../utils/theme';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerContent: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white + 'DD',
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: width / 2,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  destinationCarouselContainer: {
    marginTop: 15,
    marginBottom: 5,
  },
  carouselLabel: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.text,
  },
  carouselContent: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  destinationItem: {
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDestinationItem: {
    borderColor: COLORS.primary,
  },
  destinationImageContainer: {
    width: 120,
    height: 100,
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: COLORS.grayLight,
    position: 'relative',
  },
  riskIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  destinationName: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  destinationCountry: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimerCard: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  disclaimerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  tripDetailsCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: COLORS.white,
  },
  picker: {
    height: 50,
  },
  weatherCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  destinationContainer: {
    marginTop: 10,
  },
  destinationHeader: {
    marginBottom: 15,
  },
  destinationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  safetyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  safetyScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 5,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  riskCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  riskTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  severityChip: {
    height: 26,
  },
  riskDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 50,
  },
  recommendationCard: {
    backgroundColor: COLORS.white + '20',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginLeft: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  emptyRisksContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginTop: 10,
  },
  emptyRisksText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    padding: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});