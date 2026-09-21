import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCap } from "lucide-react";
import { useTilt } from "@/hooks/useGsap";

gsap.registerPlugin(ScrollTrigger);

const education = [
  {
    title: "Master in Front End Development",
    institution: "Start2Impact",
    description: "Formazione pratica sullo sviluppo web frontend, incentrata sulla creazione di interfacce interattive e cura dell'esperienza utente.",  
  },
  {
    title: "Attestato grafico pubblicitario",
    institution: "Enaip Pasian di Prato",
    description: "Percorso orientato alla comunicazione visiva, alla progettazione grafica e ai fondamenti del design editoriale e pubblicitario.",
  },
  // {
  //   title: "Diploma in Informatica",
  //   institution: "ISIS Malignani",
  //   description: "Fondamenti di programmazione, reti e sistemi informatici.",
  // },
];

const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useTilt(5);
  return <div ref={ref} className={className}>{children}</div>;
};

const EducationSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleEl = ref.current?.querySelector("[data-edu-title]");
      if (titleEl) {
        gsap.set(titleEl, { clipPath: "inset(0 100% 0 0)" });
        gsap.to(titleEl, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: titleEl, start: "top 85%", once: true },
        });
      }

      gsap.from("[data-edu-card]", {
        rotateY: -20,
        x: -50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
      });

      gsap.from("[data-edu-icon]", {
        scale: 0,
        rotation: -270,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="education" ref={ref} className="section-padding bg-secondary/30">
      <div className="section-container">
        <h2 data-edu-title className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-12">
          Formazione
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {education.map((edu, i) => (
            <TiltCard key={i} className="glass-card p-6 flex items-start gap-4">
              <div data-edu-card>
                <div className="flex items-start gap-4">
                  <div data-edu-icon className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">{edu.title}</h3>
                    <p className="text-sm text-primary font-medium mt-0.5">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {edu.description}
                    </p>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
