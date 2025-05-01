/**
 * Results handling for SecureScout
 */

const resultsManager = {
  vulnerabilities: [],
  
  /**
   * Initialize results manager
   */
  init: () => {
    // Set up event listeners
    document.getElementById('exportResultsBtn')?.addEventListener('click', resultsManager.exportResults);
    document.getElementById('newScanBtn')?.addEventListener('click', resultsManager.resetAndStartNew);
    
    // Set up copy button listeners (using event delegation)
    document.addEventListener('click', (e) => {
      if (e.target.closest('.copy-btn')) {
        const card = e.target.closest('.vulnerability-card');
        const codeElement = card.querySelector('.vulnerable-code');
        if (codeElement) {
          utils.copyToClipboard(codeElement.textContent);
        }
      }
    });
  },
  
  /**
   * Display scan results
   * @param {Object} results - Scan results object
   */
  displayResults: (results) => {
    // Store vulnerabilities for export
    resultsManager.vulnerabilities = results.vulnerabilities || [];
    
    // Update summary counts
    resultsManager.updateSummaryCounts(results);
    
    // Clear existing vulnerability cards
    const container = document.getElementById('vulnerabilitiesContainer');
    if (container) {
      container.innerHTML = '';
    }
    
    // Create vulnerability cards
    if (results.vulnerabilities && results.vulnerabilities.length > 0) {
      results.vulnerabilities.forEach((vuln, index) => {
        setTimeout(() => {
          const card = resultsManager.createVulnerabilityCard(vuln);
          container.appendChild(card);
        }, index * 100); // Stagger animation
      });
    } else {
      // No vulnerabilities found
      const noVulnMessage = document.createElement('div');
      noVulnMessage.className = 'no-vulnerabilities';
      noVulnMessage.innerHTML = `
        <div class="no-vulns-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m9 12 2 2 4-4"></path></svg>
        </div>
        <h3>No Vulnerabilities Found</h3>
        <p>Great job! Your website appears to be secure against common SQL injection and XSS attacks.</p>
      `;
      container.appendChild(noVulnMessage);
    }
    
    // Show results section
    animations.transitionSections('#scanStatus', '#resultsSection');
  },
  
  /**
   * Create a vulnerability card element
   * @param {Object} vulnerability - Vulnerability data
   * @returns {HTMLElement} Vulnerability card element
   */
  createVulnerabilityCard: (vulnerability) => {
    const template = document.getElementById('vulnerabilityCardTemplate');
    const card = template.content.cloneNode(true).querySelector('.vulnerability-card');
    
    // Set severity class
    const severityClass = utils.getSeverityClass(vulnerability.severity);
    card.querySelector('.vulnerability-severity').classList.add(severityClass);
    
    // Set content
    card.querySelector('.vulnerability-title').textContent = vulnerability.title;
    card.querySelector('.vulnerability-location').textContent = vulnerability.location || 'N/A';
    card.querySelector('.vulnerability-description').textContent = vulnerability.description;
    card.querySelector('.vulnerability-impact').textContent = vulnerability.impact || 'Potential security breach';
    card.querySelector('.vulnerability-recommendation').textContent = vulnerability.recommendation || 'Fix the vulnerability';
    
    // Set code sample
    const codeElement = card.querySelector('.vulnerable-code');
    codeElement.textContent = vulnerability.code || 'No code sample available';
    
    return card;
  },
  
  /**
   * Update summary count cards
   * @param {Object} results - Scan results object
   */
  updateSummaryCounts: (results) => {
    const counts = {
      critical: 0,
      warning: 0,
      info: 0,
      secure: 0
    };
    
    // Count vulnerabilities by severity
    if (results.vulnerabilities && results.vulnerabilities.length > 0) {
      results.vulnerabilities.forEach(vuln => {
        const severity = vuln.severity.toLowerCase();
        if (severity === 'critical' || severity === 'high') {
          counts.critical++;
        } else if (severity === 'medium') {
          counts.warning++;
        } else if (severity === 'low') {
          counts.info++;
        }
      });
    } else {
      // If no vulnerabilities, mark as secure
      counts.secure = 1;
    }
    
    // Update count elements with animation
    animations.animateCountUp('criticalCount', counts.critical);
    animations.animateCountUp('warningCount', counts.warning);
    animations.animateCountUp('infoCount', counts.info);
    animations.animateCountUp('secureCount', counts.secure);
  },
  
  /**
   * Export results to JSON file
   */
  exportResults: () => {
    const exportData = {
      scanDate: new Date().toISOString(),
      target: document.getElementById('scanTargetUrl').textContent,
      vulnerabilities: resultsManager.vulnerabilities,
      summary: {
        critical: parseInt(document.getElementById('criticalCount').textContent),
        warning: parseInt(document.getElementById('warningCount').textContent),
        info: parseInt(document.getElementById('infoCount').textContent),
        secure: parseInt(document.getElementById('secureCount').textContent)
      }
    };
    
    utils.exportToJson(exportData, `security-scan-${new Date().toISOString().split('T')[0]}.json`);
  },
  
  /**
   * Reset and start new scan
   */
  resetAndStartNew: () => {
    // Reset form fields
    document.getElementById('scanForm').reset();
    
    // Hide results section and show scanner section
    animations.transitionSections('#resultsSection', '#scanForm');
    
    // Clear stored vulnerabilities
    resultsManager.vulnerabilities = [];
    
    // Reset progress
    animations.updateProgressBar(0);
    
    // Focus on URL input
    document.getElementById('targetUrl').focus();
  }
};

// Initialize results manager on DOMContentLoaded
document.addEventListener('DOMContentLoaded', resultsManager.init);