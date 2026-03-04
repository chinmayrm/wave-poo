import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export function ProjectPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#050508" }}>
      <BackgroundBeamsWithCollision>
        <div
          style={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "56px 48px",
              textAlign: "center" as const,
              maxWidth: 460,
              width: "100%",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                margin: "0 auto 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.06))",
                border: "1px solid rgba(251,191,36,0.2)",
              }}
            >
              <Construction size={34} color="#fbbf24" />
            </div>

            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #fbbf24, #f59e0b, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 12,
              }}
            >
              Coming Soon
            </h1>

            <p
              style={{
                fontSize: "0.95rem",
                color: "#8b8b9e",
                lineHeight: 1.7,
                marginBottom: 32,
              }}
            >
              The AI Scam Interceptor project is under construction.
              <br />
              Stay tuned for launch!
            </p>

            <motion.button
              onClick={() => navigate("/main")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#e0e0f0",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                cursor: "pointer",
              }}
              whileHover={{
                background: "rgba(255,255,255,0.1)",
                y: -2,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeft size={18} />
              Back to Home
            </motion.button>
          </motion.div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}

export default ProjectPage;
