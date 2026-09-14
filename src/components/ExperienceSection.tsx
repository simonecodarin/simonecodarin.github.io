import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Experience {
  company: string;
  role: string;
  period: string;
  description: string | string[];
  tags: string[];
}

const experiences: Experience[] = [
  {
    company: "Maschio Gaspardo S.p.A.",
    role: "Full Stack Developer",
    period: "02/2025 - Attuale",
    description: [
      "Sviluppo e manutenzione di applicativi enterprise per la gestione aziendale, con funzionalità utilizzate da migliaia di utenti in contesti internazionali.",
      "Progettazione e sviluppo backend in C# / ASP.NET Core con architettura a servizi e separazione per domini, integrazione di funzionalità real-time tramite SignalR.",
      "Sviluppo frontend con Vue.js 3 + Vite, realizzazione di dashboard interattive e sistemi complessi (inclusi componenti GIS).",
      "Gestione e ottimizzazione di database SQL Server, con focus su performance, query complesse e affidabilità sotto carichi multi-utente.",
      "Collaborazione nello sviluppo e manutenzione del codice attraverso revisioni e pratiche di qualità del software.",
    ],
    tags: ["Vue.js", "ASP.NET Core", "SQL Server"],
  },
  {
    company: "CG Soluzioni Informatiche",
    role: "Frontend Developer",
    period: "01/2024 - 02/2025",
    description:
      "Sviluppo di pagine web dinamiche utilizzando HTML, CSS e JavaScript, assicurando la compatibilità tra browser e utilizzando Bootstrap per un design reattivo. Creazione e la manutenzione di cataloghi di accesso pubblico online (OPAC), migliorando le attività di supporto clienti tramite materiali stampati e report.",
    tags: ["JavaScript", "React", "ASP.NET Core", "Bootstrap"],
  },
  {
    company: "CDA Distribuzione Automatica",
    role: "Esperienza Professionale",
    period: "12/2017 - 01/2024",
    description:
      "Come caricatore di distributori automatici, ero responsabile di gestire un portafoglio di clienti giornalieri, seguendo una lista predefinita. Il mio ruolo includeva il rifornimento dei distributori automatici con prodotti freschi, la pulizia e la sanificazione delle macchine per garantire il rispetto degli standard igienici, e la raccolta del denaro dalle macchine. Mi spostavo quotidianamente tra i vari punti vendita utilizzando un furgone aziendale, assicurandomi che ogni distributore fosse sempre perfettamente funzionante e pronto per l'uso da parte dei clienti.",
    tags: ["Autonomia", "Problem Solving", "Organizzazione"],
  },
  {
    company: "Publistar",
    role: "Grafico Pubblicitario",
    period: "06/2017 - 12/2017",
    description:
      "Ho lavorato come grafico pubblicitario per un'agenzia di comunicazione, dove ero responsabile della creazione di piccoli banner pubblicitari per una varietà di clienti. Utilizzavo la suite Adobe (Photoshop, Illustrator, InDesign) per sviluppare layout visivamente accattivanti, rispettando le specifiche dei clienti e i requisiti editoriali. I banner creati venivano poi stampati su giornali locali, contribuendo alla promozione dei prodotti e servizi dei clienti. Questo lavoro mi ha permesso di affinare le mie capacità di design e attenzione ai dettagli, lavorando in stretta collaborazione con il team e i clienti per garantire la coerenza visiva e il rispetto delle scadenze.",
    tags: ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Graphic Design"],
  },
];

const ExperienceSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title clip reveal
      const titleEl = ref.current?.querySelector("[data-exp-title]");
      if (titleEl) {
        gsap.set(titleEl, { clipPath: "inset(0 100% 0 0)" });
        gsap.to(titleEl, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: titleEl, start: "top 85%", once: true },
        });
      }

      // Timeline line draws itself
      const line = ref.current?.querySelector("[data-exp-line]");
      if (line) {
        gsap.from(line, {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        });
      }

      // Timeline dots pop in
      gsap.from("[data-exp-dot]", {
        scale: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: "back.out(3)",
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });

      // Cards alternate slide from left/right
      const cards = ref.current?.querySelectorAll("[data-exp-card]");
      cards?.forEach((card, i) => {
        gsap.from(card, {
          x: i % 2 === 0 ? -60 : 60,
          opacity: 0,
          rotateY: i % 2 === 0 ? 5 : -5,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Tags pop in with stagger per card
      cards?.forEach((card) => {
        const tags = card.querySelectorAll("[data-exp-tag]");
        gsap.from(tags, {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            once: true,
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={ref} className="section-padding bg-secondary/30">
      <div className="section-container">
        <h2 data-exp-title className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-12">
          Esperienza
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div data-exp-line className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-border" />

          <div className="flex flex-col gap-8">
            {experiences.map((exp, i) => (
              <div key={i} className="relative md:pl-20">
                {/* Dot */}
                <div data-exp-dot className="hidden md:flex absolute left-6 top-5 w-5 h-5 rounded-full border-2 border-primary bg-background items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div data-exp-card className="glass-card p-6 sm:p-8 transition-shadow duration-300">
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Briefcase size={18} className="text-primary shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground text-base truncate">{exp.company}</h3>
                        <p className="text-sm text-muted-foreground truncate">{exp.role}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        data-exp-tag
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
