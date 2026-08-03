"use client";
import { useEffect } from "react";

export default function TapeMeasureEffects() {
  useEffect(() => {
    const ns = "http://www.w3.org/2000/svg";
    const g = document.querySelectorAll(".tape-divider g")[0];
    if (g && g.children.length === 0) {
      const width = 1120;
      for (let x = 0; x <= width; x += 8) {
        const isMajor = x % 40 === 0;
        const line = document.createElementNS(ns, "line");
        line.setAttribute("x1", String(x));
        line.setAttribute("x2", String(x));
        line.setAttribute("y1", "34");
        line.setAttribute("y2", isMajor ? "14" : "24");
        line.setAttribute("stroke", isMajor ? "#B9873E" : "#4A5468");
        line.setAttribute("stroke-width", isMajor ? "1.4" : "1");
        g.appendChild(line);
      }
    }

    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}