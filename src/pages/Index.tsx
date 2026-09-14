import { useState } from "react";
import Preloader from "@/components/Preloader";
import MatrixBackground from "@/components/MatrixBackground";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

import AIChatWidget from "@/components/AIChatWidget";

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      <CustomCursor />
      <MatrixBackground />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <EducationSection />
      <ContactSection />
      <Footer />

      <AIChatWidget />
    </>
  );
};

export default Index;
