import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import "../styles/Contact.css";

const channels = [
  {
    name: "GitHub",
    handle: "@profKarim22",
    icon: <FaGithub />,
    description: "Source code, architectural experiments & contributions",
    href: "https://github.com/profKarim22",
  },
  {
    name: "LinkedIn",
    handle: "Karim Abbas El-Ashiry",
    icon: <FaLinkedin />,
    description: "Professional background, network & engineering updates",
    href: "https://www.linkedin.com/in/karim-abbas-el-ashiry-7a5a51361/",
  },
  {
    name: "WhatsApp",
    handle: "+20 105 040 0641",
    icon: <FaWhatsapp />,
    description: "Direct message for quick discussion & project inquiries",
    href: "https://wa.me/201050400641?text=Hello%20Karim",
  },
  {
    name: "Email",
    handle: "profkvrim@gmail.com",
    icon: <FaEnvelope />,
    description: "Formal inquiries, internship & engineering roles",
    href: "mailto:profkvrim@gmail.com",
  },
];

export default function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow-text">// COMMUNICATION &amp; AVAILABILITY</div>
          <h2 className="section-title">Get In Touch</h2>
          <p className="lead-p section-subtitle">
            Open for backend engineering roles, internships, and technical collaborations.
            Feel free to reach out directly through any of these channels.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="contact-grid">
          {channels.map((channel, i) => (
            <a
              key={i}
              href={channel.href}
              className="neo-card contact-neo-card"
              target={channel.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="contact-card-topbar">
                <div className="contact-icon-square">
                  {channel.icon}
                </div>
                <div className="contact-arrow-chip">
                  <FiArrowUpRight size={16} />
                </div>
              </div>

              <div className="contact-title-group">
                <h3 className="contact-name">
                  <strong>{channel.name}</strong>
                </h3>
                <span className="contact-handle">{channel.handle}</span>
              </div>

              <p className="contact-desc">{channel.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
