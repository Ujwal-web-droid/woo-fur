import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowLeft, Heart, Stethoscope, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnimals } from "@/hooks/useAnimals";
import { TestimonialCarousel } from "@/components/shared/TestimonialCarousel";
import { usePageContent } from "@/hooks/usePageContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroContent {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
}

interface StatsContent {
  items: Array<{ value: string; label: string }>;
}

interface TimelineContent {
  title: string;
  description: string;
  items: Array<{ phase: string; description: string; duration: string }>;
}

interface FundingContent {
  title: string;
  description: string;
  currentFunding: number;
  fundingGoal: number;
  donationLevels: Array<{ amount: string; description: string }>;
}

interface PartnersContent {
  title: string;
  description: string;
  items: Array<{ name: string; specialty: string; years: number }>;
}

const RehabilitationProgram = () => {
  const { data: animals = [], isLoading: animalsLoading } = useAnimals();
  const { getSection, isLoading } = usePageContent('rehabilitation');

  // Fetch testimonials from database
  const { data: testimonials = [] } = useQuery({
    queryKey: ['rehab-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, author_name, excerpt, category')
        .eq('status', 'published')
        .ilike('category', '%rehab%')
        .limit(5);
      if (error) throw error;
      return data?.map(s => ({
        id: s.id,
        name: s.author_name || 'Anonymous',
        role: 'Sponsor',
        content: s.excerpt || s.title,
        rating: 5
      })) || [];
    }
  });

  const hero = getSection<HeroContent>('hero', {
    badge: "Rehabilitation Program",
    title: "Healing Bodies,",
    titleHighlight: "Restoring Spirits",
    description: "Our expert team provides comprehensive medical care and emotional healing for animals recovering from trauma, illness, or neglect."
  });

  const stats = getSection<StatsContent>('stats', {
    items: [
      { value: "350+", label: "Animals Rehabilitated" },
      { value: "12", label: "Medical Partners" },
      { value: "95%", label: "Recovery Rate" }
    ]
  });

  const timeline = getSection<TimelineContent>('timeline', {
    title: "Recovery Journey",
    description: "Every animal's path to wellness",
    items: [
      { phase: "Intake", description: "Initial assessment, emergency medical care, and quarantine", duration: "Week 1" },
      { phase: "Stabilization", description: "Medical treatment, nutritional support, and monitoring", duration: "Weeks 2-4" },
      { phase: "Rehabilitation", description: "Physical therapy, behavioral training, and socialization", duration: "Weeks 5-12" },
      { phase: "Preparation", description: "Final health checks and finding the perfect match", duration: "Weeks 12+" }
    ]
  });

  const funding = getSection<FundingContent>('funding', {
    title: "Current Rehabilitation Fund",
    description: "Help us reach our goal to care for more animals",
    currentFunding: 75000,
    fundingGoal: 100000,
    donationLevels: [
      { amount: "$25", description: "1 Week of Food" },
      { amount: "$100", description: "Vet Visit" },
      { amount: "$500", description: "Surgery Fund" }
    ]
  });

  const partners = getSection<PartnersContent>('partners', {
    title: "Our Medical Partners",
    description: "Working together for animal wellness",
    items: [
      { name: "City Veterinary Hospital", specialty: "Emergency & Surgery", years: 8 },
      { name: "Animal Physical Therapy Center", specialty: "Rehabilitation", years: 5 },
      { name: "Pet Nutrition Experts", specialty: "Dietary Management", years: 6 },
      { name: "Behavioral Wellness Clinic", specialty: "Mental Health", years: 4 }
    ]
  });

  const rehabAnimals = animals.filter((a) => a.status === "In Rehabilitation");
  const fundingProgress = (funding.currentFunding / funding.fundingGoal) * 100;

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
              <span>{hero.badge}</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              {hero.title} <span className="text-gradient">{hero.titleHighlight}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {hero.description}
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
            {stats.items.map((stat, index) => (
              <div key={index}>
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recovery Timeline */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">{timeline.title}</h2>
            <p className="text-muted-foreground">{timeline.description}</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20" />
              <div className="space-y-8">
                {timeline.items.map((phase, index) => (
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
              <h2 className="font-heading text-3xl font-bold mb-4">{funding.title}</h2>
              <p className="text-muted-foreground">{funding.description}</p>
            </div>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading text-2xl font-bold text-primary">
                    ${funding.currentFunding.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    of ${funding.fundingGoal.toLocaleString()} goal
                  </span>
                </div>
                <Progress value={fundingProgress} className="h-4 mb-6" />
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  {funding.donationLevels.map((level, index) => (
                    <div key={index} className="p-4 rounded-lg bg-primary/5">
                      <p className="font-heading font-bold text-primary">{level.amount}</p>
                      <p className="text-xs text-muted-foreground">{level.description}</p>
                    </div>
                  ))}
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
            <h2 className="font-heading text-3xl font-bold mb-4">{partners.title}</h2>
            <p className="text-muted-foreground">{partners.description}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.items.map((partner) => (
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
      <section className="section-padding bg-muted/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Currently in Rehabilitation</h2>
            <p className="text-muted-foreground">These animals are on their healing journey</p>
          </div>
          {animalsLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : rehabAnimals.length > 0 ? (
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
          ) : (
            <div className="text-center py-12">
              <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No animals currently in rehabilitation. Add animals through the admin panel!</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold mb-4">Recovery Stories</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <TestimonialCarousel testimonials={testimonials} />
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default RehabilitationProgram;