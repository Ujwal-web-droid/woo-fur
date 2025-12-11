import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  HelpCircle, Search, MessageSquare, Send, 
  Heart, Calendar, Users, DollarSign, PawPrint
} from "lucide-react";
import { faqs } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const categoryIcons: { [key: string]: React.ElementType } = {
  therapy: Heart,
  rescue: PawPrint,
  "part-time-pets": Calendar,
  volunteer: Users,
  donations: DollarSign,
  booking: Calendar,
  general: HelpCircle,
};

const categories = [
  { id: "all", label: "All Questions" },
  { id: "therapy", label: "Therapy" },
  { id: "rescue", label: "Rescue & Adoption" },
  { id: "part-time-pets", label: "Part-time Pets" },
  { id: "volunteer", label: "Volunteering" },
  { id: "donations", label: "Donations" },
  { id: "booking", label: "Booking" },
  { id: "general", label: "General" },
];

const FAQ = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAskForm, setShowAskForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    name: "",
    email: "",
    question: ""
  });

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "all" || faq.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">{part}</mark>
        : part
    );
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Question Submitted!",
      description: "We'll get back to you within 24-48 hours.",
    });
    
    setShowAskForm(false);
    setQuestionForm({ name: "", email: "", question: "" });
  };

  // Group FAQs by category for related questions
  const getRelatedQuestions = (currentFaq: typeof faqs[0]) => {
    return faqs
      .filter(f => f.category === currentFaq.category && f.id !== currentFaq.id)
      .slice(0, 2);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sand-light/30 via-background to-beige section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <HelpCircle className="h-4 w-4" />
              <span>Help Center</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers to common questions about our programs, services, and how to get involved.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-6 bg-card border-y sticky top-0 z-20">
        <div className="container-app">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((category) => {
              const Icon = categoryIcons[category.id] || HelpCircle;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex-shrink-0 gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="max-w-3xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <Card className="text-center">
                <CardContent className="py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-semibold mb-2">
                    No Results Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any questions matching your search. 
                    Try different keywords or browse by category.
                  </p>
                  <Button onClick={() => setShowAskForm(true)} className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Ask Your Question
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq) => {
                  const Icon = categoryIcons[faq.category] || HelpCircle;
                  const relatedQuestions = getRelatedQuestions(faq);
                  
                  return (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border rounded-lg px-6 data-[state=open]:bg-card"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-start gap-3 text-left">
                          <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="font-medium">
                            {highlightMatch(faq.question, searchQuery)}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="pl-8">
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {highlightMatch(faq.answer, searchQuery)}
                          </p>
                          
                          {relatedQuestions.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm font-medium mb-2">Related Questions:</p>
                              <ul className="space-y-1">
                                {relatedQuestions.map((related) => (
                                  <li key={related.id}>
                                    <button
                                      className="text-sm text-primary hover:underline text-left"
                                      onClick={() => {
                                        const element = document.querySelector(`[data-value="${related.id}"]`);
                                        element?.scrollIntoView({ behavior: "smooth", block: "center" });
                                      }}
                                    >
                                      {related.question}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}

            {/* Ask a Question CTA */}
            <Card className="mt-12 bg-gradient-to-r from-primary/10 to-sand-light/50 border-primary/20">
              <CardContent className="py-8 text-center">
                <MessageSquare className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold mb-2">
                  Didn't Find Your Answer?
                </h3>
                <p className="text-muted-foreground mb-6">
                  We're here to help! Send us your question and we'll get back to you.
                </p>
                <Button onClick={() => setShowAskForm(!showAskForm)} className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {showAskForm ? "Hide Form" : "Ask a Question"}
                </Button>
              </CardContent>
            </Card>

            {/* Ask Question Form */}
            {showAskForm && (
              <Card className="mt-6 animate-fade-in">
                <CardContent className="p-6">
                  <form onSubmit={handleAskQuestion} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                          id="name"
                          value={questionForm.name}
                          onChange={(e) => setQuestionForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={questionForm.email}
                          onChange={(e) => setQuestionForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="question">Your Question *</Label>
                      <Textarea
                        id="question"
                        value={questionForm.question}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                        placeholder="What would you like to know?"
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setShowAskForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="gap-2">
                        <Send className="h-4 w-4" />
                        Send Question
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section-padding bg-card border-t">
        <div className="container-app">
          <h2 className="font-heading text-2xl font-bold text-center mb-8">
            Popular Topics
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Therapy Sessions", link: "/programs/therapy", description: "Learn about our certified therapy animals" },
              { icon: PawPrint, title: "Adoption Process", link: "/programs/rescue", description: "How to adopt one of our animals" },
              { icon: Calendar, title: "Book a Visit", link: "/booking", description: "Schedule your experience" },
              { icon: DollarSign, title: "Support Us", link: "/support", description: "Ways to donate and help" }
            ].map((topic, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <topic.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-heading font-semibold mb-1">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href={topic.link}>Learn more →</a>
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

export default FAQ;
