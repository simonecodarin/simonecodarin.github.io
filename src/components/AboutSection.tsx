import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Gamepad2, Code2, Sparkles, Volleyball } from "lucide-react";
import { useTilt } from "@/hooks/useGsap";

gsap.registerPlugin(ScrollTrigger);

const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useTilt(4);
  return <div ref={ref} className={className}>{children}</div>;
};

const experienceYears = new Date().getFullYear() - 2024;

const stats = [
  { value: "Front-End", label: "Focus principale & UI" },
  { value: "Pratico", label: "Approccio concreto al codice" },
  { value: "Vue.js", label: "Framework di riferimento" },
];

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Photo area
      gsap.from("[data-about-photo]", {
        scale: 0.8,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
      });

      // Photo border ring rotation
      gsap.to("[data-about-ring]", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });

      // Title clip reveal
      const titleEl = ref.current?.querySelector("[data-about-title]");
      if (titleEl) {
        gsap.set(titleEl, { clipPath: "inset(0 100% 0 0)" });
        gsap.to(titleEl, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: titleEl, start: "top 85%", once: true },
        });
      }

      // Bio paragraphs
      gsap.from("[data-about-bio]", {
        opacity: 0,
        y: 25,
        filter: "blur(4px)",
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 72%", once: true },
      });

      // Stats counter
      gsap.from("[data-about-stat]", {
        y: 30,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: ref.current, start: "top 65%", once: true },
      });

      // Passion cards
      gsap.from("[data-about-card]", {
        x: 40,
        opacity: 0,
        rotateY: -6,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-about-cards]", start: "top 82%", once: true },
      });

      gsap.from("[data-about-icon]", {
        scale: 0,
        rotation: -180,
        duration: 0.7,
        stagger: 0.12,
        ease: "back.out(2.5)",
        scrollTrigger: { trigger: "[data-about-cards]", start: "top 82%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={ref} className="section-padding">
      <div className="section-container">
        {/* Top: Photo + Intro side by side */}
        <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center mb-16">
          {/* Profile photo area */}
          <div data-about-photo className="flex justify-center md:justify-start">
            <div className="relative">
              {/* Rotating decorative ring */}
              <div
                data-about-ring
                className="absolute -inset-3 rounded-full border-2 border-dashed border-primary/20"
              />
              {/* Photo placeholder */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-secondary border-2 border-border overflow-hidden flex items-center justify-center relative">
                {/* Sfumatura decorativa sopra la foto se vuoi un leggero effetto */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 pointer-events-none z-10" />

                {/* Tua foto a tutto tondo */}
                <img
                  src="/image/io.jpg"
                  alt="Simone Codarin"
                  className="w-full h-full object-cover relative z-0"
                  style={{ objectPosition: "center 15%" }}
                />

                {/* Decorative dot */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 z-20">
                  <Sparkles size={12} className="text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Intro text */}
          <div>
            <h2 data-about-title className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-5">
              Lascia che mi presenti
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg" data-about-bio>
              <p>
                👋 Ciao! Sono Simone, sviluppatore web con una forte predilezione per il front-end e la cura dell'interfaccia.
              </p>
              <p>
                Mi occupo di dare forma a siti e applicazioni web moderne, mettendo al centro l'esperienza utente e la pulizia del codice. Lavoro principalmente 
                con <strong className="text-foreground font-medium">Vue.js</strong> per l'interfaccia, affiancato da <strong className="text-foreground font-medium">.NET Core </strong> 
                per la parte logica quando serve.
              </p>
              <p>
                Arrivo da un percorso un po' diverso: prima di entrare nel mondo dello sviluppo ho lavorato per anni come operaio. 
                Questo mi ha lasciato un approccio molto pratico, concreto e orientato al "fare le cose per bene".  
              </p>
              <p>Fuori dai progetti? Trovi spazio per la pallavolo agonistica e per il gaming.</p>
            </div>
          </div>
        </div>

        {/* Stats / Pillole informative */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {stats.map((s, i) => (
            <div
              key={i}
              data-about-stat
              className="glass-card py-5 px-4 text-center"
            >
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight gradient-text">
                {s.value}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Passions */}
        <div data-about-cards className="grid sm:grid-cols-2 gap-4">
          <TiltCard className="glass-card p-6 flex items-start gap-4">
            <div data-about-card>
              <div className="flex items-start gap-4">
                <div data-about-icon className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Volleyball size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">Pallavolo</h3>
                  <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                    Giocatore di pallavolo e beach volley. Quando non sono al PC, sono in campo.
                  </p>
                </div>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="glass-card p-6 flex items-start gap-4">
            <div data-about-card>
              <div className="flex items-start gap-4">
                <div data-about-icon className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Gamepad2 size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">Tech, Gaming & Hardware</h3>
                  <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                    Passione per l'hardware, i PC assemblati e le sessioni di gaming.
                  </p>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
