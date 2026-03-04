import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import {
  Shield,
  Users,
  Rocket,
  AlertTriangle,
  Target,
  Lightbulb,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────
const team = [
  { name: "Poorvi I H", role: "Team Lead", initial: "P" },
  { name: "Vaishnavi", role: "Developer", initial: "V" },
  { name: "Neha", role: "Developer", initial: "N" },
];

const challenges = [
  "Sophisticated phishing techniques that evade traditional detection",
  "Lack of real-time threat intelligence and analysis",
  "User awareness gaps in identifying phishing attempts",
  "Need for proactive intervention before damage occurs",
];

// ─── Shared inline-style helpers (pure JS objects) ───────
const card: React.CSSProperties = {
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
  width: 46,
  height: 46,
  borderRadius: 12,
  background: `linear-gradient(135deg, ${from}, ${to})`,
  border: `1px solid ${border}`,
  flexShrink: 0,
});

// ─── Animation variants ──────────────────────────────────
const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.13, delayChildren: 0.15 },
  },
};

const riseUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
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
            padding: "48px 24px",
            overflowY: "auto",
          }}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{
              maxWidth: 960,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 36,
            }}
          >
            {/* ─── Header ─── */}
            <motion.div variants={riseUp} style={{ textAlign: "center" }}>
              <motion.h1
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #c084fc, #818cf8, #38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.1,
                }}
                initial={{ scale: 0.92 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.7 }}
              >
                NovaTech
              </motion.h1>
              <p
                style={{
                  marginTop: 12,
                  fontSize: "1.1rem",
                  color: "#8b8b9e",
                  letterSpacing: "0.04em",
                  fontWeight: 400,
                }}
              >
                WAVE 3.0 — Hackathon 2026
              </p>
            </motion.div>

            {/* ─── Problem Statement Card ─── */}
            <motion.div variants={riseUp} style={card}>
              {/* Card heading */}
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
                      fontSize: "0.8rem",
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

              {/* Two-column inner cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 18,
                }}
              >
                {/* Background */}
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

                {/* Challenges */}
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
                        <span style={{ color: "#fb923c", marginTop: 2 }}>
                          ▸
                        </span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Expected solution */}
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

            {/* ─── Team Members Card ─── */}
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
                    "rgba(56,189,248,0.15)",
                    "rgba(34,211,238,0.08)",
                    "rgba(56,189,248,0.25)"
                  )}
                >
                  <Users size={22} color="#38bdf8" />
                </div>
                <h2
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "#f0f0f5",
                  }}
                >
                  Team Members
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 16,
                }}
              >
                {team.map((m, i) => (
                  <motion.div
                    key={m.name}
                    style={{
                      ...innerCard,
                      textAlign: "center" as const,
                      cursor: "default",
                    }}
                    whileHover={{
                      y: -4,
                      boxShadow: "0 8px 30px rgba(139,92,246,0.12)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.1 }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        margin: "0 auto 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        color: "#fff",
                        background:
                          "linear-gradient(135deg, #a78bfa, #818cf8, #38bdf8)",
                      }}
                    >
                      {m.initial}
                    </div>
                    <p
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#f0f0f5",
                      }}
                    >
                      {m.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "#6b6b80",
                        marginTop: 4,
                      }}
                    >
                      {m.role}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ─── Launch Button ─── */}
            <motion.div
              variants={riseUp}
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: 40,
              }}
            >
              <motion.button
                onClick={() => navigate("/project")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 36px",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#fff",
                  background:
                    "linear-gradient(135deg, #8b5cf6, #6366f1, #0ea5e9)",
                  border: "none",
                  borderRadius: 14,
                  cursor: "pointer",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
                }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Rocket size={20} />
                Launch Project
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}

export default MainPage;
