import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, Heart, Filter } from "lucide-react";

const animals = [
  { name: "Luna", species: "Golden Retriever", age: "4 years", status: "Therapy Certified", emoji: "🐕" },
  { name: "Oliver", species: "Tabby Cat", age: "2 years", status: "Available for Adoption", emoji: "🐈" },
  { name: "Daisy", species: "Holland Lop Rabbit", age: "1 year", status: "Part-time Pet", emoji: "🐰" },
  { name: "Max", species: "Border Collie", age: "3 years", status: "Therapy Certified", emoji: "🐕" },
  { name: "Whiskers", species: "Persian Cat", age: "5 years", status: "Available for Adoption", emoji: "🐱" },
  { name: "Coco", species: "Mini Poodle", age: "2 years", status: "In Rehabilitation", emoji: "🐩" },
];

const Animals = () => {
  return (
    <Layout>
      <section className="relative bg-gradient-to-br from-sage-light/30 via-background to-amber-light/20 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <PawPrint className="h-4 w-4" />
              <span>Our Animals</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Meet Our <span className="text-gradient">Furry Friends</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Each of our animals has a unique story and personality. Find your perfect match for therapy, adoption, or companionship.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">{animals.length} animals available</p>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals.map((animal) => (
              <Card key={animal.name} className="overflow-hidden card-hover group">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                  <span className="text-8xl group-hover:scale-110 transition-transform">{animal.emoji}</span>
                  <button className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background transition-colors">
                    <Heart className="h-5 w-5 text-muted-foreground hover:text-accent" />
                  </button>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-heading font-semibold text-lg">{animal.name}</h3>
                      <p className="text-sm text-muted-foreground">{animal.species} • {animal.age}</p>
                    </div>
                  </div>
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {animal.status}
                  </span>
                  <Button variant="outline" className="w-full mt-4">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Animals;
