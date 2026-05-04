# Code Reviewer - Project Summary

## 🎯 Project Overview

**Code Reviewer** is a full-stack web application that analyzes source code (Python, JavaScript, Java) and generates detailed quality reports with static analysis, security checks, metrics, and AI-powered suggestions.

---

## 📁 Project Structure

```
code_reviewer/
├── frontend/                      # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # App header with animations
│   │   │   ├── CodeInput.jsx      # Monaco editor + file upload
│   │   │   ├── LoadingAnimation.jsx
│   │   │   ├── AnalysisResults.jsx # Results display
│   │   │   └── MetricsChart.jsx   # Recharts visualization
│   │   ├── services/
│   │   │   └── api.js             # API client
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Tailwind styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── backend/                       # FastAPI + Python
│   ├── app/
│   │   ├── routes/
│   │   │   ├── analysis.py        # Code analysis endpoints
│   │   │   ├── history.py         # History management
│   │   │   └── auth.py            # Authentication (JWT)
│   │   ├── services/
│   │   │   ├── python_analyzer.py # Pylint, Radon, Bandit
│   │   │   ├── javascript_analyzer.py
│   │   │   ├── java_analyzer.py
│   │   │   └── analyzer_service.py # Main analyzer
│   │   ├── database.py            # MongoDB connection
│   │   └── models.py              # Pydantic models
│   ├── main.py                    # FastAPI app
│   └── requirements.txt
│
├── README.md                      # Full documentation
├── QUICKSTART.md                  # Quick start guide
├── setup.bat                      # Setup script
├── start.bat                      # Start script
├── example_code.py                # Python example
└── example_code.js                # JavaScript example
```

---

## ✨ Features Implemented

### Frontend Features
✅ **User Interface**
- Modern, responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Dark mode support via Tailwind
- Mobile-friendly responsive layout

✅ **Code Editor**
- Monaco Editor integration (VS Code editor)
- Syntax highlighting for Python, JavaScript, Java
- Line numbers and code folding
- Auto-detection of language from file extension

✅ **File Upload**
- Drag & drop file upload
- File browser integration
- Supported extensions: .py, .js, .jsx, .java

✅ **Results Visualization**
- Interactive metrics cards
- Recharts for data visualization
- Color-coded severity indicators (error, warning, info)
- Expandable issue details

✅ **Loading States**
- Animated loading spinner
- Progress indicators
- Smooth transitions

### Backend Features
✅ **Python Analysis**
- Pylint integration (linting)
- Radon integration (complexity metrics)
- Bandit integration (security scanning)
- Comprehensive issue reporting

✅ **JavaScript Analysis**
- Pattern-based issue detection
- Complexity calculation
- Common anti-pattern detection

✅ **Java Analysis**
- Basic static analysis
- Code quality checks
- Best practice suggestions

✅ **API Endpoints**
- POST /api/analyze - Analyze code
- GET /api/history - Get analysis history
- GET /api/stats - Get statistics
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user

✅ **Database Integration**
- MongoDB connection with Motor (async)
- Analysis history storage
- User authentication data
- Statistics tracking

✅ **Security**
- JWT authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Monaco Editor | Code editor |
| Recharts | Data visualization |
| React Icons | Icon library |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|------------|---------|
| Python 3.8+ | Programming language |
| FastAPI | Web framework |
| Motor | Async MongoDB driver |
| Pylint | Python linting |
| Radon | Code metrics |
| Bandit | Security analysis |
| Passlib | Password hashing |
| Python-JOSE | JWT tokens |

---

## 🚀 Quick Start Commands

### First Time Setup
```bash
# Run setup script
setup.bat

# OR manually:
cd frontend && npm install
cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt
```

### Start Application
```bash
# Easy way:
start.bat

# Manual way:
# Terminal 1: Backend
cd backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Access
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs
- API: http://localhost:8000

---

## 📊 Analysis Capabilities

### Metrics Calculated
- **Lines of Code**: Total lines in the file
- **Cyclomatic Complexity**: Code complexity score
- **Maintainability Index**: Code maintainability (0-100)

### Issues Detected
- **Errors**: Critical bugs, syntax errors
- **Warnings**: Code style, potential issues
- **Info**: Suggestions, best practices

### Security Scanning (Python)
- SQL injection vulnerabilities
- Hardcoded secrets
- Unsafe function usage (eval, exec)
- Weak cryptography

### AI Suggestions
- Refactoring recommendations
- Best practice tips
- Performance improvements
- Code organization advice

---

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=code_reviewer
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:8000
```

---

## 📝 API Examples

### Analyze Code
```bash
curl -X POST "http://localhost:8000/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def hello():\n    print(\"Hello\")",
    "language": "python"
  }'
```

### Get History
```bash
curl "http://localhost:8000/api/history?limit=10"
```

### Get Statistics
```bash
curl "http://localhost:8000/api/stats"
```

---

## 🎨 UI/UX Highlights

- **Smooth Animations**: Framer Motion for all transitions
- **Color-Coded Results**: Red (errors), Yellow (warnings), Blue (info)
- **Interactive Charts**: Hover effects and tooltips
- **Responsive Design**: Works on desktop, tablet, mobile
- **Loading States**: Professional loading animations
- **Error Handling**: User-friendly error messages

---

## 🔐 Authentication (Optional)

The app includes JWT-based authentication:

1. **Register**: Create account at `/api/auth/register`
2. **Login**: Get JWT token at `/api/auth/login`
3. **Use Token**: Include in Authorization header

---

## 📦 Dependencies

### Frontend (package.json)
- react, react-dom: ^18.3.1
- framer-motion: ^11.2.10
- @monaco-editor/react: ^4.6.0
- recharts: ^2.12.7
- axios: ^1.7.2
- react-icons: ^5.2.1
- tailwindcss: ^3.4.4
- vite: ^5.3.1

### Backend (requirements.txt)
- fastapi==0.110.0
- uvicorn==0.27.1
- pymongo==4.6.1
- motor==3.3.2
- pylint==3.0.3
- radon==6.0.1
- bandit==1.7.7
- passlib==1.7.4
- python-jose==3.3.0

---

## 🎯 Use Cases

1. **Code Review**: Automated code review before PR
2. **Learning**: Students learning to write better code
3. **Quality Assurance**: Ensure code quality standards
4. **Security Audit**: Detect security vulnerabilities
5. **Refactoring**: Get suggestions for code improvements

---

## 🚧 Future Enhancements

Potential additions:
- More languages (TypeScript, Go, C++, etc.)
- ESLint/TSLint integration for JavaScript
- Checkstyle for Java
- PDF report export
- Code comparison (before/after)
- Team collaboration features
- VS Code extension
- CI/CD integration

---

## 📄 License

MIT License - Free for personal and commercial use

---

## 🙏 Acknowledgments

Built with:
- React team for React
- FastAPI team for FastAPI
- Tailwind Labs for Tailwind CSS
- All open-source contributors

---

## 📞 Support

For issues or questions:
1. Check README.md
2. Check QUICKSTART.md
3. View API docs at /docs
4. Review example code files

---

**Enjoy analyzing your code! 🎉**
