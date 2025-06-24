/**
 * Utility functions for formatting values in the Briki application
 */

/**
 * Formats a value based on its field type
 * @param value - The value to format
 * @param fieldType - The type of field (used to determine formatting)
 * @returns Formatted string representation of the value
 */
export const formatFieldValue = (value: any, fieldType: string): string => {
  // Handle undefined or null values
  if (value === undefined || value === null) {
    return 'N/A';
  }

  // Format based on field type
  switch (fieldType) {
    case 'basePrice':
      return formatPrice(value);
    
    case 'coverageAmount':
      return formatCoverage(value);
      
    case 'boolean':
    case 'coversMedical':
    case 'coversCancellation':
    case 'coversValuables':
    case 'comprehensive':
    case 'roadside':
    case 'coversIllness':
    case 'coversAccident':
    case 'coversPreventive':
    case 'coversEmergency':
    case 'coversSpecialist':
      return formatBoolean(value);
      
    case 'maxTripDuration':
      return `${value} days`;
      
    case 'array':
    case 'destinations':
    case 'vehicleTypes':
    case 'petTypes':
    case 'features':
      return formatArray(value);
      
    default:
      // If the value is an array but not caught by specific types
      if (Array.isArray(value)) {
        return formatArray(value);
      }
      
      // If the value is a boolean but not caught by specific types
      if (typeof value === 'boolean') {
        return formatBoolean(value);
      }
      
      // For numbers, add commas for thousands
      if (typeof value === 'number') {
        return value.toLocaleString();
      }
      
      // Default to string representation
      return String(value);
  }
};

/**
 * Formats a price value with currency symbol
 * @param price - The price to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Formats a coverage amount with currency symbol
 * @param coverage - The coverage amount to format
 * @returns Formatted coverage string
 */
export const formatCoverage = (coverage: number): string => {
  if (coverage >= 1000000) {
    return `$${(coverage / 1000000).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    })}M`;
  } else if (coverage >= 1000) {
    return `$${(coverage / 1000).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    })}K`;
  } else {
    return formatPrice(coverage);
  }
};

/**
 * Formats a boolean value into a user-friendly string
 * @param value - The boolean value to format
 * @returns Formatted boolean string
 */
export const formatBoolean = (value: boolean): string => {
  return value ? '✓ Included' : '✗ Not included';
};

/**
 * Formats an array into a comma-separated string
 * @param array - The array to format
 * @returns Formatted array string
 */
export const formatArray = (array: any[]): string => {
  if (!Array.isArray(array) || array.length === 0) {
    return 'None';
  }
  
  return array.join(', ');
};

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    // Special handling for COP and MXN for better formatting
    if (currency === 'COP') {
      locale = 'es-CO';
    } else if (currency === 'MXN') {
      locale = 'es-MX';
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    console.warn(`Could not format currency for ${currency}:`, error);
    // Fallback for unknown currencies
    return `$${Math.round(amount).toLocaleString()} ${currency}`;
  }
}