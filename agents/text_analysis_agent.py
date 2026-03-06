"""
Agent 1 – Text Analysis Agent
Scans message text for scam language, urgency indicators, and suspicious phrases.
"""

from typing import Dict, Any, List

# ── Pattern banks ──────────────────────────────────────────────
URGENCY_PHRASES = [
    "immediately", "urgent", "right now", "act now", "hurry",
    "last chance", "limited time", "within 24 hours", "within 1 hour",
    "today only", "don't delay", "quick action", "asap", "right away",
    "time sensitive", "expires today", "before it's too late",
    "don't miss", "respond now", "expiring soon", "deadline",
]

THREAT_PHRASES = [
    "account suspended", "account blocked", "account frozen",
    "card blocked", "card deactivated", "payment failed",
    "will be closed", "will be terminated", "legal action",
    "police complaint", "arrest warrant", "case filed",
    "penalty", "fine imposed", "your account will be",
    "permanently disabled", "unauthorized access detected",
    "security breach", "compromised", "flagged for review",
]

OTP_PHRASES = [
    "share otp", "send otp", "verify otp", "otp expired",
    "enter otp", "provide otp", "otp is", "one time password",
    "share your pin", "tell us your password", "security code",
    "verification code", "confirm your cvv",
]

PRIZE_PHRASES = [
    "you won", "you have won", "congratulations", "lottery",
    "prize", "reward", "gift voucher", "gift card", "cashback",
    "lucky winner", "selected winner", "claim your", "you are selected",
    "exclusive offer for you", "bonus credited", "free gift",
]

IMPERSONATION_PHRASES = [
    "bank manager", "support team", "customer care", "rbi",
    "income tax", "government", "sbi", "hdfc", "icici",
    "aadhaar", "pan card", "kyc update", "kyc expired",
    "this is from", "official notice", "authorized dealer",
    "compliance team", "fraud department", "security team",
]

FINANCIAL_PHRASES = [
    "processing fee", "registration fee", "advance payment",
    "transfer amount", "pay now", "send money", "deposit",
    "invest now", "guaranteed returns", "double your money",
    "100% returns", "bitcoin", "crypto", "small fee",
    "nominal charge", "token amount", "refundable deposit",
    "wire transfer", "western union", "upi",
]

SOCIAL_ENGINEERING_PHRASES = [
    "do not tell anyone", "keep this confidential",
    "do not share this with", "this is between us",
    "act before someone else", "others are waiting",
    "you are the only one", "specially chosen",
    "trusted person", "personal request",
]


def _count_phrase_hits(text: str, phrase_bank: List[str]) -> List[str]:
    """Return matched phrases from a phrase bank."""
    lower = text.lower()
    return [p for p in phrase_bank if p in lower]


def _exclamation_density(text: str) -> float:
    """Ratio of exclamation/question marks to total characters."""
    if not text:
        return 0.0
    return sum(1 for c in text if c in "!?") / len(text)


def _caps_ratio(text: str) -> float:
    """Ratio of uppercase letters to total alpha characters."""
    alpha = [c for c in text if c.isalpha()]
    if not alpha:
        return 0.0
    return sum(1 for c in alpha if c.isupper()) / len(alpha)


class TextAnalysisAgent:
    """Rule-based scam language detector (no LLM needed for demo)."""

    def analyze(self, message: str, preprocessed: Dict[str, Any]) -> Dict[str, Any]:
        lower = message.lower()

        detected_phrases: List[str] = []
        category_scores: Dict[str, int] = {}

        # Urgency
        hits = _count_phrase_hits(lower, URGENCY_PHRASES)
        if hits:
            detected_phrases.extend(hits)
            category_scores["urgency"] = min(len(hits) * 7, 20)

        # Threats
        hits = _count_phrase_hits(lower, THREAT_PHRASES)
        if hits:
            detected_phrases.extend(hits)
            category_scores["threats"] = min(len(hits) * 9, 20)

        # OTP requests
        hits = _count_phrase_hits(lower, OTP_PHRASES)
        if hits:
            detected_phrases.extend(hits)
            category_scores["otp_request"] = min(len(hits) * 12, 20)

        # Prize / lottery
        hits = _count_phrase_hits(lower, PRIZE_PHRASES)
        if hits:
            detected_phrases.extend(hits)
            category_scores["prize_scam"] = min(len(hits) * 9, 20)

        # Impersonation
        hits = _count_phrase_hits(lower, IMPERSONATION_PHRASES)
        if hits:
            detected_phrases.extend(hits)
            category_scores["impersonation"] = min(len(hits) * 7, 15)

        # Financial
        hits = _count_phrase_hits(lower, FINANCIAL_PHRASES)
        if hits:
            detected_phrases.extend(hits)
            category_scores["financial_lure"] = min(len(hits) * 9, 20)

        # Social engineering
        hits = _count_phrase_hits(lower, SOCIAL_ENGINEERING_PHRASES)
        if hits:
            detected_phrases.extend(hits)
            category_scores["social_engineering"] = min(len(hits) * 8, 15)

        # Keyword density boost
        keyword_count = len(preprocessed.get("keywords_found", []))
        keyword_bonus = min(keyword_count * 3, 15)

        # Stylistic signals (ALL CAPS, excessive punctuation)
        style_bonus = 0
        if _caps_ratio(message) > 0.5 and len(message) > 20:
            style_bonus += 3
        if _exclamation_density(message) > 0.03:
            style_bonus += 2

        scam_language_score = min(sum(category_scores.values()) + keyword_bonus + style_bonus, 40)
        urgency_score = category_scores.get("urgency", 0) + category_scores.get("threats", 0)

        return {
            "scam_language_score": scam_language_score,
            "detected_phrases": list(set(detected_phrases)),
            "urgency_score": min(urgency_score, 20),
            "category_scores": category_scores,
            "keywords_found": preprocessed.get("keywords_found", []),
        }
