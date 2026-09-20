import { useState, Suspense, lazy } from "react";
import Preloader from "@/components/Preloader";
import MatrixBackground from "@/components/MatrixBackground";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

// Sezioni sotto la piega: caricate solo quando servono, non nel bundle iniziale
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const ExperienceSection = lazy(() => import("@/components/ExperienceSection"));
const SkillsSection = lazy(() => import("@/components/SkillsSection"));
const EducationSection = lazy(() => import("@/components/EducationSection"));
const PricingSection = lazy(() => import("@/components/Pricingsection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const AIChatWidget = lazy(() => import("@/components/AIChatWidget"));

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      <CustomCursor />
      <MatrixBackground />
      <Navbar />

      <main>
        <HeroSection />
        <AboutSection />

        <Suspense fallback={null}>
          <ProjectsSection />
          <ExperienceSection />
          <SkillsSection />
          <EducationSection />
          <PricingSection />
          <ContactSection />
        </Suspense>
      </main>

      <Footer />

      <Suspense fallback={null}>
        <AIChatWidget />
      </Suspense>
    </>
  );
};

export default Index;