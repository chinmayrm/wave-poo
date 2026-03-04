"""
Agent 3 – Fraud Pattern Agent
Checks the message against a database of known scam templates.
"""

from typing import Dict, Any, List

# ── Scam pattern templates ─────────────────────────────────────
PATTERNS = [
    {
        "id": "banking_scam",
        "name": "Bank Alert Scam",
        "keywords": ["bank", "account", "suspended", "blocked", "deactivated", "card", "debit", "credit"],
        "triggers": ["click here", "verify", "call immediately", "call now", "update"],
        "description": "Fake bank alerts claiming account/card issues",
    },
    {
        "id": "lottery_scam",
        "name": "Lottery / Prize Scam",
        "keywords": ["won", "lottery", "prize", "lakh", "crore", "reward", "gift", "congratulations"],
        "triggers": ["claim", "processing fee", "pay", "register"],
        "description": "Fake lottery/prize winnings requiring payment",
    },
    {
        "id": "job_scam",
        "name": "Job / Earn Money Scam",
        "keywords": ["earn", "income", "job", "work from home", "salary", "hiring", "vacancy"],
        "triggers": ["register now", "apply now", "limited seats", "guaranteed"],
        "description": "Fake job offers or work-from-home schemes",
    },
    {
        "id": "delivery_scam",
        "name": "Delivery / Package Scam",
        "keywords": ["package", "delivery", "parcel", "courier", "shipment", "held"],
        "triggers": ["update address", "reschedule", "click", "track"],
        "description": "Fake delivery notifications requiring personal info",
    },
    {
        "id": "kyc_scam",
        "name": "KYC / ID Verification Scam",
        "keywords": ["kyc", "aadhaar", "pan", "verification", "identity", "document"],
        "triggers": ["expired", "update immediately", "frozen", "within 24 hours", "mandatory"],
        "description": "Fake KYC update demands impersonating banks/govt",
    },
    {
        "id": "investment_scam",
        "name": "Investment / Crypto Scam",
        "keywords": ["invest", "bitcoin", "crypto", "trading", "stock", "mutual fund", "returns"],
        "triggers": ["guaranteed", "100%", "double", "risk free", "limited offer"],
        "description": "Fraudulent investment schemes promising impossible returns",
    },
    {
        "id": "otp_scam",
        "name": "OTP / Credential Theft",
        "keywords": ["otp", "password", "pin", "cvv", "security code"],
        "triggers": ["share", "send", "enter", "provide", "verify"],
        "description": "Attempts to steal OTPs, passwords, or PINs",
    },
    {
        "id": "government_scam",
        "name": "Government Impersonation Scam",
        "keywords": ["income tax", "government", "police", "court", "legal", "rbi", "sebi"],
        "triggers": ["penalty", "fine", "arrest", "case filed", "notice", "summon"],
        "description": "Impersonating government/legal authorities to extort money",
    },
]


class FraudPatternAgent:
    """Matches messages against known scam pattern templates."""

    def analyze(self, message: str, preprocessed: Dict[str, Any]) -> Dict[str, Any]:
        lower = message.lower()
        best_match = None
        best_score = 0.0

        all_matches: List[Dict[str, Any]] = []

        for pattern in PATTERNS:
            kw_hits = sum(1 for kw in pattern["keywords"] if kw in lower)
            tr_hits = sum(1 for tr in pattern["triggers"] if tr in lower)

            total_possible = len(pattern["keywords"]) + len(pattern["triggers"])
            if total_possible == 0:
                continue

            # Weight triggers more heavily
            raw = kw_hits + tr_hits * 1.5
            confidence = min(raw / (total_possible * 0.6), 1.0)

            if confidence > 0.2:
                match_info = {
                    "pattern_id": pattern["id"],
                    "pattern_name": pattern["name"],
                    "confidence": round(confidence, 2),
                    "keyword_hits": kw_hits,
                    "trigger_hits": tr_hits,
                    "description": pattern["description"],
                }
                all_matches.append(match_info)

                if confidence > best_score:
                    best_score = confidence
                    best_match = match_info

        pattern_matched = best_match is not None and best_score >= 0.3

        return {
            "pattern_matched": pattern_matched,
            "matched_pattern": best_match["pattern_name"] if best_match else None,
            "matched_pattern_id": best_match["pattern_id"] if best_match else None,
            "confidence": round(best_score, 2),
            "pattern_type": best_match["description"] if best_match else None,
            "all_matches": all_matches,
        }
