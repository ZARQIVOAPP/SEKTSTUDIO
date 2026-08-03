'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ─────────────────────────────────────────────
// Track Definitions
// ─────────────────────────────────────────────
interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number; // seconds
  // Synthesis parameters
  synth: {
    baseFreq: number;
    type: OscillatorType;
    harmonics: { freq: number; type: OscillatorType; gain: number }[];
    lfoRate: number;
    lfoDepth: number;
    filterFreq: number;
    filterQ: number;
    noiseGain: number;
  };
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: 'Meridian',
    artist: 'SEKT STUDIO',
    duration: 32,
    synth: {
      baseFreq: 55,
      type: 'sine',
      harmonics: [
        { freq: 110, type: 'sine', gain: 0.15 },
        { freq: 165, type: 'sine', gain: 0.08 },
        { freq: 220, type: 'triangle', gain: 0.05 },
        { freq: 330, type: 'sine', gain: 0.03 },
      ],
      lfoRate: 0.08,
      lfoDepth: 5,
      filterFreq: 800,
      filterQ: 2,
      noiseGain: 0.008,
    },
  },
  {
    id: 2,
    title: 'Nocturne',
    artist: 'SEKT STUDIO',
    duration: 28,
    synth: {
      baseFreq: 73.42, // D2
      type: 'triangle',
      harmonics: [
        { freq: 146.83, type: 'sine', gain: 0.12 },
        { freq: 220, type: 'sine', gain: 0.06 },
        { freq: 293.66, type: 'triangle', gain: 0.04 },
        { freq: 440, type: 'sine', gain: 0.02 },
      ],
      lfoRate: 0.12,
      lfoDepth: 8,
      filterFreq: 600,
      filterQ: 3,
      noiseGain: 0.012,
    },
  },
  {
    id: 3,
    title: 'Void Protocol',
    artist: 'SEKT STUDIO',
    duration: 36,
    synth: {
      baseFreq: 41.2, // E1
      type: 'sawtooth',
      harmonics: [
        { freq: 82.41, type: 'sine', gain: 0.1 },
        { freq: 123.47, type: 'triangle', gain: 0.06 },
        { freq: 164.81, type: 'sine', gain: 0.04 },
      ],
      lfoRate: 0.05,
      lfoDepth: 3,
      filterFreq: 400,
      filterQ: 6,
      noiseGain: 0.02,
    },
  },
];

