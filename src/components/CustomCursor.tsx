import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Disattiva il cursore personalizzato su dispositivi touch/mobili
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const onMouseMove = (e: MouseEvent) => {
      // Il puntino segue immediatamente il mouse
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      // Il cerchio esterno segue con un effetto "lag" morbido
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // Gestione degli elementi cliccabili (link, bottoni) per ingrandire il cursore
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("magnetic-btn")
      ) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("magnetic-btn")
      ) {
        setIsHovered(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  // Nascondi sui dispositivi touch
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Puntino centrale */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-primary rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />

      {/* Cerchio esterno fluido con effetto hover dinamico */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 border border-primary/50 ${
          isHovered
            ? "w-14 h-14 bg-primary/10 scale-125"
            : "w-8 h-8 bg-transparent"
        }`}
      />
    </>
  );
};

export default CustomCursor;