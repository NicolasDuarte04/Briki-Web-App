import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

// Combine class names with Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date using date-fns with a default format
export function formatDate(date: Date | string | undefined, formatStr: string = "PP") {
  if (!date) return "N/A";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

// Calculate the number of days between two dates
export function daysBetween(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Reset times to midnight to get full days
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // Calculate the time difference in milliseconds
  const timeDiff = Math.abs(end.getTime() - start.getTime());
  
  // Convert to days and return
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

// Check if a date is within a specified range
export function isDateWithinRange(date: Date, minDate?: Date, maxDate?: Date): boolean {
  const checkDate = new Date(date);
  
  // Check minimum date if provided
  if (minDate && checkDate < minDate) {
    return false;
  }
  
  // Check maximum date if provided
  if (maxDate && checkDate > maxDate) {
    return false;
  }
  
  return true;
}

// Format price with currency symbol
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price);
}

// Generate unique ID with prefix
export function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}