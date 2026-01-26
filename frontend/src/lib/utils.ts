import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  const d = new Date(date);

  if (format === 'short') {
    return d.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return d.toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate Kenyan phone number
export function isValidKenyanPhone(phone: string): boolean {
  const phoneRegex = /^(?:254|\+254|0)?(7\d{8})$/;
  return phoneRegex.test(phone);
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  let formatted = phone.replace(/\D/g, '');
  if (formatted.startsWith('0')) {
    formatted = `254${formatted.substring(1)}`;
  } else if (formatted.startsWith('254') === false) {
    formatted = `254${formatted}`;
  }
  return formatted;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generate random ID
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Truncate text
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

// Get file icon based on extension
export function getFileIcon(extension: string): string {
  const icons: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    csv: '📊',
    txt: '📄',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
  };
  return icons[extension] || '📎';
}

// Calculate file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Check if object is empty
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

// Get query parameter
export function getQueryParam(param: string): string | null {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Set query parameter
export function setQueryParam(params: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  window.history.pushState({}, '', url.toString());
}

// Remove query parameter
export function removeQueryParam(param: string): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete(param);
  window.history.pushState({}, '', url.toString());
}
