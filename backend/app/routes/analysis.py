from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models import CodeAnalysisRequest, BatchAnalysisRequest, GitHubRepoAnalysisRequest, AnalysisResult
from app.services.analyzer_service import CodeAnalyzerService
from app.database import get_database
from datetime import datetime
from io import BytesIO
import urllib.request
import urllib.error
import zipfile
import re

router = APIRouter()
analyzer_service = CodeAnalyzerService()

SUPPORTED_EXTENSIONS = {
    ".py": "python",
    ".js": "javascript",
    ".jsx": "javascript",
    ".java": "java"
}
MAX_FILE_SIZE_BYTES = 1_000_000


def _build_github_archive_url(github_url: str) -> str:
    cleaned = github_url.strip()
    pattern = r"^https?://github\.com/([^/\s]+)/([^/\s]+?)(?:\.git)?(?:/tree/([^/\s]+))?/?$"
    match = re.match(pattern, cleaned)
    if not match:
        raise ValueError("Invalid GitHub URL. Use format: https://github.com/owner/repo")

    owner = match.group(1)
    repo = match.group(2)
    branch = match.group(3)

    if branch:
        return f"https://codeload.github.com/{owner}/{repo}/zip/refs/heads/{branch}"
    return f"https://api.github.com/repos/{owner}/{repo}/zipball"


def _extract_supported_files(zip_bytes: bytes, max_files: int):
    extracted_files = []
    with zipfile.ZipFile(BytesIO(zip_bytes)) as zip_ref:
        for info in zip_ref.infolist():
            if len(extracted_files) >= max_files:
                break
            if info.is_dir():
                continue
            if info.file_size > MAX_FILE_SIZE_BYTES:
                continue

            normalized_name = info.filename.replace("\\", "/")
            extension = "." + normalized_name.split(".")[-1].lower() if "." in normalized_name else ""
            language = SUPPORTED_EXTENSIONS.get(extension)
            if not language:
                continue

            with zip_ref.open(info) as file_handle:
                raw_content = file_handle.read()
            try:
                code = raw_content.decode("utf-8")
            except UnicodeDecodeError:
                code = raw_content.decode("utf-8", errors="ignore")

            if not code.strip():
                continue

            relative_name = normalized_name.split("/", 1)[1] if "/" in normalized_name else normalized_name
            extracted_files.append({
                "file_name": relative_name,
                "language": language,
                "code": code
            })

    return extracted_files

@router.post("/analyze", response_model=dict)
async def analyze_code(request: CodeAnalysisRequest, background_tasks: BackgroundTasks, user_id: str = None):
    """
    Analyze source code and return detailed report
    
    - **code**: Source code to analyze
    - **language**: Programming language (python, javascript, java)
    - **user_id**: Optional user ID to associate analysis with a user
    """
    try:
        # Validate input
        if not request.code.strip():
            raise HTTPException(status_code=400, detail="Code cannot be empty")
        
        if request.language.lower() not in ['python', 'javascript', 'java']:
            raise HTTPException(
                status_code=400,
                detail="Unsupported language. Supported: python, javascript, java"
            )
        
        # Perform analysis
        result = analyzer_service.analyze_code(
            request.code,
            request.language,
            security_deep_scan=request.security_deep_scan,
            performance_hints=request.performance_hints
        )
        
        # Save to database in background (if database is connected)
        db = get_database()
        if db is not None:
            background_tasks.add_task(save_analysis_to_db, db, request.code, result, user_id)
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error analyzing code: {e}")
        raise HTTPException(status_code=500, detail="Error analyzing code")


