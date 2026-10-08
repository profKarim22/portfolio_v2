import React from "react";
import { FiBookOpen, FiServer, FiCompass } from "react-icons/fi";
import "../styles/About.css";

const aboutData = [
  {
    id: "academic",
    category: "Academic",
    titleKey: "Computer Science Senior",
    badge: "Education",
    Icon: FiBookOpen,
    subtitle: "Higher Institute of CS & IS — 6th of October City • Level 04",
    description:
      "Developing a rigorous computer science foundation in operating systems, database internals, algorithmic problem solving, and object-oriented principles.",
    chips: [
      "Operating Systems",
      "Database Internals",
      "Data Structures",
      "Algorithmic Problem Solving",
    ],
  },
  {
    id: "specialty",
    category: "Core Domain",
    titleKey: "Backend Engineering",
    badge: "Specialty",
    isPrimary: true,
    Icon: FiServer,
    subtitle: "Node.js • Express.js • MySQL • MongoDB • RESTful APIs",
    description:
      "Architecting clean, modular server-side applications with Node.js, designing robust REST APIs, modeling relational & document databases, and implementing secure JWT authentication.",
    chips: [
      "Node.js & Express.js",
      "RESTful API Design",
      "MySQL & MongoDB",
      "JWT & Auth Security",
      "Clean MVC Architecture",
    ],
  },
  {
    id: "horizons",
    category: "Horizons",
    titleKey: "Systems & Client-Side",
    badge: "Exploratory",
    Icon: FiCompass,
    subtitle: "C++ • Redis • Modern Web • Flutter Basics",
    description:
      "Reinforcing low-level system understanding with C++ and OOP, experimenting with in-memory Redis caching, and building modern frontend interfaces with React.",
    chips: [
      "C++ & OOP Foundations",
      "Redis Caching Basics",
      "Modern React UI",
      "Basic Flutter",
    ],
  },
];

export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow-text">// ACADEMIC &amp; ENGINEERING IDENTITY</div>
          <h2 className="section-title">About Me</h2>
          <p className="lead-p section-subtitle">
            An authentic, modest overview of my academic foundation at HICIS 6th of October,
            core backend engineering focus, and supporting technical horizons.
          </p>
        </div>

        {/* 3 Neo-Card Grid */}
        <div className="about-cards-grid">
          {aboutData.map((card) => {
            const IconComponent = card.Icon;
            return (
              <div
                key={card.id}
                className={`neo-card about-neo-card ${card.isPrimary ? "is-featured-about" : ""}`}
              >
                {/* Header Row */}
                <div className="about-card-topbar">
                  <div className="about-icon-square">
                    <IconComponent size={20} />
                  </div>
                  <span className={card.isPrimary ? "new-badge" : "about-pill-badge"}>
                    {card.badge}
                  </span>
                </div>

                {/* Card Title (per prompt: category regular, key word weight 800) */}
                <div className="about-title-block">
                  <span className="about-category-label">{card.category} /</span>
                  <h3 className="about-main-name">
                    <strong>{card.titleKey}</strong>
                  </h3>
                  <p className="about-sub-label">{card.subtitle}</p>
                </div>

                {/* Description */}
                <p className="about-card-desc">{card.description}</p>

                {/* Chips Grid */}
                <div className="about-chips-list">
                  {card.chips.map((chip, idx) => (
                    <span key={idx} className="about-neo-chip">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
