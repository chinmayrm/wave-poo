from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class MessageRequest(BaseModel):
    message: str


class TextAnalysisResult(BaseModel):
    scam_language_score: int = 0
    detected_phrases: List[str] = []
    urgency_score: int = 0


class URLAnalysisResult(BaseModel):
    has_url: bool = False
    suspicious_domains: List[str] = []
    url_risk_score: int = 0
    details: List[str] = []


class PatternAnalysisResult(BaseModel):
    pattern_matched: bool = False
    matched_pattern: Optional[str] = None
    confidence: float = 0.0
    pattern_type: Optional[str] = None


class AnalysisDetails(BaseModel):
    text_analysis: Dict[str, Any] = {}
    url_analysis: Dict[str, Any] = {}
    pattern_analysis: Dict[str, Any] = {}


class AnalysisResponse(BaseModel):
    risk_score: int
    risk_level: str
    reasons: List[str]
    recommendation: str
    analysis_details: AnalysisDetails
