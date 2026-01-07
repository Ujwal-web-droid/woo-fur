import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Calendar, 
  PawPrint, 
  ArrowRight, 
  Sparkles,
  Users,
  HandHeart,
  Clock,
  ChevronRight
} from "lucide-react";

// Animal images
import lunaImg from "@/assets/animals/luna-golden-retriever.jpg";
import oliverImg from "@/assets/animals/oliver-tabby-cat.jpg";
import daisyImg from "@/assets/animals/daisy-rabbit.jpg";

const programs = [
  {
    icon: Heart,
    title: "Animal Rescue",
    description: "Saving animals in need and giving them a second chance at a loving life.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Sparkles,
    title: "Rehabilitation",
    description: "Medical care and emotional healing for animals recovering from trauma.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Therapy Sessions",
    description: "Certified therapy animals providing comfort and healing to those in need.",
    color: "bg-sage-light text-sage-dark",
  },
  {
    icon: Clock,
    title: "Part-time Pets",
    description: "Experience the joy of animal companionship without full-time commitment.",
    color: "bg-amber-light text-amber-dark",
  },
];

const stats = [
  { value: "500+", label: "Animals Rescued" },
  { value: "1,200+", label: "Therapy Sessions" },
  { value: "300+", label: "Happy Adoptions" },
  { value: "50+", label: "Volunteers" },
];

const featuredAnimals = [
  { name: "Luna", species: "Golden Retriever", status: "Therapy Certified", image: lunaImg },
  { name: "Oliver", species: "Tabby Cat", status: "Available for Adoption", image: oliverImg },
  { name: "Daisy", species: "Rabbit", status: "Part-time Pet", image: daisyImg },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sage-light/30 via-background to-amber-light/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container-app relative section-padding">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <PawPrint className="h-4 w-4" />
              <span>Healing Through Connection</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-slide-up">
              Where Healing Paws Meet{" "}
              <span className="text-gradient">Loving Hearts</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Woo-Fur connects rescued animals with humans seeking therapeutic companionship. 
              Every interaction heals two souls.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button size="lg" className="gap-2 min-w-[180px]" asChild>
                <Link to="/booking">
                  <Calendar className="h-5 w-5" />
                  Book a Visit
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 min-w-[180px]" asChild>
                <Link to="/animals">
                  <Heart className="h-5 w-5" />
                  Meet Our Animals
                </Link>
              </Button>
            </div>
          </div>

          {/* Floating Animal Cards Preview */}
          <div className="mt-16 flex justify-center gap-4 overflow-x-auto pb-4 px-4 -mx-4 md:overflow-visible md:px-0 md:mx-0">
            {featuredAnimals.map((animal, index) => (
              <Card 
                key={animal.name}
                className="min-w-[200px] md:min-w-[220px] card-hover animate-slide-up overflow-hidden"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={animal.image} 
                    alt={animal.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-heading font-semibold text-lg">{animal.name}</h3>
                  <p className="text-sm text-muted-foreground">{animal.species}</p>
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {animal.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-foreground text-background py-12">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="font-heading text-3xl md:text-4xl font-bold text-accent">
                  {stat.value}
                </div>
                <div className="text-sm text-background/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Our Programs
            </h2>
            <p className="text-muted-foreground">
              Discover the many ways Woo-Fur creates meaningful connections between animals and humans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <Card 
                key={program.title}
                className="group card-hover border-2 border-transparent hover:border-primary/20"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${program.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <program.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {program.description}
                  </p>
                  <Link 
                    to="/programs" 
                    className="inline-flex items-center text-sm font-medium text-primary hover:gap-2 transition-all gap-1"
                  >
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Story Section */}
      <section className="section-padding bg-gradient-to-br from-sage-light/20 to-amber-light/20">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                Featured Story
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold">
                How Luna Changed Sarah's Life Forever
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                "After months of struggling with anxiety, I found peace in Luna's gentle presence. 
                Our weekly therapy sessions became the highlight of my week. Luna somehow always 
                knows exactly what I need—whether it's a quiet companion or playful energy to 
                lift my spirits."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  👩
                </div>
                <div>
                  <p className="font-medium">Sarah Mitchell</p>
                  <p className="text-sm text-muted-foreground">Therapy Client since 2023</p>
                </div>
              </div>
              <Button variant="outline" className="gap-2" asChild>
                <Link to="/stories">
                  Read More Stories <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-elevated">
                <img 
                  src={lunaImg} 
                  alt="Luna the therapy dog"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-card rounded-xl p-4 shadow-elevated">
                <div className="flex items-center gap-2">
                  <HandHeart className="h-5 w-5 text-accent" />
                  <span className="font-medium">200+ Sessions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-app text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience the Healing Power of Animals?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Whether you're looking for therapy sessions, considering adoption, or want to volunteer, 
            we'd love to connect you with our amazing animals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="gap-2 min-w-[180px]" asChild>
              <Link to="/booking">
                <Calendar className="h-5 w-5" />
                Schedule a Visit
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 min-w-[180px] bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
              <Link to="/support">
                <Heart className="h-5 w-5" />
                Make a Donation
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
