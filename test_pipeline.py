"""Quick test of the scam detection pipeline."""
from crew.scam_detection_crew import ScamDetectionCrew
import json

crew = ScamDetectionCrew()

# Test 1: Scam message
r = crew.analyze(
    "URGENT: Your SBI account has been suspended. Click http://sbi-verify.xyz/update to verify immediately. Share OTP now."
)
print("=== TEST 1: Scam message ===")
print(f"Score: {r['risk_score']}, Level: {r['risk_level']}")
for reason in r["reasons"]:
    print(f"  - {reason}")
print()

# Test 2: Safe message
r2 = crew.analyze(
    "Hi! Just wanted to check if we are still meeting tomorrow at 3 PM for coffee."
)
print("=== TEST 2: Safe message ===")
print(f"Score: {r2['risk_score']}, Level: {r2['risk_level']}")
for reason in r2["reasons"]:
    print(f"  - {reason}")
