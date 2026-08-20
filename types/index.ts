export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Provider = {
  id: string;
  companyName: string;
  logoUrl?: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
};

export type Experience = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  price: number;
  discountedPrice?: number;
  isLastMinute: boolean;
  lastMinuteEndsAt?: string;
  videoUrl: string;
  imageUrls: string[];
  gradient: [string, string];
  location: string;
  address: string;
  city: string;
  availableSpots: number;
  durationMinutes: number;
  minParticipants: number;
  maxParticipants: number;
  providerId: string;
  distanceKm?: number;
  whatYoullDo: string;
  whatsIncluded: string[];
  goodToKnow: string[];
};

export const PROPOSED_DATE_OPTIONS = [
  "Idag",
  "Imorgon",
  "Fre 22 aug",
  "Lör 23 aug",
  "Sön 24 aug",
  "Nästa helg",
] as const;

export type GroupEventStatus = "voting" | "resulted" | "booked";

export type GroupEventVote = {
  userId: string;
  experienceId: string;
};

export type GroupEventDateVote = {
  userId: string;
  date: string;
};

export type GroupEvent = {
  id: string;
  title: string;
  organizerId: string;
  memberIds: string[];
  experienceIds: string[];
  proposedDates: string[];
  votes: GroupEventVote[];
  dateVotes: GroupEventDateVote[];
  status: GroupEventStatus;
  createdAt: string;
  finalExperienceId?: string;
  finalDate?: string;
};

export type Review = {
  id: string;
  experienceId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
};
