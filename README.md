# SecureScout - Website Security Scanner

SecureScout is a modern web application security scanner that helps identify SQL injection vulnerabilities and cross-site scripting (XSS) attacks in websites. Built with a focus on user experience and detailed reporting, it provides comprehensive security assessments with an intuitive interface.

![SecureScout Screenshot](https://images.pexels.com/photos/5935794/pexels-photo-5935794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

- **Real-time Vulnerability Scanning**
  - SQL Injection detection
  - Cross-Site Scripting (XSS) detection
  - Configurable scan depth
  - Progress monitoring

- **Comprehensive Reporting**
  - Detailed vulnerability descriptions
  - Severity classifications
  - Impact analysis
  - Remediation recommendations
  - Code samples

- **History Tracking**
  - Complete scan history
  - Historical report viewing
  - Export functionality
  - Clear history option

- **Modern UI/UX**
  - Responsive design
  - Dark/Light theme
  - Animated transitions
  - Interactive vulnerability cards

## Technologies Used

- HTML5
- CSS3 (Custom properties, Flexbox, Grid)
- JavaScript (ES6+)
- Python (Flask)
- Local Storage API

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/securescout.git
   ```

2. Install Python dependencies:
   ```bash
   pip install flask
   ```

3. Start the Flask server:
   ```bash
   python app.py
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

1. Enter the target URL in the scan form
2. Select desired vulnerability checks:
   - SQL Injection
   - Cross-Site Scripting (XSS)
3. Choose scan depth:
   - Quick Scan
   - Deep Scan
4. Click "Start Scan" and monitor progress
5. Review detailed results and recommendations
6. Export reports as needed

## Project Structure

```
securescout/
├── app.py                 # Flask backend server
├── index.html            # Main HTML file
├── scripts/
│   ├── app.js           # Main application logic
│   ├── scanner.js       # Scanning functionality
│   ├── results.js       # Results handling
│   ├── animations.js    # UI animations
│   └── utils.js         # Utility functions
├── styles/
│   ├── main.css         # Base styles
│   ├── components.css   # Component styles
│   └── animations.css   # Animation styles
└── mock_vulnerabilities.json  # Mock data for demo
```

## Security Considerations

- This is a demonstration tool and should be used responsibly
- Always obtain proper authorization before scanning any website
- The tool currently uses mock data for demonstration purposes
- In a production environment, implement proper security measures

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons from [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- Demo images from [Pexels](https://www.pexels.com/)

## Contact

Dhruv Verma- [Instagram]https://www.instagram.com/_dhruv.verma/
