import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollProgress } from "@/hooks/useGsap";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const ref = useRef<HTMLElement>(null);
  const progressRef = useScrollProgress();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-footer-anim]", {
        y: 15,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 95%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={progressRef}
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-primary to-[hsl(190,70%,50%)] z-[60] origin-left"
        style={{ transform: "scaleX(0)" }}
      />
      <footer ref={ref} className="py-10 border-t border-border">
        <div className="section-container text-center">
          <p data-footer-anim className="text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Autorizzo il trattamento dei dati personali ai sensi del Dlgs 196/03 e del GDPR (Regolamento UE 2016/679).
            <br /> 
            <span className="flex items-center justify-center gap-1 text-base">
              Leggi la <Link to="/privacy-policy" className="underline opacity-75 hover:opacity-100">Privacy Policy</Link>.
            </span>
          </p>
          <p data-footer-anim className="text-xs text-muted-foreground mt-3">
            © {new Date().getFullYear()} Simone Codarin. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
