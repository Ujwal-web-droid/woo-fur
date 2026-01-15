import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft, CheckCircle, Phone, FileText, Home, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnimals } from "@/hooks/useAnimals";
import { TestimonialCarousel } from "@/components/shared/TestimonialCarousel";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { usePageContent } from "@/hooks/usePageContent";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.ElementType> = {
  Phone, FileText, Heart, Home
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

interface StepsContent {
  items: Array<{ icon: string; title: string; description: string }>;
}

interface FormContent {
  title: string;
  description: string;
}

const RescueProgram = () => {
  const { data: animals = [], isLoading: animalsLoading } = useAnimals();
  const { getSection, isLoading } = usePageContent('rescue');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    experience: "",
    housing: "",
  });

  // Fetch testimonials from database
  const { data: testimonials = [] } = useQuery({
    queryKey: ['rescue-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, author_name, excerpt, category')
        .eq('status', 'published')
        .ilike('category', '%rescue%')
        .limit(5);
      if (error) throw error;
      return data?.map(s => ({
        id: s.id,
        name: s.author_name || 'Anonymous',
        role: 'Adopter',
        content: s.excerpt || s.title,
        rating: 5
      })) || [];
    }
  });

  const hero = getSection<HeroContent>('hero', {
    badge: "Animal Rescue Program",
    title: "Giving Every Animal a",
    titleHighlight: "Second Chance",
    description: "We rescue animals from shelters, abusive situations, and abandonment. Every animal deserves love, care, and a forever home."
  });

  const stats = getSection<StatsContent>('stats', {
    items: [
      { value: "500+", label: "Animals Rescued" },
      { value: "400+", label: "Successful Adoptions" },
      { value: "95%", label: "Success Rate" }
    ]
  });

  const steps = getSection<StepsContent>('steps', {
    items: [
      { icon: "Phone", title: "Report", description: "Call our 24/7 rescue hotline or submit an online report about an animal in need." },
      { icon: "FileText", title: "Assess", description: "Our team evaluates the situation and dispatches rescue specialists if needed." },
      { icon: "Heart", title: "Rescue", description: "We safely retrieve the animal and provide immediate medical care." },
      { icon: "Home", title: "Rehabilitate & Rehome", description: "Animals receive full care until they're ready for their forever home." }
    ]
  });

  const formContent = getSection<FormContent>('form', {
    title: "Adoption Application",
    description: "Start your journey to pet parenthood"
  });

  const rescueAnimals = animals.filter((a) => a.status === "Available for Adoption");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and contact you within 3-5 business days.",
    });
    setFormData({ name: "", email: "", phone: "", reason: "", experience: "", housing: "" });
  };

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
      <section className="relative bg-gradient-to-br from-accent/10 via-background to-primary/5 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
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
                <a href="#adopt">View Adoptable Animals</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Report an Animal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-accent/5">
        <div className="container-app">
          <div className="grid grid-cols-3 gap-6 text-center">
            {stats.items.map((stat, index) => (
              <div key={index}>
                <div className="font-heading text-3xl md:text-4xl font-bold text-accent">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">How Our Rescue Works</h2>
            <p className="text-muted-foreground">From report to forever home, we're with them every step</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.items.map((step, index) => {
              const IconComponent = iconMap[step.icon] || Heart;
              return (
                <Card key={step.title} className="relative">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-7 w-7 text-accent" />
                    </div>
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Adoptable Animals */}
      <section id="adopt" className="section-padding bg-muted/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Animals Ready for Adoption</h2>
            <p className="text-muted-foreground">These loving animals are waiting for their forever homes</p>
          </div>
          {animalsLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : rescueAnimals.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rescueAnimals.map((animal) => (
                <Card key={animal.id} className="overflow-hidden card-hover group">
                  <Link to={`/animals/${animal.id}`}>
                    <div className="aspect-square overflow-hidden">
                      <img src={animal.image} alt={animal.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-heading font-semibold text-lg">{animal.name}</h3>
                      <p className="text-sm text-muted-foreground">{animal.breed} • {animal.age}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No animals available for adoption at the moment. Check back soon or add animals in the admin panel!</p>
            </div>
          )}
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/animals">View All Animals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Adoption Application */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl font-bold mb-4">{formContent.title}</h2>
              <p className="text-muted-foreground">{formContent.description}</p>
            </div>
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="housing">Housing Type</Label>
                    <Input id="housing" placeholder="House, apartment, etc." value={formData.housing} onChange={(e) => setFormData({ ...formData, housing: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Pet Experience</Label>
                    <Textarea id="experience" placeholder="Tell us about your experience with pets..." value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Why do you want to adopt? *</Label>
                    <Textarea id="reason" placeholder="Tell us why you're interested in adoption..." value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} required />
                  </div>
                  <Button type="submit" className="w-full">Submit Application</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold mb-4">Success Stories</h2>
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

export default RescueProgram;