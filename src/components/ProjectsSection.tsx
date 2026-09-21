import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, Github } from "lucide-react";
import { useTilt } from "@/hooks/useGsap";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Restyling sito web della Fitup",
    description: "Ho voluto rifare il design del sito web della Fitup per renderlo più moderno e responsive.",
    tags: ["Vue.js", "Tailwind CSS", "Gsap", "Responsive Design"],
    image: "/image/projects/fitup-restyle.webp",
    linkCode: "https://github.com/simonecodarin/restyling_sito_fitup",
    linkDemo: "https://restyling-site-fitup.netlify.app/",
    color: "from-primary/15 to-[hsl(190,70%,50%)]/10",
  },
  {
    title: "Film scope",
    description: "Web app per la ricerca di film tramite API di TMDB. Include filtri per genere e la gestione di una watchlist personale salvata su LocalStorage.",
    tags: ["Vue.js", "Tailwind CSS", "Gsap", "Responsive Design", "Local Storage"],
    image: "/image/projects/film-scope.webp",
    linkCode: "https://github.com/simonecodarin/film-scope",
    linkDemo: "https://film-scope.netlify.app/",
    color: "from-[hsl(190,70%,50%)]/15 to-primary/10",
  },
  {
    title: "Pokedex",
    description: "Amante dei pokemon ho voluto ricreare il famoso pokedex, a modo mio.",
    tags: ["Vue.js", "Css", "TypeScript"],
    image: "/image/projects/pokedex.webp",
    linkCode: "https://github.com/simonecodarin/Pokedex",
    linkDemo: "https://full-pokedex.netlify.app/",
    color: "from-primary/10 to-[hsl(260,60%,55%)]/10",
  },
  {
    title: "In Arrivo...",
    description:
      "Nuovi progetti in fase di sviluppo. Resta aggiornato per scoprire le ultime novità.",
    tags: ["Coming Soon"],
    color: "from-muted/50 to-muted/30",
    placeholder: true,
  },
];

const ProjectCard = ({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) => {
  const ref = useTilt(4);

  return (
    <div
      ref={ref}
      data-project-card
      className="glass-card overflow-hidden group"
    >
      <div
        className={`h-44 sm:h-52 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}
      >
        <div
          className={`absolute inset-0 opacity-[1] hover:opacity-[0.8] transition-opacity duration-300 bg-cover bg-center`}
          onClick={() => !project.placeholder && project.linkDemo && window.open(project.linkDemo, "_blank")}
          style={project.image ? { backgroundImage: `url(${project.image})` } : undefined}
        />
        <span className="text-4xl font-black text-foreground/[0.06] tracking-tighter select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
        {!project.placeholder && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors" onClick={() => window.open(project.linkDemo, "_blank")} aria-label="Apri demo live">
              <ExternalLink size={14} />
            </button>
            <button className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors" onClick={() => window.open(project.linkCode, "_blank")} aria-label="Visualizza codice">
              <Github size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3
          className={`font-bold text-base mb-2 ${
            project.placeholder ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              data-project-tag
              className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                project.placeholder
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleEl = ref.current?.querySelector("[data-projects-title]");
      if (titleEl) {
        gsap.set(titleEl, { clipPath: "inset(0 100% 0 0)" });
        gsap.to(titleEl, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: titleEl, start: "top 85%", once: true },
        });
      }

      // Subtitle
      gsap.from("[data-projects-sub]", {
        y: 20,
        opacity: 0,
        filter: "blur(4px)",
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
      });

      gsap.from("[data-project-card]", {
        y: 60,
        opacity: 0,
        scale: 0.92,
        rotateX: -6,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-projects-grid]",
          start: "top 82%",
          once: true,
        },
      });

      const cards = ref.current?.querySelectorAll("[data-project-card]");
      cards?.forEach((card) => {
        gsap.from(card.querySelectorAll("[data-project-tag]"), {
          scale: 0,
          opacity: 0,
          duration: 0.35,
          stagger: 0.04,
          ease: "back.out(2)",
          scrollTrigger: { trigger: card, start: "top 80%", once: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={ref} className="section-padding bg-secondary/30">
      <div className="section-container">
        <h2
          data-projects-title
          className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3"
        >
          I miei lavori
        </h2>
        <p data-projects-sub className="text-muted-foreground mb-12 max-w-full">
          Una selezione dei progetti più significativi a cui ho lavorato, completi di codice, screenshot e anteprime live.
        </p>

        <div data-projects-grid className="grid sm:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
