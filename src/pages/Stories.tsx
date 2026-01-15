import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, Heart, ArrowRight, Search, Filter, 
  PenSquare, Sparkles, ChevronLeft, ChevronRight 
} from "lucide-react";
import { useStories, useFeaturedStories, useStoryLike, useStoriesRealtime } from "@/hooks/useStories";
import { useAuth } from "@/context/AuthContext";
import { usePageContent } from "@/hooks/usePageContent";
import { cn } from "@/lib/utils";

const STORIES_PER_PAGE = 6;

interface HeroContent {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
}

interface CategoriesContent {
  items: string[];
}

interface CTAContent {
  title: string;
  description: string;
  buttonText: string;
}

const Stories = () => {
  const { user } = useAuth();
  const { data: stories = [], isLoading } = useStories();
  const { data: featuredStories = [] } = useFeaturedStories();
  const { likedStories, toggleLike } = useStoryLike();
  const { subscribeToStories } = useStoriesRealtime();
  const { getSection, isLoading: contentLoading } = usePageContent('stories');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [localLikes, setLocalLikes] = useState<Set<string>>(new Set());
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const hero = getSection<HeroContent>('hero', {
    badge: "Impact Stories",
    title: "Stories of",
    titleHighlight: "Healing & Hope",
    description: "Real stories from our community about the transformative power of the human-animal bond."
  });

  const categoriesContent = getSection<CategoriesContent>('categories', {
    items: ["All", "healing", "transformation", "community", "youth"]
  });

  const ctaContent = getSection<CTAContent>('cta', {
    title: "Have a Story to Share?",
    description: "Your experience could inspire others. Share how our animals have impacted your life.",
    buttonText: "Share Your Story"
  });

  const categories = categoriesContent.items;

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToStories();
    return () => unsubscribe();
  }, []);

  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      const matchesSearch = 
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "All" || story.category.toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, stories]);

  const currentFeatured = featuredStories[featuredIndex];

  const totalPages = Math.ceil(filteredStories.length / STORIES_PER_PAGE);
  const paginatedStories = filteredStories.slice(
    (currentPage - 1) * STORIES_PER_PAGE,
    currentPage * STORIES_PER_PAGE
  );

  const handleLike = (storyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (user) {
      toggleLike(storyId);
    } else {
      // Local-only likes for non-authenticated users
      setLocalLikes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(storyId)) {
          newSet.delete(storyId);
        } else {
          newSet.add(storyId);
        }
        return newSet;
      });
    }
  };

  const isLiked = (storyId: string) => {
    return likedStories.has(storyId) || localLikes.has(storyId);
  };

  const nextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % featuredStories.length);
  };

  const prevFeatured = () => {
    setFeaturedIndex((prev) => (prev - 1 + featuredStories.length) % featuredStories.length);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">{part}</mark>
        : part
    );
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sand-light/30 via-background to-beige section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
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

      {/* Featured Story Carousel */}
      {featuredStories.length > 0 && currentFeatured && (
        <section className="py-12 bg-card border-y">
          <div className="container-app">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-semibold">Featured Story</h2>
            </div>
            
            <div className="relative">
              <Card className="overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto">
                    <img
                      src={currentFeatured.image}
                      alt={currentFeatured.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                    <Badge variant="secondary" className="w-fit mb-4">
                      {currentFeatured.category}
                    </Badge>
                    <h3 className="font-heading text-2xl font-bold mb-3">
                      {currentFeatured.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {currentFeatured.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {currentFeatured.author} • {currentFeatured.date}
                      </p>
                      <Button asChild>
                        <Link to={`/stories/${currentFeatured.id}`}>
                          Read Story <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
              
              {featuredStories.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                    onClick={prevFeatured}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                    onClick={nextFeatured}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Search & Filter */}
      <section className="py-8 bg-background border-b">
        <div className="container-app">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className="flex-shrink-0 capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="section-padding bg-background">
        <div className="container-app">
          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && stories.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">No Stories Yet</h3>
              <p className="text-muted-foreground">
                Stories will appear here once added through the admin panel.
              </p>
            </div>
          )}

          {!isLoading && stories.length > 0 && paginatedStories.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">No Stories Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : !isLoading && paginatedStories.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedStories.map((story) => (
                  <Link key={story.id} to={`/stories/${story.id}`}>
                    <Card className="overflow-hidden card-hover group h-full">
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <button
                          onClick={(e) => handleLike(story.id, e)}
                          className={cn(
                            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                            isLiked(story.id)
                              ? "bg-red-500 text-white"
                              : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-500"
                          )}
                        >
                          <Heart className={cn("h-4 w-4", isLiked(story.id) && "fill-current")} />
                        </button>
                      </div>
                      <CardContent className="p-6">
                        <Badge variant="secondary" className="mb-3 capitalize">
                          {story.category}
                        </Badge>
                        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {highlightMatch(story.title, searchQuery)}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {highlightMatch(story.excerpt, searchQuery)}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {highlightMatch(story.author, searchQuery)} • {story.date}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Heart className="h-3 w-3" />
                            <span>{story.likes + (isLiked(story.id) ? 1 : 0)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Share Your Story CTA */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-sand-light/50 border-primary/20">
              <CardContent className="py-12">
                <PenSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-bold mb-3">
                  {ctaContent.title}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {ctaContent.description}
                </p>
                <Button asChild size="lg">
                  <Link to="/stories/submit" className="gap-2">
                    <PenSquare className="h-4 w-4" />
                    {ctaContent.buttonText}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Stories;