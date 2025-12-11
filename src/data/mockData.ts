// Mock data for animals
export interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  ageNumber: number;
  gender: string;
  size: "small" | "medium" | "large";
  status: "Therapy Certified" | "Available for Adoption" | "Part-time Pet" | "In Rehabilitation";
  personalityTraits: string[];
  medicalHistory: string[];
  specialNeeds: string[];
  therapyCertifications: string[];
  biography: string;
  arrivalDate: string;
  image: string;
  gallery: string[];
  availability: { [key: string]: boolean };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  program?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole?: string;
  date: string;
  category: "Therapy Success" | "Rescue Story" | "Rehabilitation" | "Community" | "Volunteer";
  image: string;
  relatedAnimalIds?: string[];
  likes: number;
  featured?: boolean;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  skills: string[];
  commitment: string;
  location: string;
  spots: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

// Import animal images
import lunaImg from "@/assets/animals/luna-golden-retriever.jpg";
import oliverImg from "@/assets/animals/oliver-tabby-cat.jpg";
import daisyImg from "@/assets/animals/daisy-rabbit.jpg";
import maxImg from "@/assets/animals/max-border-collie.jpg";
import whiskersImg from "@/assets/animals/whiskers-persian-cat.jpg";
import cocoImg from "@/assets/animals/coco-mini-poodle.jpg";

