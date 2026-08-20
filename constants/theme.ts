export const colors = {
  background: "#F5F0EB",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  border: "#E4DDD3",
  text: "#1A1A1A",
  textMuted: "#6B6459",
  textFaint: "#9C9488",
  onDark: "#F5F0EB",
  accent: "#1A1A1A",
  accentPressed: "#000000",
  success: "#3D7A4E",
  warning: "#B5652B",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const fonts = {
  serif: "Fraunces_600SemiBold",
  serifMedium: "Fraunces_500Medium",
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
  sansBold: "Inter_700Bold",
};

export const typography = {
  display: { fontFamily: fonts.serif, fontSize: 44, letterSpacing: -0.5, lineHeight: 50 },
  hero: { fontFamily: fonts.serif, fontSize: 26, letterSpacing: -0.3, lineHeight: 32 },
  title: { fontFamily: fonts.serifMedium, fontSize: 19, letterSpacing: -0.2 },
  body: { fontFamily: fonts.sans, fontSize: 15 },
  bodyBold: { fontFamily: fonts.sansSemiBold, fontSize: 15 },
  caption: { fontFamily: fonts.sansMedium, fontSize: 13 },
  micro: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 0.4 },
};

export const categoryColors: Record<string, string> = {
  paintball: "#B5482B",
  mat: "#B5652B",
  cocktail: "#7A5C9E",
  escape: "#3B6A8C",
  standup: "#B5762B",
  streetfood: "#A8452E",
  klattring: "#3D7A4E",
  brygga: "#8A6B3E",
  sushi: "#A8456C",
  paddling: "#2E7D8A",
  foto: "#5C5C9E",
  dj: "#9E3D8A",
  keramik: "#A87A45",
  bastu: "#A85C3E",
  vin: "#7A2E38",
  trampolin: "#2E8A6B",
  graffiti: "#B5482B",
  katt: "#B56B96",
  kaffe: "#75543A",
};
