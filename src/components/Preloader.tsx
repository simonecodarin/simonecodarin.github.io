import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const CODE_LINES = [
  'import { createApp } from "vue"',
  'import { defineStore } from "pinia"',
  "const app = createApp(App)",
  "app.use(router)",
  "app.use(pinia)",
  'builder.Services.AddSignalR()',
  'builder.Services.AddControllers()',
  'app.MapHub<NotificationHub>("/hub")',
  "SELECT * FROM Users WHERE Active = 1",
  "CREATE INDEX IX_Users ON Users(Email)",
  "npm run build ████████████ done",
  "dotnet publish -c Release",
  "✓ Compiled successfully",
  "✓ All tests passed",
  "🚀 Deploying to production...",
];

const VISITED_KEY = "sc_portfolio_last_visit";
const SKIP_WINDOW_MS = 3 * 60 * 1000; // (3 minuti) entro questa finestra si salta il preloader

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);

  const shouldSkip = (() => {
    if (typeof window === "undefined") return false;
    const lastVisit = sessionStorage.getItem(VISITED_KEY);
    if (!lastVisit) return false;
    const elapsed = Date.now() - parseInt(lastVisit, 10);
    return elapsed < SKIP_WINDOW_MS;
  })();

  const animateOut = useCallback(() => {
    const tl = gsap.timeline({ onComplete });

    if (contentRef.current) {
      tl.to(contentRef.current, {
        scale: 0.95,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.4,
        ease: "power3.in",
      });
    }

    if (containerRef.current) {
      tl.to(containerRef.current, {
        clipPath: "inset(50% 0% 50% 0%)",
        duration: 0.7,
        ease: "power4.inOut",
      }, "-=0.1");

      tl.set(containerRef.current, { display: "none" });
    }
  }, [onComplete]);

  useEffect(() => {
    if (shouldSkip) {
      onComplete();
      return;
    }

    sessionStorage.setItem(VISITED_KEY, Date.now().toString());
    document.body.style.overflow = "hidden";

    const obj = { val: 0 };
    let lineIndex = 0;

    const lineInterval = setInterval(() => {
      if (lineIndex < CODE_LINES.length) {
        setLines((prev) => [...prev, CODE_LINES[lineIndex]]);
        lineIndex++;
      }
    }, 100);

    gsap.to(obj, {
      val: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(obj.val);
        if (progressRef.current) progressRef.current.textContent = `${v}`;
        if (barRef.current) barRef.current.style.width = `${v}%`;
      },
      onComplete: () => {
        clearInterval(lineInterval);
        setTimeout(() => {
          document.body.style.overflow = "";
          animateOut();
        }, 200);
      },
    });

    gsap.to("[data-cursor]", {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "steps(1)",
    });

    return () => {
      clearInterval(lineInterval);
      document.body.style.overflow = "";
    };
  }, [animateOut, shouldSkip, onComplete]);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  }, [lines]);

  if (shouldSkip) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[hsl(220,20%,6%)] flex items-center justify-center"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div ref={contentRef} className="w-full max-w-lg px-6 flex flex-col items-center gap-8">
        <div className="text-center">
          <span className="text-3xl font-black tracking-tight text-white">
            &lt;S<span className="text-[#03D92D]">C/&gt;</span>
            <span className="text-primary">.</span>
          </span>
        </div>

        <div className="w-full rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-[10px] text-white/30 font-mono">portfolio.exe</span>
          </div>
          <div
            ref={codeRef}
            className="h-48 px-4 py-3 overflow-hidden font-mono text-xs leading-relaxed"
          >
            {lines.map((line, i) => {
              const safeLine = line || "";
              return (
                <div key={i} className="flex gap-2 animate-[fade-in_0.2s_ease-out]">
                  <span className="text-white/20 select-none w-5 text-right shrink-0">
                    {i + 1}
                  </span>
                  <span
                    className={
                      safeLine.startsWith("✓")
                        ? "text-[hsl(150,70%,55%)]"
                        : safeLine.startsWith("🚀")
                          ? "text-[hsl(40,90%,60%)]"
                          : safeLine.startsWith("SELECT") || safeLine.startsWith("CREATE")
                            ? "text-[hsl(190,70%,55%)]"
                            : "text-white/70"
                    }
                  >
                    {safeLine}
                  </span>
                </div>
              );
            })}
            <span data-cursor className="inline-block w-2 h-3.5 bg-[hsl(213,70%,55%)] ml-7 mt-0.5" />
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              Compiling
            </span>
            <div className="flex items-baseline gap-0.5">
              <span ref={progressRef} className="text-2xl font-black text-white tabular-nums">
                0
              </span>
              <span className="text-sm font-bold text-white/40">%</span>
            </div>
          </div>
          <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              ref={barRef}
              className="h-full rounded-full bg-gradient-to-r from-[hsl(213,70%,55%)] to-[hsl(190,70%,55%)]"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;