// ─────────────────────────────────────────────
// Audio Engine
// ─────────────────────────────────────────────
class AmbientSynthEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private isPlaying = false;

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
  }

  play(track: Track, fadeIn = 1.5) {
    this.stop(0.05);
    this.init();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Master gain with fade-in
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, now);
    this.masterGain.gain.linearRampToValueAtTime(0.12, now + fadeIn);

    // Low-pass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(track.synth.filterFreq, now);
    filter.Q.setValueAtTime(track.synth.filterQ, now);

    // Slowly open filter for evolving texture
    filter.frequency.linearRampToValueAtTime(
      track.synth.filterFreq * 1.8,
      now + track.duration * 0.6
    );
    filter.frequency.linearRampToValueAtTime(
      track.synth.filterFreq * 0.7,
      now + track.duration
    );

    // LFO → filter modulation
    this.lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    this.lfo.type = 'sine';
    this.lfo.frequency.setValueAtTime(track.synth.lfoRate, now);
    lfoGain.gain.setValueAtTime(track.synth.lfoDepth, now);
    this.lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    this.lfo.start(now);

    // Base oscillator
    const baseOsc = ctx.createOscillator();
    const baseGain = ctx.createGain();
    baseOsc.type = track.synth.type;
    baseOsc.frequency.setValueAtTime(track.synth.baseFreq, now);
    baseGain.gain.setValueAtTime(0.3, now);
    baseOsc.connect(baseGain);
    baseGain.connect(filter);
    baseOsc.start(now);
    this.oscillators.push(baseOsc);

    // Harmonic oscillators
    for (const h of track.synth.harmonics) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = h.type;
      osc.frequency.setValueAtTime(h.freq, now);
      gain.gain.setValueAtTime(h.gain, now);

      // Subtle frequency drift for organic feel
      osc.frequency.setValueAtTime(h.freq, now);
      osc.frequency.linearRampToValueAtTime(h.freq * 1.002, now + 4);
      osc.frequency.linearRampToValueAtTime(h.freq * 0.998, now + 8);
      osc.frequency.linearRampToValueAtTime(h.freq, now + 12);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(now);
      this.oscillators.push(osc);
    }

    // Noise layer (textured air)
    if (track.synth.noiseGain > 0) {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }
      this.noiseSource = ctx.createBufferSource();
      this.noiseSource.buffer = buffer;
      this.noiseSource.loop = true;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(track.synth.noiseGain, now);

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(200, now);
      noiseFilter.Q.setValueAtTime(0.5, now);

      this.noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(filter);
      this.noiseSource.start(now);
    }

    // Connect chain: filter → master → destination
    filter.connect(this.masterGain);
    this.masterGain.connect(ctx.destination);

    this.isPlaying = true;
  }

  stop(fadeOut = 1.0) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.linearRampToValueAtTime(0, now + fadeOut);

    const cleanup = () => {
      for (const osc of this.oscillators) {
        try { osc.stop(); } catch { /* already stopped */ }
      }
      try { this.lfo?.stop(); } catch { /* */ }
      try { this.noiseSource?.stop(); } catch { /* */ }
      this.oscillators = [];
      this.lfo = null;
      this.noiseSource = null;
    };

    setTimeout(cleanup, fadeOut * 1000 + 100);
    this.isPlaying = false;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  destroy() {
    this.stop(0.05);
    if (this.ctx?.state !== 'closed') {
      this.ctx?.close();
    }
    this.ctx = null;
  }
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const engineRef = useRef<AmbientSynthEngine | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentTrack = TRACKS[currentTrackIndex];

  // Initialize engine
  useEffect(() => {
    engineRef.current = new AmbientSynthEngine();
    return () => {
      engineRef.current?.destroy();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer for elapsed display
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(secs % (TRACKS[currentTrackIndex].duration + 1));
    }, 250);
  }, [currentTrackIndex]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setElapsed(0);
  }, []);

  // Auto-loop: restart track when elapsed reaches duration
  useEffect(() => {
    if (isPlaying && elapsed >= currentTrack.duration) {
      // Move to next track
      const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
      setCurrentTrackIndex(nextIndex);
      setElapsed(0);
      startTimeRef.current = Date.now();
      engineRef.current?.play(TRACKS[nextIndex]);
    }
  }, [elapsed, isPlaying, currentTrack.duration, currentTrackIndex]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      engineRef.current?.stop();
      stopTimer();
      setIsPlaying(false);
    } else {
      engineRef.current?.play(currentTrack);
      startTimer();
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack, startTimer, stopTimer]);

  const selectTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    setElapsed(0);
    if (isPlaying) {
      engineRef.current?.play(TRACKS[index]);
      startTimeRef.current = Date.now();
    }
    setIsMenuOpen(false);
  }, [isPlaying]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(1, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-2">
      {/* Track Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl overflow-hidden backdrop-blur-xl"
            style={{
              backgroundColor: 'rgba(17,17,17,0.92)',
              border: '1px solid rgba(255,255,255,0.08)',
              width: '260px',
            }}
          >
            {/* Menu Header */}
            <div
              className="px-4 py-3 font-mono uppercase tracking-widest flex items-center justify-between"
              style={{
                fontSize: '9px',
                color: 'var(--color-text-muted)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span>Now Playing</span>
              <span>{isPlaying ? '● Live' : '○ Paused'}</span>
            </div>

            {/* Track List */}
            <div className="py-1">
              {TRACKS.map((track, index) => {
                const isActive = index === currentTrackIndex;
                return (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(index)}
                    className="w-full px-4 py-3 flex items-center gap-3 transition-colors duration-200 text-left"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Track Number / Playing Indicator */}
                    <span
                      className="font-mono flex-shrink-0"
                      style={{
                        fontSize: '9px',
                        color: isActive && isPlaying ? 'var(--color-accent)' : 'var(--color-text-muted)',
                        width: '16px',
                      }}
                    >
                      {isActive && isPlaying ? (
                        <span className="flex gap-[2px] items-end h-[10px]">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="block rounded-full"
                              style={{
                                width: '2px',
                                backgroundColor: 'var(--color-accent)',
                              }}
                              animate={{
                                height: ['3px', `${8 + Math.random() * 6}px`, '3px'],
                              }}
                              transition={{
                                duration: 0.5 + i * 0.15,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          ))}
                        </span>
                      ) : (
                        String(index + 1).padStart(2, '0')
                      )}
                    </span>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-display font-medium truncate"
                        style={{
                          fontSize: '13px',
                          color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        }}
                      >
                        {track.title}
                      </div>
                      <div
                        className="font-mono truncate"
                        style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}
                      >
                        {track.artist}
                      </div>
                    </div>

                    {/* Duration */}
                    <span
                      className="font-mono flex-shrink-0"
                      style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}
                    >
                      {formatTime(track.duration)}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Control Bar */}
      <motion.div
        className="flex items-center gap-3 rounded-full cursor-pointer select-none backdrop-blur-xl"
        style={{
          padding: '8px 16px',
          backgroundColor: 'rgba(17,17,17,0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="flex items-center justify-center transition-colors duration-200"
          style={{
            width: '24px',
            height: '24px',
            color: 'var(--color-text-primary)',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
              <rect x="0" y="0" width="3" height="12" rx="1" />
              <rect x="7" y="0" width="3" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
              <path d="M0 0L10 6L0 12Z" />
            </svg>
          )}
        </button>

        {/* Track Info & Progress */}
        <div className="flex flex-col items-start" style={{ minWidth: '90px' }}>
          <span
            className="font-display font-medium truncate"
            style={{
              fontSize: '11px',
              color: 'var(--color-text-primary)',
              maxWidth: '100px',
            }}
          >
            {currentTrack.title}
          </span>
          <span
            className="font-mono"
            style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}
          >
            {formatTime(elapsed)} / {formatTime(currentTrack.duration)}
          </span>
        </div>

        {/* Equalizer Bars (playing indicator) */}
        <div className="flex gap-[2px] items-end" style={{ height: '14px' }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: '2px',
                backgroundColor: isPlaying ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              }}
              animate={
                isPlaying
                  ? { height: ['3px', `${6 + Math.random() * 8}px`, '3px'] }
                  : { height: '3px' }
              }
              transition={
                isPlaying
                  ? { duration: 0.6 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.3 }
              }
            />
          ))}
        </div>

        {/* Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center transition-colors duration-200"
          style={{
            width: '20px',
            height: '20px',
            color: isMenuOpen ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          }}
          aria-label="Toggle track menu"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="1" y1="4" x2="13" y2="4" />
            <line x1="1" y1="7" x2="10" y2="7" />
            <line x1="1" y1="10" x2="7" y2="10" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}
