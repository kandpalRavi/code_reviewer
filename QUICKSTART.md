# Code Reviewer - Quick Start Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Run Setup (First Time Only)
```bash
# Double-click setup.bat
# OR run in terminal:
setup.bat
```

### Step 2: Start the Application
```bash
# Option A: Double-click start.bat (starts both frontend & backend)
start.bat

# Option B: Manual start
# Terminal 1:
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Terminal 2:
cd frontend  
npm run dev
```

### Step 3: Open Browser
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

## 📝 How to Use

1. **Select Language**: Choose Python, JavaScript, or Java
2. **Add Code**: Paste code or drag & drop a file
3. **Analyze**: Click "Analyze Code" button
4. **View Results**: See metrics, issues, and suggestions

## 📊 What You Get

✅ **Code Metrics**
- Lines of Code
- Cyclomatic Complexity
- Maintainability Index

✅ **Issue Detection**
- Syntax errors
- Code style violations
- Potential bugs

✅ **Security Scan**
- Vulnerability detection (Python only)
- Security best practices

✅ **AI Suggestions**
- Code improvement tips
- Refactoring recommendations
- Best practices

## 🧪 Try It Out

Use the example files:
- `example_code.py` - Python with issues
- `example_code.js` - JavaScript with issues

## ⚙️ Ports

- Frontend: `3000`
- Backend: `8000`
- MongoDB: `27017` (optional)

## 🔧 Troubleshooting

**Backend won't start?**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend won't start?**
```bash
cd frontend
npm install
```

**Port already in use?**
- Change frontend port in `frontend/vite.config.js`
- Change backend port: `uvicorn main:app --reload --port 8001`

## 📚 Documentation

- **API Documentation**: http://localhost:8000/docs
- **Full README**: See README.md

## 🎨 Features

- 🎭 Beautiful animations
- 📱 Mobile responsive
- 🎯 Drag & drop upload
- 📊 Interactive charts
- 🔍 Real-time analysis
- 💾 History tracking (with MongoDB)
- 🔐 User authentication (optional)

## 💡 Tips

- MongoDB is optional - app works without it
- Python analysis provides the most detailed results
- Backend must be running for frontend to work
- Check API docs for advanced usage

---

Need help? Check the full README.md or API documentation!
