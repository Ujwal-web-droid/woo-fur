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
import { usePageContent } from "@/hooks/usePageContent";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ElementType> = {
  Heart, Target, Users, Sparkles, Eye, Award, Calendar, PawPrint
};

interface HeroContent {
  title: string;
  description: string;
}

interface FounderContent {
  title: string;
  content: string;
  quote: string;
}

interface MissionContent {
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
}

interface TeamContent {
  title: string;
  description: string;
  members: Array<{
    name: string;
    role: string;
    bio: string;
    avatar: string;
  }>;
}

interface MilestonesContent {
  title: string;
  description: string;
  items: Array<{
    year: string;
    title: string;
    description: string;
  }>;
}

interface ValuesContent {
  title: string;
  description: string;
  items: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

interface AwardsContent {
  items: Array<{
    title: string;
  }>;
}

const About = () => {
  const { getSection, isLoading } = usePageContent('about');

  const hero = getSection<HeroContent>('hero', {
    title: "Our Story",
    description: "Woo-Fur began with a simple belief: that the bond between humans and animals has the power to heal. What started as a small rescue operation has grown into a sanctuary where healing happens every day."
  });

  const founder = getSection<FounderContent>('founder', {
    title: "A Vision Born from Love",
    content: "In 2018, our founder Dr. Emily Chen witnessed something remarkable. A rescue dog named Biscuit, once timid and afraid, helped a young boy with autism speak his first full sentence. That moment changed everything. Dr. Chen left her veterinary practice to create Woo-Fur—a place where rescued animals could become healers themselves.",
    quote: "Every animal we rescue has a gift to give. Our job is simply to help them share it."
  });

  const mission = getSection<MissionContent>('mission', {
    missionTitle: "Our Mission",
    missionText: "To rescue animals in need and connect them with humans seeking therapeutic companionship, creating healing experiences that transform lives on both ends of the leash.",
    visionTitle: "Our Vision",
    visionText: "A world where every rescued animal has the opportunity to heal and be healed, where the bond between species creates lasting positive change in communities."
  });

  const team = getSection<TeamContent>('team', {
    title: "Meet Our Team",
    description: "Dedicated professionals who make Woo-Fur's mission possible every day.",
    members: [
      { name: "Dr. Emily Chen", role: "Founder & Director", bio: "Veterinarian with 15 years of experience in animal therapy and rescue operations.", avatar: "👩‍⚕️" },
      { name: "Marcus Williams", role: "Head of Therapy Programs", bio: "Certified animal-assisted therapy specialist with a background in psychology.", avatar: "👨‍🏫" },
      { name: "Sofia Rodriguez", role: "Animal Care Manager", bio: "Dedicated animal welfare advocate overseeing the health of all our residents.", avatar: "👩‍🔬" },
      { name: "James Thompson", role: "Volunteer Coordinator", bio: "Community organizer passionate about connecting people with meaningful causes.", avatar: "👨‍💼" },
    ]
  });

  const milestones = getSection<MilestonesContent>('milestones', {
    title: "Our Journey",
    description: "Key milestones that shaped Woo-Fur into what it is today.",
    items: [
      { year: "2018", title: "Foundation", description: "Woo-Fur was founded with just 5 rescue animals and a dream." },
      { year: "2019", title: "First Therapy Program", description: "Launched our certified animal therapy program." },
      { year: "2020", title: "Virtual Sessions", description: "Adapted to provide online therapy sessions during challenging times." },
      { year: "2021", title: "New Facility", description: "Opened our expanded sanctuary with room for 100+ animals." },
      { year: "2022", title: "Part-time Pets", description: "Introduced our innovative Part-time Pets program." },
      { year: "2023", title: "500+ Rescues", description: "Celebrated rescuing and rehoming over 500 animals." },
    ]
  });

  const values = getSection<ValuesContent>('values', {
    title: "Our Core Values",
    description: "The principles that guide everything we do at Woo-Fur.",
    items: [
      { icon: "Heart", title: "Compassion First", description: "Every decision we make is guided by love and care for both animals and humans." },
      { icon: "Target", title: "Purpose-Driven", description: "We believe every animal has a purpose in bringing joy and healing to others." },
      { icon: "Users", title: "Community Focus", description: "Building strong connections between animals, volunteers, and those we serve." },
      { icon: "Sparkles", title: "Continuous Growth", description: "Always learning, improving, and expanding our impact in the community." },
    ]
  });

  const awards = getSection<AwardsContent>('awards', {
    items: [
      { title: "Best Animal Therapy Program 2023" },
      { title: "Community Impact Award" },
      { title: "Non-Profit Excellence" },
    ]
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage-light/30 via-background to-amber-light/20 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <PawPrint className="h-4 w-4" />
              {isLoading ? <Skeleton className="h-4 w-20" /> : <span>{hero.title}</span>}
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gradient">Woo-Fur</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {isLoading ? <Skeleton className="h-6 w-full" /> : hero.description}
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
                {founder.title}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{founder.content}</p>
              </div>
              <blockquote className="italic border-l-4 border-primary pl-4 text-muted-foreground">
                "{founder.quote}"
              </blockquote>
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
                <h2 className="font-heading text-2xl font-bold">{mission.missionTitle}</h2>
              </div>
              <p className="text-background/80 leading-relaxed">
                {mission.missionText}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-bold">{mission.visionTitle}</h2>
              </div>
              <p className="text-background/80 leading-relaxed">
                {mission.visionText}
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
              {values.title}
            </h2>
            <p className="text-muted-foreground">
              {values.description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.items.map((value) => {
              const IconComponent = iconMap[value.icon] || Heart;
              return (
                <Card key={value.title} className="text-center card-hover">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gradient-to-br from-sage-light/20 to-amber-light/20">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {team.title}
            </h2>
            <p className="text-muted-foreground">
              {team.description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.members.map((member) => (
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
              {milestones.title}
            </h2>
            <p className="text-muted-foreground">
              {milestones.description}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[22px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />
              
              {milestones.items.map((milestone, index) => (
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
            {awards.items.map((award, index) => (
              <div key={index} className="flex items-center gap-3">
                <Award className={`h-8 w-8 ${index % 2 === 0 ? 'text-accent' : 'text-primary'}`} />
                <span className="font-medium text-muted-foreground">{award.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;