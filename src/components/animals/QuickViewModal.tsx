import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Animal } from "@/types/database";
import { Link } from "react-router-dom";
import { Heart, Calendar, Award, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickViewModalProps {
  animal: Animal | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const QuickViewModal = ({
  animal,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}: QuickViewModalProps) => {
  if (!animal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">{animal.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-square rounded-xl overflow-hidden">
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground">
                {animal.breed} • {animal.age} • {animal.gender}
              </p>
              <Badge
                className={cn(
                  "mt-2",
                  animal.status === "Therapy Certified" && "bg-primary/10 text-primary hover:bg-primary/20",
                  animal.status === "Available for Adoption" && "bg-accent/10 text-accent hover:bg-accent/20",
                  animal.status === "Part-time Pet" && "bg-amber-light text-amber-dark hover:bg-amber-light/80",
                  animal.status === "In Rehabilitation" && "bg-sage-light text-sage-dark hover:bg-sage-light/80"
                )}
              >
                {animal.status}
              </Badge>
            </div>

            <p className="text-sm line-clamp-4">{animal.biography}</p>

            <div>
              <h4 className="font-medium text-sm mb-2">Personality</h4>
              <div className="flex flex-wrap gap-1">
                {animal.personalityTraits.map((trait) => (
                  <Badge key={trait} variant="outline" className="text-xs">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            {animal.therapyCertifications.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <Award className="h-4 w-4 text-primary" />
                  Certifications
                </h4>
                <div className="flex flex-wrap gap-1">
                  {animal.therapyCertifications.map((cert) => (
                    <Badge key={cert} className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Availability
              </h4>
              <div className="flex gap-1">
                {Object.entries(animal.availability).map(([day, available]) => (
                  <span
                    key={day}
                    className={cn(
                      "text-xs w-8 h-8 rounded-full flex items-center justify-center",
                      available ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {day.slice(0, 2)}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => onToggleFavorite(animal.id)}
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-accent text-accent")} />
                {isFavorite ? "Saved" : "Save"}
              </Button>
              <Button className="flex-1 gap-2" asChild>
                <Link to={`/animals/${animal.id}`} onClick={onClose}>
                  Full Profile <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
