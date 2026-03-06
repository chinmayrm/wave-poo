import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import {
  Shield,
  Rocket,
  AlertTriangle,
  Target,
  Lightbulb,
  Brain,
  Link2,
  FileSearch,
  Gauge,
  Zap,
  Lock,
  Eye,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────
const challenges = [
  "Sophisticated phishing techniques that evade traditional detection",
  "Lack of real-time threat intelligence and analysis",
  "User awareness gaps in identifying phishing attempts",
  "Need for proactive intervention before damage occurs",
];

const pipelineSteps = [
  {
    icon: Brain,
    title: "Text Analysis",
    desc: "NLP-powered scam language detection across 6 threat categories",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
  },
  {
    icon: Link2,
    title: "URL Verification",
    desc: "Deep URL inspection for phishing indicators and domain squatting",
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.08)",
    border: "rgba(34,211,238,0.2)",
  },
  {
    icon: FileSearch,
    title: "Pattern Matching",
    desc: "Cross-reference against 8+ known fraud template databases",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    icon: Gauge,
    title: "Risk Scoring",
    desc: "Aggregated threat assessment with actionable classification",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
  },
];

const features = [
  {
    icon: Zap,
    title: "Real-Time Detection",
    desc: "Instant analysis of suspicious messages with sub-second response times",
    color: "#f59e0b",
  },
  {
    icon: Lock,
    title: "Zero Data Storage",
    desc: "Messages are analyzed in-memory and never persisted to any database",
    color: "#22c55e",
  },
  {
    icon: Eye,
    title: "Transparent AI",
    desc: "Full breakdown of every agent's reasoning — no black box decisions",
    color: "#a78bfa",
  },
];

const techStack = [
  { name: "FastAPI", color: "#009688" },
  { name: "React 19", color: "#61dafb" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "Python", color: "#3776ab" },
  { name: "Framer Motion", color: "#ff0050" },
  { name: "Pydantic", color: "#e92063" },
];

// ─── Shared styles ───────────────────────────────────────
const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.035)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 20,
  padding: "32px 36px",
};

const innerCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: 14,
  padding: "22px 24px",
};

const iconBox = (
  from: string,
  to: string,
  border: string
): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  borderRadius: 14,
  background: `linear-gradient(135deg, ${from}, ${to})`,
  border: `1px solid ${border}`,
  flexShrink: 0,
});

const sectionTitle: React.CSSProperties = {
  fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
  fontWeight: 800,
  color: "#f0f0f5",
  letterSpacing: "-0.02em",
  marginBottom: 8,
};

const sectionSub: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#6b6b80",
  maxWidth: 520,
  lineHeight: 1.6,
};

