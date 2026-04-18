import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import SkillsSection from "@/components/home/SkillsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import ResumeSection from "@/components/home/ResumeSection";
import ContactSection from "@/components/home/ContactSection";
import { getAbout, getFeaturedProjects, getExperiences } from "@/lib/firebase/firestore";

export const revalidate = 3600; // ISR: revalidate every hour

export default async function HomePage() {
  const [about, projects, experiences] = await Promise.all([
    getAbout(),
    getFeaturedProjects(),
    getExperiences(),
  ]);

  return (
      <div className="flex flex-col gap-16">
          <HeroSection about={about} />
          <AboutSection about={about} />
          <SkillsSection about={about} />
          <ProjectsSection projects={projects} />
          <ExperienceSection experiences={experiences} />
          <ContactSection about={about} />
      </div>
  );
}
