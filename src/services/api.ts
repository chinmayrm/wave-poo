const API_BASE = import.meta.env.VITE_API_URL || "https://wave-poo.onrender.com";

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
  metadata?: {
    analysis_time_ms: number;
    message_length: number;
    timestamp: string;
  };
}

export interface SampleMessage {
  label: string;
  message: string;
}

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new ApiError(res.status, body || `HTTP ${res.status}`);
    }

    return res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out — the server may be waking up. Try again.");
    }
    throw new Error("Cannot reach the server. It may be starting up (free tier cold start).");
  } finally {
    clearTimeout(timeout);
  }
}

export async function analyzeMessage(message: string): Promise<AnalysisResult> {
  return request<AnalysisResult>("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function fetchExamples(): Promise<SampleMessage[]> {
  const data = await request<{ examples: SampleMessage[] }>("/api/examples");
  return data.examples;
}

export async function healthCheck(): Promise<boolean> {
  try {
    await request("/api/health");
    return true;
  } catch {
    return false;
  }
}
