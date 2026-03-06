"""
Agent 4 – Risk Scoring Agent
Combines outputs from all other agents into a final risk score + classification.
"""

from typing import Dict, Any, List


RECOMMENDATIONS = {
    "SAFE": "This message appears to be safe. No immediate threats detected.",
    "SUSPICIOUS": "Exercise caution. Some elements of this message are suspicious. Do not click links or share personal information until verified through official channels.",
    "SCAM": "HIGH RISK — Do not click any links, share OTPs, or respond to this message. Report it to your bank/service provider and block the sender.",
}


class RiskScoringAgent:
    """Aggregates all agent outputs into a final risk score, level, reasons, and recommendation."""

    def score(
        self,
        text_result: Dict[str, Any],
        url_result: Dict[str, Any],
        pattern_result: Dict[str, Any],
    ) -> Dict[str, Any]:

        reasons: List[str] = []
        score = 0

        # ── Text analysis contribution (max 40) ───────────────
        text_score = text_result.get("scam_language_score", 0)
        score += text_score

        detected = text_result.get("detected_phrases", [])
        if detected:
            reasons.append(f"Scam language detected: {', '.join(detected[:5])}")

        urgency = text_result.get("urgency_score", 0)
        if urgency > 5:
            reasons.append("High urgency / threat language used")

        # Category detail
        cats = text_result.get("category_scores", {})
        if cats.get("social_engineering", 0) > 0:
            reasons.append("Social engineering tactics detected")

        # ── URL analysis contribution (max 30) ─────────────────
        url_score = url_result.get("url_risk_score", 0)
        score += url_score

        if url_result.get("has_url"):
            sus = url_result.get("suspicious_domains", [])
            if sus:
                reasons.append(f"Suspicious URL(s): {', '.join(sus)}")
            details = url_result.get("details", [])
            for d in details[:3]:
                reasons.append(d)

        # ── Pattern analysis contribution (max 30) ─────────────
        if pattern_result.get("pattern_matched"):
            conf = pattern_result.get("confidence", 0)
            pattern_score = int(conf * 30)
            score += pattern_score
            name = pattern_result.get("matched_pattern", "Unknown")
            reasons.append(f"Matches known scam pattern: {name}")
        elif pattern_result.get("confidence", 0) > 0.15:
            score += 5
            reasons.append("Partial match to known scam patterns")

        # ── Cross-signal amplification ─────────────────────────
        # If multiple agent categories fire, the message is likely worse
        active_signals = sum([
            text_score > 10,
            url_score > 10,
            pattern_result.get("pattern_matched", False),
        ])
        if active_signals >= 3:
            score += 5
            reasons.append("Multiple independent risk signals detected")

        # ── Clamp ──────────────────────────────────────────────
        score = max(0, min(score, 100))

        # ── Classification ─────────────────────────────────────
        if score <= 30:
            level = "SAFE"
        elif score <= 60:
            level = "SUSPICIOUS"
        else:
            level = "SCAM"

        if not reasons:
            reasons.append("No significant scam indicators found")

        return {
            "risk_score": score,
            "risk_level": level,
            "reasons": reasons,
            "recommendation": RECOMMENDATIONS[level],
        }
