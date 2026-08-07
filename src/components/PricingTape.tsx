"use client";
import { useEffect, useRef } from "react";

export default function PricingTape() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg && svg.children.length === 0) {
      const ns = "http://www.w3.org/2000/svg";
      const width = 1120;
      for (let x = 0; x <= width; x += 8) {
        const isMajor = x % 40 === 0;
        const line = document.createElementNS(ns, "line");
        line.setAttribute("x1", String(x));
        line.setAttribute("x2", String(x));
        line.setAttribute("y1", "26");
        line.setAttribute("y2", isMajor ? "8" : "18");
        line.setAttribute("stroke", isMajor ? "#B9873E" : "#DCD3BC");
        line.setAttribute("stroke-width", isMajor ? "1.4" : "1");
        svg.appendChild(line);
      }
    }
  }, []);

  return (
    <div className="tape-divider-pricing" aria-hidden="true">
      <svg ref={svgRef} viewBox="0 0 1120 26" preserveAspectRatio="none"></svg>
    </div>
  );
}