// ─── Animation variants ──────────────────────────────────
const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const riseUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─── Page ────────────────────────────────────────────────
export function MainPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#050508" }}>
      <BackgroundBeamsWithCollision>
        <div
          style={{
            width: "100%",
            minHeight: "100vh",
            padding: "48px 24px 80px",
            overflowY: "auto",
          }}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{
              maxWidth: 1040,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 48,
            }}
          >
            {/* ═══════════════════════════════════════════
                HERO SECTION
               ═══════════════════════════════════════════ */}
            <motion.div
              variants={riseUp}
              style={{ textAlign: "center", paddingTop: 20, paddingBottom: 8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: "#a78bfa",
                  background: "rgba(167,139,250,0.08)",
                  border: "1px solid rgba(167,139,250,0.15)",
                  borderRadius: 100,
                  marginBottom: 20,
                  textTransform: "uppercase" as const,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#a78bfa",
                    animation: "pulse-glow 2s ease-in-out infinite",
                  }}
                />
                WAVE 3.0 — Hackathon 2026
              </motion.div>

              {/* Main Title */}
              <motion.h1
                style={{
                  fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  background: "linear-gradient(135deg, #c084fc 0%, #818cf8 40%, #38bdf8 70%, #22d3ee 100%)",
                  backgroundSize: "200% auto",
                  animation: "gradient-shift 6s ease infinite",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.05,
                }}
                initial={{ scale: 0.92 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
              >
                NovaTech
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  marginTop: 16,
                  fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                  color: "#8b8b9e",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: 600,
                  margin: "16px auto 0",
                }}
              >
                Multi-agent AI system that autonomously detects, intercepts, and
                classifies phishing attacks in real time.
              </motion.p>

              {/* Hero CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 14,
                  marginTop: 32,
                  flexWrap: "wrap" as const,
                }}
              >
                <motion.button
                  onClick={() => navigate("/project")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 32px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#fff",
                    background: "linear-gradient(135deg, #7c3aed, #6366f1, #0ea5e9)",
                    border: "none",
                    borderRadius: 14,
                    cursor: "pointer",
                    boxShadow: "0 4px 28px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
                    fontFamily: "inherit",
                  }}
                  whileHover={{ scale: 1.03, y: -2, boxShadow: "0 8px 40px rgba(99,102,241,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Rocket size={18} />
                  Launch Interceptor
                  <ArrowRight size={16} />
                </motion.button>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 40,
                  marginTop: 40,
                  flexWrap: "wrap" as const,
                }}
              >
                {[
                  { value: "4", label: "AI Agents" },
                  { value: "8+", label: "Scam Patterns" },
                  { value: "6", label: "Threat Categories" },
                  { value: "<1s", label: "Response Time" },
                ].map(({ value, label }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #c084fc, #38bdf8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "#6b6b80",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase" as const,
                        marginTop: 2,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ═══════════════════════════════════════════
                PROBLEM STATEMENT CARD
               ═══════════════════════════════════════════ */}
            <motion.div variants={riseUp} style={card}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <div
                  style={iconBox(
                    "rgba(251,113,133,0.15)",
                    "rgba(244,63,94,0.08)",
                    "rgba(244,63,94,0.25)"
                  )}
                >
                  <AlertTriangle size={22} color="#fb7185" />
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "#f0f0f5",
                    }}
                  >
                    Problem Statement
                  </h2>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "#38bdf8",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    Agentic AI — Scam Interceptor
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 18,
                }}
              >
                <div style={innerCard}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Shield size={18} color="#a78bfa" />
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#c4b5fd",
                      }}
                    >
                      Phishing Detection & Awareness
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      lineHeight: 1.7,
                      color: "#a1a1b5",
                    }}
                  >
                    With the rise of digital communication, phishing attacks have
                    become increasingly sophisticated — targeting individuals and
                    organizations through deceptive emails, messages, and
                    websites. These attacks exploit human psychology to steal
                    sensitive information, leading to financial losses and data
                    breaches.
                  </p>
                </div>

                <div style={innerCard}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Target size={18} color="#fb923c" />
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#fdba74",
                      }}
                    >
                      Key Challenges
                    </span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {challenges.map((c) => (
                      <li
                        key={c}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          fontSize: "0.85rem",
                          color: "#a1a1b5",
                          lineHeight: 1.65,
                          marginBottom: 8,
                        }}
                      >
                        <span style={{ color: "#fb923c", marginTop: 2 }}>▸</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ ...innerCard, marginTop: 18 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <Lightbulb size={18} color="#4ade80" />
                  <span
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#86efac",
                    }}
                  >
                    Expected Solution
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.7,
                    color: "#a1a1b5",
                  }}
                >
                  Develop an AI-powered agentic system that autonomously detects,
                  intercepts, and alerts users about potential phishing attacks in
                  real-time. The solution should integrate seamlessly with
                  existing communication platforms, provide educational feedback
                  to users, and continuously learn from new phishing patterns to
                  stay ahead of evolving threats.
                </p>
              </div>
            </motion.div>

            {/* ═══════════════════════════════════════════
                HOW IT WORKS — AGENT PIPELINE
               ═══════════════════════════════════════════ */}
            <motion.div variants={riseUp}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <h2 style={sectionTitle}>How It Works</h2>
                <p style={{ ...sectionSub, margin: "0 auto" }}>
                  Four specialized AI agents work in sequence — each adding a
                  layer of analysis to produce a final threat assessment.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {pipelineSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.title}
                      variants={scaleIn}
                      whileHover={{
                        y: -4,
                        borderColor: step.border,
                        background: step.bg,
                      }}
                      style={{
                        ...innerCard,
                        position: "relative",
                        cursor: "default",
                        transition: "border-color 0.3s, background 0.3s",
                      }}
                    >
                      {/* Step number */}
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 14,
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: step.color,
                          opacity: 0.5,
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        AGENT {i + 1}
                      </div>

                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: step.bg,
                          border: `1px solid ${step.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 14,
                        }}
                      >
                        <Icon size={20} color={step.color} />
                      </div>

                      <h3
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: "#e0e0f0",
                          marginBottom: 6,
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#8b8b9e",
                          lineHeight: 1.55,
                        }}
                      >
                        {step.desc}
                      </p>

                      {/* Connector arrow (skip last) */}
                      {i < pipelineSteps.length - 1 && (
                        <div
                          style={{
                            position: "absolute",
                            right: -12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "rgba(255,255,255,0.12)",
                            zIndex: 2,
                            display: "none", // hidden on mobile
                          }}
                          className="pipeline-arrow"
                        >
                          <ChevronRight size={18} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* ═══════════════════════════════════════════
                FEATURES
               ═══════════════════════════════════════════ */}
            <motion.div variants={riseUp}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <h2 style={sectionTitle}>Key Features</h2>
                <p style={{ ...sectionSub, margin: "0 auto" }}>
                  Built with security and transparency at the core.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <motion.div
                      key={f.title}
                      variants={scaleIn}
                      whileHover={{ y: -3 }}
                      style={{
                        ...card,
                        padding: "26px 28px",
                        cursor: "default",
                      }}
                    >
                      <Icon size={22} color={f.color} style={{ marginBottom: 14 }} />
                      <h3
                        style={{
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "#e0e0f0",
                          marginBottom: 8,
                        }}
                      >
                        {f.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          color: "#8b8b9e",
                          lineHeight: 1.6,
                        }}
                      >
                        {f.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* ═══════════════════════════════════════════
                TECH STACK
               ═══════════════════════════════════════════ */}
            <motion.div variants={riseUp} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "#6b6b80",
                  textTransform: "uppercase" as const,
                  marginBottom: 14,
                }}
              >
                Built With
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  flexWrap: "wrap" as const,
                }}
              >
                {techStack.map((t) => (
                  <span
                    key={t.name}
                    style={{
                      padding: "6px 14px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: t.color,
                      background: `${t.color}12`,
                      border: `1px solid ${t.color}25`,
                      borderRadius: 8,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* ═══════════════════════════════════════════
                CTA + FOOTER
               ═══════════════════════════════════════════ */}
            <motion.div
              variants={riseUp}
              style={{
                textAlign: "center",
                paddingBottom: 20,
              }}
            >
              <motion.button
                onClick={() => navigate("/project")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 36px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#fff",
                  background: "linear-gradient(135deg, #7c3aed, #6366f1, #0ea5e9)",
                  border: "none",
                  borderRadius: 14,
                  cursor: "pointer",
                  boxShadow: "0 4px 28px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
                  fontFamily: "inherit",
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Rocket size={18} />
                Try the Interceptor
                <ArrowRight size={16} />
              </motion.button>

              <p
                style={{
                  marginTop: 32,
                  fontSize: "0.72rem",
                  color: "#4a4a5a",
                  letterSpacing: "0.04em",
                }}
              >
                Team NovaTech — WAVE 3.0 Hackathon 2026
              </p>
            </motion.div>
          </motion.div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}

export default MainPage;
