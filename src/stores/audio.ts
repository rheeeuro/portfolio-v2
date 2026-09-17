import { create } from 'zustand';
export const useAudio = create<{ enabled: boolean; error: string | null }>(
  () => ({ enabled: false, error: null }),
);
let context: AudioContext | undefined;
let gain: GainNode | undefined;
export async function toggleAudio() {
  try {
    if (!context) {
      context = new AudioContext();
      gain = context.createGain();
      gain.gain.value = 0;
      gain.connect(context.destination);
      // Quiet synthesized room tone; no remote audio asset or autoplay.
      const buffer = context.createBuffer(
        1,
        context.sampleRate * 3,
        context.sampleRate,
      );
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++)
        samples[i] = Math.random() * 2 - 1;
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 240;
      source.connect(filter);
      filter.connect(gain);
      source.start();
    }
    const enabled = !useAudio.getState().enabled;
    await context.resume();
    gain!.gain.setTargetAtTime(enabled ? 0.045 : 0, context.currentTime, 0.15);
    useAudio.setState({ enabled, error: null });
  } catch {
    useAudio.setState({
      enabled: false,
      error: '이 브라우저에서는 사운드를 재생할 수 없습니다.',
    });
  }
}
export function suspendAudio(hidden: boolean) {
  if (!context) return;
  if (hidden) void context.suspend();
  else if (useAudio.getState().enabled)
    void context.resume().catch(() => useAudio.setState({ enabled: false }));
}
