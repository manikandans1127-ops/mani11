/**
 * Cosmic Audio Synthesizer & Controller
 * Utilizes the Web Audio API for zero-dependency ambient soundscape generation,
 * interactive cosmic sound effects, and individual song playlist player.
 */

class CosmicAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingAmbience = false;
    this.ambientGain = null;
    this.oscNodes = [];
    this.melodyTimer = null;
    this.currentPlayingSongId = null;
    this.songMelodyTimer = null;

    // Frequencies for Romantic Celestial Chords (C Major 7 / F Lydian / Am)
    this.chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [349.23, 440.00, 523.25, 659.25], // Fmaj7
      [220.00, 261.63, 329.63, 440.00], // Am
      [392.00, 493.88, 587.33, 698.46]  // G7
    ];
    this.currentChord = 0;

    this.initUI();
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  initUI() {
    const btn = document.getElementById('ambient-audio-btn');
    if (btn) {
      btn.addEventListener('click', () => this.toggleAmbience());
    }

    const anthemBtn = document.getElementById('play-anthem-btn');
    if (anthemBtn) {
      anthemBtn.addEventListener('click', () => this.toggleSongPlay('song-1', 'Until I Found You', anthemBtn));
    }
  }

  toggleAmbience() {
    const btn = document.getElementById('ambient-audio-btn');
    const wave = btn ? btn.querySelector('.sound-wave') : null;

    if (this.isPlayingAmbience) {
      this.stopAmbience();
      if (wave) wave.classList.remove('playing');
      if (btn) btn.classList.remove('active');
    } else {
      this.startAmbience();
      if (wave) wave.classList.add('playing');
      if (btn) btn.classList.add('active');
    }
  }

  startAmbience() {
    const ctx = this.getAudioContext();
    this.isPlayingAmbience = true;

    // Master Ambient Gain
    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.01, ctx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 3);
    this.ambientGain.connect(ctx.destination);

    // Warm Low Drone
    const droneOsc = ctx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
    
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(300, ctx.currentTime);

    droneOsc.connect(droneFilter);
    droneFilter.connect(this.ambientGain);
    droneOsc.start();
    this.oscNodes.push(droneOsc);

    // Celestial Arpeggio Sequencer
    this.scheduleNextArpeggio();
  }

  scheduleNextArpeggio() {
    if (!this.isPlayingAmbience) return;
    const chord = this.chords[this.currentChord];
    this.currentChord = (this.currentChord + 1) % this.chords.length;

    chord.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.isPlayingAmbience) return;
        this.playSoftBell(freq * 2, 2.5);
      }, idx * 600);
    });

    this.melodyTimer = setTimeout(() => {
      this.scheduleNextArpeggio();
    }, 4200);
  }

  playSoftBell(freq, duration = 2.0) {
    if (!this.isPlayingAmbience) return;
    const ctx = this.getAudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  stopAmbience() {
    this.isPlayingAmbience = false;
    if (this.melodyTimer) clearTimeout(this.melodyTimer);
    
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1);
      setTimeout(() => {
        this.oscNodes.forEach(node => {
          try { node.stop(); } catch(e){}
        });
        this.oscNodes = [];
      }, 1000);
    }
  }

  // Individual Song Playback Controller
  toggleSongPlay(songId, songTitle, triggerBtn = null) {
    const disc = document.getElementById('vinyl-disc');
    const songObj = (window.UniverseConfig && window.UniverseConfig.soundtrack && window.UniverseConfig.soundtrack.songs)
      ? window.UniverseConfig.soundtrack.songs.find(s => s.id === songId)
      : null;

    // If already playing this song -> pause it
    if (this.currentPlayingSongId === songId && this.htmlAudio && !this.htmlAudio.paused) {
      this.htmlAudio.pause();
      this.stopSongMelody();
      this.currentPlayingSongId = null;
      if (disc) disc.classList.remove('spinning');
      this.updateAllSongButtons();
      return;
    }

    // Stop any existing audio
    if (this.htmlAudio) {
      try {
        this.htmlAudio.pause();
        this.htmlAudio.currentTime = 0;
      } catch (e) {}
      this.htmlAudio = null;
    }
    this.stopSongMelody();

    this.currentPlayingSongId = songId;
    if (disc) disc.classList.add('spinning');

    // Attempt real audio playback if audio file is specified
    const audioSrc = songObj && songObj.audio ? songObj.audio : null;
    if (audioSrc) {
      try {
        this.htmlAudio = new Audio(audioSrc);
        this.htmlAudio.volume = 0.85;
        this.htmlAudio.play().then(() => {
          this.updateAllSongButtons();
        }).catch(err => {
          console.warn("Audio play blocked or error, falling back to synth", err);
          this.startSongMelody(songId);
          this.updateAllSongButtons();
        });

        this.htmlAudio.onended = () => {
          this.currentPlayingSongId = null;
          if (disc) disc.classList.remove('spinning');
          this.updateAllSongButtons();
        };

        this.htmlAudio.onerror = () => {
          console.warn("Audio file error for", audioSrc, "falling back to synth");
          this.startSongMelody(songId);
          this.updateAllSongButtons();
        };
      } catch (e) {
        this.startSongMelody(songId);
        this.updateAllSongButtons();
      }
    } else {
      this.startSongMelody(songId);
      this.updateAllSongButtons();
    }

    if (window.EasterEggs) {
      window.EasterEggs.showToast("Now Playing 🎵", songTitle || (songObj ? songObj.title : "Cosmic Track"));
    }

    if (window.Storyteller) {
      const reaction = songObj && songObj.avatarReaction ? songObj.avatarReaction : "loving";
      window.Storyteller.say(`Playing ${songTitle || (songObj ? songObj.title : '')} 🎵🤍`, reaction, { duration: 3000 });
    }
  }

  startSongMelody(songId) {
    const ctx = this.getAudioContext();
    const songNotes = [
      [392.00, 440.00, 523.25, 659.25], // G, A, C, E
      [349.23, 392.00, 440.00, 523.25], // F, G, A, C
      [293.66, 349.23, 440.00, 587.33], // D, F, A, D
      [329.63, 392.00, 493.88, 659.25]  // E, G, B, E
    ];

    let step = 0;
    const playStep = () => {
      if (this.currentPlayingSongId !== songId) return;
      const chord = songNotes[step % songNotes.length];
      chord.forEach((freq, idx) => {
        setTimeout(() => {
          if (this.currentPlayingSongId !== songId) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        }, idx * 250);
      });

      step++;
      this.songMelodyTimer = setTimeout(playStep, 1500);
    };

    playStep();
  }

  stopSongMelody() {
    if (this.songMelodyTimer) {
      clearTimeout(this.songMelodyTimer);
      this.songMelodyTimer = null;
    }
  }

    updateAllSongButtons() {
    // Update main anthem button
    const anthemBtn = document.getElementById('play-anthem-btn');
    if (anthemBtn) {
      if (this.currentPlayingSongId === 'song-1') {
        anthemBtn.innerHTML = `<span class="btn-play-icon">⏸</span> <span class="btn-play-text">PAUSE</span>`;
        anthemBtn.classList.add('playing');
      } else {
        anthemBtn.innerHTML = `<span class="btn-play-icon">▶</span> <span class="btn-play-text">PLAY ANTHEM ✦</span>`;
        anthemBtn.classList.remove('playing');
      }
    }

    // Update all playlist card buttons
    document.querySelectorAll('.song-play-btn').forEach(btn => {
      const sid = btn.getAttribute('data-song-id');
      if (sid === this.currentPlayingSongId) {
        btn.innerHTML = `<span class="btn-play-icon">⏸</span> <span class="btn-play-text">PAUSE</span>`;
        btn.classList.add('playing');
      } else {
        btn.innerHTML = `<span class="btn-play-icon">▶</span> <span class="btn-play-text">PLAY</span>`;
        btn.classList.remove('playing');
      }
    });

    // Update soundtrack reveal card play button
    const revealPlayBtn = document.getElementById('soundtrack-reveal-play-btn');
    if (revealPlayBtn) {
      const sid = revealPlayBtn.getAttribute('data-song-id');
      if (sid && sid === this.currentPlayingSongId) {
        revealPlayBtn.innerHTML = `<span class="btn-play-icon">⏸</span> <span>Pause</span>`;
        revealPlayBtn.classList.add('playing');
      } else {
        revealPlayBtn.innerHTML = `<span class="btn-play-icon">▶</span> <span>Play Track</span>`;
        revealPlayBtn.classList.remove('playing');
      }
    }
  }

  // Sound FX Synthesizers
  playKeypadClick() {
    const ctx = this.getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  playCorrectChime() {
    const ctx = this.getAudioContext();
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }, i * 90);
    });
  }

  playWrongBuzz() {
    const ctx = this.getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  playUnlockBlast() {
    const ctx = this.getAudioContext();
    [440, 554.37, 659.25, 880, 1108.73, 1318.51].forEach((freq, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      }, i * 80);
    });
  }

  playWaxSealBreak() {
    const ctx = this.getAudioContext();
    const oscSnap = ctx.createOscillator();
    const gainSnap = ctx.createGain();
    oscSnap.type = 'triangle';
    oscSnap.frequency.setValueAtTime(800, ctx.currentTime);
    oscSnap.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.09);
    gainSnap.gain.setValueAtTime(0.2, ctx.currentTime);
    gainSnap.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
    oscSnap.connect(gainSnap);
    gainSnap.connect(ctx.destination);
    oscSnap.start();
    oscSnap.stop(ctx.currentTime + 0.09);

    [587.33, 739.99, 880.00, 1174.66, 1479.98].forEach((freq, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.4);
      }, (i + 1) * 70);
    });
  }
}

// Global instance
window.CosmicAudio = new CosmicAudioEngine();
