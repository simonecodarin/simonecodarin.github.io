import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, Server, Database } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: "Frontend",
    icon: <Globe className="w-5 h-5 text-primary" />,
    skills: [
      { name: "Vue.js", desc: "Framework principale, Composition API, Pinia" },
      { name: "JavaScript", desc: "Sviluppo logica lato client, ES6+" },
      { name: "Tailwind Css", desc: "Styling rapido e responsivo" },
      { name: "Gsap", desc: "Animazioni web ad alte prestazioni" },
    ],
  },
  {
    title: "Backend",
    icon: <Server className="w-5 h-5 text-primary" />,
    skills: [
      { name: ".NET Core", desc: "Sviluppo API e logica server-side" },
      { name: "C#", desc: "Linguaggio principale per il backend" },
      { name: "Api Rest", desc: "Progettazione e implementazione servizi web" },
    ],
  },
  {
    title: "Database",
    icon: <Database className="w-5 h-5 text-primary" />,
    skills: [
      { name: "SQL Server", desc: "Gestione database relazionali e query" },
    ],
  },
];

const SkillsSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleEl = ref.current?.querySelector("[data-skill-title]");
      if (titleEl) {
        gsap.set(titleEl, { clipPath: "inset(0 100% 0 0)" });
        gsap.to(titleEl, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: titleEl, start: "top 85%", once: true },
        });
      }

      gsap.from("[data-skill-card]", {
        scale: 0.95,
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={ref} className="section-padding relative bg-transparent overflow-hidden">
      <div className="section-container">
        
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 data-skill-title className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Competenze Tecniche
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Gli strumenti e le tecnologie che utilizzo con padronanza per sviluppare soluzioni web robuste ed efficienti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((cat) => (
            <div 
              key={cat.title} 
              data-skill-card 
              className="flex h-full"
            >
              <div className="flex flex-col w-full glass-card p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-300 group">
                
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/40">
                  <div className="p-3 rounded-2xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-foreground text-2xl tracking-tight">{cat.title}</h3>
                </div>

                <div className="flex flex-col gap-4 flex-grow">
                  {cat.skills.map((skill) => (
                    <div 
                      key={skill.name}
                      className="p-5 rounded-2xl bg-secondary/60 border border-border/50"
                    >
                      <div className="font-semibold text-foreground text-base tracking-tight">
                        {skill.name}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {skill.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;