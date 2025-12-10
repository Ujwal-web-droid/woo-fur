import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { animals } from "@/data/mockData";
import { ImageGallery } from "@/components/shared/ImageGallery";
import { useFavorites } from "@/hooks/useFavorites";
import {
  Heart,
  Calendar,
  Award,
  Share2,
  ArrowLeft,
  Stethoscope,
  Sparkles,
  AlertCircle,
  Facebook,
  Twitter,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AnimalProfile = () => {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  const animal = animals.find((a) => a.id === id);

  if (!animal) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <h1 className="font-heading text-2xl font-bold mb-4">Animal Not Found</h1>
          <Button asChild>
            <Link to="/animals">Back to Animals</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedAnimals = animals
    .filter((a) => a.id !== animal.id && a.species === animal.species)
    .slice(0, 3);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Meet ${animal.name}, a ${animal.breed} at Woo-Fur!`;

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast({ title: "Link copied!", description: "Profile link copied to clipboard." });
        break;
    }
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container-app">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/animals" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Animals
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{animal.name}</span>
          </div>
        </div>
      </div>

      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div>
              <ImageGallery images={animal.gallery} alt={animal.name} />
            </div>

            {/* Animal Info */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{animal.name}</h1>
                  <p className="text-lg text-muted-foreground">
                    {animal.breed} • {animal.age} • {animal.gender}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleFavorite(animal.id)}
                    className={cn(isFavorite(animal.id) && "bg-accent/10 border-accent")}
                  >
                    <Heart className={cn("h-5 w-5", isFavorite(animal.id) && "fill-accent text-accent")} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleShare("facebook")}>
                        <Facebook className="h-4 w-4 mr-2" /> Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("twitter")}>
                        <Twitter className="h-4 w-4 mr-2" /> Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("copy")}>
                        <LinkIcon className="h-4 w-4 mr-2" /> Copy Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Badge
                className={cn(
                  "text-sm py-1 px-3",
                  animal.status === "Therapy Certified" && "bg-primary/10 text-primary hover:bg-primary/20",
                  animal.status === "Available for Adoption" && "bg-accent/10 text-accent hover:bg-accent/20",
                  animal.status === "Part-time Pet" && "bg-amber-light text-amber-dark hover:bg-amber-light/80",
                  animal.status === "In Rehabilitation" && "bg-sage-light text-sage-dark hover:bg-sage-light/80"
                )}
              >
                {animal.status}
              </Badge>

              {/* Biography */}
              <div>
                <h2 className="font-heading font-semibold text-lg mb-2">About {animal.name}</h2>
                <p className="text-muted-foreground leading-relaxed">{animal.biography}</p>
              </div>

              {/* Personality Traits */}
              <div>
                <h2 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Personality
                </h2>
                <div className="flex flex-wrap gap-2">
                  {animal.personalityTraits.map((trait) => (
                    <Badge key={trait} variant="outline" className="text-sm">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Therapy Certifications */}
              {animal.therapyCertifications.length > 0 && (
                <div>
                  <h2 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Certifications
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {animal.therapyCertifications.map((cert) => (
                      <Badge key={cert} className="bg-primary/10 text-primary hover:bg-primary/20">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" asChild>
                  <Link to="/booking">Schedule a Visit</Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Information Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {/* Medical History */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Medical History
                </h3>
                <ul className="space-y-2">
                  {animal.medicalHistory.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Special Needs */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber" />
                  Special Needs
                </h3>
                {animal.specialNeeds.length > 0 ? (
                  <ul className="space-y-2">
                    {animal.specialNeeds.map((need, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber" />
                        {need}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No special needs</p>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Weekly Availability
                </h3>
                <div className="grid grid-cols-7 gap-1">
                  {Object.entries(animal.availability).map(([day, available]) => (
                    <div key={day} className="text-center">
                      <span className="text-xs text-muted-foreground block mb-1">{day}</span>
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-medium",
                          available ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {available ? "✓" : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Animals */}
          {relatedAnimals.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl font-bold mb-8">More {animal.species}s You Might Like</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedAnimals.map((related) => (
                  <Card key={related.id} className="overflow-hidden card-hover group">
                    <Link to={`/animals/${related.id}`}>
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-heading font-semibold text-lg">{related.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {related.breed} • {related.age}
                        </p>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AnimalProfile;
