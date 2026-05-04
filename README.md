# Code Reviewer - Installation & Setup Guide

A comprehensive code analysis tool that analyzes Python, JavaScript, and Java code for bugs, security vulnerabilities, and code quality metrics.

## Project Structure
```
code_reviewer/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── backend/           # FastAPI + Python
    ├── app/
    │   ├── routes/
    │   ├── services/
    │   ├── models.py
    │   └── database.py
    ├── main.py
    └── requirements.txt
```

## Features ✨

### Frontend
- 🎨 Beautiful animated UI with Framer Motion
- 📝 Monaco Editor for syntax highlighting
- 📤 Drag & drop file upload
- 📊 Interactive charts with Recharts
- 📄 Batch PDF export with polished summary cards, visual insights, and contextual suggestions
- 📱 Fully responsive design
- 🎯 Multi-language support (Python, Java, JavaScript)

### Backend
- 🔍 Static code analysis (Pylint, Radon, Bandit)
- 🐛 Bug detection
- 🔒 Security vulnerability scanning
- 📈 Code metrics (complexity, maintainability)
- 💡 AI-powered suggestions
- 🔐 JWT authentication
- 📜 Analysis history tracking

## Prerequisites

### Required
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (3.8 or higher) - [Download](https://www.python.org/)
- **npm** or **yarn**

### Optional
- **MongoDB** (for history tracking and authentication)
  - [Download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud)

## Quick Start 🚀

### Option 1: Step-by-Step Setup

#### 1. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

#### 2. Backend Setup

```bash
# Navigate to backend directory (in a new terminal)
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Linux/Mac

# Start the server
uvicorn main:app --reload --port 8000
```

Backend API will be available at `http://localhost:8000`

### Option 2: Quick Commands

**Terminal 1 (Frontend):**
```bash
cd frontend && npm install && npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
```

## Usage 📖

1. **Open the application** at `http://localhost:3000`
2. **Select a language** (Python, JavaScript, or Java)
3. **Upload or paste your code** in the editor
4. **Click "Analyze Code"**
5. **View the results:**
   - Code metrics (complexity, maintainability)
   - Issues and bugs
   - Security vulnerabilities
   - AI-powered suggestions

## API Documentation 📚

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Main Endpoints

- `POST /api/analyze` - Analyze code
- `GET /api/history` - Get analysis history
- `GET /api/stats` - Get statistics
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

## Configuration ⚙️

### Backend Environment Variables (.env)

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=code_reviewer
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:8000
```

## MongoDB Setup (Optional)

The application works without MongoDB, but with limited functionality.

### Local MongoDB:
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   mongod
   ```
3. MongoDB will run on `mongodb://localhost:27017`

### MongoDB Atlas (Cloud):
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URL` in backend `.env`

## Build for Production 🏭

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Backend
```bash
cd backend
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## Troubleshooting 🔧

### Common Issues

**1. Frontend can't connect to backend**
- Ensure backend is running on port 8000
- Check CORS settings in `main.py`
- Verify `VITE_API_URL` in frontend `.env`

**2. Python analysis tools not working**
- Ensure Pylint, Radon, Bandit are installed:
  ```bash
  pip install pylint radon bandit
  ```

**3. MongoDB connection failed**
- Check if MongoDB is running
- Verify `MONGODB_URL` in `.env`
- Application will work without MongoDB (limited features)

**4. Port already in use**
- Frontend: Change port in `vite.config.js`
- Backend: Run with `uvicorn main:app --reload --port 8001`

## Tech Stack 🛠️

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Monaco Editor (code editor)
- Recharts (data visualization)
- React Icons
- Axios (API client)

### Backend
- Python 3.8+
- FastAPI (web framework)
- Motor (async MongoDB driver)
- Pylint (Python linting)
- Radon (code metrics)
- Bandit (security analysis)
- Passlib (password hashing)
- Python-JOSE (JWT tokens)

## Development 💻

### Frontend Development
- Hot reload enabled by default
- Component library in `src/components/`
- API service in `src/services/api.js`

### Backend Development
- Auto-reload with `--reload` flag
- Add new analyzers in `app/services/`
- Create new routes in `app/routes/`

## License

MIT License - Feel free to use for your projects!

## Support

For issues or questions, please check the documentation or create an issue.

---

**Happy Coding! 🎉**
