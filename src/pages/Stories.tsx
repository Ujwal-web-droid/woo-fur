import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, ArrowRight } from "lucide-react";

const stories = [
  {
    title: "How Luna Changed Sarah's Life Forever",
    excerpt: "After months of struggling with anxiety, I found peace in Luna's gentle presence.",
    author: "Sarah Mitchell",
    date: "December 2024",
    category: "Therapy Success",
    emoji: "🐕",
  },
  {
    title: "From Shelter to Sanctuary",
    excerpt: "Oliver was found abandoned in a box. Today, he brings joy to everyone he meets.",
    author: "Woo-Fur Team",
    date: "November 2024",
    category: "Rescue Story",
    emoji: "🐈",
  },
  {
    title: "A Second Chance at Happiness",
    excerpt: "Max's journey from abuse to becoming a certified therapy dog is truly inspiring.",
    author: "Dr. Emily Chen",
    date: "October 2024",
    category: "Rehabilitation",
    emoji: "🐕",
  },
];

const Stories = () => {
  return (
    <Layout>
      <section className="relative bg-gradient-to-br from-sage-light/30 via-background to-amber-light/20 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              <span>Impact Stories</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Stories of <span className="text-gradient">Healing & Hope</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Real stories from our community about the transformative power of the human-animal bond.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Card key={story.title} className="overflow-hidden card-hover group">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform">{story.emoji}</span>
                </div>
                <CardContent className="p-6">
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-accent/10 text-accent mb-3">
                    {story.category}
                  </span>
                  <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2">{story.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{story.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{story.author} • {story.date}</p>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Read <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="gap-2">
              <Heart className="h-4 w-4" />
              Share Your Story
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Stories;