export const animals: Animal[] = [
  {
    id: "luna",
    name: "Luna",
    species: "Dog",
    breed: "Golden Retriever",
    age: "4 years",
    ageNumber: 4,
    gender: "Female",
    size: "large",
    status: "Therapy Certified",
    personalityTraits: ["Gentle", "Patient", "Affectionate", "Calm"],
    medicalHistory: ["Spayed", "Up-to-date vaccinations", "Hip evaluation: Excellent"],
    specialNeeds: [],
    therapyCertifications: ["Pet Partners Certified", "Animal-Assisted Therapy", "Hospital Visits"],
    biography: "Luna is our star therapy dog who has been bringing joy to patients at local hospitals and nursing homes for over 2 years. Her gentle demeanor and intuitive nature make her perfect for emotional support work. She especially loves working with children and has a remarkable ability to sense when someone needs extra comfort.",
    arrivalDate: "2021-03-15",
    image: lunaImg,
    gallery: [lunaImg, lunaImg, lunaImg],
    availability: { Mon: true, Tue: true, Wed: false, Thu: true, Fri: true, Sat: false, Sun: false }
  },
  {
    id: "oliver",
    name: "Oliver",
    species: "Cat",
    breed: "Tabby Cat",
    age: "2 years",
    ageNumber: 2,
    gender: "Male",
    size: "medium",
    status: "Available for Adoption",
    personalityTraits: ["Playful", "Curious", "Independent", "Affectionate"],
    medicalHistory: ["Neutered", "Microchipped", "FeLV/FIV negative"],
    specialNeeds: ["Indoor only"],
    therapyCertifications: [],
    biography: "Oliver was found as a stray kitten and has blossomed into a confident, loving cat. He enjoys interactive toys, sunny windowsills, and evening cuddles. Oliver would thrive in a home where he can be the center of attention.",
    arrivalDate: "2023-06-20",
    image: oliverImg,
    gallery: [oliverImg, oliverImg, oliverImg],
    availability: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: true }
  },
  {
    id: "daisy",
    name: "Daisy",
    species: "Rabbit",
    breed: "Holland Lop",
    age: "1 year",
    ageNumber: 1,
    gender: "Female",
    size: "small",
    status: "Part-time Pet",
    personalityTraits: ["Friendly", "Gentle", "Social", "Curious"],
    medicalHistory: ["Spayed", "Regular check-ups"],
    specialNeeds: ["Special diet", "Temperature controlled environment"],
    therapyCertifications: ["School Visits Certified"],
    biography: "Daisy is perfect for families who want to experience pet ownership without full-time commitment. She's great with children and loves being handled gently. Her soft fur and twitching nose bring smiles to everyone she meets.",
    arrivalDate: "2024-01-10",
    image: daisyImg,
    gallery: [daisyImg, daisyImg, daisyImg],
    availability: { Mon: true, Tue: false, Wed: true, Thu: false, Fri: true, Sat: true, Sun: true }
  },
  {
    id: "max",
    name: "Max",
    species: "Dog",
    breed: "Border Collie",
    age: "3 years",
    ageNumber: 3,
    gender: "Male",
    size: "medium",
    status: "Therapy Certified",
    personalityTraits: ["Intelligent", "Energetic", "Loyal", "Responsive"],
    medicalHistory: ["Neutered", "Annual wellness exams", "Dental cleaning"],
    specialNeeds: ["Requires daily exercise"],
    therapyCertifications: ["Pet Partners Certified", "Reading Programs", "Special Needs Support"],
    biography: "Max is an incredibly smart and responsive therapy dog who excels in educational settings. He participates in our reading program, helping children build confidence in their reading abilities. His attentive nature and quick learning make him adaptable to various therapy situations.",
    arrivalDate: "2022-08-05",
    image: maxImg,
    gallery: [maxImg, maxImg, maxImg],
    availability: { Mon: false, Tue: true, Wed: true, Thu: true, Fri: false, Sat: true, Sun: false }
  },
  {
    id: "whiskers",
    name: "Whiskers",
    species: "Cat",
    breed: "Persian Cat",
    age: "5 years",
    ageNumber: 5,
    gender: "Male",
    size: "medium",
    status: "Available for Adoption",
    personalityTraits: ["Calm", "Regal", "Affectionate", "Quiet"],
    medicalHistory: ["Neutered", "Regular grooming required", "Dental care"],
    specialNeeds: ["Daily brushing", "Eye cleaning"],
    therapyCertifications: [],
    biography: "Whiskers is a majestic Persian with a calm and loving personality. He was surrendered when his previous owner could no longer care for him. He enjoys quiet environments and would make an excellent companion for someone seeking a low-key, affectionate pet.",
    arrivalDate: "2023-11-01",
    image: whiskersImg,
    gallery: [whiskersImg, whiskersImg, whiskersImg],
    availability: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: true }
  },
  {
    id: "coco",
    name: "Coco",
    species: "Dog",
    breed: "Mini Poodle",
    age: "2 years",
    ageNumber: 2,
    gender: "Female",
    size: "small",
    status: "In Rehabilitation",
    personalityTraits: ["Sweet", "Shy", "Gentle", "Learning to trust"],
    medicalHistory: ["Spayed", "Recovering from malnutrition", "Physical therapy"],
    specialNeeds: ["Quiet environment", "Patience with new people", "Special diet"],
    therapyCertifications: [],
    biography: "Coco was rescued from a difficult situation and is currently in our rehabilitation program. She's making wonderful progress and becoming more confident each day. With continued love and patience, Coco will soon be ready to find her forever home.",
    arrivalDate: "2024-02-28",
    image: cocoImg,
    gallery: [cocoImg, cocoImg, cocoImg],
    availability: { Mon: false, Tue: false, Wed: true, Thu: true, Fri: false, Sat: false, Sun: false }
  }
];

