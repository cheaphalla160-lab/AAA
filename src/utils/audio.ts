// Web Audio API Sound Generator & Web Speech API TTS

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmTimer: number | null = null;
  private isBgmPlaying = false;
  private currentStep = 0;
  private isMuted = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        this.bgmGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play single note with envelope (marimba / xylophone kid tone)
  private playTone(freq: number, type: OscillatorType, duration: number, timeOffset = 0, volume = 0.3) {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + timeOffset);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + timeOffset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + duration);

      osc.connect(gain);
      if (this.sfxGain) {
        gain.connect(this.sfxGain);
      } else {
        gain.connect(ctx.destination);
      }

      osc.start(ctx.currentTime + timeOffset);
      osc.stop(ctx.currentTime + timeOffset + duration + 0.05);
    } catch {
      // Audio fallback handling
    }
  }

  // Sound Effect: Letter click / Bubble pop
  playPop() {
    this.playTone(523.25 + Math.random() * 80, 'sine', 0.12, 0, 0.25);
  }

  // Sound Effect: Correct answer chime (C5 -> E5 -> G5 -> C6 happy arpeggio)
  playCorrect() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.22, idx * 0.08, 0.35);
    });
  }

  // Sound Effect: Gentle incorrect 'boing'
  playWrong() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);
      else gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Audio error fallback
    }
  }

  // Sound Effect: Triumphant Fanfare for Win
  playFanfare() {
    const chords = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 0.1 },
      { f: 783.99, t: 0.2 },
      { f: 1046.5, t: 0.35 },
      { f: 880.0, t: 0.5 },
      { f: 1046.5, t: 0.65 },
    ];
    chords.forEach(({ f, t }) => {
      this.playTone(f, 'sine', 0.3, t, 0.4);
    });
  }

  // Sound Effect: Wheel spin tick
  playTick() {
    this.playTone(880, 'sine', 0.03, 0, 0.15);
  }

  // Background Music: Cheerful Pentatonic Marimba/Music Box Melody Loop
  toggleBGM(): boolean {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  startBGM() {
    const ctx = this.getContext();
    if (!ctx) return;
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    // Cheerful, child-friendly pentatonic melody notes (C major pentatonic / A minor)
    // C4, D4, E4, G4, A4, C5, D5, E5
    const melody = [
      523.25, 659.25, 783.99, 659.25, 880.0, 783.99, 659.25, 523.25,
      587.33, 659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 587.33,
      659.25, 783.99, 1046.5, 880.0, 783.99, 659.25, 587.33, 523.25,
      440.0, 523.25, 659.25, 587.33, 523.25, 0, 523.25, 0,
    ];

    const bass = [
      261.63, 0, 329.63, 0, 392.0, 0, 329.63, 0,
      293.66, 0, 349.23, 0, 392.0, 0, 349.23, 0,
      261.63, 0, 329.63, 0, 392.0, 0, 329.63, 0,
      220.0, 0, 261.63, 0, 196.0, 0, 261.63, 0,
    ];

    const stepDuration = 260; // ms per eighth note (~115 BPM)
    this.currentStep = 0;

    const tick = () => {
      if (!this.isBgmPlaying) return;
      const note = melody[this.currentStep % melody.length];
      const bassNote = bass[this.currentStep % bass.length];

      if (note > 0 && !this.isMuted) {
        // Soft marimba bell sound
        this.playBgmNote(note, 0.22, 0.08);
      }
      if (bassNote > 0 && !this.isMuted) {
        // Soft acoustic bass note
        this.playBgmNote(bassNote, 0.35, 0.09, 'sine');
      }

      this.currentStep = (this.currentStep + 1) % melody.length;
      this.bgmTimer = window.setTimeout(tick, stepDuration);
    };

    tick();
  }

  private playBgmNote(freq: number, duration: number, volume: number, type: OscillatorType = 'triangle') {
    const ctx = this.getContext();
    if (!ctx || !this.bgmGain) return;
    try {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(noteGain);
      noteGain.connect(this.bgmGain);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration + 0.05);
    } catch {
      // Audio error fallback
    }
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  setVolume(volume: number) {
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.2)), this.ctx.currentTime);
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const sound = new SoundEngine();

// Speech Synthesis for Vocabulary, Phonics & Sentences
export function speakWord(text: string, rate = 0.85, pitch = 1.05) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel(); // Stop ongoing speech

    // Clean text like "short (pencil)" to speak "short pencil" naturally
    const cleanText = text.replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Pick a high-quality natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen') || v.name.includes('Google') || v.name.includes('Natural')))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('Speech error', e);
  }
}

export function speakPhonics(phonicsChunk: string) {
  // Give a slightly slower, clear phonics voice
  speakWord(phonicsChunk, 0.7, 1.1);
}

export function speakLetter(letter: string) {
  speakWord(letter, 0.75, 1.15);
}
