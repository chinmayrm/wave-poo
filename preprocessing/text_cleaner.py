import re
import string
from typing import Dict, List, Any


SCAM_KEYWORDS = [
    "otp", "bank", "account", "suspended", "blocked", "verify",
    "urgent", "lottery", "won", "prize", "kyc", "update", "click",
    "link", "limited", "expire", "frozen", "debit", "credit",
    "refund", "payment", "failed", "immediately", "claim",
    "reward", "gift", "voucher", "register", "earn", "invest",
    "bitcoin", "crypto", "guarantee", "returns", "package",
    "delivery", "held", "address", "aadhaar", "pan", "cvv",
    "password", "pin", "secure", "login", "alert", "warning",
]


def preprocess_message(text: str) -> Dict[str, Any]:
    """Clean and tokenize a message, extracting scam-related keywords."""

    cleaned = text.lower()

    # Strip punctuation (keep @ and . for emails/urls detection later)
    cleaned_no_punct = cleaned.translate(
        str.maketrans("", "", string.punctuation.replace("@", "").replace(".", ""))
    )

    # Collapse whitespace
    cleaned_no_punct = " ".join(cleaned_no_punct.split())

    tokens = cleaned_no_punct.split()

    found_keywords = [w for w in tokens if w in SCAM_KEYWORDS]

    # Extract anything that looks like a URL
    urls = re.findall(
        r'https?://[^\s<>"\']+|www\.[^\s<>"\']+|[a-zA-Z0-9-]+\.[a-z]{2,}(?:/[^\s]*)?',
        text,
        re.IGNORECASE,
    )

    return {
        "cleaned_text": cleaned_no_punct,
        "tokens": tokens,
        "keywords_found": list(set(found_keywords)),
        "urls_found": urls,
        "original": text,
    }