export const stories: Story[] = [
  {
    id: "luna-sarah",
    title: "How Luna Changed Sarah's Life Forever",
    excerpt: "After months of struggling with anxiety, I found peace in Luna's gentle presence.",
    content: `When I first walked into Woo-Fur, I was at my lowest point. Years of anxiety had left me isolated and afraid. But then I met Luna.

From the moment our eyes met, something shifted. Luna seemed to understand my fear without judgment. During our first therapy session, she simply sat beside me, her warm body pressed against my leg. No expectations. No pressure. Just presence.

Over the following months, Luna became my anchor. Each session, I found myself breathing a little easier, smiling a little more. She taught me that healing doesn't have to be loud or dramatic—sometimes it's as quiet as a dog's steady heartbeat.

Today, six months later, I'm a different person. I've started going out again, reconnecting with friends, and even adopted my own therapy dog. Luna showed me that vulnerability isn't weakness—it's the first step toward healing.

To everyone at Woo-Fur: thank you for giving Luna to us. She's not just a therapy dog—she's a miracle worker with four paws and a wagging tail.`,
    author: "Sarah Mitchell",
    authorRole: "Therapy Client",
    date: "2024-12-01",
    category: "Therapy Success",
    image: lunaImg,
    relatedAnimalIds: ["luna"],
    likes: 234,
    featured: true
  },
  {
    id: "oliver-rescue",
    title: "From Shelter to Sanctuary",
    excerpt: "Oliver was found abandoned in a box. Today, he brings joy to everyone he meets.",
    content: `It was a cold November morning when we received the call. A cardboard box had been left outside a grocery store, and inside was a tiny, shivering orange kitten.

When Oliver arrived at Woo-Fur, he weighed less than two pounds. His eyes were infected, and he was too weak to stand. Our team worked around the clock, providing round-the-clock care.

Week by week, Oliver transformed. His playful personality emerged—he would chase laser pointers with unmatched enthusiasm and demand attention from anyone who walked by his enclosure.

Now, Oliver is one of our most beloved residents. His story reminds us why we do this work: every animal deserves a second chance. And Oliver? He's made the most of his.`,
    author: "Woo-Fur Team",
    date: "2024-11-15",
    category: "Rescue Story",
    image: oliverImg,
    relatedAnimalIds: ["oliver"],
    likes: 189,
    featured: false
  },
  {
    id: "max-journey",
    title: "A Second Chance at Happiness",
    excerpt: "Max's journey from abuse to becoming a certified therapy dog is truly inspiring.",
    content: `Max came to us with scars—both visible and invisible. Rescued from a hoarding situation, he flinched at sudden movements and cowered at raised voices. Many thought he would never recover.

But our rehabilitation team saw something in Max's eyes: a spark of hope that refused to die.

The journey was long. Months of patient training, gentle handling, and consistent love. Slowly, Max began to trust again. His natural intelligence and desire to please emerged, and we realized he had a gift for connecting with people.

After two years of rehabilitation and training, Max became a certified therapy dog. Today, he works with trauma survivors, offering the same patience and understanding that helped him heal.

Max's story proves that with enough love, even the deepest wounds can heal. He's not just our success story—he's a testament to the resilience of the animal spirit.`,
    author: "Dr. Emily Chen",
    authorRole: "Veterinary Director",
    date: "2024-10-20",
    category: "Rehabilitation",
    image: maxImg,
    relatedAnimalIds: ["max"],
    likes: 312,
    featured: true
  },
  {
    id: "volunteer-story",
    title: "Why I Volunteer: A Journey of Unexpected Joy",
    excerpt: "I came to help the animals, but they ended up helping me more.",
    content: `When I retired after 40 years in corporate finance, I didn't know what to do with myself. My wife suggested volunteering, and I reluctantly signed up at Woo-Fur.

I expected to clean cages and fill water bowls. What I didn't expect was to fall in love—with every single animal I met.

There's something magical about being greeted by wagging tails and purring cats. These animals don't care about your resume or your retirement fund. They just want to be loved.

Three years later, I volunteer five days a week. I've helped socialize shy kittens, walked anxious dogs, and held the hands of families as they adopt their new best friends.

To anyone considering volunteering: do it. You think you're giving your time, but really, these animals give you something money can't buy—purpose, joy, and unconditional love.`,
    author: "Robert Patterson",
    authorRole: "Senior Volunteer",
    date: "2024-09-15",
    category: "Volunteer",
    image: daisyImg,
    likes: 156,
    featured: false
  },
  {
    id: "community-event",
    title: "Our Annual Fur-Ball Gala Raised $50,000!",
    excerpt: "The community came together for an unforgettable evening supporting animal welfare.",
    content: `Last Saturday, over 300 guests gathered at the Grand Ballroom for our 5th Annual Fur-Ball Gala. The result? $50,000 raised for our rehabilitation and rescue programs!

The evening featured silent auctions, a live band, and of course, appearances from some of our therapy animals (who were clearly the stars of the show).

Local businesses donated incredible auction items, from weekend getaways to gourmet dinner experiences. But the highlight was the "Fund-a-Need" segment, where guests directly sponsored surgeries for animals in our rehabilitation program.

We're overwhelmed by the generosity of our community. Every dollar raised goes directly to helping animals in need. Thank you to everyone who attended, donated, and supported our mission.

Save the date: next year's gala is already in the works!`,
    author: "Event Committee",
    date: "2024-08-01",
    category: "Community",
    image: whiskersImg,
    likes: 98,
    featured: false
  },
  {
    id: "coco-progress",
    title: "Coco's Recovery: Week 8 Update",
    excerpt: "Follow Coco's incredible rehabilitation journey as she learns to trust again.",
    content: `Eight weeks ago, Coco arrived at Woo-Fur barely able to walk. Today, she took her first steps in the outdoor yard—and even wagged her tail!

This milestone might seem small, but for Coco, it's enormous. When she first came to us, she wouldn't make eye contact with humans. Now, she seeks out her favorite caretakers for gentle pets.

Our rehabilitation protocol for Coco includes:
- Daily physical therapy sessions
- Specialized nutrition plan
- Gradual socialization with trusted handlers
- Enrichment activities to rebuild confidence

We still have a long way to go, but every small victory reminds us why this work matters. Coco is learning that not all humans are scary—some of us just want to help her feel safe.

Follow our social media for weekly Coco updates!`,
    author: "Rehabilitation Team",
    date: "2024-07-15",
    category: "Rehabilitation",
    image: cocoImg,
    relatedAnimalIds: ["coco"],
    likes: 267,
    featured: false
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Therapy Session Client",
    content: "The therapy sessions with Luna have been transformative for my anxiety. Her gentle presence helps me feel calm and grounded. I look forward to every visit!",
    rating: 5,
    program: "therapy"
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Adopter",
    content: "We adopted our cat through the rescue program and couldn't be happier. The team made the process smooth and provided excellent support even after adoption.",
    rating: 5,
    program: "rescue"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Part-time Pet Parent",
    content: "As a busy professional, the part-time pet program is perfect. I get to enjoy animal companionship on weekends without the full-time commitment.",
    rating: 5,
    program: "part-time-pets"
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    role: "Hospital Partner",
    content: "The therapy animals from Woo-Fur have made a remarkable difference in our patients' recovery. The handlers are professional and the animals are well-trained.",
    rating: 5,
    program: "therapy"
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Rehabilitation Sponsor",
    content: "Watching Coco's rehabilitation journey has been incredible. Knowing my donation helps animals like her recover and find loving homes is deeply rewarding.",
    rating: 5,
    program: "rehabilitation"
  }
];

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "How do I schedule a therapy session?",
    answer: "You can schedule a therapy session through our booking system on the website, or call us directly. We recommend booking at least one week in advance to ensure availability.",
    category: "therapy"
  },
  {
    id: "2",
    question: "What is the adoption process?",
    answer: "Our adoption process includes an application, home check, meet-and-greet with the animal, and adoption finalization. The entire process typically takes 1-2 weeks.",
    category: "rescue"
  },
  {
    id: "3",
    question: "How does the part-time pet program work?",
    answer: "The part-time pet program allows you to take an animal home for weekends or short periods. We provide all supplies and support. It's perfect for those who want companionship without full-time commitment.",
    category: "part-time-pets"
  },
  {
    id: "4",
    question: "Can I donate to a specific animal?",
    answer: "Yes! You can sponsor a specific animal's care, or contribute to their rehabilitation costs. Visit our Support page to designate your donation.",
    category: "donations"
  },
  {
    id: "5",
    question: "Are the therapy animals certified?",
    answer: "All our therapy animals are certified through recognized programs like Pet Partners and undergo regular evaluations to ensure they meet the highest standards.",
    category: "therapy"
  },
  {
    id: "6",
    question: "What are the volunteer requirements?",
    answer: "Volunteers must be 18+, complete an orientation session, and commit to at least 4 hours per month. Background checks are required for all volunteers working directly with animals.",
    category: "volunteer"
  },
  {
    id: "7",
    question: "How can I become a volunteer?",
    answer: "Visit our Volunteer page to fill out an application. After review, you'll be invited to an orientation session where you'll learn about our programs and find the best fit for your skills.",
    category: "volunteer"
  },
  {
    id: "8",
    question: "What payment methods do you accept for donations?",
    answer: "We accept all major credit cards, PayPal, bank transfers, and checks. Monthly recurring donations can be set up through our secure online portal.",
    category: "donations"
  },
  {
    id: "9",
    question: "Can I visit the facility without an appointment?",
    answer: "Walk-ins are welcome during our open hours (Tue-Sat, 10am-4pm). However, for therapy sessions or adoptions, we recommend scheduling in advance.",
    category: "general"
  },
  {
    id: "10",
    question: "What happens if I need to cancel a booking?",
    answer: "Cancellations made 24+ hours in advance receive a full refund. Late cancellations may be subject to a 50% fee. No-shows are charged the full amount.",
    category: "booking"
  }
];

