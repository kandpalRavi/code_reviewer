@echo off
echo =====================================
echo Code Reviewer - Quick Setup Script
echo =====================================
echo.

echo [1/4] Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed.
)
echo.

echo [2/4] Setting up Backend...
cd ..\backend

if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
) else (
    echo Virtual environment already exists.
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing backend dependencies...
pip install -r requirements.txt

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
) else (
    echo .env file already exists.
)

cd ..

echo.
echo =====================================
echo Setup Complete! 
echo =====================================
echo.
echo To start the application:
echo.
echo 1. Start Backend (in this terminal):
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn main:app --reload --port 8000
echo.
echo 2. Start Frontend (in a new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open browser: http://localhost:3000
echo.
echo API Documentation: http://localhost:8000/docs
echo =====================================
pause
