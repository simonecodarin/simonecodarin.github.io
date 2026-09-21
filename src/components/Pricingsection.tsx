import { useEffect, useRef } from "react";
import { Check, Plus, Layers, Globe, Code } from "lucide-react";
import gsap from "gsap";

interface PricingTier {
  id: string;
  name: string;
  description: string;
  delivery: string;
  pricePrefix?: string;
  price: string;
  /** Segnaposto: togli il campo se non applichi IVA */
  priceSuffix?: string;
  /** Nome del pacchetto precedente: se presente, la card mostra "Include tutto di …" e usa il "+" */
  inherits?: string;
  features: string[];
  featured?: boolean;
  ctaLabel: string;
}

const tiers: PricingTier[] = [
  {
    id: "landing",
    name: "Landing page",
    description: "Una pagina per presentarti online, in fretta.",
    delivery: "Consegna in circa 2–3 settimane",
    pricePrefix: "da",
    price: "€350",
    priceSuffix: "+ IVA",
    features: ["Design responsive", "Form di contatto", "1 giro di modifiche incluso"],
    ctaLabel: "Richiedi preventivo",
  },
  {
    id: "vetrina",
    name: "Sito vetrina",
    description: "Più pagine, per presentare la tua attività.",
    delivery: "Consegna in circa 3–4 settimane",
    pricePrefix: "da",
    price: "€800",
    priceSuffix: "+ IVA",
    inherits: "Landing page",
    features: [
      "Fino a 5 pagine",
      "SEO di base (meta tag, sitemap, velocità)",
      "2 giri di modifiche invece di 1",
      "30 giorni di assistenza",
    ],
    featured: true,
    ctaLabel: "Richiedi preventivo",
  },
  {
    id: "webapp",
    name: "Web app su misura",
    description: "Funzionalità custom, backend incluso.",
    delivery: "Il prezzo si definisce dopo l’analisi",
    price: "Su preventivo",
    inherits: "Sito vetrina",
    features: [
      "Analisi dei requisiti",
      "Frontend e backend",
      "Supporto continuativo",
    ],
    ctaLabel: "Parliamone",
  },
];

const notes = [
  {
    icon: Globe,
    title: "Dominio e hosting",
    text: "Non sono inclusi nel prezzo: ti aiuto a sceglierli.",
  },
  {
    icon: Code,
    title: "Il codice è tuo",
    text: "Alla consegna ricevi il codice sorgente del progetto.",
  },
];

const PricingSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll("[data-pricing-card]");
    if (!cards || cards.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(cards, { opacity: 1 });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index ?? 0);
            gsap.fromTo(
              entry.target,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: index * 0.08,
                ease: "power3.out",
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      aria-labelledby="pricing-title"
      className="section-container relative section-padding"
    >
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Preventivo
        </p>
        <h2
          id="pricing-title"
          className="text-3xl md:text-4xl font-bold text-foreground mt-2"
        >
          Pacchetti e prezzi
        </h2>
        <p className="text-muted-foreground mt-4">
          Prezzi indicativi di partenza: ogni progetto è diverso, il
          preventivo finale dipende dalle esigenze specifiche.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 items-stretch">
        {tiers.map((tier, i) => {
          const f = tier.featured;
          const muted = f ? "text-white/85" : "text-muted-foreground";
          const Marker = tier.inherits ? Plus : Check;

          return (
            <article
              key={tier.id}
              data-pricing-card
              data-index={i}
              style={{ opacity: 0 }}
              className={`relative flex flex-col rounded-2xl p-8 ${
                f
                  ? "order-first md:order-none bg-primary dark:bg-[#14275A] text-white border border-primary shadow-xl dark:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.45)] md:-my-3 md:pt-11 md:pb-11"
                  : "bg-background text-foreground border border-border shadow-sm"
              }`}
            >
              {f && (
                <span className="absolute top-0 left-8 -translate-y-1/2 bg-background text-primary border border-primary dark:bg-foreground dark:text-[#14275A] text-[13px] font-semibold leading-none px-3.5 py-2 rounded-full whitespace-nowrap">
                  Più richiesto
                </span>
              )}

              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className={`text-sm mt-1 ${muted}`}>{tier.description}</p>

              <p className="mt-7 flex items-baseline gap-2 font-bold tracking-tight leading-none">
                {tier.pricePrefix && (
                  <span className={`text-base font-medium ${muted}`}>
                    {tier.pricePrefix}
                  </span>
                )}
                <span className={tier.pricePrefix ? "text-5xl" : "text-3xl"}>
                  {tier.price}
                </span>
              </p>
              <p className={`text-sm mt-2 ${muted}`}>{tier.delivery}</p>

              <hr
                className={`my-6 ${f ? "border-white/25" : "border-border"}`}
              />

              {tier.inherits && (
                <p
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 mb-4 text-sm font-medium ${
                    f ? "bg-white/15" : "bg-primary/10"
                  }`}
                >
                  <Layers
                    size={18}
                    aria-hidden="true"
                    className={`shrink-0 ${f ? "text-white" : "text-primary"}`}
                  />
                  Include tutto di {tier.inherits}
                </p>
              )}

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Marker
                      size={18}
                      aria-hidden="true"
                      className={`mt-0.5 shrink-0 ${
                        f ? "text-white" : "text-primary"
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                data-package={tier.id}
                className={`mt-auto w-full inline-flex items-center justify-center rounded-full py-3.5 text-sm font-bold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  f
                    ? "bg-white text-primary dark:text-[#14275A] hover:bg-white/90 focus-visible:outline-white"
                    : "border-[1.5px] border-foreground text-foreground hover:bg-foreground hover:text-background focus-visible:outline-primary"
                }`}
              >
                {tier.ctaLabel}
              </a>
            </article>
          );
        })}
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-border bg-background divide-y divide-border md:divide-y-0 md:divide-x">
        {notes.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-4 p-6 md:px-8">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-foreground">{title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;