export const volunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: "animal-care",
    title: "Animal Care Assistant",
    description: "Help with daily care including feeding, grooming, and cleaning. Build bonds with our resident animals while ensuring their comfort and wellbeing.",
    skills: ["Animal handling", "Physical stamina", "Attention to detail"],
    commitment: "4-8 hours/week",
    location: "On-site",
    spots: 5
  },
  {
    id: "dog-walker",
    title: "Dog Walker",
    description: "Take our dogs on walks around the facility grounds. Help them get exercise and socialization while enjoying the outdoors.",
    skills: ["Dog handling experience", "Physical fitness", "Reliability"],
    commitment: "2-4 hours/week",
    location: "On-site",
    spots: 8
  },
  {
    id: "therapy-assistant",
    title: "Therapy Session Assistant",
    description: "Support our therapy team during sessions. Help set up, assist handlers, and ensure a calm environment for clients and animals.",
    skills: ["Calm demeanor", "Client service", "Animal awareness"],
    commitment: "4-6 hours/week",
    location: "Various locations",
    spots: 3
  },
  {
    id: "event-coordinator",
    title: "Event Volunteer",
    description: "Help organize and run fundraising events, adoption days, and community outreach programs.",
    skills: ["Event planning", "Communication", "Teamwork"],
    commitment: "Flexible/Event-based",
    location: "Various",
    spots: 10
  },
  {
    id: "foster-parent",
    title: "Foster Parent",
    description: "Provide temporary homes for animals awaiting adoption or recovering from medical procedures. All supplies provided.",
    skills: ["Home environment", "Time availability", "Animal experience"],
    commitment: "2-8 weeks per foster",
    location: "Your home",
    spots: 15
  },
  {
    id: "admin-support",
    title: "Administrative Support",
    description: "Help with office tasks including data entry, phone calls, scheduling, and organizing records.",
    skills: ["Computer literacy", "Organization", "Communication"],
    commitment: "4-8 hours/week",
    location: "On-site or Remote",
    spots: 4
  }
];

