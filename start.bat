@echo off
echo Starting Code Reviewer Application...
echo.

start cmd /k "cd frontend && echo Starting Frontend... && npm run dev"
timeout /t 3 > nul

start cmd /k "cd backend && echo Starting Backend... && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo.
echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000/docs
echo.
echo Press any key to stop all servers...
pause > nul

taskkill /FI "WindowTitle eq *vite*" /F
taskkill /FI "WindowTitle eq *uvicorn*" /F
echo Servers stopped.
