import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, FileDown } from "lucide-react";
import { useMagnetic, useParallax } from "@/hooks/useGsap";

gsap.registerPlugin(ScrollTrigger);

const TYPING_TEXTS = [
  "Frontend developer",
  "Backend developer",
  "Graphic designer",
  "Freelancer",
];

const MagneticButton = ({
  href,
  children,
  variant = "primary",
  download,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  download?: string | boolean;
}) => {
  const ref = useMagnetic(0.3);
  const classes =
    variant === "primary"
      ? "magnetic-btn px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:brightness-110 transition-all duration-200"
      : "magnetic-btn px-7 py-3.5 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-all duration-200";

  return (
    <a href={href} download={download} ref={ref as any} className={classes}>
      {children}
    </a>
  );
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const orbRef = useParallax(-0.15);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Typing effect
  useEffect(() => {
    const current = TYPING_TEXTS[textIndex];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setTypedText(current.slice(0, charIndex + 1));
          if (charIndex + 1 === current.length) {
            setTimeout(() => setDeleting(true), 1800);
          } else {
            setCharIndex(charIndex + 1);
          }
        } else {
          setTypedText(current.slice(0, charIndex));
          if (charIndex === 0) {
            setDeleting(false);
            setTextIndex((textIndex + 1) % TYPING_TEXTS.length);
          } else {
            setCharIndex(charIndex - 1);
          }
        }
      },
      deleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex]);

  // Rich GSAP entrance choreography
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Background orbs float in
      tl.from("[data-hero-orb]", {
        scale: 0,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        stagger: 0.2,
      }, 0);

      // Name slides up with rotation
      tl.from("[data-hero-name]", {
        yPercent: 120,
        rotateX: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }, 0.2);

      // H1 split word reveal
      tl.from("[data-hero-word]", {
        yPercent: 110,
        opacity: 0,
        rotateX: -40,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      }, 0.4);

      // Typing area
      tl.from("[data-hero-typing]", {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: "power2.out",
      }, 0.9);

      // Description chars fade in
      tl.from("[data-hero-desc]", {
        opacity: 0,
        y: 20,
        filter: "blur(8px)",
        duration: 0.8,
        ease: "power3.out",
      }, 1);

      // Buttons elastic entrance
      tl.from("[data-hero-btn]", {
        scale: 0.8,
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.12,
        ease: "back.out(1.7)",
      }, 1.2);

      // Scroll indicator bounce
      tl.from("[data-hero-scroll]", {
        opacity: 0,
        y: -10,
        duration: 0.6,
        ease: "power2.out",
      }, 1.5);

      // Floating orbs continuous animation
      gsap.to("[data-hero-orb]", {
        y: "random(-20, 20)",
        x: "random(-15, 15)",
        duration: "random(4, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.5,
          from: "random",
        },
      });

      // Scroll indicator pulsing
      gsap.to("[data-hero-scroll]", {
        y: 8,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Parallax on scroll for hero content
      gsap.to("[data-hero-content]", {
        y: 100,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // const h1Words = "Sviluppatore Full Stack".split(" ");
  const h1Words = "Simone Codarin".split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center pt-[var(--nav-height)] overflow-hidden"
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          data-hero-orb
          ref={orbRef}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.06] blur-3xl"
        />
        <div
          data-hero-orb
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(190,70%,50%)]/[0.04] blur-3xl"
        />
        <div
          data-hero-orb
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/[0.04] blur-3xl"
        />
      </div>

      <div data-hero-content className="section-container text-center relative z-10">
        <div className="overflow-hidden mb-4">
          <p
            data-hero-name
            className="text-sm font-semibold tracking-widest uppercase text-primary inline-block"
          >
            {/* Simone Codarin */} Sviluppatore Full Stack
          </p>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] flex flex-wrap items-center justify-center gap-x-4">
          {h1Words.map((word, i) => (
            <span key={i} className="overflow-hidden inline-block">
              <span data-hero-word className="inline-block">
                {word}
              </span>
            </span>
          ))}
        </h1>

        <div data-hero-typing className="mt-4 h-8 flex items-center justify-center">
          <span className="text-lg sm:text-xl font-medium text-primary">
            {typedText}
          </span>
          <span className="inline-block w-0.5 h-6 bg-primary ml-0.5 animate-cursor-blink" />
        </div>

        <p
          data-hero-desc
          className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Sviluppatore web orientato al front-end. Trasformo le idee in siti e applicazioni reali, concentrandomi su interfacce curate, codice pulito e un'esperienza utente impeccabile.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div data-hero-btn>
            <MagneticButton href="#projects" variant="primary">
              <ArrowDown size={16} className="mr-2" />
              Guarda i progetti
            </MagneticButton>
          </div>
          <div data-hero-btn>
            <MagneticButton
              href="/Simone_Codarin_CV.pdf"
              download="Simone_Codarin_CV.pdf"
              variant="outline"
            >
              <FileDown size={16} className="mr-2" />
              Scarica CV
            </MagneticButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div data-hero-scroll className="mt-16 flex flex-col items-center gap-1 text-muted-foreground">
          <span className="text-xs font-medium tracking-wider uppercase">Scorri</span>
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
