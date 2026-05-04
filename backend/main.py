from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analysis, auth, history
from app.database import connect_to_mongo, close_mongo_connection

app = FastAPI(
    title="Code Reviewer API",
    description="AI-powered code analysis and review system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Event handlers
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include routers
app.include_router(analysis.router, prefix="/api", tags=["analysis"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(history.router, prefix="/api", tags=["history"])

@app.get("/")
async def root():
    return {
        "message": "Code Reviewer API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
