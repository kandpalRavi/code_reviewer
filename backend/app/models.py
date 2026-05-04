from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CodeAnalysisRequest(BaseModel):
    code: str = Field(..., description="Source code to analyze")
    language: str = Field(..., description="Programming language (python, javascript, java)")
    security_deep_scan: bool = Field(default=True, description="Enable deep security checks")
    performance_hints: bool = Field(default=True, description="Enable performance pattern checks")


class BatchFileRequest(BaseModel):
    file_name: str = Field(..., description="Original file name")
    code: str = Field(..., description="File source code")
    language: str = Field(..., description="Detected language")


class BatchAnalysisRequest(BaseModel):
    files: List[BatchFileRequest] = Field(..., description="Files to analyze")
    security_deep_scan: bool = Field(default=True, description="Enable deep security checks")
    performance_hints: bool = Field(default=True, description="Enable performance pattern checks")


class GitHubRepoAnalysisRequest(BaseModel):
    github_url: str = Field(..., description="GitHub repository URL")
    max_files: int = Field(default=200, ge=1, le=1000, description="Maximum supported files to analyze")
    security_deep_scan: bool = Field(default=True, description="Enable deep security checks")
    performance_hints: bool = Field(default=True, description="Enable performance pattern checks")

class Issue(BaseModel):
    id: int
    severity: str  # error, warning, info
    line: int
    message: str
    rule: str

class Metrics(BaseModel):
    lines_of_code: int
    complexity: int
    maintainability: float
    cyclomatic_complexity: Optional[float] = None
    halstead_metrics: Optional[dict] = None

class AnalysisResult(BaseModel):
    language: str
    metrics: Metrics
    issues: List[Issue]
    suggestions: List[str]
    security_vulnerabilities: Optional[List[dict]] = []
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class User(BaseModel):
    username: str
    email: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AnalysisHistory(BaseModel):
    user_id: Optional[str] = None
    code_snippet: str
    language: str
    result: dict
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
