import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye } from "lucide-react";
import { Animal } from "@/types/database";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AnimalCardProps {
  animal: Animal;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onQuickView: (animal: Animal) => void;
}

export const AnimalCard = ({ animal, isFavorite, onToggleFavorite, onQuickView }: AnimalCardProps) => {
  return (
    <Card className="overflow-hidden card-hover group">
      <div className="aspect-square overflow-hidden relative">
        <img
          src={animal.image}
          alt={animal.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(animal.id);
            }}
            className={cn(
              "p-2 rounded-full bg-background/80 hover:bg-background transition-colors",
              isFavorite && "bg-accent/20"
            )}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "text-accent fill-accent" : "text-muted-foreground hover:text-accent"
              )}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(animal);
            }}
            className="p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          >
            <Eye className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex flex-wrap gap-1">
            {animal.personalityTraits.slice(0, 3).map((trait) => (
              <span key={trait} className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-heading font-semibold text-lg">{animal.name}</h3>
            <p className="text-sm text-muted-foreground">
              {animal.breed} • {animal.age}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "inline-block text-xs px-2 py-1 rounded-full",
            animal.status === "Therapy Certified" && "bg-primary/10 text-primary",
            animal.status === "Available for Adoption" && "bg-accent/10 text-accent",
            animal.status === "Part-time Pet" && "bg-amber-light text-amber-dark",
            animal.status === "In Rehabilitation" && "bg-sage-light text-sage-dark"
          )}
        >
          {animal.status}
        </span>
        <Button variant="outline" className="w-full mt-4" asChild>
          <Link to={`/animals/${animal.id}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
