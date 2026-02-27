import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <Features />
        <HowItWorks />
        <TrustSection />
      </div>
    </div>
  );
};

export default Index;
