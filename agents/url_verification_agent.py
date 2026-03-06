"""
Agent 2 – URL Verification Agent
Extracts URLs from a message and evaluates them for phishing indicators.
"""

import re
from typing import Dict, Any, List
from urllib.parse import urlparse

# ── Risk indicators ────────────────────────────────────────────
SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".club", ".online", ".site", ".icu",
    ".buzz", ".fun", ".space", ".info", ".pw", ".cc",
    ".tk", ".ml", ".ga", ".cf", ".gq", ".work", ".click",
    ".loan", ".date", ".bid", ".trade", ".webcam", ".stream",
]

SHORTENER_DOMAINS = [
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd",
    "buff.ly", "ow.ly", "rebrand.ly", "cutt.ly", "shorturl.at",
    "rb.gy", "t.ly", "v.gd", "qr.ae",
]

PHISHING_URL_KEYWORDS = [
    "verify", "login", "secure", "update", "account", "confirm",
    "banking", "payment", "wallet", "claim", "prize", "reward",
    "kyc", "aadhaar", "pan", "refund", "suspend", "block",
    "authenticate", "validate", "recover",
]

IP_PATTERN = re.compile(r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}")

URL_PATTERN = re.compile(
    r'https?://[^\s<>"\']+|www\.[^\s<>"\']+',
    re.IGNORECASE,
)


def _extract_domain(url: str) -> str:
    if not url.startswith("http"):
        url = "http://" + url
    try:
        parsed = urlparse(url)
        return parsed.netloc.lower()
    except Exception:
        return url.lower()


class URLVerificationAgent:
    """Rule-based URL phishing detector."""

    def analyze(self, message: str, preprocessed: Dict[str, Any]) -> Dict[str, Any]:
        urls: List[str] = preprocessed.get("urls_found", [])
        # Also try our own extraction
        urls += URL_PATTERN.findall(message)
        urls = list(set(urls))

        if not urls:
            return {
                "has_url": False,
                "suspicious_domains": [],
                "url_risk_score": 0,
                "details": [],
            }

        suspicious_domains: List[str] = []
        details: List[str] = []
        score = 0

        for url in urls:
            domain = _extract_domain(url)
            url_lower = url.lower()
            domain_flags: List[str] = []

            # Suspicious TLD
            for tld in SUSPICIOUS_TLDS:
                if domain.endswith(tld):
                    domain_flags.append(f"Suspicious TLD: {tld}")
                    score += 10
                    break

            # URL shortener
            for short in SHORTENER_DOMAINS:
                if short in domain:
                    domain_flags.append("URL shortener detected")
                    score += 8
                    break

            # IP address in URL
            if IP_PATTERN.search(domain):
                domain_flags.append("IP address used instead of domain")
                score += 12

            # Phishing keywords in URL path
            kw_hits = [k for k in PHISHING_URL_KEYWORDS if k in url_lower]
            if kw_hits:
                domain_flags.append(f"Phishing keywords in URL: {', '.join(kw_hits)}")
                score += min(len(kw_hits) * 5, 15)

            # Domain squatting heuristic (hyphenated domains with bank-ish words)
            brand_words = ["bank", "sbi", "hdfc", "icici", "paytm", "gpay", "phonepe",
                           "amazon", "flipkart", "google", "microsoft", "apple", "paypal"]
            if any(b in domain for b in brand_words) and "-" in domain:
                domain_flags.append("Possible domain squatting (brand name + hyphen)")
                score += 10

            # Excessive subdomains heuristic
            if domain.count(".") >= 3:
                domain_flags.append("Excessive subdomains (obfuscation technique)")
                score += 6

            if domain_flags:
                suspicious_domains.append(domain)
                details.extend(domain_flags)

        # Cap at 30
        url_risk_score = min(score, 30)

        return {
            "has_url": True,
            "suspicious_domains": suspicious_domains,
            "url_risk_score": url_risk_score,
            "details": details,
            "urls_found": urls,
        }
