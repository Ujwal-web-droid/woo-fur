import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Testimonial } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
}

export const TestimonialCarousel = ({
  testimonials,
  autoPlay = true,
  interval = 5000,
}: TestimonialCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <div className="relative">
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-none">
        <CardContent className="p-8 md:p-12">
          <Quote className="h-10 w-10 text-primary/20 mb-6" />
          
          <div className="min-h-[120px]">
            <p className="text-lg md:text-xl leading-relaxed mb-6 animate-fade-in">
              "{current.content}"
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading font-semibold">{current.name}</p>
              <p className="text-sm text-muted-foreground">{current.role}</p>
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < current.rating ? "text-amber fill-amber" : "text-muted"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={goToPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentIndex === index ? "bg-primary w-6" : "bg-primary/30"
            )}
          />
        ))}
      </div>
    </div>
  );
};