export const timeSlots: TimeSlot[] = [
  { id: "9am", time: "9:00 AM", available: true },
  { id: "10am", time: "10:00 AM", available: true },
  { id: "11am", time: "11:00 AM", available: false },
  { id: "1pm", time: "1:00 PM", available: true },
  { id: "2pm", time: "2:00 PM", available: true },
  { id: "3pm", time: "3:00 PM", available: true },
  { id: "4pm", time: "4:00 PM", available: false },
];

export const programStats = {
  rescue: { animalsRescued: 500, adoptions: 420, successRate: 98 },
  rehabilitation: { animalsHealed: 300, partnersCount: 25, fundingGoal: 50000, currentFunding: 32000 },
  therapy: { sessionsCompleted: 2500, clientsHelped: 800, certifiedAnimals: 15 },
  partTimePets: { activeParticipants: 150, animalsInProgram: 30, satisfactionRate: 99 }
};

export const donationImpacts = [
  { amount: 25, impact: "Feeds one animal for a week" },
  { amount: 50, impact: "Covers basic medical checkup" },
  { amount: 100, impact: "Provides therapy session supplies" },
  { amount: 250, impact: "Sponsors rehabilitation for one animal" },
  { amount: 500, impact: "Funds emergency veterinary care" },
  { amount: 1000, impact: "Supports an animal for one month" },
];
