import React from 'react';

interface NexusLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'amber' | 'white' | 'monochrome';
}

export const NexusSymbol: React.FC<{ className?: string; color?: string }> = ({
  className = "w-7 h-7",
  color = "#FFAC2F"
}) => {
  return (
    <svg
      viewBox="0 0 120 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="NEXUS Symbol"
    >
      {/* Top Stem */}
      <polygon
        points="46.84,10 64.74,10 73.68,25.79 64.21,40.53"
        fill={color}
      />
      {/* Right Wing */}
      <polygon
        points="93.16,25.79 111.58,25.79 83.68,74.21 74.74,58.42"
        fill={color}
      />
      {/* Bottom Stem */}
      <polygon
        points="73.16,90 55.26,90 46.32,74.21 55.79,59.47"
        fill={color}
      />
      {/* Left Wing */}
      <polygon
        points="8.42,74.21 36.32,25.79 45.26,41.58 26.84,74.21"
        fill={color}
      />
    </svg>
  );
};

export const NexusLogo: React.FC<NexusLogoProps> = ({
  className = "",
  showWordmark = true,
  size = "md",
  variant = "amber"
}) => {
  const symbolColor = variant === "white" ? "#FFFFFF" : variant === "monochrome" ? "currentColor" : "#FFAC2F";
  const textColor = variant === "white" ? "text-white" : variant === "monochrome" ? "text-current" : "text-nexus-warm";

  const sizeClasses = {
    sm: { symbol: "w-5 h-5", text: "text-base tracking-[0.22em]" },
    md: { symbol: "w-7 h-7", text: "text-xl tracking-[0.25em]" },
    lg: { symbol: "w-9 h-9", text: "text-2xl tracking-[0.28em]" },
    xl: { symbol: "w-12 h-12", text: "text-3xl tracking-[0.3em]" }
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <NexusSymbol className={`${sizeClasses.symbol} transition-transform duration-300 hover:scale-105`} color={symbolColor} />
      {showWordmark && (
        <span className={`font-heading font-bold uppercase ${sizeClasses.text} ${textColor}`}>
          NEXUS
        </span>
      )}
    </div>
  );
};

export default NexusLogo;

