import { experiences as seedExperiences } from "@/data/experiences";
import { categories as seedCategories } from "@/data/categories";
import { providers as seedProviders } from "@/data/providers";
import { Experience, Category, Provider } from "@/types";

// Mock data-access layer. Swap the bodies of these functions for Supabase
// queries later without touching any screen/component code.

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getExperiences(): Promise<Experience[]> {
  return delay(seedExperiences);
}

export async function getExperienceById(id: string): Promise<Experience | undefined> {
  return delay(seedExperiences.find((e) => e.id === id));
}

export async function getLastMinuteExperiences(): Promise<Experience[]> {
  return delay(seedExperiences.filter((e) => e.isLastMinute));
}

export async function getCategories(): Promise<Category[]> {
  return delay(seedCategories);
}

export function getCategoryById(id: string): Category | undefined {
  return seedCategories.find((c) => c.id === id);
}

export function getProviderById(id: string): Provider | undefined {
  return seedProviders.find((p) => p.id === id);
}

export async function searchExperiences(query: string): Promise<Experience[]> {
  const q = query.trim().toLowerCase();
  if (!q) return delay(seedExperiences);
  return delay(
    seedExperiences.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        getCategoryById(e.categoryId)?.name.toLowerCase().includes(q)
    )
  );
}
