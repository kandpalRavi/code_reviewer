from fastapi import APIRouter, HTTPException
from app.database import get_database
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/history")
async def get_history(limit: int = 20, user_id: str = None):
    """
    Get analysis history.

    - **limit**: Number of recent analyses to return (default: 20)
    - **user_id**: Optional filter by user
    """
    db = get_database()

    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    try:
        query = {}
        if user_id:
            query["user_id"] = user_id

        cursor = db.analysis_history.find(query).sort("created_at", -1).limit(limit)
        history = await cursor.to_list(length=limit)

        # Convert ObjectId to string
        for item in history:
            item["_id"] = str(item["_id"])
            # Ensure created_at is ISO string
            if isinstance(item.get("created_at"), datetime):
                item["created_at"] = item["created_at"].isoformat()

        return {"history": history, "count": len(history)}

    except Exception as e:
        print(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail="Error fetching history")


@router.get("/history/trends")
async def get_history_trends(days: int = 30, user_id: str = None):
    """
    Get analysis trends over the last N days, grouped by date and language.
    Returns per-day counts and average scores.
    """
    db = get_database()

    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    try:
        since = datetime.utcnow() - timedelta(days=days)
        match_stage = {"created_at": {"$gte": since}}
        if user_id:
            match_stage["user_id"] = user_id

        pipeline = [
            {"$match": match_stage},
            {
                "$group": {
                    "_id": {
                        "date": {
                            "$dateToString": {
                                "format": "%Y-%m-%d",
                                "date": "$created_at"
                            }
                        },
                        "language": "$language"
                    },
                    "count": {"$sum": 1},
                    "avg_quality": {"$avg": "$metrics.quality_score"},
                    "avg_complexity": {"$avg": "$metrics.complexity_score"},
                    "avg_security": {"$avg": "$metrics.security_score"},
                    "avg_overall": {"$avg": "$metrics.overall_score"}
                }
            },
            {"$sort": {"_id.date": 1}}
        ]

        raw = await db.analysis_history.aggregate(pipeline).to_list(None)

        # Reformat
        trends = []
        for item in raw:
            trends.append({
                "date": item["_id"]["date"],
                "language": item["_id"].get("language", "unknown"),
                "count": item["count"],
                "avg_quality": round(item.get("avg_quality") or 0, 1),
                "avg_complexity": round(item.get("avg_complexity") or 0, 1),
                "avg_security": round(item.get("avg_security") or 0, 1),
                "avg_overall": round(item.get("avg_overall") or 0, 1)
            })

        # Language distribution
        lang_pipeline = [
            {"$match": match_stage},
            {"$group": {"_id": "$language", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        lang_stats = await db.analysis_history.aggregate(lang_pipeline).to_list(None)
        languages = {s["_id"]: s["count"] for s in lang_stats if s["_id"]}

        # Total counts
        total = await db.analysis_history.count_documents(match_stage)

        return {
            "trends": trends,
            "languages": languages,
            "total_in_period": total,
            "days": days
        }

    except Exception as e:
        print(f"Error fetching trends: {e}")
        raise HTTPException(status_code=500, detail="Error fetching trends")


@router.delete("/history/{analysis_id}")
async def delete_history_item(analysis_id: str):
    """Delete a specific analysis from history"""
    db = get_database()

    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    try:
        from bson import ObjectId
        result = await db.analysis_history.delete_one({"_id": ObjectId(analysis_id)})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Analysis not found")

        return {"message": "Analysis deleted successfully"}

    except Exception as e:
        print(f"Error deleting history: {e}")
        raise HTTPException(status_code=500, detail="Error deleting history")
