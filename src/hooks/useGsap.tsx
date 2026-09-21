import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Magnetic button effect — element follows cursor within its bounds
 */
export function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
}

/**
 * Parallax on scroll
 */
export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, [speed]);

  return ref;
}

/**
 * Counter animation — animates a number from 0 to target
 */
export function useCounter(target: number, duration = 2) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: target,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toLocaleString("it-IT");
        },
      });
    });
    return () => ctx.revert();
  }, [target, duration]);

  return ref;
}

/**
 * Split text reveal — wraps each char/word and animates them in
 */
export function useSplitReveal(type: "chars" | "words" = "words") {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const text = el.textContent || "";
    const items = type === "chars" ? text.split("") : text.split(" ");

    el.innerHTML = items
      .map(
        (item) =>
          `<span style="display:inline-block;overflow:hidden"><span class="split-item" style="display:inline-block">${item}${type === "words" ? "&nbsp;" : ""}</span></span>`
      )
      .join("");

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".split-item"), {
        yPercent: 110,
        opacity: 0,
        rotateX: -40,
        duration: 0.8,
        stagger: type === "chars" ? 0.02 : 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    });
    return () => ctx.revert();
  }, [type]);

  return ref;
}

/**
 * Tilt on hover — 3D card effect
 */
export function useTilt(maxTilt = 6) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transformStyle = "preserve-3d";
    el.style.perspective = "800px";

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateY: x * maxTilt,
        rotateX: -y * maxTilt,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [maxTilt]);

  return ref;
}

/**
 * Horizontal scroll-based progress (e.g. for a reading progress bar)
 */
export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return ref;
}

/**
 * Stagger children on scroll reveal
 */
export function useStaggerReveal(selector: string, options?: {
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(selector, {
        y: options?.y ?? 40,
        opacity: 0,
        filter: "blur(6px)",
        duration: options?.duration ?? 0.8,
        stagger: options?.stagger ?? 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: options?.start ?? "top 80%",
          once: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [selector]);

  return ref;
}

/**
 * Magnetic button component wrapper
 */
export const MagneticWrap = ({
  children,
  className = "",
  as: Tag = "div",
  strength = 0.35,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  strength?: number;
  [key: string]: any;
}) => {
  const ref = useMagnetic(strength);
  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
};
