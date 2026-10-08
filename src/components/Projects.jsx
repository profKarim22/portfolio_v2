import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import ProjectCard from "./ProjectCard";
import "../styles/Projects.css";

// Decorative SVG patterns for the 16:9 poster placeholders
const projectPosters = {
  "birthday-gift-web-experience": {
    category: "Frontend Development",
    keyWord: "Birthday Gift Web Experience",
    duration: "Verified",
    gradient: "linear-gradient(135deg, #fce7f3 0%, #f472b6 100%)",
    symbol: "🎁 REACT // CANVAS",
  },
  "user-greeting": {
    category: "Design System & Frontend",
    keyWord: "UI Component Suite",
    duration: "React + TypeScript",
    gradient: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
    symbol: "📐 FIGMA // RADIX",
  },
  "daily-expense-tracker": {
    category: "Mobile Development",
    keyWord: "Daily Expense Tracker",
    duration: "Verified",
    gradient: "linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)",
    symbol: "📱 FLUTTER // DART",
  },
  "event-system": {
    category: "AI & Platform",
    keyWord: "Event Management System",
    duration: "Node.js + MySQL",
    gradient: "linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)",
    symbol: "🤖 AI // REST API",
  },
  "algorithmic-storytelling": {
    category: "Canvas 2D & DSP Audio",
    keyWord: "Algorithmic Storytelling",
    duration: "60 FPS Locked",
    gradient: "linear-gradient(135deg, #fbcfe8 0%, #d8b4fe 100%)",
    symbol: "⚡ AUDIO // CANVAS",
  },
  "portfolio-site": {
    category: "3D Graphics & Web",
    keyWord: "Developer Portfolio",
    duration: "R3F + WebGL",
    gradient: "linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)",
    symbol: "🎨 3D CARD // VITE",
  },
};

export default function Projects() {
  const { portfolioData } = usePortfolio();
  const projects = portfolioData?.projects || [];

  return (
    <section className="section projects-section" id="projects">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow-text">// VERIFIED WORK &amp; CODEBASES</div>
          <h2 className="section-title">Featured Projects</h2>
          <p className="lead-p section-subtitle">
            Authentic, database-driven and systems engineering projects built from scratch,
            backed by active GitHub repositories and production deployments.
          </p>
        </div>

        {/* Neo-Brutalist Projects Grid using reusable ProjectCard */}
        <div className="projects-grid">
          {projects.map((project, index) => {
            const posterInfo = projectPosters[project.id] || {
              category: project.domain || "Backend",
              keyWord: project.title,
              duration: "Verified",
              gradient: "linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 100%)",
              symbol: "ENGINEERING",
            };

            return (
              <ProjectCard
                key={project._id || project.id || project.title}
                project={project}
                index={index}
                posterInfo={posterInfo}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
