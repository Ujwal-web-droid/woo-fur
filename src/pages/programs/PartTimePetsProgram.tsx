import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, ArrowLeft, Calendar, CheckCircle, Package, Heart, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { animals, testimonials, programStats } from "@/data/mockData";
import { TestimonialCarousel } from "@/components/shared/TestimonialCarousel";

const pricingOptions = [
  { duration: "Weekend", days: "Fri-Sun", price: "$50", description: "Perfect for a trial experience", popular: false },
  { duration: "1 Week", days: "7 days", price: "$120", description: "Great for vacation coverage", popular: true },
  { duration: "2 Weeks", days: "14 days", price: "$200", description: "Extended companionship", popular: false },
  { duration: "Monthly", days: "30 days", price: "$350", description: "Regular pet presence", popular: false },
];

const whatsIncluded = [
  "All food and treats for the duration",
  "Necessary supplies (bowls, toys, bedding)",
  "24/7 support hotline",
  "Pre-visit orientation session",
  "Care instructions and guidelines",
  "Emergency vet contact information",
];

const careInstructions = [
  { title: "Feeding Schedule", content: "We provide a detailed feeding schedule with the exact type and amount of food. Most of our animals eat twice daily - morning and evening. All food and treats are included and delivered with the animal." },
  { title: "Exercise & Play", content: "Each animal comes with a guide to their preferred activities. Dogs need daily walks (we'll specify duration), cats enjoy interactive toys, and smaller animals have specific play needs. We provide all toys and equipment." },
  { title: "Health & Safety", content: "All animals are up-to-date on vaccinations and health checks. We provide emergency vet contacts and our 24/7 support line. Any medications needed will be clearly labeled with instructions." },
  { title: "Pickup & Return", content: "You can pick up your part-time pet from our facility, or we can arrange delivery for an additional fee. Return times are flexible - just coordinate with us beforehand." },
];

const PartTimePetsProgram = () => {
  const partTimeAnimals = animals.filter((a) => a.status === "Part-time Pet");
  const ptpTestimonials = testimonials.filter((t) => t.program === "part-time-pets");

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container-app">
          <Link to="/programs" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Programs
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-light/30 via-background to-primary/5 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-light text-amber-dark text-sm font-medium mb-6">
              <Clock className="h-4 w-4" />
              <span>Part-time Pets Program</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              All the Joy, <span className="text-gradient">Flexible Commitment</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Experience the companionship of a pet without the full-time commitment. Perfect for busy professionals, travelers, or those wanting to try pet ownership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="#animals">Browse Available Pets</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Ask Questions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-amber-light/30">
        <div className="container-app">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-amber-dark">{programStats.partTimePets.activeParticipants}+</div>
              <p className="text-sm text-muted-foreground">Active Participants</p>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-amber-dark">{programStats.partTimePets.animalsInProgram}</div>
              <p className="text-sm text-muted-foreground">Animals Available</p>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-amber-dark">{programStats.partTimePets.satisfactionRate}%</div>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Simple steps to your part-time companion</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Choose", description: "Browse available animals and find your match" },
              { icon: Calendar, title: "Schedule", description: "Pick dates that work for your lifestyle" },
              { icon: Package, title: "Receive", description: "We deliver everything you need" },
              { icon: Home, title: "Enjoy", description: "Create memories with your part-time pet" },
            ].map((step, index) => (
              <Card key={step.title}>
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-amber-light flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-7 w-7 text-amber-dark" />
                  </div>
                  <div className="text-xs font-medium text-amber-dark mb-2">Step {index + 1}</div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-muted/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Pricing Options</h2>
            <p className="text-muted-foreground">Flexible durations to fit your needs</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {pricingOptions.map((option) => (
              <Card key={option.duration} className={`relative ${option.popular ? "ring-2 ring-primary" : ""}`}>
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <h3 className="font-heading font-semibold text-lg mb-1">{option.duration}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{option.days}</p>
                  <div className="font-heading text-3xl font-bold text-primary mb-2">{option.price}</div>
                  <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                  <Button variant={option.popular ? "default" : "outline"} className="w-full" asChild>
                    <Link to="/booking">Select</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-6">What's Included</h2>
              <ul className="space-y-3">
                {whatsIncluded.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="bg-gradient-to-br from-amber-light/20 to-primary/10">
              <CardContent className="p-8">
                <h3 className="font-heading text-xl font-semibold mb-4">No Hidden Costs</h3>
                <p className="text-muted-foreground mb-4">
                  Our pricing includes everything you need. Food, supplies, toys, and support are all covered. The only additional cost would be for optional delivery service.
                </p>
                <p className="text-sm text-muted-foreground">
                  Delivery available for $25 within city limits.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Animals */}
      <section id="animals" className="section-padding bg-muted/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Available Part-time Pets</h2>
            <p className="text-muted-foreground">Meet your potential companions</p>
          </div>
          {partTimeAnimals.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {partTimeAnimals.map((animal) => (
                <Card key={animal.id} className="overflow-hidden card-hover group">
                  <Link to={`/animals/${animal.id}`}>
                    <div className="aspect-square overflow-hidden">
                      <img src={animal.image} alt={animal.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-heading font-semibold text-lg">{animal.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{animal.breed} • {animal.age}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {animal.personalityTraits.slice(0, 3).map((trait) => (
                          <span key={trait} className="text-xs px-2 py-0.5 rounded-full bg-amber-light/50 text-amber-dark">{trait}</span>
                        ))}
                      </div>
                      <Button className="w-full">Book {animal.name}</Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">All our part-time pets are currently booked. Check back soon!</p>
            </div>
          )}
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/animals">View All Animals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Care Instructions */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold mb-4">Care Instructions</h2>
              <p className="text-muted-foreground">Everything you need to know</p>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {careInstructions.map((item) => (
                <AccordionItem key={item.title} value={item.title} className="bg-card border rounded-xl px-6">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {ptpTestimonials.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold mb-4">Happy Part-time Pet Parents</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <TestimonialCarousel testimonials={ptpTestimonials} />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-amber-light/30">
        <div className="container-app text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Ready for Some Furry Companionship?</h2>
          <p className="text-muted-foreground mb-8">Book your part-time pet experience today</p>
          <Button size="lg" className="gap-2" asChild>
            <Link to="/booking">
              <Calendar className="h-5 w-5" />
              Book Now
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default PartTimePetsProgram;
