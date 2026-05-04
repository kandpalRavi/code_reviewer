# Code Reviewer Backend

FastAPI backend for code analysis and review.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
copy .env.example .env
# Edit .env with your configurations
```

4. Start MongoDB (if not already running)

5. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

## API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation.

## Features
- Code analysis (Pylint, Radon, Bandit)
- Security vulnerability detection
- Code metrics calculation
- AI-powered suggestions
- User authentication (JWT)
- Analysis history tracking
