import React from 'react';

// Simple test component for web display
export default function TestApp() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#4B76E5',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        Briki Travel Insurance - Test
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: '#333',
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        If you can see this, the basic app structure is working!
      </p>
      
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%',
      }}>
        <h2 style={{
          fontSize: '18px',
          color: '#333',
          marginBottom: '12px',
        }}>
          Weather Risk Test
        </h2>
        
        <p style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '16px',
        }}>
          This is a simplified version of the app to test basic functionality.
        </p>
        
        <button style={{
          backgroundColor: '#4B76E5',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
        }}>
          Test Button
        </button>
      </div>
    </div>
  );
}