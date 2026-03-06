"""
FastAPI backend – Agentic AI Scam Interceptor
Endpoints:
  POST /api/analyze   – Analyze a message for scam indicators
  GET  /api/health    – Health check
  GET  /api/examples  – Sample messages for demo
  GET  /api/history   – Recent analysis results (in-memory)
"""

import logging
from datetime import datetime, timezone
from collections import deque
from typing import List, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from crew.scam_detection_crew import ScamDetectionCrew

# ── Logging ────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger("scam-interceptor")

# ── App ────────────────────────────────────────────────────────
app = FastAPI(
    title="Agentic AI – Scam Interceptor",
    description="Multi-agent scam detection API by Team NovaTech",
    version="2.0.0",
)

# ── CORS ───────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Crew singleton ─────────────────────────────────────────────
crew = ScamDetectionCrew()

# ── In-memory history (last 50) ────────────────────────────────
MAX_HISTORY = 50
history: deque = deque(maxlen=MAX_HISTORY)

# ── Request / Response models ──────────────────────────────────
class AnalyzeRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)


class AnalyzeResponse(BaseModel):
    risk_score: int
    risk_level: str
    reasons: List[str]
    recommendation: str
    details: Dict[str, Any]
    preprocessed: Dict[str, Any]
    metadata: Dict[str, Any]


# ── Sample messages ────────────────────────────────────────────
SAMPLE_MESSAGES: List[Dict[str, str]] = [
    {
        "label": "Bank Account Suspended Scam",
        "message": "URGENT: Your SBI account has been suspended due to incomplete KYC. Click here to verify immediately: http://sbi-verify.xyz/update. Failure to update within 24 hours will result in permanent account closure.",
    },
    {
        "label": "Lottery Prize Scam",
        "message": "Congratulations! You have won ₹25,00,000 in the Amazon Lucky Draw 2025! To claim your prize, pay the processing fee of ₹999. Click: http://bit.ly/claim-prize-now",
    },
    {
        "label": "OTP Theft Attempt",
        "message": "Dear customer, a transaction of ₹49,999 is being processed from your account. If not done by you, share your OTP with our support team immediately to block it. Call now: 9876543210",
    },
    {
        "label": "Job Scam",
        "message": "Earn ₹50,000 monthly working from home! No experience needed. Limited seats available. Register now at http://easy-jobs.online/apply and pay ₹499 registration fee.",
    },
    {
        "label": "Delivery / Package Scam",
        "message": "Your Amazon parcel is held at the warehouse. Update your delivery address to reschedule: http://192.168.1.1/track-delivery. Act now or package will be returned.",
    },
    {
        "label": "Safe Message (Genuine)",
        "message": "Hi! Just wanted to check if we're still meeting tomorrow at 3 PM for coffee. Let me know if the timing works for you. See you soon!",
    },
]


# ── Endpoints ──────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "service": "Agentic AI – Scam Interceptor",
        "team": "NovaTech",
        "version": "2.0.0",
        "endpoints": {
            "POST /api/analyze": "Analyze a message for scam indicators",
            "GET /api/health": "Health check",
            "GET /api/examples": "Sample scam messages for demo",
            "GET /api/history": "Recent analysis history",
            "GET /docs": "Interactive API documentation (Swagger UI)",
        },
    }


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_message(req: AnalyzeRequest):
    """Run the multi-agent scam detection pipeline."""
    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=422, detail="Message cannot be empty or whitespace only.")

    logger.info("Analyzing message (%d chars)", len(message))
    result = crew.analyze(message)

    # Enrich metadata
    result.setdefault("metadata", {})
    result["metadata"]["analysis_time_ms"] = result["metadata"].get("timing_ms", {}).get("total", 0)
    result["metadata"]["message_length"] = len(message)
    result["metadata"]["timestamp"] = datetime.now(timezone.utc).isoformat()

    # Store in history
    history.append({
        "risk_score": result["risk_score"],
        "risk_level": result["risk_level"],
        "message_preview": message[:80] + ("..." if len(message) > 80 else ""),
        "timestamp": result["metadata"]["timestamp"],
    })

    logger.info(
        "Result: %s (score=%d) in %.1f ms",
        result["risk_level"],
        result["risk_score"],
        result["metadata"]["analysis_time_ms"],
    )
    return result


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "scam-interceptor", "version": "2.0.0"}


@app.get("/api/examples")
async def get_examples():
    return {"examples": SAMPLE_MESSAGES}


@app.get("/api/history")
async def get_history():
    """Return recent analysis summaries (newest first)."""
    return {"history": list(reversed(history)), "count": len(history)}
