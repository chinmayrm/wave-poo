const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface AnalysisResult {
  risk_score: number;
  risk_level: "SAFE" | "SUSPICIOUS" | "SCAM";
  reasons: string[];
  recommendation: string;
  details: {
    text_analysis: {
      scam_language_score: number;
      detected_phrases: string[];
      urgency_score: number;
    };
    url_analysis: {
      has_url: boolean;
      suspicious_domains: string[];
      url_risk_score: number;
    };
    pattern_analysis: {
      pattern_matched: boolean;
      matched_pattern: string | null;
      confidence: number;
    };
  };
  preprocessed: {
    keywords_found: string[];
    urls_found: string[];
  };
}

export interface SampleMessage {
  label: string;
  message: string;
}

export async function analyzeMessage(message: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchExamples(): Promise<SampleMessage[]> {
  const res = await fetch(`${API_BASE}/api/examples`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.examples;
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}
