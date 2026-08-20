export function formatPrice(kr: number): string {
  return `${kr.toLocaleString("sv-SE")} kr`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} tim` : `${hours} tim ${rest} min`;
}

export function formatCountdown(iso: string, now: number = Date.now()): string {
  const diffMs = new Date(iso).getTime() - now;
  if (diffMs <= 0) return "Avslutad";
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `Slutar om ${minutes}m`;
  return `Slutar om ${hours}h ${minutes}m`;
}

export function formatDistance(km?: number): string {
  if (km == null) return "";
  if (km < 1) return `${Math.round(km * 1000)} m bort`;
  return `${km.toFixed(1).replace(".", ",")} km bort`;
}
