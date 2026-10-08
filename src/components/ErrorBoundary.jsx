import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global ErrorBoundary caught an unhandled exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a1124",
            color: "#eef2ff",
            padding: "20px",
            fontFamily: "monospace",
            textAlign: "center",
          }}
        >
          <div
            className="neo-panel"
            style={{
              maxWidth: "520px",
              padding: "36px",
              background: "hsl(var(--panel))",
              border: "3px solid var(--outline)",
              borderRadius: "var(--radius-panel, 8px)",
              boxShadow: "6px 6px 0 var(--shadow)",
            }}
          >
            <div className="eyebrow-text" style={{ marginBottom: "12px" }}>
              // System Recovered
            </div>
            <p style={{ color: "hsl(var(--soft-text))", marginBottom: "24px", fontSize: "0.9rem" }}>
              A client-side initialization issue occurred. Click below to reload.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="neo-button"
              type="button"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
