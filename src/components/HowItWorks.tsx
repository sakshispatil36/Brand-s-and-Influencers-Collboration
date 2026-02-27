import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Campaign",
    description: "Brand creates a campaign with clear deliverables, budget, and timeline.",
  },
  {
    number: "02",
    title: "Escrow Deposit",
    description: "Funds are deposited into secure escrow account, visible to both parties.",
  },
  {
    number: "03",
    title: "Influencer Delivers",
    description: "Influencer completes work and submits deliverables for review.",
  },
  {
    number: "04",
    title: "Verification",
    description: "Platform verifies deliverables meet agreed standards and guidelines.",
  },
  {
    number: "05",
    title: "Secure Payout",
    description: "Payment automatically releases to influencer upon approval.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Simple, secure process from campaign creation to payment
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-success hidden lg:block"></div>
            
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="relative flex gap-8 items-start group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Step number */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xl shadow-glow group-hover:scale-110 transition-transform">
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-card rounded-2xl p-8 shadow-card border border-border group-hover:shadow-glow transition-all">
                    <h3 className="text-2xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute left-6 -bottom-4 w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
