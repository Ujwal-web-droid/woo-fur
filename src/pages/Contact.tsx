import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Calendar,
  PawPrint,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

const contactReasons = [
  "General Inquiry",
  "Therapy Session Booking",
  "Adoption Information",
  "Volunteer Opportunities",
  "Donation Questions",
  "Media & Press",
  "Partnership Inquiry",
  "Other",
];

const operatingHours = [
  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
  { day: "Sunday", hours: "12:00 PM - 4:00 PM" },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, url: "#", followers: "12.5K" },
  { name: "Instagram", icon: Instagram, url: "#", followers: "28K" },
  { name: "Twitter", icon: Twitter, url: "#", followers: "8.2K" },
  { name: "Youtube", icon: Youtube, url: "#", followers: "5.1K" },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24-48 hours.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      reason: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage-light/30 via-background to-amber-light/20 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <MessageCircle className="h-4 w-4" />
              <span>Get in Touch</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Contact <span className="text-gradient">Woo-Fur</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about our programs, want to schedule a visit, or
              interested in volunteering? We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    Send Us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Contact *</Label>
                        <Select
                          value={formData.reason}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, reason: value }))
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            {contactReasons.map((reason) => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us how we can help you..."
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Location Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-1">
                        Visit Us
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        123 Healing Paws Lane
                        <br />
                        Greenfield, CA 95000
                      </p>
                      <Button
                        variant="link"
                        className="px-0 h-auto text-primary"
                      >
                        Get Directions →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone & Email Card */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-1">
                        Call Us
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        (555) 123-4567
                      </p>
                      <p className="text-xs text-muted-foreground">
                        For emergencies: (555) 123-9999
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-sage-dark" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-1">
                        Email Us
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        hello@woo-fur.org
                      </p>
                      <p className="text-xs text-muted-foreground">
                        We respond within 24-48 hours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold">
                      Operating Hours
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {operatingHours.map((schedule) => (
                      <div
                        key={schedule.day}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {schedule.day}
                        </span>
                        <span className="font-medium">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      <strong>Note:</strong> Therapy sessions are by appointment
                      only. Please book in advance.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="pt-6">
                  <h3 className="font-heading font-semibold mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      Book a Visit
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <PawPrint className="h-4 w-4" />
                      View Our Animals
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Interactive Map Coming Soon</p>
            <p className="text-sm text-muted-foreground/70">
              123 Healing Paws Lane, Greenfield, CA 95000
            </p>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-12 bg-foreground text-background">
        <div className="container-app">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold mb-2">
              Follow Our Journey
            </h2>
            <p className="text-background/70">
              Stay connected with daily updates, rescue stories, and adorable moments.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-background/10 hover:bg-background/20 transition-colors"
              >
                <social.icon className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-sm font-medium">{social.name}</p>
                  <p className="text-xs text-background/60">
                    {social.followers} followers
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
