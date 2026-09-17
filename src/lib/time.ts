export type TimePhase = 'dawn' | 'day' | 'sunset' | 'night';
export const phases: TimePhase[] = ['dawn', 'day', 'sunset', 'night'];
export function phaseAtHour(hour: number): TimePhase {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 17) return 'day';
  if (hour >= 17 && hour < 19) return 'sunset';
  return 'night';
}
