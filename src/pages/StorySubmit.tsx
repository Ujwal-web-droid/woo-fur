import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  PenSquare, Upload, Image, Save, Send, 
  ArrowLeft, CheckCircle, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const categories = [
  { value: "therapy", label: "Therapy Success" },
  { value: "rescue", label: "Rescue Story" },
  { value: "rehabilitation", label: "Rehabilitation" },
  { value: "community", label: "Community" },
  { value: "volunteer", label: "Volunteer Experience" },
];

const StorySubmit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    authorName: "",
    authorEmail: "",
    animalName: "",
    consent: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem("storyDraft", JSON.stringify(formData));
    setIsDraft(true);
    toast({
      title: "Draft Saved",
      description: "Your story has been saved as a draft.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "Please agree to the terms before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    localStorage.removeItem("storyDraft");
    
    toast({
      title: "Story Submitted!",
      description: "Thank you for sharing. We'll review your story soon.",
    });
    
    navigate("/stories");
    setIsSubmitting(false);
  };

  // Load draft on mount
  useState(() => {
    const draft = localStorage.getItem("storyDraft");
    if (draft) {
      setFormData(JSON.parse(draft));
      setIsDraft(true);
    }
  });

  const characterCount = formData.content.length;
  const wordCount = formData.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sand-light/30 via-background to-beige section-padding">
        <div className="container-app">
          <Button variant="ghost" asChild className="mb-6 gap-2">
            <Link to="/stories">
              <ArrowLeft className="h-4 w-4" /> Back to Stories
            </Link>
          </Button>
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <PenSquare className="h-4 w-4" />
              <span>Share Your Story</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Your Story <span className="text-gradient">Matters</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Share how our animals have impacted your life. Your experience could inspire 
              others and help spread awareness about the healing power of the human-animal bond.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Story Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Story Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Give your story a compelling title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Brief Summary *</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleChange("excerpt", e.target.value)}
                      placeholder="A short summary that will appear in the story preview (1-2 sentences)"
                      rows={2}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="content">Your Story *</Label>
                      <span className="text-xs text-muted-foreground">
                        {wordCount} words • {characterCount} characters
                      </span>
                    </div>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleChange("content", e.target.value)}
                      placeholder="Share your experience in detail. What led you to Woo-Fur? How did the animals help you? What changed in your life?"
                      rows={12}
                      required
                      className="min-h-[300px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tip: Include specific moments, emotions, and details to make your story more engaging.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="animalName">Animal Name (if applicable)</Label>
                    <Input
                      id="animalName"
                      value={formData.animalName}
                      onChange={(e) => handleChange("animalName", e.target.value)}
                      placeholder="Name of the animal in your story"
                    />
                  </div>

                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Image className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium mb-1">Add Photos (Optional)</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload images to accompany your story
                    </p>
                    <Button type="button" variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Images
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="authorName">Your Name *</Label>
                      <Input
                        id="authorName"
                        value={formData.authorName}
                        onChange={(e) => handleChange("authorName", e.target.value)}
                        placeholder="How should we credit you?"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="authorEmail">Email Address *</Label>
                      <Input
                        id="authorEmail"
                        type="email"
                        value={formData.authorEmail}
                        onChange={(e) => handleChange("authorEmail", e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => handleChange("consent", checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="consent" className="cursor-pointer">
                        I agree to the terms and conditions *
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        By submitting, you grant Woo-Fur permission to publish your story on our 
                        website and social media channels. We may edit for clarity and length.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isDraft ? "Update Draft" : "Save as Draft"}
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.consent}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Story
                    </>
                  )}
                </Button>
              </div>

              {isDraft && (
                <p className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Draft saved locally
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StorySubmit;
