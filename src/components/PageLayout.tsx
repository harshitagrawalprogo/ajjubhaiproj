import { ReactNode, useState, useCallback } from "react";
import TopBar, { TOPBAR_HEIGHT } from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PageLayout({ children }: { children: ReactNode }) {
  const [topBarHeight, setTopBarHeight] = useState(TOPBAR_HEIGHT);

  const handleHeightChange = useCallback((h: number) => {
    setTopBarHeight(h);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onHeightChange={handleHeightChange} />
      <Navbar topBarHeight={topBarHeight} />
      <main style={{ paddingTop: topBarHeight + 52 }}>{children}</main>
      <Footer />
    </div>
  );
}
