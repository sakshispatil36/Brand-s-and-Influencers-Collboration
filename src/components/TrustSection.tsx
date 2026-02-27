import { Shield, Award, Users, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Shield,
    value: "99.8%",
    label: "Payment Success Rate",
    color: "text-primary",
  },
  {
    icon: Award,
    value: "4.9/5",
    label: "User Satisfaction",
    color: "text-success",
  },
  {
    icon: Users,
    value: "10K+",
    label: "Active Users",
    color: "text-accent",
  },
  {
    icon: TrendingUp,
    value: "$50M+",
    label: "Transactions Protected",
    color: "text-primary",
  },
];

const TrustSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-muted-foreground">
            Join brands and influencers who protect their partnerships
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center space-y-4 p-8 rounded-2xl bg-gradient-card border border-border hover:shadow-glow transition-all hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 bg-gradient-hero rounded-3xl p-12 text-center shadow-glow">
          <h3 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Protect Your Campaigns?
          </h3>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Start securing your influencer partnerships today with zero setup fees
          </p>
          <button className="px-8 py-4 bg-background text-primary rounded-lg font-semibold text-lg hover:scale-105 transition-transform shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
