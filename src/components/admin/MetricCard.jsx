import React from 'react';

export default function MetricCard({ label, icon: Icon, iconClass, value, subtext, valueStyle }) {
  return (
    <div className="metric-card">
      <div className="metric-card-top">
        <span className="metric-label">{label}</span>
        <div className={`metric-icon-wrap ${iconClass}`}>
          <Icon />
        </div>
      </div>
      <div className="metric-value-wrap">
        <span className="metric-value" style={valueStyle}>
          {value}
        </span>
        <span className="metric-sub">{subtext}</span>
      </div>
    </div>
  );
}
