import React from "react";

interface TooltipProps {
  x: number;
  y: number;
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ x, y, content }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        background: "rgba(255, 255, 255, 0.9)", // Changed to semi-transparent white
        border: "1px solid rgba(0, 0, 0, 0.2)", // Made border slightly transparent
        padding: "5px",
        borderRadius: "5px",
        pointerEvents: "none",
        zIndex: 1000,
        maxWidth: "200px",
        fontSize: "12px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added subtle shadow for better visibility
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
