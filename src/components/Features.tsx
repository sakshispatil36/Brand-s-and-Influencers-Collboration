import { Shield, Lock, FileCheck, CheckCircle, Eye, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Escrow Protection",
    description: "Funds are held securely until campaign milestones are verified and approved by both parties.",
  },
  {
    icon: Lock,
    title: "Smart Contracts",
    description: "Automated payment releases based on predefined conditions, eliminating manual fraud risks.",
  },
  {
    icon: FileCheck,
    title: "Verified Deliverables",
    description: "Track and verify content delivery with timestamped proof before releasing payments.",
  },
  {
    icon: CheckCircle,
    title: "Identity Verification",
    description: "Multi-layer KYC process ensures both brands and influencers are legitimate entities.",
  },
  {
    icon: Eye,
    title: "Transparent Tracking",
    description: "Real-time dashboard showing payment status, milestones, and campaign progress for full visibility.",
  },
  {
    icon: CreditCard,
    title: "Secure Transactions",
    description: "Bank-grade encryption and PCI compliance for all financial transactions and data.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            How We Prevent Fraud
          </h2>
          <p className="text-xl text-muted-foreground">
            Multi-layered security designed specifically for influencer marketing campaigns
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
