import { useState, useEffect, useCallback, useRef } from "react";
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
  Gauge,
  ShieldCheck,
  Clock,
  MessageSquareWarning,
  Copy,
  Check,
} from "lucide-react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import {
  analyzeMessage,
  fetchExamples,
  type AnalysisResult,
  type SampleMessage,
} from "@/services/api";

// ─── Style helpers ───────────────────────────────────────
const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.035)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 20,
  padding: "28px 32px",
};

const innerCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: 14,
  padding: "20px 22px",
};

const LEVEL_COLORS: Record<string, { main: string; bg: string; border: string; glow: string }> = {
  SAFE: {
    main: "#22c55e",
    bg: "rgba(34,197,94,0.06)",
    border: "rgba(34,197,94,0.18)",
    glow: "0 0 40px rgba(34,197,94,0.15)",
  },
  SUSPICIOUS: {
    main: "#f59e0b",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.18)",
    glow: "0 0 40px rgba(245,158,11,0.15)",
  },
  SCAM: {
    main: "#ef4444",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.18)",
    glow: "0 0 40px rgba(239,68,68,0.15)",
  },
};

const PIPELINE_STEPS = [
  { key: "preprocess", label: "Preprocessing", icon: Clock, color: "#8b8b9e" },
  { key: "text", label: "Text Analysis", icon: Brain, color: "#a78bfa" },
  { key: "url", label: "URL Verification", icon: LinkIcon, color: "#22d3ee" },
  { key: "pattern", label: "Pattern Matching", icon: FileSearch, color: "#f59e0b" },
  { key: "risk", label: "Risk Scoring", icon: Gauge, color: "#ef4444" },
];

function RiskIcon({ level, size = 40 }: { level: string; size?: number }) {
  const color = LEVEL_COLORS[level]?.main || "#8b8b9e";
  if (level === "SAFE") return <Shield size={size} color={color} />;
  if (level === "SUSPICIOUS") return <ShieldAlert size={size} color={color} />;
  return <ShieldX size={size} color={color} />;
}

// ─── Circular Score Gauge ────────────────────────────────
function CircularGauge({ score, level }: { score: number; level: string }) {
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS.SAFE;
  const pct = Math.max(0, Math.min(score, 100));
  const radius = 54;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
      <svg width={140} height={140} viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
        {/* Background ring */}
        <circle
          cx={70} cy={70} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
        />
        {/* Score arc */}
        <motion.circle
          cx={70} cy={70} r={radius}
          fill="none"
          stroke={colors.main}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 6px ${colors.main}60)` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: colors.main,
            lineHeight: 1,
            fontFamily: "var(--font-mono)",
          }}
        >
          {pct}
        </motion.span>
        <span style={{ fontSize: "0.65rem", color: "#6b6b80", fontWeight: 500, marginTop: 2 }}>
          / 100
        </span>
      </div>
    </div>
  );
}

// ─── Risk Meter Bar ──────────────────────────────────────
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
          fontSize: "0.78rem",
          color: "#6b6b80",
        }}
      >
        <span>Risk Score</span>
        <span style={{ color: colors.main, fontWeight: 700, fontSize: "0.95rem", fontFamily: "var(--font-mono)" }}>
          {pct}/100
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 8,
          borderRadius: 4,
          background: "rgba(255,255,255,0.04)",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: "100%",
            borderRadius: 4,
            background: `linear-gradient(90deg, ${colors.main}66, ${colors.main})`,
            boxShadow: `0 0 12px ${colors.main}40`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Pipeline Stepper ────────────────────────────────────
function PipelineStepper({ activeStep }: { activeStep: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        width: "100%",
        padding: "4px 0",
      }}
    >
      {PIPELINE_STEPS.map((step, i) => {
        const Icon = step.icon;
        const isActive = i === activeStep;
        const isDone = i < activeStep;

        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center" }}>
            <motion.div
              animate={{
                scale: isActive ? 1.1 : 1,
                borderColor: isActive
                  ? step.color
                  : isDone
                  ? "rgba(34,197,94,0.3)"
                  : "rgba(255,255,255,0.06)",
                background: isActive
                  ? `${step.color}15`
                  : isDone
                  ? "rgba(34,197,94,0.06)"
                  : "rgba(255,255,255,0.02)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                minWidth: 72,
              }}
            >
              {isDone ? (
                <CheckCircle size={16} color="#22c55e" />
              ) : (
                <Icon
                  size={16}
                  color={isActive ? step.color : "#4a4a5a"}
                  style={isActive ? { animation: "pulse-glow 1.5s ease-in-out infinite" } : {}}
                />
              )}
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  color: isActive ? step.color : isDone ? "#22c55e" : "#4a4a5a",
                  textAlign: "center" as const,
                  lineHeight: 1.2,
                }}
              >
                {step.label}
              </span>
            </motion.div>

            {i < PIPELINE_STEPS.length - 1 && (
              <div
                style={{
                  width: 20,
                  height: 2,
                  background: isDone ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)",
                  borderRadius: 1,
                  transition: "background 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Agent Score Card ────────────────────────────────────
function AgentCard({
  icon: Icon,
  title,
  color,
  children,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        ...innerCard,
        transition: "border-color 0.3s, background 0.3s",
      }}
      whileHover={{
        borderColor: `${color}30`,
        background: `${color}06`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: `${color}12`,
            border: `1px solid ${color}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={14} color={color} />
        </div>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e0e0f0" }}>
          {title}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Stat Row helper ─────────────────────────────────────
