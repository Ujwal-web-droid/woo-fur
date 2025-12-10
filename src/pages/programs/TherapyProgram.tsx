import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowLeft, Heart, Brain, Smile, Shield, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { animals, testimonials, programStats } from "@/data/mockData";
import { TestimonialCarousel } from "@/components/shared/TestimonialCarousel";

const benefits = [
  { icon: Heart, title: "Emotional Support", description: "Reduce anxiety, depression, and stress through calming animal interactions" },
  { icon: Brain, title: "Cognitive Benefits", description: "Improve focus, memory, and mental clarity with engaging activities" },
  { icon: Smile, title: "Social Connection", description: "Build communication skills and reduce feelings of isolation" },
  { icon: Shield, title: "Physical Health", description: "Lower blood pressure and promote physical activity" },
];

const sessionTypes = [
  { title: "Individual Sessions", description: "One-on-one therapy with a certified animal and handler", duration: "60 min", price: "$75" },
  { title: "Group Sessions", description: "Small group therapy ideal for schools or organizations", duration: "90 min", price: "$150" },
  { title: "Facility Visits", description: "Bring therapy animals to hospitals, nursing homes, or offices", duration: "2 hours", price: "$200" },
  { title: "Ongoing Programs", description: "Regular weekly sessions for continued support", duration: "Varies", price: "Custom" },
];

const handlers = [
  { name: "Sarah Mitchell", role: "Lead Therapy Handler", years: 8, certifications: ["Pet Partners", "CARES"] },
  { name: "James Rodriguez", role: "Senior Handler", years: 5, certifications: ["TDI", "Alliance"] },
  { name: "Emily Chen", role: "Therapy Specialist", years: 3, certifications: ["Pet Partners", "AKC CGC"] },
];

const TherapyProgram = () => {
  const therapyAnimals = animals.filter((a) => a.status === "Therapy Certified");
  const therapyTestimonials = testimonials.filter((t) => t.program === "therapy");

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container-app">
          <Link to="/programs" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Programs
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sage-light/30 via-background to-primary/5 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light text-sage-dark text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              <span>Therapy Program</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Healing Through <span className="text-gradient">Connection</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Our certified therapy animals and professional handlers provide comfort, support, and healing through guided therapeutic sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/booking">Book a Session</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-sage-light/30">
        <div className="container-app">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-sage-dark">{programStats.therapy.sessionsCompleted.toLocaleString()}+</div>
              <p className="text-sm text-muted-foreground">Sessions Completed</p>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-sage-dark">{programStats.therapy.clientsHelped}+</div>
              <p className="text-sm text-muted-foreground">Clients Helped</p>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-sage-dark">{programStats.therapy.certifiedAnimals}</div>
              <p className="text-sm text-muted-foreground">Certified Animals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Benefits of Animal Therapy</h2>
            <p className="text-muted-foreground">Scientifically proven ways animals help heal</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-sage-light flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-7 w-7 text-sage-dark" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Session Types */}
      <section className="section-padding bg-muted/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Session Types</h2>
            <p className="text-muted-foreground">Find the perfect therapy option for your needs</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sessionTypes.map((session) => (
              <Card key={session.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-2">{session.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{session.description}</p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-muted-foreground">{session.duration}</span>
                    <span className="font-semibold text-primary">{session.price}</span>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/booking">Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certified Animals */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Our Therapy Animals</h2>
            <p className="text-muted-foreground">Meet our certified, gentle healers</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapyAnimals.map((animal) => (
              <Card key={animal.id} className="overflow-hidden card-hover group">
                <Link to={`/animals/${animal.id}`}>
                  <div className="aspect-square overflow-hidden relative">
                    <img src={animal.image} alt={animal.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="flex flex-wrap gap-1">
                        {animal.therapyCertifications.slice(0, 2).map((cert) => (
                          <Badge key={cert} className="bg-white/20 text-white text-xs">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-heading font-semibold text-lg">{animal.name}</h3>
                    <p className="text-sm text-muted-foreground">{animal.breed}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {animal.personalityTraits.slice(0, 3).map((trait) => (
                        <Badge key={trait} variant="outline" className="text-xs">{trait}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Handlers */}
      <section className="section-padding bg-muted/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Our Handlers</h2>
            <p className="text-muted-foreground">Experienced professionals dedicated to your care</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {handlers.map((handler) => (
              <Card key={handler.name}>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-heading font-bold text-primary">{handler.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg">{handler.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{handler.role}</p>
                  <p className="text-xs text-primary mb-3">{handler.years} years experience</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {handler.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">{cert}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {therapyTestimonials.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold mb-4">Client Stories</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <TestimonialCarousel testimonials={therapyTestimonials} />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-sage-light/30">
        <div className="container-app text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Ready to Experience the Healing Power?</h2>
          <p className="text-muted-foreground mb-8">Book your first therapy session today</p>
          <Button size="lg" className="gap-2" asChild>
            <Link to="/booking">
              <Calendar className="h-5 w-5" />
              Schedule a Session
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default TherapyProgram;
