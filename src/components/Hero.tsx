import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-background to-muted">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/15 rounded-full border border-accent/30">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">
                Secure Payment Protection
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              The Ultimate Collaboration Platform for Brands & Influencers
            </h1>
            <p className="text-xl text-muted-foreground/90 max-w-xl">
              Streamline your brand-influencer collaboration with secure payments, real-time messaging, and seamless campaign management. Where successful collaborations begin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                <Link to="/auth">
                  Get Started Free
                  <TrendingUp className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
               <div className="text-3xl font-bold text-foreground">98%</div>
                <div className="text-sm text-muted-foreground">Fraud Reduction</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
              <div className="text-3xl font-bold text-foreground">$1.2M+</div>
              <div className="text-sm text-muted-foreground">Protected</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-foreground">9k+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
            </div>
          </div>

          <div className="relative lg:block hidden">
            <div className="absolute inset-0 bg-accent/20 rounded-3xl blur-3xl animate-float"></div>
            <img
              src={heroImage}
              alt="Secure payment protection"
              className="relative rounded-2xl shadow-2xl border border-border"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
