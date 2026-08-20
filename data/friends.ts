export type Friend = {
  id: string;
  name: string;
  username: string;
  color: string;
};

export const friends: Friend[] = [
  { id: "f1", name: "Emma Lindqvist", username: "emmalind", color: "#B5482B" },
  { id: "f2", name: "Oskar Berg", username: "oskarberg", color: "#3D7A4E" },
  { id: "f3", name: "Lina Holm", username: "linaholm", color: "#7A5C9E" },
  { id: "f4", name: "Viktor Ström", username: "viktorstrom", color: "#2E7D8A" },
  { id: "f5", name: "Sara Ek", username: "saraek", color: "#B5652B" },
  { id: "f6", name: "Anton Nyberg", username: "antonnyberg", color: "#9E3D8A" },
  { id: "f7", name: "Klara Sund", username: "klarasund", color: "#3B6A8C" },
  { id: "f8", name: "Isak Falk", username: "isakfalk", color: "#A8452E" },
  { id: "f9", name: "Nora Wik", username: "norawik", color: "#75543A" },
  { id: "f10", name: "Elias Åberg", username: "eliasaberg", color: "#5C5C9E" },
];

export function getFriendById(id: string): Friend | undefined {
  return friends.find((f) => f.id === id);
}

export function initialsFor(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
