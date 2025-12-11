import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Heart, Share2, Facebook, Twitter, Linkedin,
  Calendar, User, PawPrint, Send, MessageCircle
} from "lucide-react";
import { stories, animals } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const story = stories.find(s => s.id === id);
  const relatedAnimals = story?.relatedAnimalIds?.map(aid => animals.find(a => a.id === aid)).filter(Boolean) || [];
  const relatedStories = stories.filter(s => s.id !== id && s.category === story?.category).slice(0, 3);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(story?.likes || 0);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Jessica M.",
      content: "This story really touched my heart. Thank you for sharing!",
      date: "2 days ago",
      likes: 12
    },
    {
      id: "2",
      author: "David R.",
      content: "What an amazing journey. Woo-Fur does incredible work!",
      date: "1 week ago",
      likes: 8
    }
  ]);

  useEffect(() => {
    if (!story) {
      navigate("/stories");
    }
  }, [story, navigate]);

  if (!story) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (platform: string) => {
    const shareUrl = window.location.href;
    const shareText = `${story.title} - A beautiful story from Woo-Fur`;
    
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(story.title)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({ title: story.title, text: shareText, url: shareUrl });
          return;
        } else {
          navigator.clipboard.writeText(shareUrl);
          toast({ title: "Link copied!", description: "Share link copied to clipboard." });
          return;
        }
    }
    if (url) window.open(url, "_blank", "width=600,height=400");
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      content: newComment,
      date: "Just now",
      likes: 0
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment("");
    toast({ title: "Comment posted!", description: "Thank you for your feedback." });
  };

  return (
    <Layout>
      {/* Back Button */}
      <div className="bg-card border-b">
        <div className="container-app py-4">
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/stories">
              <ArrowLeft className="h-4 w-4" /> Back to Stories
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <section className="section-padding -mt-32 relative z-10">
        <div className="container-app">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                {story.category}
              </Badge>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                {story.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{story.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{story.author}</p>
                    {story.authorRole && <p className="text-xs">{story.authorRole}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{story.date}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pb-6 border-b">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  className="gap-2"
                >
                  <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                  {likeCount}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShare("default")} className="gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <div className="hidden sm:flex items-center gap-1 ml-auto">
                  <Button variant="ghost" size="icon" onClick={() => handleShare("facebook")}>
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleShare("twitter")}>
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleShare("linkedin")}>
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Story Content */}
            <article className="prose prose-lg max-w-none mb-12">
              {story.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </article>

            {/* Related Animals */}
            {relatedAnimals.length > 0 && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-primary" />
                    Animals in This Story
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {relatedAnimals.map((animal) => animal && (
                      <Link
                        key={animal.id}
                        to={`/animals/${animal.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <img
                          src={animal.image}
                          alt={animal.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{animal.name}</p>
                          <p className="text-sm text-muted-foreground">{animal.breed}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Comments ({comments.length})
                </h3>
                
                {/* Add Comment */}
                <div className="flex gap-3 mb-6">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={2}
                      className="mb-2"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim()}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" /> Post Comment
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-4 rounded-lg bg-muted/30">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{comment.author}</p>
                          <span className="text-xs text-muted-foreground">{comment.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                        <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs gap-1">
                          <Heart className="h-3 w-3" /> {comment.likes}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Stories */}
            {relatedStories.length > 0 && (
              <div>
                <h3 className="font-heading text-xl font-semibold mb-6">
                  More Stories Like This
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedStories.map((relatedStory) => (
                    <Link key={relatedStory.id} to={`/stories/${relatedStory.id}`}>
                      <Card className="overflow-hidden card-hover h-full">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={relatedStory.image}
                            alt={relatedStory.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                            {relatedStory.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {relatedStory.author}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StoryDetail;
