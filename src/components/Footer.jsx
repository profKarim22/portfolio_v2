import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer neo-footer">
      <div className="container footer-container">
        {/* Original Developer Name Wordmark Preserved */}
        <div className="footer-logo navbar-logo">
          <span className="logo-bracket">&lt;</span>
          <span className="logo-text">Karim Abbas</span>
          <span className="logo-dot">.</span>
          <span className="logo-method">Dev</span>
          <span className="logo-bracket"> /&gt;</span>
        </div>

        <div className="footer-meta-wrap">
          <span className="new-badge footer-badge">
            LAVENDER NEO-BRUTALISM
          </span>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Karim Abbas. Backend Developer &amp; Computer Science Senior.
          </p>
        </div>
      </div>
    </footer>
  );
}
