/**
 * Animation utilities for SecureScout
 */

const animations = {
  /**
   * Initializes all animations
   */
  init: () => {
    // Add scanning animation class when scan starts
    document.addEventListener('scanStart', () => {
      document.body.classList.add('scanning-active');
    });
    
    // Remove scanning animation class when scan completes
    document.addEventListener('scanComplete', () => {
      document.body.classList.remove('scanning-active');
    });
    
    // Initialize expandable cards
    animations.initExpandableCards();
  },
  
  /**
   * Initialize expandable cards
   */
  initExpandableCards: () => {
    document.addEventListener('click', (e) => {
      // Check if clicked element is a vulnerability card header or part of it
      const header = e.target.closest('.vulnerability-header');
      if (header) {
        const card = header.closest('.vulnerability-card');
        animations.toggleCard(card);
      }
    });
  },
  
  /**
   * Toggle card expansion
   * @param {HTMLElement} card - Card element to toggle
   */
  toggleCard: (card) => {
    card.classList.toggle('expanded');
  },
  
  /**
   * Updates progress bar with animation
   * @param {number} percentage - Progress percentage (0-100)
   */
  updateProgressBar: (percentage) => {
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    
    if (!progressBar || !progressPercentage) return;
    
    // Ensure percentage is between 0-100
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    // Animate progress bar width
    progressBar.style.width = `${clampedPercentage}%`;
    
    // Update percentage text
    progressPercentage.textContent = `${Math.round(clampedPercentage)}%`;
    
    // Add pulse animation when close to 100%
    if (clampedPercentage > 90) {
      progressBar.classList.add('pulse');
    } else {
      progressBar.classList.remove('pulse');
    }
  },
  
  /**
   * Animates the count up for summary cards
   * @param {string} elementId - Element ID to animate
   * @param {number} targetValue - Target number value
   * @param {number} duration - Animation duration in milliseconds
   */
  animateCountUp: (elementId, targetValue, duration = 1000) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const increment = (targetValue - startValue) / (duration / 16);
    let currentValue = startValue;
    
    const animateCount = () => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        element.textContent = targetValue;
      } else {
        element.textContent = Math.floor(currentValue);
        requestAnimationFrame(animateCount);
      }
    };
    
    animateCount();
  },
  
  /**
   * Animate element entrance
   * @param {HTMLElement} element - Element to animate
   * @param {string} animationClass - CSS animation class
   * @param {number} delay - Delay in milliseconds
   */
  animateEntrance: (element, animationClass = 'fadeIn', delay = 0) => {
    if (!element) return;
    
    element.style.opacity = '0';
    
    setTimeout(() => {
      element.classList.add(animationClass);
      element.style.opacity = '1';
    }, delay);
  },
  
  /**
   * Animate section transition
   * @param {string} hideSelector - Selector for element to hide
   * @param {string} showSelector - Selector for element to show
   */
  transitionSections: (hideSelector, showSelector) => {
    const hideElement = document.querySelector(hideSelector);
    const showElement = document.querySelector(showSelector);
    
    if (!hideElement || !showElement) return;
    
    // Hide the current element
    hideElement.style.opacity = '0';
    hideElement.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      hideElement.classList.add('hidden');
      
      // Show the new element
      showElement.classList.remove('hidden');
      showElement.style.opacity = '0';
      showElement.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        showElement.style.opacity = '1';
        showElement.style.transform = 'translateY(0)';
      }, 50);
    }, 300);
  }
};

// Initialize animations on DOMContentLoaded
document.addEventListener('DOMContentLoaded', animations.init);