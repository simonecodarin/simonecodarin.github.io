import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import gsap from "gsap";

const navLinks = [
  { label: "Chi Sono", href: "#about" },
  { label: "Progetti", href: "#projects" },
  { label: "Esperienza", href: "#experience" },
  { label: "Competenze", href: "#skills" },
  { label: "Formazione", href: "#education" },
  { label: "Preventivi", href: "#pricing" },
  { label: "Contatti", href: "#contact" },
];


const Navbar = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-nav-item]", {
        y: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from("[data-nav-logo]", {
        x: -20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!mobileRef.current) return;
    if (menuOpen) {
      gsap.fromTo(
        mobileRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" }
      );
      gsap.from(mobileRef.current.querySelectorAll("a"), {
        x: -20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.3,
        ease: "power3.out",
        delay: 0.1,
      });
    }
  }, [menuOpen]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="section-container flex items-center justify-between h-[var(--nav-height)]">
        <a data-nav-logo href="#" className="text-lg font-bold tracking-tight text-foreground">
          &lt;S<span className="text-[#0A8F2F] dark:text-[#03D92D]">C/&gt;</span>
          <span className="text-primary">.</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-nav-item
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
            >
              {l.label}
            </a>
          ))}
          <button
            data-nav-item
            onClick={() => setDark(!dark)}
            className="magnetic-btn p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200"
            aria-label="Cambia tema"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Cambia tema"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div ref={mobileRef} className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden">
          <div className="section-container py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground py-2 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
