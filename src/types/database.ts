// Database types matching Supabase schema
export interface DbAnimal {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  gender: string | null;
  size: string | null;
  personality_traits: string[] | null;
  medical_history: Record<string, unknown> | null;
  therapy_certifications: Record<string, unknown>[] | null;
  availability_status: string | null;
  arrival_date: string | null;
  biography: string | null;
  special_needs: string | null;
  adoption_status: string | null;
  photos: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface DbProgram {
  id: string;
  name: string;
  type: 'rescue' | 'rehabilitation' | 'therapy' | 'part-time-pets';
  description: string | null;
  goals: string | null;
  process_steps: { step: number; title: string; description: string }[] | null;
  requirements: Record<string, unknown> | null;
  pricing: Record<string, unknown> | null;
  active: boolean;
  created_at: string;
}

export interface DbBooking {
  id: string;
  user_id: string;
  animal_id: string | null;
  program_id: string | null;
  booking_type: string;
  scheduled_date: string;
  scheduled_time: string;
  duration: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requirements: string | null;
  contact_info: Record<string, unknown> | null;
  confirmation_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbStory {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author_id: string | null;
  author_name: string | null;
  category: string;
  featured: boolean;
  media_urls: string[] | null;
  related_animal_ids: string[] | null;
  status: 'pending' | 'published' | 'rejected';
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbDonation {
  id: string;
  user_id: string | null;
  amount: number;
  currency: string;
  allocation: { type: string; id?: string } | null;
  recurring: boolean;
  recurring_frequency: 'monthly' | 'quarterly' | 'yearly' | null;
  payment_method: string | null;
  transaction_id: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  donor_email: string | null;
  donor_name: string | null;
  created_at: string;
}

export interface DbVolunteer {
  id: string;
  user_id: string;
  skills: string[] | null;
  availability: Record<string, unknown> | null;
  hours_logged: number;
  background_check: boolean;
  emergency_contact: Record<string, unknown> | null;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface DbStoryLike {
  id: string;
  story_id: string;
  user_id: string;
  created_at: string;
}

// Transformed types for frontend use
export interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  ageNumber: number;
  gender: string;
  size: 'small' | 'medium' | 'large';
  status: string;
  personalityTraits: string[];
  medicalHistory: string[];
  specialNeeds: string[];
  therapyCertifications: string[];
  biography: string;
  arrivalDate: string;
  image: string;
  gallery: string[];
  availability: Record<string, boolean>;
  adoptionStatus: string;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole?: string;
  date: string;
  category: string;
  image: string;
  relatedAnimalIds?: string[];
  likes: number;
  featured?: boolean;
}

export interface Program {
  id: string;
  name: string;
  type: 'rescue' | 'rehabilitation' | 'therapy' | 'part-time-pets';
  description: string;
  goals: string;
  processSteps: { step: number; title: string; description: string }[];
  requirements: Record<string, unknown>;
  pricing: Record<string, unknown>;
  active: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  animalId: string | null;
  programId: string | null;
  bookingType: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequirements: string | null;
  contactInfo: Record<string, unknown> | null;
  confirmationSent: boolean;
  createdAt: string;
  animal?: Animal | null;
  program?: Program | null;
}
