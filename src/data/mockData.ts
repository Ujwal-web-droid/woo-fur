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
    category: "general"
  },
  {
    id: "5",
    question: "Are the therapy animals certified?",
    answer: "All our therapy animals are certified through recognized programs like Pet Partners and undergo regular evaluations to ensure they meet the highest standards.",
    category: "therapy"
  }
];

export const programStats = {
  rescue: { animalsRescued: 500, adoptions: 420, successRate: 98 },
  rehabilitation: { animalsHealed: 300, partnersCount: 25, fundingGoal: 50000, currentFunding: 32000 },
  therapy: { sessionsCompleted: 2500, clientsHelped: 800, certifiedAnimals: 15 },
  partTimePets: { activeParticipants: 150, animalsInProgram: 30, satisfactionRate: 99 }
};
