import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Users, Clock, ArrowRight, Layers } from "lucide-react";

const programs = [
  {
    icon: Heart,
    title: "Animal Rescue",
    description: "We rescue animals from shelters, abusive situations, and abandonment. Every animal deserves a second chance at life.",
    features: ["24/7 rescue hotline", "Medical care provided", "Rehabilitation support", "Forever home placement"],
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Sparkles,
    title: "Rehabilitation",
    description: "Our expert team provides medical care and emotional healing for animals recovering from trauma or illness.",
    features: ["Veterinary care", "Behavioral therapy", "Physical rehabilitation", "Nutritional programs"],
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Therapy Sessions",
    description: "Certified therapy animals provide comfort and healing through guided sessions with trained professionals.",
    features: ["Certified therapy animals", "Professional handlers", "Individual & group sessions", "Flexible scheduling"],
    color: "bg-sage-light text-sage-dark",
  },
  {
    icon: Clock,
    title: "Part-time Pets",
    description: "Experience the joy of animal companionship without full-time commitment. Perfect for busy lifestyles.",
    features: ["Flexible time periods", "All supplies provided", "No long-term commitment", "Trial before adoption"],
    color: "bg-amber-light text-amber-dark",
  },
];

const Programs = () => {
  return (
    <Layout>
      <section className="relative bg-gradient-to-br from-sage-light/30 via-background to-amber-light/20 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Layers className="h-4 w-4" />
              <span>Our Programs</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Programs That <span className="text-gradient">Transform Lives</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover the many ways we create meaningful connections between animals and humans.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="space-y-8">
            {programs.map((program, index) => (
              <Card key={program.title} className="overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className={`p-8 md:p-12 ${index % 2 === 1 ? "md:order-2" : ""}`}>
                    <div className={`w-14 h-14 rounded-xl ${program.color} flex items-center justify-center mb-6`}>
                      <program.icon className="h-7 w-7" />
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">{program.title}</h2>
                    <p className="text-muted-foreground mb-6">{program.description}</p>
                    <ul className="space-y-2 mb-6">
                      {program.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="gap-2">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className={`bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-12 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                    <program.icon className="h-32 w-32 text-primary/30" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
