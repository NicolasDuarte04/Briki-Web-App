import React from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, FileBarChart, Trash } from 'lucide-react';
import { useCompareStore } from '@/store/compare-store';

// This is a minimal component that doesn't use complex layouts or contexts
export default function ComparePlansSimple() {
  console.log("ComparePlansSimple mounting"); // Debug log
  const [, navigate] = useLocation();
  const { selectedPlans, clearPlans } = useCompareStore();
  
  // Function to go back to insurance plans
  const goBackToPlans = () => {
    navigate('/insurance/travel');
  };

  // Simple styling using inline styles to avoid dependencies
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    heading: {
      fontSize: '24px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    button: {
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      color: '#374151'
    },
    dangerButton: {
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      color: '#b91c1c'
    },
    infoBox: {
      backgroundColor: '#fffbeb',
      border: '1px solid #fef3c7',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px'
    },
    planGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '16px'
    },
    planCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      padding: '16px'
    },
    planHeader: {
      fontWeight: 'bold',
      marginBottom: '8px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header with navigation */}
      <div style={styles.header}>
        <div>
          <button 
            onClick={goBackToPlans} 
            style={styles.button}
          >
            <ArrowLeft size={16} />
            Back to Plans
          </button>
          <h1 style={styles.heading}>
            <FileBarChart size={24} color="#0ea5e9" />
            Comparing {selectedPlans.length} {selectedPlans.length === 1 ? 'Plan' : 'Plans'}
          </h1>
        </div>
        
        <button 
          onClick={() => clearPlans()} 
          style={{...styles.button, ...styles.dangerButton}}
        >
          <Trash size={16} />
          Clear All
        </button>
      </div>
      
      {/* Informational box */}
      <div style={styles.infoBox}>
        <h2 style={styles.planHeader}>Comparison Information</h2>
        <p>Selected plans: {selectedPlans.length}</p>
        <p>Plan IDs: {selectedPlans.map(p => p.id).join(', ') || 'None selected'}</p>
        <p>Categories: {Array.from(new Set(selectedPlans.map(p => p.category))).join(', ') || 'None'}</p>
      </div>
      
      {/* Simple plan display */}
      {selectedPlans.length > 0 ? (
        <div style={styles.planGrid}>
          {selectedPlans.map((plan) => (
            <div key={plan.id} style={styles.planCard}>
              <h3 style={styles.planHeader}>Plan ID: {plan.id}</h3>
              <p>Category: {plan.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.infoBox}>
          <p>No plans selected for comparison. Please go back and select plans to compare.</p>
          <button 
            onClick={goBackToPlans} 
            style={{...styles.button, marginTop: '16px'}}
          >
            Select Plans
          </button>
        </div>
      )}
    </div>
  );
}