// File: frontend/components/Landing.js
import React from "react";
import { motion } from "framer-motion";

export default function Landing({ onOpenModal }) {
  return (
    <div style={styles.pageWrapper}>
      <div style={styles.shadow}></div> {/* Animated Gradient Shadow */}

      <div style={styles.leftSection}>
        <motion.div
          style={styles.newBadge}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Introducing <span style={styles.highlight}>CodeSense</span>
        </motion.div>

        <motion.h1
          style={styles.heading}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          Chat with your CodeBase
        </motion.h1>

        <motion.p
          style={styles.subheading}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          The best way to understand, document, and chat with your codebase.
          Analyze repositories, generate summaries, and streamline development workflows.
        </motion.p>

        <motion.div
          style={styles.buttonRow}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button style={styles.getStartedButton} onClick={onOpenModal}>
            Get Started →
          </button>
          {/* <button style={styles.secondaryButton}>Documentation</button> */}
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "100vh",
    padding: "0 10%",
    color: "#fff",
    backgroundColor: "#000",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  },
  shadow: {
    position: "absolute",
    background: "hsl(220, 90%, 60% / 0%)", // Silverish Blue
    borderRadius: "24px",
    rotate: "35deg",
    zIndex: -1,
    width: "100vw",  // Full width to fit the screen
    height: "100vh", // Full height to fit the screen
    filter: "blur(150px)",
    willChange: "transform",
    animation: "shadowSlide 4s infinite linear alternate",
    overflow: "hidden",  // Prevent overflow
  },
  leftSection: {
    maxWidth: "600px",
    zIndex: 1,
  },
  newBadge: {
    display: "inline-block",
    padding: "6px 12px",
    backgroundColor: "#1c1c1e",
    borderRadius: "20px",
    fontSize: "0.85rem",
    color: "#fff",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
  },
  highlight: {
    background: "linear-gradient(90deg, #ff00ff, #00ffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heading: {
    fontSize: "4rem",
    margin: "0 0 20px 0",
    lineHeight: "1.2",
    color: "#ffffff",
  },
  subheading: {
    fontSize: "1.25rem",
    margin: "0 0 30px 0",
    color: "#9e9e9e",
  },
  buttonRow: {
    display: "flex",
    gap: "20px",
  },
  getStartedButton: {
    backgroundColor: "#ffffff",
    color: "#000",
    border: "none",
    padding: "12px 24px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "30px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "#9e9e9e",
    border: "none",
    padding: "12px 24px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "color 0.3s ease",
  },
  "@keyframes shadowSlide": {
    "0%": {
      background: "hsl(220, 90%, 60% / 20%)",
      right: "460px",
    },
    "100%": {
      background: "hsl(220, 90%, 60% / 80%)",
      right: "160px",
    },
  },
};
