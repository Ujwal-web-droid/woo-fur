import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Users, Clock, ArrowRight, Layers, TrendingUp, CheckCircle, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { TestimonialCarousel } from "@/components/shared/TestimonialCarousel";
import { useEffect, useState } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ElementType> = {
  Heart, Sparkles, Users, Clock, Layers, TrendingUp, CheckCircle, ArrowRight
};

interface HeroContent {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
}

interface ProgramItem {
  id: string;
  icon: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  color: string;
  stats?: { label: string; value: number };
}

interface ProgramsListContent {
  items: ProgramItem[];
}

interface ProcessContent {
  badge: string;
  title: string;
  steps: Array<{
    step: number;
    title: string;
    description: string;
  }>;
}

interface CTAContent {
  title: string;
  description: string;
  buttonPrimary: string;
  buttonSecondary: string;
}

interface TestimonialsContent {
  title: string;
  description: string;
  items: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
  }>;
}

const AnimatedCounter = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const Programs = () => {
  const { getSection, isLoading } = usePageContent('programs');

  // Fetch testimonials from database
  const { data: dbTestimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, author_name, excerpt, category')
        .eq('status', 'published')
        .limit(5);
      if (error) throw error;
      return data?.map(s => ({
        id: s.id,
        name: s.author_name || 'Anonymous',
        role: s.category,
        content: s.excerpt || s.title,
        rating: 5
      })) || [];
    }
  });

  const hero = getSection<HeroContent>('hero', {
    badge: "Our Programs",
    title: "Programs That",
    titleHighlight: "Transform Lives",
    description: "Discover the many ways we create meaningful connections between animals and humans."
  });

  const programsList = getSection<ProgramsListContent>('programs_list', {
    items: [
      { id: "rescue", icon: "Heart", title: "Animal Rescue", slug: "rescue", description: "We rescue animals from shelters, abusive situations, and abandonment. Every animal deserves a second chance at life.", features: ["24/7 rescue hotline", "Medical care provided", "Rehabilitation support", "Forever home placement"], color: "bg-accent/10 text-accent", stats: { label: "Animals Rescued", value: 500 } },
      { id: "rehabilitation", icon: "Sparkles", title: "Rehabilitation", slug: "rehabilitation", description: "Our expert team provides medical care and emotional healing for animals recovering from trauma or illness.", features: ["Veterinary care", "Behavioral therapy", "Physical rehabilitation", "Nutritional programs"], color: "bg-primary/10 text-primary", stats: { label: "Animals Healed", value: 350 } },
      { id: "therapy", icon: "Users", title: "Therapy Sessions", slug: "therapy", description: "Certified therapy animals provide comfort and healing through guided sessions with trained professionals.", features: ["Certified therapy animals", "Professional handlers", "Individual & group sessions", "Flexible scheduling"], color: "bg-sage-light text-sage-dark", stats: { label: "Sessions Completed", value: 1200 } },
      { id: "part-time-pets", icon: "Clock", title: "Part-time Pets", slug: "part-time-pets", description: "Experience the joy of animal companionship without full-time commitment. Perfect for busy lifestyles.", features: ["Flexible time periods", "All supplies provided", "No long-term commitment", "Trial before adoption"], color: "bg-amber-light text-amber-dark", stats: { label: "Active Participants", value: 150 } }
    ]
  });

  const process = getSection<ProcessContent>('process', {
    badge: "How It Works",
    title: "Your Journey With Us",
    steps: [
      { step: 1, title: "Explore", description: "Browse our programs and find what suits your needs" },
      { step: 2, title: "Connect", description: "Reach out to us and we'll match you with the right animals" },
      { step: 3, title: "Experience", description: "Enjoy meaningful interactions that benefit both you and our animals" },
      { step: 4, title: "Transform", description: "Watch the positive impact unfold in your life" }
    ]
  });

  const cta = getSection<CTAContent>('cta', {
    title: "Ready to Get Started?",
    description: "Whether you're looking for therapy sessions, considering adoption, or want to support our mission, we're here to help.",
    buttonPrimary: "Book a Session",
    buttonSecondary: "Contact Us"
  });

  const testimonials = getSection<TestimonialsContent>('testimonials', {
    title: "What People Say",
    description: "Hear from those whose lives have been touched by our programs",
    items: []
  });

  // Use database testimonials if available, otherwise use content from admin
  const displayTestimonials = dbTestimonials.length > 0 ? dbTestimonials : testimonials.items;

  if (isLoading) {
    return (
      <Layout>
        <div className="container-app section-padding">
          <div className="space-y-8">
            <Skeleton className="h-12 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <div className="grid md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage-light/30 via-background to-amber-light/20 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Layers className="h-4 w-4" />
              <span>{hero.badge}</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              {hero.title} <span className="text-gradient">{hero.titleHighlight}</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary/5">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {programsList.items.map((program) => (
              <div key={program.slug} className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter end={program.stats?.value || 0} suffix="+" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{program.stats?.label || program.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section-padding bg-background">
        <div className="container-app">
          {programsList.items.length === 0 ? (
            <div className="text-center py-12">
              <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">No Programs Yet</h3>
              <p className="text-muted-foreground">Programs will appear here once added through the admin panel.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {programsList.items.map((program, index) => {
                const IconComponent = iconMap[program.icon] || Heart;
                return (
                  <Card key={program.id || program.title} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className={`p-8 md:p-12 ${index % 2 === 1 ? "md:order-2" : ""}`}>
                        <div className={`w-14 h-14 rounded-xl ${program.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          <IconComponent className="h-7 w-7" />
                        </div>
                        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">{program.title}</h2>
                        <p className="text-muted-foreground mb-6">{program.description}</p>
                        <ul className="space-y-2 mb-6">
                          {program.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button className="gap-2" asChild>
                          <Link to={`/programs/${program.slug}`}>
                            Learn More <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <div className={`bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-12 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                        <IconComponent className="h-32 w-32 text-primary/30 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-muted/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <TrendingUp className="h-4 w-4" />
              <span>{process.badge}</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">{process.title}</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {process.steps.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-heading font-bold text-xl">
                      {step.step}
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < process.steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {displayTestimonials.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">{testimonials.title}</h2>
              <p className="text-muted-foreground">{testimonials.description}</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <TestimonialCarousel testimonials={displayTestimonials} />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-primary/5">
        <div className="container-app text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">{cta.title}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/booking">{cta.buttonPrimary}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">{cta.buttonSecondary}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;