import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  ShieldX,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle,
  LinkIcon,
  Brain,
  FileSearch,
  ChevronDown,
} from "lucide-react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import {
  analyzeMessage,
  fetchExamples,
  type AnalysisResult,
  type SampleMessage,
} from "@/services/api";

// ─── Inline style helpers ────────────────────────────────
const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 18,
  padding: "28px 32px",
};

const innerCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: 14,
  padding: "20px 22px",
};

const LEVEL_COLORS: Record<string, { main: string; bg: string; border: string }> = {
  SAFE: { main: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
  SUSPICIOUS: { main: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  SCAM: { main: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
};

function RiskIcon({ level, size = 40 }: { level: string; size?: number }) {
  const color = LEVEL_COLORS[level]?.main || "#8b8b9e";
  if (level === "SAFE") return <Shield size={size} color={color} />;
  if (level === "SUSPICIOUS") return <ShieldAlert size={size} color={color} />;
  return <ShieldX size={size} color={color} />;
}

// ─── Risk Score Meter ────────────────────────────────────
function RiskMeter({ score, level }: { score: number; level: string }) {
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS.SAFE;
  const pct = Math.max(0, Math.min(score, 100));

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontSize: "0.8rem",
          color: "#8b8b9e",
        }}
      >
        <span>Risk Score</span>
        <span style={{ color: colors.main, fontWeight: 700, fontSize: "1rem" }}>
          {pct}/100
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 10,
          borderRadius: 5,
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: "100%",
            borderRadius: 5,
            background: `linear-gradient(90deg, ${colors.main}88, ${colors.main})`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────
export function ProjectPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [samples, setSamples] = useState<SampleMessage[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchExamples()
      .then(setSamples)
      .catch(() => {
        // Fallback samples if backend isn't running
        setSamples([
          {
            label: "Bank Scam",
            message:
              "URGENT: Your SBI account has been suspended due to incomplete KYC. Click here to verify immediately: http://sbi-verify.xyz/update. Failure to update within 24 hours will result in permanent account closure.",
          },
          {
            label: "Lottery Scam",
            message:
              "Congratulations! You have won ₹25,00,000 in the Amazon Lucky Draw 2025! To claim your prize, pay the processing fee of ₹999. Click: http://bit.ly/claim-prize-now",
          },
          {
            label: "OTP Theft",
            message:
              "Dear customer, a transaction of ₹49,999 is being processed from your account. If not done by you, share your OTP with our support team immediately to block it. Call now: 9876543210",
          },
          {
            label: "Safe Message",
            message:
              "Hi! Just wanted to check if we're still meeting tomorrow at 3 PM for coffee. Let me know if the timing works for you.",
          },
        ]);
      });
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyzeMessage(message);
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [message]);

  const selectSample = (s: SampleMessage) => {
    setMessage(s.message);
    setResult(null);
    setError(null);
    setDropdownOpen(false);
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#050508" }}>
      <BackgroundBeamsWithCollision>
        <div
          style={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            padding: "32px 16px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* ─── Header ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              width: "100%",
              maxWidth: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
            }}
          >
            <motion.button
              onClick={() => navigate("/main")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#c0c0d0",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                cursor: "pointer",
              }}
              whileHover={{ background: "rgba(255,255,255,0.09)", y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeft size={16} />
              Home
            </motion.button>

            <h1
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #a78bfa, #6366f1, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              Scam Interceptor
            </h1>
          </motion.div>

          {/* ─── Input Card ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ ...glassCard, width: "100%", maxWidth: 900, marginBottom: 24 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#e0e0f0",
                }}
              >
                Analyze a Message
              </h2>

              {/* Sample dropdown */}
              <div style={{ position: "relative" }}>
                <motion.button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "#a78bfa",
                    background: "rgba(167,139,250,0.08)",
                    border: "1px solid rgba(167,139,250,0.2)",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                  whileHover={{ background: "rgba(167,139,250,0.14)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Sample Messages
                  <ChevronDown
                    size={14}
                    style={{
                      transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        right: 0,
                        minWidth: 240,
                        background: "rgba(20,20,30,0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 10,
                        padding: 6,
                        zIndex: 50,
                      }}
                    >
                      {samples.map((s, i) => (
                        <motion.button
                          key={i}
                          onClick={() => selectSample(s)}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "10px 14px",
                            fontSize: "0.8rem",
                            color: "#c0c0d0",
                            background: "transparent",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                            textAlign: "left" as const,
                          }}
                          whileHover={{ background: "rgba(255,255,255,0.06)" }}
                        >
                          {s.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste a suspicious message here..."
              rows={5}
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: "0.9rem",
                fontFamily: "inherit",
                color: "#e0e0f0",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                resize: "vertical" as const,
                outline: "none",
                lineHeight: 1.6,
                boxSizing: "border-box" as const,
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <motion.button
                onClick={handleAnalyze}
                disabled={loading || !message.trim()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "#fff",
                  background:
                    loading || !message.trim()
                      ? "rgba(99,102,241,0.3)"
                      : "linear-gradient(135deg, #6366f1, #a78bfa)",
                  border: "none",
                  borderRadius: 12,
                  cursor: loading || !message.trim() ? "not-allowed" : "pointer",
                }}
                whileHover={
                  loading || !message.trim() ? {} : { scale: 1.02, y: -1 }
                }
                whileTap={loading || !message.trim() ? {} : { scale: 0.97 }}
              >
                {loading ? (
                  <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <Send size={18} />
                )}
                {loading ? "Analyzing…" : "Analyze Message"}
              </motion.button>
            </div>
          </motion.div>

          {/* ─── Error ──────────────────────────────── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  ...glassCard,
                  width: "100%",
                  maxWidth: 900,
                  marginBottom: 24,
                  borderColor: "rgba(239,68,68,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <AlertTriangle size={20} color="#ef4444" />
                <span style={{ color: "#f87171", fontSize: "0.9rem" }}>
                  {error}. Make sure the backend server is running on port 8000.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Results ────────────────────────────── */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: "100%", maxWidth: 900 }}
              >
                {/* Top Results Card */}
                <div
                  style={{
                    ...glassCard,
                    marginBottom: 20,
                    borderColor: LEVEL_COLORS[result.risk_level]?.border,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: LEVEL_COLORS[result.risk_level]?.bg,
                        border: `1px solid ${LEVEL_COLORS[result.risk_level]?.border}`,
                        flexShrink: 0,
                      }}
                    >
                      <RiskIcon level={result.risk_level} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 4,
                        }}
                      >
                        <h2
                          style={{
                            fontSize: "1.4rem",
                            fontWeight: 800,
                            color: LEVEL_COLORS[result.risk_level]?.main,
                          }}
                        >
                          {result.risk_level}
                        </h2>
                      </div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#8b8b9e",
                          lineHeight: 1.5,
                        }}
                      >
                        {result.recommendation}
                      </p>
                    </div>
                  </div>

                  <RiskMeter score={result.risk_score} level={result.risk_level} />
                </div>

                {/* Reasons */}
                <div style={{ ...glassCard, marginBottom: 20 }}>
                  <h3
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#e0e0f0",
                      marginBottom: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <AlertTriangle size={16} color="#f59e0b" />
                    Analysis Reasons
                  </h3>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {result.reasons.map((r, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          padding: "8px 0",
                          fontSize: "0.85rem",
                          color: "#c0c0d0",
                          borderBottom:
                            i < result.reasons.length - 1
                              ? "1px solid rgba(255,255,255,0.04)"
                              : "none",
                        }}
                      >
                        <span
                          style={{
                            color: LEVEL_COLORS[result.risk_level]?.main,
                            fontWeight: 700,
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          •
                        </span>
                        {r}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Agent Breakdown */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 16,
                    marginBottom: 20,
                  }}
                >
                  {/* Text Analysis */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={innerCard}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      <Brain size={16} color="#a78bfa" />
                      <span
                        style={{ fontSize: "0.82rem", fontWeight: 700, color: "#c0c0d0" }}
                      >
                        Text Analysis
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.78rem",
                        color: "#8b8b9e",
                        marginBottom: 6,
                      }}
                    >
                      <span>Scam Language Score</span>
                      <span style={{ color: "#a78bfa", fontWeight: 700 }}>
                        {result.details.text_analysis.scam_language_score}/40
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.78rem",
                        color: "#8b8b9e",
                        marginBottom: 10,
                      }}
                    >
                      <span>Urgency Score</span>
                      <span style={{ color: "#a78bfa", fontWeight: 700 }}>
                        {result.details.text_analysis.urgency_score}/20
                      </span>
                    </div>
                    {result.details.text_analysis.detected_phrases.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap" as const,
                          gap: 4,
                          marginTop: 4,
                        }}
                      >
                        {result.details.text_analysis.detected_phrases
                          .slice(0, 5)
                          .map((p, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: "0.7rem",
                                padding: "3px 8px",
                                borderRadius: 6,
                                background: "rgba(167,139,250,0.1)",
                                border: "1px solid rgba(167,139,250,0.2)",
                                color: "#a78bfa",
                              }}
                            >
                              {p}
                            </span>
                          ))}
                      </div>
                    )}
                  </motion.div>

                  {/* URL Analysis */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={innerCard}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      <LinkIcon size={16} color="#06b6d4" />
                      <span
                        style={{ fontSize: "0.82rem", fontWeight: 700, color: "#c0c0d0" }}
                      >
                        URL Analysis
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.78rem",
                        color: "#8b8b9e",
                        marginBottom: 6,
                      }}
                    >
                      <span>URL Risk Score</span>
                      <span style={{ color: "#06b6d4", fontWeight: 700 }}>
                        {result.details.url_analysis.url_risk_score}/30
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: result.details.url_analysis.has_url ? "#f59e0b" : "#22c55e",
                        marginBottom: 6,
                      }}
                    >
                      {result.details.url_analysis.has_url
                        ? `${result.details.url_analysis.suspicious_domains.length} suspicious domain(s)`
                        : "No URLs detected"}
                    </div>
                    {result.details.url_analysis.suspicious_domains.length > 0 && (
                      <div style={{ marginTop: 4 }}>
                        {result.details.url_analysis.suspicious_domains.map((d, i) => (
                          <span
                            key={i}
                            style={{
                              display: "block",
                              fontSize: "0.7rem",
                              padding: "3px 8px",
                              borderRadius: 6,
                              background: "rgba(6,182,212,0.08)",
                              border: "1px solid rgba(6,182,212,0.2)",
                              color: "#06b6d4",
                              marginBottom: 4,
                              wordBreak: "break-all" as const,
                            }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Pattern Analysis */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={innerCard}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      <FileSearch size={16} color="#f59e0b" />
                      <span
                        style={{ fontSize: "0.82rem", fontWeight: 700, color: "#c0c0d0" }}
                      >
                        Pattern Matching
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.78rem",
                        color: "#8b8b9e",
                        marginBottom: 6,
                      }}
                    >
                      <span>Pattern Match</span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: result.details.pattern_analysis.pattern_matched
                            ? "#ef4444"
                            : "#22c55e",
                        }}
                      >
                        {result.details.pattern_analysis.pattern_matched ? "Yes" : "No"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.78rem",
                        color: "#8b8b9e",
                        marginBottom: 6,
                      }}
                    >
                      <span>Confidence</span>
                      <span style={{ color: "#f59e0b", fontWeight: 700 }}>
                        {Math.round(result.details.pattern_analysis.confidence * 100)}%
                      </span>
                    </div>
                    {result.details.pattern_analysis.matched_pattern && (
                      <div
                        style={{
                          fontSize: "0.78rem",
                          padding: "6px 10px",
                          borderRadius: 8,
                          background: "rgba(245,158,11,0.08)",
                          border: "1px solid rgba(245,158,11,0.2)",
                          color: "#f59e0b",
                          marginTop: 4,
                        }}
                      >
                        {result.details.pattern_analysis.matched_pattern}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Keywords */}
                {result.preprocessed.keywords_found.length > 0 && (
                  <div style={{ ...glassCard, marginBottom: 20 }}>
                    <h3
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "#e0e0f0",
                        marginBottom: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <CheckCircle size={15} color="#22c55e" />
                      Extracted Keywords
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap" as const,
                        gap: 6,
                      }}
                    >
                      {result.preprocessed.keywords_found.map((kw, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "0.72rem",
                            padding: "4px 10px",
                            borderRadius: 8,
                            background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.15)",
                            color: "#f87171",
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BackgroundBeamsWithCollision>

      {/* Spinner keyframes (injected once) */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default ProjectPage;
