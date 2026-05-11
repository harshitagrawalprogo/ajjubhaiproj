import { useState, useCallback } from "react";
import TopBar, { TOPBAR_HEIGHT } from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import StatsSection from "@/components/home/StatsSection";
import EventsSection from "@/components/home/EventsSection";
import KnowledgeHubSection from "@/components/home/KnowledgeHubSection";
import CommunitySection from "@/components/home/CommunitySection";
import PartnersSection from "@/components/home/PartnersSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import Footer from "@/components/Footer";
import MarqueeStrip from "@/components/MarqueeStrip";

const Index = () => {
  const [topBarHeight, setTopBarHeight] = useState(TOPBAR_HEIGHT);

  const handleHeightChange = useCallback((h: number) => {
    setTopBarHeight(h);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onHeightChange={handleHeightChange} />
      <Navbar topBarHeight={topBarHeight} />
      <main style={{ paddingTop: 72 }}>
        <MarqueeStrip />
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <StatsSection />
        <EventsSection />
        <CommunitySection />
        <PartnersSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
