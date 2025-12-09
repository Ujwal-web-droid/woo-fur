import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Target, 
  Eye, 
  Users, 
  Award,
  Calendar,
  PawPrint,
  Sparkles
} from "lucide-react";

const teamMembers = [
  {
    name: "Dr. Emily Chen",
    role: "Founder & Director",
    bio: "Veterinarian with 15 years of experience in animal therapy and rescue operations.",
    avatar: "👩‍⚕️",
  },
  {
    name: "Marcus Williams",
    role: "Head of Therapy Programs",
    bio: "Certified animal-assisted therapy specialist with a background in psychology.",
    avatar: "👨‍🏫",
  },
  {
    name: "Sofia Rodriguez",
    role: "Animal Care Manager",
    bio: "Dedicated animal welfare advocate overseeing the health of all our residents.",
    avatar: "👩‍🔬",
  },
  {
    name: "James Thompson",
    role: "Volunteer Coordinator",
    bio: "Community organizer passionate about connecting people with meaningful causes.",
    avatar: "👨‍💼",
  },
];

const milestones = [
  { year: "2018", title: "Foundation", description: "Woo-Fur was founded with just 5 rescue animals and a dream." },
  { year: "2019", title: "First Therapy Program", description: "Launched our certified animal therapy program." },
  { year: "2020", title: "Virtual Sessions", description: "Adapted to provide online therapy sessions during challenging times." },
  { year: "2021", title: "New Facility", description: "Opened our expanded sanctuary with room for 100+ animals." },
  { year: "2022", title: "Part-time Pets", description: "Introduced our innovative Part-time Pets program." },
  { year: "2023", title: "500+ Rescues", description: "Celebrated rescuing and rehoming over 500 animals." },
];

const values = [
  {
    icon: Heart,
    title: "Compassion First",
    description: "Every decision we make is guided by love and care for both animals and humans.",
  },
  {
    icon: Target,
    title: "Purpose-Driven",
    description: "We believe every animal has a purpose in bringing joy and healing to others.",
  },
  {
    icon: Users,
    title: "Community Focus",
    description: "Building strong connections between animals, volunteers, and those we serve.",
  },
  {
    icon: Sparkles,
    title: "Continuous Growth",
    description: "Always learning, improving, and expanding our impact in the community.",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage-light/30 via-background to-amber-light/20 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <PawPrint className="h-4 w-4" />
              <span>Our Story</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gradient">Woo-Fur</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Born from a simple belief that healing happens when compassionate humans 
              and loving animals come together. Our journey started with a few rescued 
              animals and a vision to transform lives through connection.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">👩‍⚕️🐕</div>
                  <p className="text-sm text-muted-foreground">Dr. Emily Chen with Luna, our first therapy dog</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="font-heading text-3xl md:text-4xl font-bold">
                The Founder's Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  In 2018, Dr. Emily Chen was a successful veterinarian who felt something 
                  was missing. She had seen countless animals heal physically, but noticed 
                  something magical happened when they connected with humans going through 
                  difficult times.
                </p>
                <p>
                  After rescuing Luna, a gentle golden retriever who had been abandoned, 
                  Emily witnessed how Luna's presence brought comfort to everyone she met. 
                  Hospital patients smiled for the first time in weeks. Anxious children 
                  found calm in her fur.
                </p>
                <p>
                  That's when Woo-Fur was born—a sanctuary where rescued animals become 
                  healers, and humans find peace through their unconditional love.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-background">🐕</div>
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border-2 border-background">🐈</div>
                  <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center border-2 border-background">🐰</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Started with 5 animals, now home to 100+
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-foreground text-background">
        <div className="container-app">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <h2 className="font-heading text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-background/80 leading-relaxed">
                To rescue and rehabilitate animals while creating meaningful therapeutic 
                connections that heal both human and animal hearts. We believe in the 
                transformative power of the human-animal bond and work tirelessly to 
                make these connections accessible to everyone.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-background/80 leading-relaxed">
                A world where every rescued animal has the opportunity to become a 
                healer, and every person in need can experience the unconditional 
                love and comfort that only an animal companion can provide. We envision 
                communities transformed by compassion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground">
              The principles that guide everything we do at Woo-Fur.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center card-hover">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gradient-to-br from-sage-light/20 to-amber-light/20">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground">
              Dedicated professionals who make Woo-Fur's mission possible every day.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.name} className="overflow-hidden card-hover">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <span className="text-7xl">{member.avatar}</span>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-heading font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Our Journey
            </h2>
            <p className="text-muted-foreground">
              Key milestones that shaped Woo-Fur into what it is today.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[22px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />
              
              {milestones.map((milestone, index) => (
                <div 
                  key={milestone.year}
                  className={`relative flex gap-6 md:gap-0 mb-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-11 h-11 rounded-full bg-primary flex items-center justify-center z-10 shrink-0">
                    <Calendar className="h-5 w-5 text-primary-foreground" />
                  </div>
                  
                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
                    index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                  }`}>
                    <Card className="inline-block">
                      <CardContent className="p-5">
                        <span className="inline-block px-2 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-2">
                          {milestone.year}
                        </span>
                        <h3 className="font-heading font-semibold mb-1">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-12 bg-muted">
        <div className="container-app">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-accent" />
              <span className="font-medium text-muted-foreground">Best Animal Therapy Program 2023</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <span className="font-medium text-muted-foreground">Community Impact Award</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-accent" />
              <span className="font-medium text-muted-foreground">Non-Profit Excellence</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
