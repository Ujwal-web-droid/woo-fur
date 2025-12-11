import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Heart, Clock, MapPin, Calendar, 
  Search, Filter, CheckCircle, Upload, Send,
  Award, Star, Sparkles
} from "lucide-react";
import { volunteerOpportunities } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const skillOptions = [
  "Animal handling",
  "Customer service",
  "Event planning",
  "Photography",
  "Social media",
  "Administrative",
  "Medical/Veterinary",
  "Training/Teaching",
  "Driving",
  "Cooking/Baking"
];

const availabilityOptions = [
  "Weekday mornings",
  "Weekday afternoons",
  "Weekday evenings",
  "Weekend mornings",
  "Weekend afternoons",
  "Flexible"
];

const Volunteer = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    skills: [] as string[],
    availability: [] as string[],
    experience: "",
    motivation: "",
    consent: false
  });

  const filteredOpportunities = volunteerOpportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleAvailability = (time: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(time)
        ? prev.availability.filter(t => t !== time)
        : [...prev.availability, time]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the volunteer terms.",
        variant: "destructive"
      });
      return;
    }

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Application Submitted!",
      description: "We'll contact you within 3-5 business days.",
    });
    
    setShowApplicationForm(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      skills: [],
      availability: [],
      experience: "",
      motivation: "",
      consent: false
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-sand-light/30 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              <span>Join Our Team</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Become a <span className="text-gradient">Volunteer</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Make a difference in the lives of animals and the people they help. 
              Join our community of dedicated volunteers.
            </p>
            <Button size="lg" onClick={() => setShowApplicationForm(true)} className="gap-2">
              <Heart className="h-5 w-5" />
              Apply to Volunteer
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-card border-y">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "150+", label: "Active Volunteers" },
              { value: "12,000+", label: "Hours Donated" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "5", label: "Awards Won" }
            ].map((stat, index) => (
              <div key={index}>
                <p className="font-heading text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <h2 className="font-heading text-2xl font-bold">Volunteer Opportunities</h2>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <Card 
                key={opportunity.id} 
                className={cn(
                  "card-hover cursor-pointer transition-all",
                  selectedOpportunity === opportunity.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedOpportunity(
                  selectedOpportunity === opportunity.id ? null : opportunity.id
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-heading font-semibold text-lg">{opportunity.title}</h3>
                    <Badge variant="secondary">{opportunity.spots} spots</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {opportunity.description}
                  </p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{opportunity.commitment}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{opportunity.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {opportunity.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  {selectedOpportunity === opportunity.id && (
                    <Button 
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowApplicationForm(true);
                      }}
                    >
                      Apply for This Role
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Modal/Section */}
      {showApplicationForm && (
        <section className="section-padding bg-card border-t" id="application">
          <div className="container-app">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Volunteer Application
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-3">
                      <Label>Skills & Interests (select all that apply)</Label>
                      <div className="flex flex-wrap gap-2">
                        {skillOptions.map((skill) => (
                          <Button
                            key={skill}
                            type="button"
                            variant={formData.skills.includes(skill) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleSkill(skill)}
                          >
                            {skill}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="space-y-3">
                      <Label>Availability (select all that apply) *</Label>
                      <div className="flex flex-wrap gap-2">
                        {availabilityOptions.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={formData.availability.includes(time) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleAvailability(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-2">
                      <Label htmlFor="experience">Previous Volunteer/Animal Experience</Label>
                      <Textarea
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="Tell us about any relevant experience..."
                        rows={3}
                      />
                    </div>

                    {/* Motivation */}
                    <div className="space-y-2">
                      <Label htmlFor="motivation">Why do you want to volunteer? *</Label>
                      <Textarea
                        id="motivation"
                        value={formData.motivation}
                        onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                        placeholder="What draws you to Woo-Fur?"
                        rows={3}
                        required
                      />
                    </div>

                    {/* Consent */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, consent: checked as boolean }))
                        }
                      />
                      <div>
                        <Label htmlFor="consent" className="cursor-pointer">
                          I agree to the volunteer terms *
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          I understand that a background check may be required and I commit 
                          to attending an orientation session if accepted.
                        </p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowApplicationForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="gap-2">
                        <Send className="h-4 w-4" />
                        Submit Application
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="section-padding bg-background border-t">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">
              Why Volunteer With Us?
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Make a Difference",
                description: "Directly impact the lives of animals and the people they help heal"
              },
              {
                icon: Award,
                title: "Gain Experience",
                description: "Learn animal care, therapy techniques, and event management"
              },
              {
                icon: Users,
                title: "Join a Community",
                description: "Connect with like-minded animal lovers and make lasting friendships"
              },
              {
                icon: Star,
                title: "Recognition",
                description: "Receive certificates, references, and appreciation events"
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="p-6">
                  <benefit.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-heading font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Volunteer;
