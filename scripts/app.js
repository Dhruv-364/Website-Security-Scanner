/**
 * Main application script for SecureScout
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', utils.toggleTheme);
  
  // Check if the app has been loaded before
  const firstVisit = !localStorage.getItem('hasVisitedBefore');
  if (firstVisit) {
    // Show welcome message on first visit
    setTimeout(() => {
      utils.showToast('Welcome to SecureScout! Scan your website for vulnerabilities.', 'info', 5000);
      localStorage.setItem('hasVisitedBefore', 'true');
    }, 1000);
  }
  
  // Set up example URL button
  document.addEventListener('click', (e) => {
    if (e.target.closest('.url-options')) {
      const options = [
        'https://example.com',
        'https://test-site.com/login.php',
        'https://demo-shop.example/products.php'
      ];
      const targetUrlInput = document.getElementById('targetUrl');
      const randomOption = options[Math.floor(Math.random() * options.length)];
      targetUrlInput.value = randomOption;
    }
  });
  
  // Set up navigation
  const navLinks = document.querySelectorAll('.main-nav a');
  const sections = {
    scanner: document.querySelector('.scanner-section'),
    history: document.getElementById('historySection'),
    results: document.getElementById('resultsSection')
  };
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = e.target.getAttribute('data-section');
      
      // Update active state
      navLinks.forEach(l => l.classList.remove('active'));
      e.target.classList.add('active');
      
      // Show selected section, hide others
      Object.entries(sections).forEach(([key, element]) => {
        if (element) {
          if (key === section) {
            element.classList.remove('hidden');
            if (key === 'history') {
              // Refresh history when showing the section
              scanner.displayScanHistory();
            }
          } else {
            element.classList.add('hidden');
          }
        }
      });
    });
  });
  
  // Set up clear history button
  document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all scan history? This action cannot be undone.')) {
      utils.clearScanHistory();
      scanner.displayScanHistory();
      utils.showToast('Scan history cleared successfully', 'success');
    }
  });
  
  // Set default page title
  document.title = 'SecureScout - Website Security Scanner';
  
  // Initialize demo mode
  const isDemoMode = true; // Set to true for demo purposes
  
  if (isDemoMode) {
    // Update text to indicate demo mode
    const sectionHeader = document.querySelector('.section-header p');
    if (sectionHeader) {
      sectionHeader.innerHTML += ' <span class="demo-badge">Demo Mode</span>';
      
      // Add demo badge styles
      const style = document.createElement('style');
      style.textContent = `
        .demo-badge {
          background-color: var(--color-info);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.8em;
          margin-left: 8px;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Add a tooltip to explain demo mode
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = `
      <p>This is a demonstration mode. The scanner simulates vulnerability detection without actually testing real websites.</p>
      <p>In a real implementation, the scanner would perform actual security tests against the target website.</p>
    `;
    
    // Add tooltip styles
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
      .tooltip {
        position: absolute;
        top: 60px;
        right: 20px;
        background-color: var(--color-bg-secondary);
        border-left: 4px solid var(--color-info);
        padding: 12px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        max-width: 300px;
        z-index: 1000;
        font-size: 0.9em;
        animation: fadeIn 0.3s ease-in-out;
      }
      
      .tooltip p {
        margin-bottom: 8px;
      }
      
      .tooltip p:last-child {
        margin-bottom: 0;
      }
      
      @media (max-width: 768px) {
        .tooltip {
          position: static;
          margin: 16px 0;
        }
      }
    `;
    document.head.appendChild(tooltipStyle);
    
    // Show tooltip after a delay
    setTimeout(() => {
      document.querySelector('.scan-form-container').appendChild(tooltip);
      
      // Auto-hide tooltip after 8 seconds
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.style.opacity = '0';
          tooltip.style.transform = 'translateY(10px)';
          setTimeout(() => tooltip.remove(), 300);
        }
      }, 8000);
    }, 2000);
  }
});