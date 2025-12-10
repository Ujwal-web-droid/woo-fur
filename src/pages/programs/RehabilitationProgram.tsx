import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowLeft, Heart, Stethoscope, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { animals, testimonials, programStats } from "@/data/mockData";
import { TestimonialCarousel } from "@/components/shared/TestimonialCarousel";

const recoveryTimeline = [
  { phase: "Intake", description: "Initial assessment, emergency medical care, and quarantine", duration: "Week 1" },
  { phase: "Stabilization", description: "Medical treatment, nutritional support, and monitoring", duration: "Weeks 2-4" },
  { phase: "Rehabilitation", description: "Physical therapy, behavioral training, and socialization", duration: "Weeks 5-12" },
  { phase: "Preparation", description: "Final health checks and finding the perfect match", duration: "Weeks 12+" },
];

const partners = [
  { name: "City Veterinary Hospital", specialty: "Emergency & Surgery", years: 8 },
  { name: "Animal Physical Therapy Center", specialty: "Rehabilitation", years: 5 },
  { name: "Pet Nutrition Experts", specialty: "Dietary Management", years: 6 },
  { name: "Behavioral Wellness Clinic", specialty: "Mental Health", years: 4 },
];

const RehabilitationProgram = () => {
  const rehabAnimals = animals.filter((a) => a.status === "In Rehabilitation");
  const rehabTestimonials = testimonials.filter((t) => t.program === "rehabilitation");
  const fundingProgress = (programStats.rehabilitation.currentFunding / programStats.rehabilitation.fundingGoal) * 100;

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
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-sage-light/20 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Rehabilitation Program</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Healing Bodies, <span className="text-gradient">Restoring Spirits</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Our expert team provides comprehensive medical care and emotional healing for animals recovering from trauma, illness, or neglect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="#sponsor">Sponsor an Animal</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/support">Donate Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary/5">
        <div className="container-app">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-primary">{programStats.rehabilitation.animalsHealed}+</div>
              <p className="text-sm text-muted-foreground">Animals Rehabilitated</p>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-primary">{programStats.rehabilitation.partnersCount}</div>
              <p className="text-sm text-muted-foreground">Medical Partners</p>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-primary">95%</div>
              <p className="text-sm text-muted-foreground">Recovery Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recovery Timeline */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Recovery Journey</h2>
            <p className="text-muted-foreground">Every animal's path to wellness</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20" />
              <div className="space-y-8">
                {recoveryTimeline.map((phase, index) => (
                  <div key={phase.phase} className="relative flex gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 z-10 border-4 border-background">
                      <span className="font-heading font-bold text-primary">{index + 1}</span>
                    </div>
                    <Card className="flex-1">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-heading font-semibold text-lg">{phase.phase}</h3>
                          <span className="text-sm text-muted-foreground">{phase.duration}</span>
                        </div>
                        <p className="text-muted-foreground">{phase.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funding Progress */}
      <section id="sponsor" className="section-padding bg-muted/30">
        <div className="container-app">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl font-bold mb-4">Current Rehabilitation Fund</h2>
              <p className="text-muted-foreground">Help us reach our goal to care for more animals</p>
            </div>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading text-2xl font-bold text-primary">
                    ${programStats.rehabilitation.currentFunding.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    of ${programStats.rehabilitation.fundingGoal.toLocaleString()} goal
                  </span>
                </div>
                <Progress value={fundingProgress} className="h-4 mb-6" />
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div className="p-4 rounded-lg bg-primary/5">
                    <p className="font-heading font-bold text-primary">$25</p>
                    <p className="text-xs text-muted-foreground">1 Week of Food</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5">
                    <p className="font-heading font-bold text-primary">$100</p>
                    <p className="text-xs text-muted-foreground">Vet Visit</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5">
                    <p className="font-heading font-bold text-primary">$500</p>
                    <p className="text-xs text-muted-foreground">Surgery Fund</p>
                  </div>
                </div>
                <Button className="w-full gap-2" size="lg" asChild>
                  <Link to="/support">
                    <Heart className="h-5 w-5" />
                    Donate to Rehabilitation
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Medical Partners */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Our Medical Partners</h2>
            <p className="text-muted-foreground">Working together for animal wellness</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <Card key={partner.name}>
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-1">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{partner.specialty}</p>
                  <p className="text-xs text-primary">{partner.years} years partnered</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Animals in Rehabilitation */}
      {rehabAnimals.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold mb-4">Currently in Rehabilitation</h2>
              <p className="text-muted-foreground">These animals are on their healing journey</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rehabAnimals.map((animal) => (
                <Card key={animal.id} className="overflow-hidden card-hover group">
                  <Link to={`/animals/${animal.id}`}>
                    <div className="aspect-square overflow-hidden">
                      <img src={animal.image} alt={animal.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-heading font-semibold text-lg">{animal.name}</h3>
                      <p className="text-sm text-muted-foreground">{animal.breed} • {animal.age}</p>
                      <Button variant="outline" size="sm" className="w-full mt-4">Sponsor {animal.name}</Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {rehabTestimonials.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold mb-4">Recovery Stories</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <TestimonialCarousel testimonials={rehabTestimonials} />
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default RehabilitationProgram;
