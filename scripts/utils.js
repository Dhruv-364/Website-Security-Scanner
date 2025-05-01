/**
 * Utility functions for the SecureScout application
 */

const utils = {
  /**
   * Formats a timestamp in MM:SS format
   * @param {number} seconds - Total seconds to format
   * @returns {string} Formatted time string
   */
  formatTime: (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },
  
  /**
   * Creates a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of toast (success, error, info, warning)
   * @param {number} duration - Duration in milliseconds
   */
  showToast: (message, type = 'info', duration = 3000) => {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Auto-remove after duration
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  
  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      utils.showToast('Copied to clipboard!', 'success');
      return true;
    } catch (err) {
      utils.showToast('Failed to copy text.', 'error');
      console.error('Failed to copy: ', err);
      return false;
    }
  },
  
  /**
   * Validates a URL
   * @param {string} url - URL to validate
   * @returns {boolean} Is valid URL
   */
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  },
  
  /**
   * Sanitizes HTML to prevent XSS
   * @param {string} html - HTML string to sanitize
   * @returns {string} Sanitized HTML
   */
  sanitizeHtml: (html) => {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
  },
  
  /**
   * Debounces a function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce: (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  /**
   * Toggle theme between light and dark
   */
  toggleTheme: () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    utils.showToast(`Switched to ${newTheme} theme`, 'info', 1500);
  },
  
  /**
   * Initialize theme from localStorage or system preference
   */
  initTheme: () => {
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', defaultTheme);
  },
  
  /**
   * Export data to JSON file
   * @param {Object} data - Data to export
   * @param {string} filename - File name
   */
  exportToJson: (data, filename = 'scan-results.json') => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    utils.showToast('Results exported successfully', 'success');
  },
  
  /**
   * Format date to locale string
   * @param {Date} date - Date to format
   * @returns {string} Formatted date
   */
  formatDate: (date) => {
    return new Date(date).toLocaleString();
  },
  
  /**
   * Get severity color class
   * @param {string} severity - Severity level
   * @returns {string} CSS class for severity
   */
  getSeverityClass: (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-critical';
      case 'medium': return 'severity-warning';
      case 'low': return 'severity-info';
      default: return 'severity-info';
    }
  },
  
  /**
   * Generate a unique ID
   * @returns {string} Unique ID
   */
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
  
  /**
   * Save scan history to localStorage
   * @param {Object} scanResult - Scan result object
   */
  saveScanHistory: (scanResult) => {
    const history = utils.getScanHistory();
    history.unshift({
      id: utils.generateId(),
      date: new Date().toISOString(),
      ...scanResult
    });
    
    // Keep only last 50 scans
    if (history.length > 50) {
      history.pop();
    }
    
    localStorage.setItem('scanHistory', JSON.stringify(history));
  },
  
  /**
   * Get scan history from localStorage
   * @returns {Array} Array of scan history items
   */
  getScanHistory: () => {
    const history = localStorage.getItem('scanHistory');
    return history ? JSON.parse(history) : [];
  },
  
  /**
   * Clear scan history
   */
  clearScanHistory: () => {
    localStorage.removeItem('scanHistory');
    utils.showToast('Scan history cleared', 'info');
  }
};

// Initialize theme on load
document.addEventListener('DOMContentLoaded', utils.initTheme);