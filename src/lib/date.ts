export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function isSameDay(isoA: string, isoB: string): boolean {
  return isoA.slice(0, 10) === isoB.slice(0, 10)
}

export function startOfWeekIso(iso: string): string {
  const d = new Date(iso)
  const day = d.getDay()
  const diff = (day + 6) % 7 // Monday-start week
  d.setDate(d.getDate() - diff)
  return d.toISOString().slice(0, 10)
}
