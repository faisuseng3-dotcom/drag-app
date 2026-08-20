import { GroupEvent } from "@/types";
import { experiences as seedExperiences } from "@/data/experiences";

export const ME_ID = "me";

let groupEvents: GroupEvent[] = [];
let nextId = 1;

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getGroupEvents(): Promise<GroupEvent[]> {
  return delay([...groupEvents].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
}

export async function getGroupEventById(id: string): Promise<GroupEvent | undefined> {
  return delay(groupEvents.find((g) => g.id === id));
}

export function createGroupEvent(input: {
  title: string;
  memberIds: string[];
  experienceIds: string[];
  proposedDates: string[];
}): GroupEvent {
  const event: GroupEvent = {
    id: `g${nextId++}`,
    title: input.title,
    organizerId: ME_ID,
    memberIds: input.memberIds,
    experienceIds: input.experienceIds,
    proposedDates: input.proposedDates,
    votes: [],
    dateVotes: [],
    status: "voting",
    createdAt: new Date().toISOString(),
  };
  groupEvents = [...groupEvents, event];
  return event;
}

function allMembers(event: GroupEvent): string[] {
  return [event.organizerId, ...event.memberIds];
}

function hasVoted(event: GroupEvent, userId: string): boolean {
  return event.votes.some((v) => v.userId === userId) && event.dateVotes.some((v) => v.userId === userId);
}

function maybeResolveResults(event: GroupEvent) {
  if (event.status !== "voting") return;
  const everyoneVoted = allMembers(event).every((id) => hasVoted(event, id));
  if (!everyoneVoted) return;

  const expTally = new Map<string, number>();
  for (const v of event.votes) expTally.set(v.experienceId, (expTally.get(v.experienceId) ?? 0) + 1);
  const winningExperienceId = event.experienceIds.reduce((best, id) =>
    (expTally.get(id) ?? 0) > (expTally.get(best) ?? 0) ? id : best
  , event.experienceIds[0]);

  const dateTally = new Map<string, number>();
  for (const v of event.dateVotes) dateTally.set(v.date, (dateTally.get(v.date) ?? 0) + 1);
  const winningDate = event.proposedDates.reduce((best, d) =>
    (dateTally.get(d) ?? 0) > (dateTally.get(best) ?? 0) ? d : best
  , event.proposedDates[0]);

  event.status = "resulted";
  event.finalExperienceId = winningExperienceId;
  event.finalDate = winningDate;
}

export async function voteExperience(eventId: string, userId: string, experienceId: string): Promise<GroupEvent | undefined> {
  const event = groupEvents.find((g) => g.id === eventId);
  if (!event) return undefined;
  event.votes = [...event.votes.filter((v) => v.userId !== userId), { userId, experienceId }];
  maybeResolveResults(event);
  return delay(event);
}

export async function voteDate(eventId: string, userId: string, date: string): Promise<GroupEvent | undefined> {
  const event = groupEvents.find((g) => g.id === eventId);
  if (!event) return undefined;
  event.dateVotes = [...event.dateVotes.filter((v) => v.userId !== userId), { userId, date }];
  maybeResolveResults(event);
  return delay(event);
}

export async function simulateFriendVotes(eventId: string): Promise<GroupEvent | undefined> {
  const event = groupEvents.find((g) => g.id === eventId);
  if (!event) return undefined;
  for (const memberId of event.memberIds) {
    if (!event.votes.some((v) => v.userId === memberId)) {
      const experienceId = event.experienceIds[Math.floor(Math.random() * event.experienceIds.length)];
      event.votes.push({ userId: memberId, experienceId });
    }
    if (!event.dateVotes.some((v) => v.userId === memberId)) {
      const date = event.proposedDates[Math.floor(Math.random() * event.proposedDates.length)];
      event.dateVotes.push({ userId: memberId, date });
    }
  }
  maybeResolveResults(event);
  return delay(event, 400);
}

export function hasMemberVoted(event: GroupEvent, userId: string): boolean {
  return hasVoted(event, userId);
}

export function votesForExperience(event: GroupEvent, experienceId: string): number {
  return event.votes.filter((v) => v.experienceId === experienceId).length;
}

export function votesForDate(event: GroupEvent, date: string): number {
  return event.dateVotes.filter((v) => v.date === date).length;
}

export function getCostSplit(event: GroupEvent): { perPerson: number; people: number; total: number } | undefined {
  if (!event.finalExperienceId) return undefined;
  const experience = getExperienceByIdSync(event.finalExperienceId);
  if (!experience) return undefined;
  const perPerson = experience.discountedPrice ?? experience.price;
  const people = allMembers(event).length;
  return { perPerson, people, total: perPerson * people };
}

export async function markBooked(eventId: string): Promise<void> {
  const event = groupEvents.find((g) => g.id === eventId);
  if (event) event.status = "booked";
}

function getExperienceByIdSync(id: string) {
  return seedExperiences.find((e) => e.id === id);
}
