"use client";
import { useEffect, useRef, useState } from "react";

export const useMouse = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0, elementX: 0, elementY: 0, elementPositionX: 0, elementPositionY: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setMouse({
          x: e.clientX,
          y: e.clientY,
          elementX: e.clientX - rect.left,
          elementY: e.clientY - rect.top,
          elementPositionX: rect.left,
          elementPositionY: rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return [mouse, ref] as const;
};
