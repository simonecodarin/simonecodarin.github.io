import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send } from "lucide-react";
import { useMagnetic, useTilt } from "@/hooks/useGsap";
import { FaWhatsapp, FaLinkedin, FaGithub, FaTelegram } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const SocialCard = ({ href, icon: Icon, label, sub }: { href: string; icon: any; label: string; sub: string }) => {
  const ref = useTilt(4);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      ref={ref as any}
      data-contact-social
      className="glass-card p-3 flex items-center gap-4 group transition-shadow duration-300 min-w-0"
    >
      <Icon size={22} className="text-primary shrink-0" />
      <div className="min-w-0">
        <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{sub}</p>
      </div>
    </a>
  );
};

const ContactSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useMagnetic(0.25);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title clip reveal
      const titleEl = ref.current?.querySelector("[data-contact-title]");
      if (titleEl) {
        gsap.set(titleEl, { clipPath: "inset(0 100% 0 0)" });
        gsap.to(titleEl, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: titleEl, start: "top 85%", once: true },
        });
      }

      // Form fields slide up one by one
      gsap.from("[data-contact-field]", {
        y: 30,
        opacity: 0,
        filter: "blur(4px)",
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });

      // Social cards slide in from right
      gsap.from("[data-contact-social]", {
        x: 50,
        opacity: 0,
        rotateY: -8,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
      });

      // Submit button elastic
      gsap.from("[data-contact-btn]", {
        scale: 0.7,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ref.current, start: "top 65%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Inserisci un indirizzo email valido.");
      return;
    }

    if (form.message.trim().length < 15) {
      setError("Raccontami qualcosa in più!");
      return;
    }

    try {
      const response = await fetch("https://formspree.io/f/xoeqbdjg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSent(true);
        setTimeout(() => setSent(false), 4000);
        setForm({ name: "", email: "", message: "" });
      } else {
        setError("C'è stato un problema nell'invio. Riprova tra poco!");
      }
    } catch (err) {
      console.error("Errore:", err);
      setError("Errore di connessione. Controlla la rete.");
    }
  };

  return (
    <section id="contact" ref={ref} className="section-padding overflow-x-hidden">
      <div className="section-container">
        <h2 data-contact-title className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
          Contatti
        </h2>
        <p data-contact-field className="text-muted-foreground mb-10 max-w-lg">
          Hai un progetto in mente? Scrivimi e parliamone.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <input
              data-contact-field
              type="text"
              placeholder="Nome"
              required
              maxLength={100}
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (error) setError("");
              }}
              className="px-4 py-3 rounded-xl bg-secondary/60 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
            <input
              data-contact-field
              type="email"
              placeholder="Email"
              required
              maxLength={255}
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (error) setError("");
              }}
              className={`px-4 py-3 rounded-xl bg-secondary/60 border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${error.includes("email") ? "border-red-500 ring-2 ring-red-500/50" : "border-border"
                }`}
            />
            <textarea
              data-contact-field
              placeholder="Messaggio (min. 15 caratteri)"
              required
              maxLength={1000}
              rows={5}
              value={form.message}
              onChange={(e) => {
                setForm({ ...form, message: e.target.value });
                if (error) setError("");
              }}
              className={`px-4 py-3 rounded-xl bg-secondary/60 border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none ${error.includes("messaggio") || error.includes("corto") ? "border-red-500 ring-2 ring-red-500/50" : "border-border"
                }`}
            />

            <div data-contact-btn className="mt-2">
              <button
                type="submit"
                aria-label="Invia messaggio"
                ref={btnRef as any}
                className={`magnetic-btn self-start px-7 py-3 rounded-full font-semibold text-sm shadow-lg transition-all duration-300 ${sent
                    ? "bg-emerald-600 text-white shadow-emerald-600/30 scale-[1.02]"
                    : error
                      ? "bg-red-600 text-white shadow-red-600/30 scale-[1.02]"
                      : "bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/30 hover:brightness-110"
                  }`}
              >
                <Send size={16} className={`mr-2 inline ${error ? "animate-bounce" : ""}`} />
                {sent
                  ? "Inviato, ti ricontatterò al più presto ✓"
                  : error
                    ? error
                    : "Invia messaggio"}
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <SocialCard
                href="https://wa.me/393337067474?text=Ciao%20Simone,%20ho%20visto%20il%20tuo%20portfolio%20e%20vorrei%20parlarti%20di%20un%20progetto."
                icon={FaWhatsapp}
                label="WhatsApp"
                sub="Scrivimi un messaggio rapido"
              />
              <SocialCard
                href="https://t.me/CodaSimo"
                icon={FaTelegram}
                label="Telegram"
                sub="Contattami al volo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SocialCard href="https://linkedin.com/in/simone-codarin" icon={FaLinkedin} label="LinkedIn" sub="Connettiti con me" />
              <SocialCard href="https://github.com/simonecodarin?tab=repositories" icon={FaGithub} label="GitHub" sub="Esplora i miei progetti" />
            </div>  
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;