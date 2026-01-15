import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, ArrowLeft, Calendar, CheckCircle, Package, Heart, Home, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnimals } from "@/hooks/useAnimals";
import { TestimonialCarousel } from "@/components/shared/TestimonialCarousel";
import { usePageContent } from "@/hooks/usePageContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ElementType> = {
  Heart, Calendar, Package, Home, Clock
};

interface HeroContent {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
}

interface StatsContent {
  items: Array<{ value: string; label: string }>;
}

interface HowItWorksContent {
  title: string;
  description: string;
  steps: Array<{ icon: string; title: string; description: string }>;
}

interface PricingContent {
  title: string;
  description: string;
  options: Array<{ duration: string; days: string; price: string; description: string; popular: boolean }>;
}

interface IncludedContent {
  title: string;
  description: string;
  items: string[];
  noHiddenCostsTitle: string;
  noHiddenCostsDescription: string;
  deliveryNote: string;
}

interface CareContent {
  title: string;
  description: string;
  items: Array<{ title: string; content: string }>;
}

interface CTAContent {
  title: string;
  description: string;
  buttonText: string;
}

const PartTimePetsProgram = () => {
  const { data: animals = [], isLoading: animalsLoading } = useAnimals();
  const { getSection, isLoading } = usePageContent('part-time-pets');

  // Fetch testimonials from database
  const { data: testimonials = [] } = useQuery({
    queryKey: ['ptp-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, author_name, excerpt, category')
        .eq('status', 'published')
        .ilike('category', '%part%')
        .limit(5);
      if (error) throw error;
      return data?.map(s => ({
        id: s.id,
        name: s.author_name || 'Anonymous',
        role: 'Part-time Pet Parent',
        content: s.excerpt || s.title,
        rating: 5
      })) || [];
    }
  });

  const hero = getSection<HeroContent>('hero', {
    badge: "Part-time Pets Program",
    title: "All the Joy,",
    titleHighlight: "Flexible Commitment",
    description: "Experience the companionship of a pet without the full-time commitment. Perfect for busy professionals, travelers, or those wanting to try pet ownership."
  });

  const stats = getSection<StatsContent>('stats', {
    items: [
      { value: "150+", label: "Active Participants" },
      { value: "25", label: "Animals Available" },
      { value: "98%", label: "Satisfaction Rate" }
    ]
  });

  const howItWorks = getSection<HowItWorksContent>('how_it_works', {
    title: "How It Works",
    description: "Simple steps to your part-time companion",
    steps: [
      { icon: "Heart", title: "Choose", description: "Browse available animals and find your match" },
      { icon: "Calendar", title: "Schedule", description: "Pick dates that work for your lifestyle" },
      { icon: "Package", title: "Receive", description: "We deliver everything you need" },
      { icon: "Home", title: "Enjoy", description: "Create memories with your part-time pet" }
    ]
  });

  const pricing = getSection<PricingContent>('pricing', {
    title: "Pricing Options",
    description: "Flexible durations to fit your needs",
    options: [
      { duration: "Weekend", days: "Fri-Sun", price: "$50", description: "Perfect for a trial experience", popular: false },
      { duration: "1 Week", days: "7 days", price: "$120", description: "Great for vacation coverage", popular: true },
      { duration: "2 Weeks", days: "14 days", price: "$200", description: "Extended companionship", popular: false },
      { duration: "Monthly", days: "30 days", price: "$350", description: "Regular pet presence", popular: false }
    ]
  });

  const included = getSection<IncludedContent>('included', {
    title: "What's Included",
    description: "",
    items: [
      "All food and treats for the duration",
      "Necessary supplies (bowls, toys, bedding)",
      "24/7 support hotline",
      "Pre-visit orientation session",
      "Care instructions and guidelines",
      "Emergency vet contact information"
    ],
    noHiddenCostsTitle: "No Hidden Costs",
    noHiddenCostsDescription: "Our pricing includes everything you need. Food, supplies, toys, and support are all covered. The only additional cost would be for optional delivery service.",
    deliveryNote: "Delivery available for $25 within city limits."
  });

  const care = getSection<CareContent>('care', {
    title: "Care Instructions",
    description: "Everything you need to know",
    items: [
      { title: "Feeding Schedule", content: "We provide a detailed feeding schedule with the exact type and amount of food. Most of our animals eat twice daily - morning and evening. All food and treats are included and delivered with the animal." },
      { title: "Exercise & Play", content: "Each animal comes with a guide to their preferred activities. Dogs need daily walks (we'll specify duration), cats enjoy interactive toys, and smaller animals have specific play needs. We provide all toys and equipment." },
      { title: "Health & Safety", content: "All animals are up-to-date on vaccinations and health checks. We provide emergency vet contacts and our 24/7 support line. Any medications needed will be clearly labeled with instructions." },
      { title: "Pickup & Return", content: "You can pick up your part-time pet from our facility, or we can arrange delivery for an additional fee. Return times are flexible - just coordinate with us beforehand." }
    ]
  });

  const cta = getSection<CTAContent>('cta', {
    title: "Ready for Some Furry Companionship?",
    description: "Book your part-time pet experience today",
    buttonText: "Book Now"
  });

  const partTimeAnimals = animals.filter((a) => a.status === "Part-time Pet");

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
      <section className="relative bg-gradient-to-br from-amber-light/30 via-background to-primary/5 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-light text-amber-dark text-sm font-medium mb-6">
              <Clock className="h-4 w-4" />
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
                <a href="#animals">Browse Available Pets</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Ask Questions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-amber-light/30">
        <div className="container-app">
          <div className="grid grid-cols-3 gap-6 text-center">
            {stats.items.map((stat, index) => (
              <div key={index}>
                <div className="font-heading text-3xl md:text-4xl font-bold text-amber-dark">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">{howItWorks.title}</h2>
            <p className="text-muted-foreground">{howItWorks.description}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.steps.map((step, index) => {
              const IconComponent = iconMap[step.icon] || Heart;
              return (
                <Card key={step.title}>
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-amber-light flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-7 w-7 text-amber-dark" />
                    </div>
                    <div className="text-xs font-medium text-amber-dark mb-2">Step {index + 1}</div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-muted/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">{pricing.title}</h2>
            <p className="text-muted-foreground">{pricing.description}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {pricing.options.map((option) => (
              <Card key={option.duration} className={`relative ${option.popular ? "ring-2 ring-primary" : ""}`}>
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <h3 className="font-heading font-semibold text-lg mb-1">{option.duration}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{option.days}</p>
                  <div className="font-heading text-3xl font-bold text-primary mb-2">{option.price}</div>
                  <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                  <Button variant={option.popular ? "default" : "outline"} className="w-full" asChild>
                    <Link to="/booking">Select</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-6">{included.title}</h2>
              <ul className="space-y-3">
                {included.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="bg-gradient-to-br from-amber-light/20 to-primary/10">
              <CardContent className="p-8">
                <h3 className="font-heading text-xl font-semibold mb-4">{included.noHiddenCostsTitle}</h3>
                <p className="text-muted-foreground mb-4">
                  {included.noHiddenCostsDescription}
                </p>
                <p className="text-sm text-muted-foreground">
                  {included.deliveryNote}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Animals */}
      <section id="animals" className="section-padding bg-muted/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Available Part-time Pets</h2>
            <p className="text-muted-foreground">Meet your potential companions</p>
          </div>
          {animalsLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : partTimeAnimals.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {partTimeAnimals.map((animal) => (
                <Card key={animal.id} className="overflow-hidden card-hover group">
                  <Link to={`/animals/${animal.id}`}>
                    <div className="aspect-square overflow-hidden">
                      <img src={animal.image} alt={animal.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-heading font-semibold text-lg">{animal.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{animal.breed} • {animal.age}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {animal.personalityTraits.slice(0, 3).map((trait) => (
                          <span key={trait} className="text-xs px-2 py-0.5 rounded-full bg-amber-light/50 text-amber-dark">{trait}</span>
                        ))}
                      </div>
                      <Button className="w-full">Book {animal.name}</Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No part-time pets available at the moment. Add animals through the admin panel!</p>
            </div>
          )}
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/animals">View All Animals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Care Instructions */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold mb-4">{care.title}</h2>
              <p className="text-muted-foreground">{care.description}</p>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {care.items.map((item) => (
                <AccordionItem key={item.title} value={item.title} className="bg-card border rounded-xl px-6">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold mb-4">Happy Part-time Pet Parents</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <TestimonialCarousel testimonials={testimonials} />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-amber-light/30">
        <div className="container-app text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">{cta.title}</h2>
          <p className="text-muted-foreground mb-8">{cta.description}</p>
          <Button size="lg" className="gap-2" asChild>
            <Link to="/booking">
              <Calendar className="h-5 w-5" />
              {cta.buttonText}
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default PartTimePetsProgram;