@router.post("/analyze/batch", response_model=dict)
async def analyze_batch_code(request: BatchAnalysisRequest):
    """
    Analyze multiple files and return per-file summaries + worst offenders.
    """
    try:
        if not request.files:
            raise HTTPException(status_code=400, detail="At least one file is required")
        if len(request.files) > 100:
            raise HTTPException(status_code=400, detail="Maximum 100 files per batch request")

        normalized_files = []
        supported = {'python', 'javascript', 'java'}
        for file_item in request.files:
            language = file_item.language.lower()
            if language not in supported:
                continue
            if not file_item.code.strip():
                continue
            normalized_files.append({
                "file_name": file_item.file_name,
                "language": language,
                "code": file_item.code
            })

        if not normalized_files:
            raise HTTPException(
                status_code=400,
                detail="No valid files to analyze. Supported languages: python, javascript, java"
            )

        return analyzer_service.analyze_batch(
            normalized_files,
            security_deep_scan=request.security_deep_scan,
            performance_hints=request.performance_hints
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in batch analysis: {e}")
        raise HTTPException(status_code=500, detail="Error analyzing batch files")


@router.post("/analyze/repo", response_model=dict)
async def analyze_github_repo(request: GitHubRepoAnalysisRequest, background_tasks: BackgroundTasks, user_id: str = None):
    """Analyze supported source files from a public GitHub repository."""
    try:
        archive_url = _build_github_archive_url(request.github_url)
        http_request = urllib.request.Request(
            archive_url,
            headers={"User-Agent": "CodeReviewer/1.0"}
        )
        with urllib.request.urlopen(http_request, timeout=30) as response:
            archive_bytes = response.read()

        files = _extract_supported_files(archive_bytes, request.max_files)
        if not files:
            raise HTTPException(
                status_code=400,
                detail="No supported files found in repository (.py, .js/.jsx, .java)."
            )

        result = analyzer_service.analyze_batch(
            files,
            security_deep_scan=request.security_deep_scan,
            performance_hints=request.performance_hints
        )
        result["source"] = {
            "type": "github_repo",
            "url": request.github_url,
            "analyzed_files": len(files)
        }

        db = get_database()
        if db is not None:
            background_tasks.add_task(
                save_analysis_to_db,
                db,
                code="",
                result=result,
                user_id=user_id,
                source=result["source"],
            )

        return result
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except urllib.error.HTTPError as e:
        if e.code == 404:
            raise HTTPException(status_code=404, detail="GitHub repository or branch not found")
        if e.code in (403, 429):
            raise HTTPException(status_code=429, detail="GitHub rate limit exceeded. Try again later.")
        raise HTTPException(status_code=400, detail="Unable to download repository archive")
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Failed to parse repository archive")
    except Exception as e:
        print(f"Error in GitHub repo analysis: {e}")
        raise HTTPException(status_code=500, detail="Error analyzing GitHub repository")


async def save_analysis_to_db(db, code: str, result: dict, user_id: str = None, source: dict = None):
    """Save analysis result to database"""
    try:
        if not user_id:
            return

        doc = {
            "user_id": user_id,
            "analysis_type": source.get("type") if source else "code",
            "source_url": source.get("url") if source else None,
            "source_files": source.get("analyzed_files") if source else None,
            "code_snippet": code[:500] if code else (source.get("url") if source else ""),
            "language": result.get("language", "batch" if result.get("mode") == "batch" else "unknown"),
            "metrics": result.get("metrics", result.get("summary", {})),
            "issue_count": result.get("summary", {}).get("total_issues", len(result.get("issues", []))),
            "created_at": datetime.utcnow()
        }
        await db.analysis_history.insert_one(doc)
    except Exception as e:
        print(f"Error saving to database: {e}")

@router.get("/stats")
async def get_stats():
    """Get analysis statistics"""
    db = get_database()
    
    if db is None:
        return {
            "total_analyses": 0,
            "languages": {},
            "message": "Database not connected"
        }
    
    try:
        total = await db.analysis_history.count_documents({})
        
        # Get language distribution
        pipeline = [
            {"$group": {"_id": "$language", "count": {"$sum": 1}}}
        ]
        language_stats = await db.analysis_history.aggregate(pipeline).to_list(None)
        
        languages = {stat['_id']: stat['count'] for stat in language_stats}
        
        return {
            "total_analyses": total,
            "languages": languages
        }
    except Exception as e:
        print(f"Error fetching stats: {e}")
        return {"error": "Error fetching statistics"}
