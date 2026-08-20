import { Category } from "@/types";
import { categoryColors } from "@/constants/theme";

export const categories: Category[] = [
  { id: "paintball", name: "Paintball", icon: "🎯", color: categoryColors.paintball },
  { id: "mat", name: "Matlagning", icon: "🍳", color: categoryColors.mat },
  { id: "cocktail", name: "Cocktail", icon: "🍸", color: categoryColors.cocktail },
  { id: "escape", name: "Escape Room", icon: "🔐", color: categoryColors.escape },
  { id: "standup", name: "Standup", icon: "🎤", color: categoryColors.standup },
  { id: "streetfood", name: "Streetfood", icon: "🌮", color: categoryColors.streetfood },
  { id: "klattring", name: "Klättring", icon: "🧗", color: categoryColors.klattring },
  { id: "brygga", name: "Bryggeri", icon: "🍺", color: categoryColors.brygga },
  { id: "sushi", name: "Sushi", icon: "🍣", color: categoryColors.sushi },
  { id: "paddling", name: "Paddling", icon: "🛶", color: categoryColors.paddling },
  { id: "foto", name: "Foto", icon: "📷", color: categoryColors.foto },
  { id: "dj", name: "DJ", icon: "🎧", color: categoryColors.dj },
  { id: "keramik", name: "Keramik", icon: "🏺", color: categoryColors.keramik },
  { id: "bastu", name: "Bastu", icon: "🧖", color: categoryColors.bastu },
  { id: "vin", name: "Vin", icon: "🍷", color: categoryColors.vin },
  { id: "trampolin", name: "Trampolin", icon: "🤸", color: categoryColors.trampolin },
  { id: "graffiti", name: "Graffiti", icon: "🎨", color: categoryColors.graffiti },
  { id: "katt", name: "Kattcafé", icon: "🐱", color: categoryColors.katt },
  { id: "kaffe", name: "Kaffe", icon: "☕", color: categoryColors.kaffe },
];