function StatRow({
  label,
  value,
  color,
  maxVal,
}: {
  label: string;
  value: number | string;
  color: string;
  maxVal?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.78rem",
        color: "#8b8b9e",
        marginBottom: 6,
      }}
    >
      <span>{label}</span>
      <span style={{ color, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
        {value}{maxVal ? `/${maxVal}` : ""}
      </span>
    </div>
  );
}

// ─── Tag Chip ────────────────────────────────────────────
function TagChip({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        fontSize: "0.68rem",
        padding: "3px 10px",
        borderRadius: 6,
        background: `${color}10`,
        border: `1px solid ${color}22`,
        color,
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
      }}
    >
      {text}
    </span>
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
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchExamples()
      .then(setSamples)
      .catch(() => {
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
    setPipelineStep(0);

    // Run API call and visual pipeline in parallel — always show full animation
    const stepDurations = [800, 1600, 2400, 3200, 4000]; // ms for each step transition
    const stepPromise = new Promise<void>((resolve) => {
      stepDurations.forEach((delay, i) => {
        setTimeout(() => {
          setPipelineStep(i + 1);
          if (i === stepDurations.length - 1) resolve();
        }, delay);
      });
    });

    try {
      const [res] = await Promise.all([analyzeMessage(message), stepPromise]);
      setPipelineStep(5); // all done
      setResult(res);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err: unknown) {
      setPipelineStep(-1);
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
    setPipelineStep(-1);
    setDropdownOpen(false);
  };

  const copyResult = () => {
    if (!result) return;
    const text = `Risk: ${result.risk_level} (${result.risk_score}/100)\n${result.recommendation}\n\nReasons:\n${result.reasons.map((r) => `- ${r}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            padding: "32px 16px 80px",
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
              marginBottom: 24,
            }}
          >
            <motion.button
              onClick={() => navigate("/main")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#c0c0d0",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
              whileHover={{ background: "rgba(255,255,255,0.08)", y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeft size={15} />
              Home
            </motion.button>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldCheck size={20} color="#a78bfa" />
              <h1
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #a78bfa, #6366f1, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.02em",
                }}
              >
                Scam Interceptor
              </h1>
            </div>
          </motion.div>

          {/* ─── Input Card ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ ...glassCard, width: "100%", maxWidth: 900, marginBottom: 20 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MessageSquareWarning size={18} color="#a78bfa" />
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#e0e0f0" }}>
                  Analyze a Message
                </h2>
              </div>

              {/* Sample dropdown */}
              <div style={{ position: "relative" }}>
                <motion.button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#a78bfa",
                    background: "rgba(167,139,250,0.06)",
                    border: "1px solid rgba(167,139,250,0.15)",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                  whileHover={{ background: "rgba(167,139,250,0.12)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Try Samples
                  <ChevronDown
                    size={13}
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
                        minWidth: 220,
                        background: "rgba(16,16,24,0.97)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 12,
                        padding: 6,
                        zIndex: 50,
                        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
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
                            fontSize: "0.78rem",
                            color: "#c0c0d0",
                            background: "transparent",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            textAlign: "left" as const,
                            fontFamily: "inherit",
                          }}
                          whileHover={{ background: "rgba(255,255,255,0.05)" }}
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
              placeholder="Paste a suspicious SMS, email, or message here for analysis..."
              rows={5}
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: "0.88rem",
                color: "#e0e0f0",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                resize: "vertical" as const,
                outline: "none",
                lineHeight: 1.65,
                boxSizing: "border-box" as const,
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(167,139,250,0.3)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.06)")}
            />

            {/* Character count + button */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  color: message.length > 2000 ? "#ef4444" : "#4a4a5a",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {message.length} chars
              </span>
              <motion.button
                onClick={handleAnalyze}
                disabled={loading || !message.trim()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 26px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color: "#fff",
                  background:
                    loading || !message.trim()
                      ? "rgba(99,102,241,0.2)"
                      : "linear-gradient(135deg, #6366f1, #a78bfa)",
                  border: "none",
                  borderRadius: 12,
                  cursor: loading || !message.trim() ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  boxShadow:
                    loading || !message.trim()
                      ? "none"
                      : "0 4px 20px rgba(99,102,241,0.3)",
                }}
                whileHover={
                  loading || !message.trim() ? {} : { scale: 1.02, y: -1 }
                }
                whileTap={loading || !message.trim() ? {} : { scale: 0.97 }}
              >
                {loading ? (
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <Send size={16} />
                )}
                {loading ? "Analyzing…" : "Analyze"}
              </motion.button>
            </div>
          </motion.div>

          {/* ─── Pipeline Stepper (during analysis) ── */}
          <AnimatePresence>
            {loading && pipelineStep >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{ ...glassCard, width: "100%", maxWidth: 900, marginBottom: 20, padding: "20px 24px" }}
              >
                <PipelineStepper activeStep={pipelineStep} />
              </motion.div>
            )}
          </AnimatePresence>

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
                  marginBottom: 20,
                  borderColor: "rgba(239,68,68,0.18)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "18px 24px",
                }}
              >
                <AlertTriangle size={18} color="#ef4444" />
                <div>
                  <span style={{ color: "#f87171", fontSize: "0.85rem", fontWeight: 600 }}>
                    Analysis Failed
                  </span>
                  <p style={{ color: "#8b8b9e", fontSize: "0.78rem", marginTop: 2 }}>
                    {error}. Check that the backend is running and try again.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Results ────────────────────────────── */}
          <AnimatePresence>
            {result && (
              <motion.div
                ref={resultRef}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: "100%", maxWidth: 900 }}
              >
                {/* ── Top Result Card ─── */}
                <div
                  style={{
                    ...glassCard,
                    marginBottom: 16,
                    borderColor: LEVEL_COLORS[result.risk_level]?.border,
                    boxShadow: LEVEL_COLORS[result.risk_level]?.glow,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      flexWrap: "wrap" as const,
                    }}
                  >
                    <CircularGauge score={result.risk_score} level={result.risk_level} />

                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 6,
                        }}
                      >
                        <RiskIcon level={result.risk_level} size={28} />
                        <h2
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 800,
                            color: LEVEL_COLORS[result.risk_level]?.main,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {result.risk_level}
                        </h2>
                      </div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#a1a1b5",
                          lineHeight: 1.55,
                          marginBottom: 14,
                        }}
                      >
                        {result.recommendation}
                      </p>
                      <RiskMeter score={result.risk_score} level={result.risk_level} />
                    </div>

                    {/* Copy button */}
                    <motion.button
                      onClick={copyResult}
                      style={{
                        position: "absolute" as const,
                        top: 16,
                        right: 16,
                        padding: "6px 10px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 8,
                        cursor: "pointer",
                        color: copied ? "#22c55e" : "#6b6b80",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "0.7rem",
                        fontFamily: "inherit",
                      }}
                      whileHover={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? "Copied" : "Copy"}
                    </motion.button>
                  </div>
                </div>

                {/* ── Analysis Reasons ─── */}
                <div style={{ ...glassCard, marginBottom: 16 }}>
                  <h3
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "#e0e0f0",
                      marginBottom: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <AlertTriangle size={15} color="#f59e0b" />
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
                          padding: "9px 0",
                          fontSize: "0.83rem",
                          color: "#c0c0d0",
                          borderBottom:
                            i < result.reasons.length - 1
                              ? "1px solid rgba(255,255,255,0.035)"
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

                {/* ── Agent Breakdown ─── */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 14,
                    marginBottom: 16,
                  }}
                >
                  {/* Text Analysis */}
                  <AgentCard icon={Brain} title="Text Analysis" color="#a78bfa" delay={0.1}>
                    <StatRow
                      label="Scam Language"
                      value={result.details.text_analysis.scam_language_score}
                      color="#a78bfa"
                      maxVal="40"
                    />
                    <StatRow
                      label="Urgency Level"
                      value={result.details.text_analysis.urgency_score}
                      color="#a78bfa"
                      maxVal="20"
                    />
                    {result.details.text_analysis.detected_phrases.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4, marginTop: 8 }}>
                        {result.details.text_analysis.detected_phrases.slice(0, 6).map((p, i) => (
                          <TagChip key={i} text={p} color="#a78bfa" />
                        ))}
                      </div>
                    )}
                  </AgentCard>

                  {/* URL Analysis */}
                  <AgentCard icon={LinkIcon} title="URL Verification" color="#22d3ee" delay={0.2}>
                    <StatRow
                      label="URL Risk"
                      value={result.details.url_analysis.url_risk_score}
                      color="#22d3ee"
                      maxVal="30"
                    />
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: result.details.url_analysis.has_url ? "#f59e0b" : "#22c55e",
                        marginBottom: 6,
                        fontWeight: 600,
                      }}
                    >
                      {result.details.url_analysis.has_url
                        ? `${result.details.url_analysis.suspicious_domains.length} suspicious domain(s)`
                        : "No URLs detected"}
                    </div>
                    {result.details.url_analysis.suspicious_domains.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: 4, marginTop: 4 }}>
                        {result.details.url_analysis.suspicious_domains.map((d, i) => (
                          <TagChip key={i} text={d} color="#22d3ee" />
                        ))}
                      </div>
                    )}
                  </AgentCard>

                  {/* Pattern Analysis */}
                  <AgentCard icon={FileSearch} title="Pattern Matching" color="#f59e0b" delay={0.3}>
                    <StatRow
                      label="Match Found"
                      value={result.details.pattern_analysis.pattern_matched ? "Yes" : "No"}
                      color={result.details.pattern_analysis.pattern_matched ? "#ef4444" : "#22c55e"}
                    />
                    <StatRow
                      label="Confidence"
                      value={`${Math.round(result.details.pattern_analysis.confidence * 100)}%`}
                      color="#f59e0b"
                    />
                    {result.details.pattern_analysis.matched_pattern && (
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: "0.76rem",
                          padding: "8px 12px",
                          borderRadius: 8,
                          background: "rgba(245,158,11,0.06)",
                          border: "1px solid rgba(245,158,11,0.15)",
                          color: "#f59e0b",
                          fontWeight: 600,
                        }}
                      >
                        {result.details.pattern_analysis.matched_pattern}
                      </div>
                    )}
                  </AgentCard>
                </div>

                {/* ── Extracted Keywords ─── */}
                {result.preprocessed.keywords_found.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ ...glassCard, marginBottom: 16 }}
                  >
                    <h3
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        color: "#e0e0f0",
                        marginBottom: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <CheckCircle size={14} color="#22c55e" />
                      Extracted Keywords
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                      {result.preprocessed.keywords_found.map((kw, i) => (
                        <TagChip key={i} text={kw} color="#f87171" />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}

export default ProjectPage;
