import React from 'react';
import {
  SiNodedotjs,
  SiExpress,
  SiTypescript,
  SiJavascript,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiMongoose,
  SiRedis,
  SiSocketdotio,
  SiSwagger
} from 'react-icons/si';
import {
  TbApi,
  TbLayersLinked,
  TbHierarchy,
  TbDatabase,
  TbGauge,
  TbShieldLock,
  TbServer2,
  TbSparkles
} from 'react-icons/tb';
import '../styles/TechStack.css';

const skillClusters = [
  {
    id: 'runtime',
    category: 'CORE ARCHITECTURE',
    meta: 'Primary Execution Layer',
    title: 'Server Runtimes & Frameworks',
    description:
      'Architecting resilient, asynchronous server-side services with non-blocking event loops, modular MVC/Clean architecture, and strict type safety.',
    accent: '#38bdf8',
    HeaderIcon: TbServer2,
    skills: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express.js', icon: SiExpress },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Modern ES6+', icon: SiJavascript },
      { name: 'RESTful APIs', icon: TbApi },
      { name: 'Middleware Pipelines', icon: TbLayersLinked },
      { name: 'Clean Architecture / MVC', icon: TbHierarchy }
    ]
  },
  {
    id: 'persistence',
    category: 'STORAGE ENGINE',
    meta: 'Relational & Document',
    title: 'Data Persistence & Schemas',
    description:
      'Designing normalized relational schemas, handling ACID transactions, optimized indexing, and efficient ORM integrations.',
    accent: '#10b981',
    HeaderIcon: TbDatabase,
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'MySQL', icon: SiMysql },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'Mongoose', icon: SiMongoose },
      { name: 'Data Modeling & ERD', icon: TbDatabase },
      { name: 'Query Optimization', icon: TbGauge }
    ]
  },
  {
    id: 'distributed',
    category: 'SERVICES & SECURITY',
    meta: 'Performance & Access',
    title: 'Distributed Caching & Security',
    description:
      'High-throughput caching strategies, pub/sub messaging patterns, strict RBAC/JWT authentication, and contract-driven API documentation.',
    accent: '#818cf8',
    HeaderIcon: TbShieldLock,
    skills: [
      { name: 'Redis (Caching & Pub/Sub)', icon: SiRedis },
      { name: 'JWT & OAuth2 / RBAC', icon: TbShieldLock },
      { name: 'Socket.IO (WebSockets)', icon: SiSocketdotio },
      { name: 'API Security & Rate Limiting', icon: TbShieldLock },
      { name: 'OpenAPI / Swagger', icon: SiSwagger }
    ]
  }
];

export default function TechStack() {
  return (
    <section id="skills" className="techstack-section">
      <div className="techstack-container">
        {/* Section Header */}
        <div className="techstack-header-wrap">
          <div className="techstack-domain-badge">
            <TbSparkles className="star-icon" />
            <span>PRIMARY DOMAIN: BACKEND &amp; ARCHITECTURE (CORE — 80%)</span>
          </div>
          <h2 className="techstack-main-title">Skills &amp; Specializations</h2>
          <p className="techstack-lead-desc">
            An unambiguous technical hierarchy emphasizing Core Backend Architecture, Distributed Systems, and Secure Data Persistence.
          </p>
        </div>

        {/* 3 Unified Skill Cards */}
        <div className="techstack-cards-grid">
          {skillClusters.map((cluster) => {
            const HeaderIcon = cluster.HeaderIcon;
            return (
              <div
                key={cluster.id}
                className="techstack-card"
                style={{ '--cluster-accent': cluster.accent }}
              >
                {/* Top Unified Header */}
                <div className="cluster-header-bar">
                  <div className="cluster-icon-box">
                    <HeaderIcon className="cluster-svg" />
                  </div>

                  {/* Symmetrical Header Pill Group */}
                  <div className="cluster-pill-group">
                    <span className="cluster-primary-pill">{cluster.category}</span>
                    <span className="cluster-meta-label">{cluster.meta}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="cluster-title">{cluster.title}</h3>
                <p className="cluster-description">{cluster.description}</p>

                {/* Skills Tags List */}
                <div className="cluster-skills-list">
                  {cluster.skills.map((skill, index) => {
                    const SkillIcon = skill.icon;
                    return (
                      <div key={index} className="skill-chip-pill">
                        {SkillIcon && <SkillIcon className="skill-chip-icon" />}
                        <span className="skill-chip-name">{skill.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
