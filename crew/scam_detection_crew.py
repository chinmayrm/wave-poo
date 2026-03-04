"""
Scam Detection Crew – Orchestrates the 4-agent sequential pipeline.

Pipeline:  Text Analysis → URL Verification → Fraud Pattern → Risk Scoring
"""

from typing import Dict, Any

from agents.text_analysis_agent import TextAnalysisAgent
from agents.url_verification_agent import URLVerificationAgent
from agents.fraud_pattern_agent import FraudPatternAgent
from agents.risk_scoring_agent import RiskScoringAgent
from preprocessing.text_cleaner import preprocess_message


class ScamDetectionCrew:
    """Runs the full scam-detection pipeline."""

    def __init__(self):
        self.text_agent = TextAnalysisAgent()
        self.url_agent = URLVerificationAgent()
        self.pattern_agent = FraudPatternAgent()
        self.risk_agent = RiskScoringAgent()

    def analyze(self, raw_message: str) -> Dict[str, Any]:
        # ── Step 0: Preprocessing ──────────────────────────────
        preprocessed = preprocess_message(raw_message)

        # ── Step 1: Text Analysis ──────────────────────────────
        text_result = self.text_agent.analyze(raw_message, preprocessed)

        # ── Step 2: URL Verification ───────────────────────────
        url_result = self.url_agent.analyze(raw_message, preprocessed)

        # ── Step 3: Fraud Pattern Matching ─────────────────────
        pattern_result = self.pattern_agent.analyze(raw_message, preprocessed)

        # ── Step 4: Risk Scoring ───────────────────────────────
        risk = self.risk_agent.score(text_result, url_result, pattern_result)

        # ── Assemble full response ─────────────────────────────
        return {
            "risk_score": risk["risk_score"],
            "risk_level": risk["risk_level"],
            "reasons": risk["reasons"],
            "recommendation": risk["recommendation"],
            "details": {
                "text_analysis": {
                    "scam_language_score": text_result["scam_language_score"],
                    "detected_phrases": text_result["detected_phrases"],
                    "urgency_score": text_result["urgency_score"],
                },
                "url_analysis": {
                    "has_url": url_result["has_url"],
                    "suspicious_domains": url_result.get("suspicious_domains", []),
                    "url_risk_score": url_result["url_risk_score"],
                },
                "pattern_analysis": {
                    "pattern_matched": pattern_result["pattern_matched"],
                    "matched_pattern": pattern_result.get("matched_pattern"),
                    "confidence": pattern_result["confidence"],
                },
            },
            "preprocessed": {
                "keywords_found": preprocessed.get("keywords_found", []),
                "urls_found": preprocessed.get("urls_found", []),
            },
        }
