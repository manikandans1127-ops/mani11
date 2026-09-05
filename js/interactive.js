/**
 * Interactive Story Experiences Engine
 * Sourced directly from 01 - Our Story, 04 - Games, 05 - Love, 08 - Secrets & Easter Eggs
 * Features:
 * 1. Memory Unlock (5 interactive memory challenge cards with real photo reveals)
 * 2. Complete My Sentence (4 dialogue rounds with animated storyteller reactions)
 * 3. Final Question (Cinematic bridge to Birthday Letter)
 */

/* ==========================================================================
   1. MEMORY UNLOCK ENGINE
   ========================================================================== */
class MemoryUnlockEngine {
  constructor() {
    this.container = document.getElementById('memory-unlock-grid');
    this.memories = [
      {
        id: 'mem-1',
        title: 'Memory 1 — The Call I Never Saw Coming',
        date: '05/10/2025',
        hint: 'Before my football match, what condition did you give me in text so we could talk on the phone the next day?',
        options: [
          { text: '“If you score 3 goals”', isCorrect: false },
          { text: '“If you win, we can talk on the phone tomorrow” 📞', isCorrect: true },
          { text: '“If you buy me chocolate”', isCorrect: false },
          { text: '“If you wake up at 5 AM”', isCorrect: false }
        ],
        photo: 'assets/photos/Screenshot_20251005_161402.jpg',
        revealText: 'And the next day, you actually called. I was completely melting into your voice thinking: “Is that really you talking to me right now… or am I dreaming?” 📞🤍',
        avatarReaction: 'You actually called the next day! I was melting into your voice thinking: “Is that really you talking to me right now?” 📞🥹',
        avatarExpression: 'loving',
        isUnlocked: false
      },
      {
        id: 'mem-2',
        title: 'Memory 2 — The Paper Queen Incident',
        date: '1st-Year YellowMatic Training',
        hint: 'When we were asked to choose a king or queen during our 1st-year training, how did I convince you?',
        options: [
          { text: 'I begged you', isCorrect: false },
          { text: '“If we choose a queen from our side, we will definitely win” 👑', isCorrect: true },
          { text: 'Rock paper scissors', isCorrect: false },
          { text: 'Coin toss', isCorrect: false }
        ],
        photo: 'assets/photos/6064496562601136767.jpg',
        revealText: 'My 100 IQ master plan! You believed me and became our paper queen, and that paper queen was completely worth it! 👑🤍',
        avatarReaction: 'My 100 IQ master plan! That paper queen was completely worth it! 👑🤍',
        avatarExpression: 'excited',
        isUnlocked: false
      },
      {
        id: 'mem-3',
        title: 'Memory 3 — The Day I Actually Came to Salem for You',
        date: 'Fairlands, Salem',
        hint: 'What were the 3 words you said that made this lazy guy pack his bags and travel all the way to Salem?',
        options: [
          { text: '“Come here now”', isCorrect: false },
          { text: '“I miss you” 🤍', isCorrect: true },
          { text: '“Buy me briyani”', isCorrect: false },
          { text: '“Let’s watch movie”', isCorrect: false }
        ],
        photo: 'assets/photos/6064496562601136738 2.jpg',
        revealText: 'You simply said “I miss you.” The next day I was in Salem, we wandered Fairlands, and accidentally matched our outfits! Fate. 😌🤍',
        avatarReaction: 'You simply said “I miss you.” Next day I was in Salem, and we accidentally matched our outfits! 😌🤍',
        avatarExpression: 'loving',
        isUnlocked: false
      },
      {
        id: 'mem-4',
        title: 'Memory 4 — The Secret Prank at Your House',
        date: 'Visit to Your Home',
        hint: 'What fake job did I tell your brother I had when I visited your home for the first time?',
        options: [
          { text: 'Police Officer', isCorrect: false },
          { text: 'Bank Officer 🏦', isCorrect: true },
          { text: 'College Professor', isCorrect: false },
          { text: 'Delivery Boy', isCorrect: false }
        ],
        photo: 'assets/photos/6064496562601136765.jpg',
        revealText: 'I literally pranked your brother as a bank officer and totally scared him! He had no idea who I was and I made him cry! 😂',
        avatarReaction: 'I literally pranked your brother as a bank officer and totally scared him! 😂',
        avatarExpression: 'playful',
        isUnlocked: false
      },
      {
        id: 'mem-5',
        title: 'Memory 5 — Our Movie Date Pair',
        date: '19.04.2026',
        hint: 'On our movie date, which legendary football duo jerseys did we wear?',
        options: [
          { text: 'Messi fan girl & Neymar fan boy ⚽🎥', isCorrect: true },
          { text: 'Ronaldo & Benzema', isCorrect: false },
          { text: 'Mbappe & Haaland', isCorrect: false },
          { text: 'Real Madrid & Chelsea', isCorrect: false }
        ],
        photo: 'assets/photos/photo_6064496562601136737_y.jpg',
        revealText: 'Movie date with football jerseys: Messi fan girl & Neymar fan boy makes the best pair in the universe! ❣️🎥',
        avatarReaction: 'Messi fan girl & Neymar fan boy makes the best pair in the universe! ❣️🎥',
        avatarExpression: 'excited',
        isUnlocked: false
      }
    ];

    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    this.memories.forEach((mem, index) => {
      const card = document.createElement('div');
      card.className = `memory-unlock-card glass-panel ${mem.isUnlocked ? 'unlocked' : 'locked'}`;
      card.id = `unlock-card-${mem.id}`;

      if (mem.isUnlocked) {
        card.innerHTML = `
          <div class="card-unlocked-header">
            <span class="unlocked-badge">🔓 PHOTO UNLOCKED</span>
            <span class="unlocked-date">${mem.date}</span>
          </div>
          <h4 class="unlocked-title">${mem.title}</h4>
          <div class="unlocked-photo-box" onclick="window.openPhotoModal('${mem.photo}', '${mem.title}')">
            <img src="${mem.photo}" alt="${mem.title}" class="unlocked-real-img">
            <div class="photo-zoom-hint">🔍 Tap to view full size</div>
          </div>
          <p class="unlocked-text">${mem.revealText}</p>
        `;
      } else {
        card.innerHTML = `
          <div class="card-locked-header">
            <span class="lock-icon">🔒</span>
            <span class="locked-label">Locked Memory #${index + 1}</span>
          </div>
          <h4 class="locked-title">${mem.title}</h4>
          <p class="locked-hint"><em>“${mem.hint}”</em></p>
          <div class="unlock-options-list" id="opts-${mem.id}">
            ${mem.options.map((opt, oIdx) => `
              <button class="unlock-opt-btn" onclick="window.MemoryUnlock.attemptUnlock('${mem.id}', ${oIdx}, this)">
                <span>✦</span> <span>${opt.text}</span>
              </button>
            `).join('')}
          </div>
        `;
      }

      this.container.appendChild(card);
    });
  }

  attemptUnlock(memId, optIndex, btnEl) {
    const mem = this.memories.find(m => m.id === memId);
    if (!mem || mem.isUnlocked) return;

    const opt = mem.options[optIndex];
    if (opt.isCorrect) {
      mem.isUnlocked = true;
      btnEl.classList.add('correct');
      if (window.CosmicAudio) window.CosmicAudio.playUnlockBlast();
      if (window.EasterEggs) window.EasterEggs.showToast("Memory Unlocked! 🔓", mem.title);
      
      if (window.Storyteller) {
        window.Storyteller.say(mem.avatarReaction, mem.avatarExpression, { duration: 4000 });
      }

      setTimeout(() => {
        this.render();
      }, 500);
    } else {
      btnEl.classList.add('wrong');
      btnEl.disabled = true;
      if (window.CosmicAudio) window.CosmicAudio.playWrongBuzz();
      if (window.Storyteller) {
        window.Storyteller.say("Nalla yosichu paaru... try another option! 😂", "thinking", { duration: 2500 });
      }
    }
  }
}

/* ==========================================================================
   2. COMPLETE MY SENTENCE ENGINE
   ========================================================================== */
class CompleteSentenceEngine {
  constructor() {
    this.rounds = [
      {
        id: 1,
        title: "Round 1: Department Gossips",
        starter: "When the gossip started in our department after the IV trip, I told you:",
        starterQuote: "“Dindigul na lockuuu...”",
        options: [
          { text: "“nama tha ipa department la talkuuuu” 🗣️", isCorrect: true },
          { text: "“namba thaan class la mass-uuu”", isCorrect: false },
          { text: "“ini ellaam silent-uuu”", isCorrect: false }
        ],
        avatarReaction: "“Dindigul na lockuuu, nama tha ipa department la talkuuuu!” The whole department was trying to figure out if we were dating! 😂",
        avatarExpression: "playful"
      },
      {
        id: 2,
        title: "Round 2: The Secret Notes",
        starter: "In the dessert shop when you read the secret notes on my phone, one line said:",
        starterQuote: "“Find a girl who loves you more than you do and...”",
        options: [
          { text: "“treat her to ice cream every day”", isCorrect: false },
          { text: "“protect her at all cost” 🛡️", isCorrect: true },
          { text: "“never give your phone to her”", isCorrect: false }
        ],
        avatarReaction: "“Protect her at all cost.” You held my hand so tight reading my diary notes, and I was arrested by you in joy! 🥹🤍",
        avatarExpression: "loving"
      },
      {
        id: 3,
        title: "Round 3: That Heartfelt Confession",
        starter: "When we were clashing and I texted ‘bye, from now on I won't bother you’, you sent a whole paragraph and said:",
        starterQuote: "“...”",
        options: [
          { text: "“Nee enaku venam”", isCorrect: false },
          { text: "“Una pudichu iruku romba” 🤍", isCorrect: true },
          { text: "“Kaviya kitta pesadha”", isCorrect: false }
        ],
        avatarReaction: "“Una pudichu iruku romba.” That's the exact moment I got butterflies and knew you were the one. 🤍✨",
        avatarExpression: "wow"
      },
      {
        id: 4,
        title: "Round 4: The Fork Incident",
        starter: "When I teased you saying ‘my friend Kaviya will find another girl for me’, you held a fork to my neck and said:",
        starterQuote: "“...”",
        options: [
          { text: "“Come again?” 😂🍴", isCorrect: true },
          { text: "“All the best”", isCorrect: false },
          { text: "“Poitu vaa”", isCorrect: false }
        ],
        avatarReaction: "“Come again?” 😂🍴 My hands were literally shaking after you held them!",
        avatarExpression: "playful"
      }
    ];

    this.currentIndex = 0;
    this.initDOM();
  }

  initDOM() {
    this.roundIndicator = document.getElementById('sentence-round-num');
    this.titleEl = document.getElementById('sentence-round-title');
    this.starterEl = document.getElementById('sentence-starter-text');
    this.quoteEl = document.getElementById('sentence-starter-quote');
    this.optionsGrid = document.getElementById('sentence-options-grid');
    this.feedbackBox = document.getElementById('sentence-feedback-box');
    this.feedbackText = document.getElementById('sentence-feedback-text');
    this.nextBtn = document.getElementById('sentence-next-btn');

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextRound());
    }

    this.loadRound(0);
  }

  loadRound(index) {
    this.currentIndex = index;
    const r = this.rounds[index];
    if (!r) return;

    if (this.roundIndicator) this.roundIndicator.innerText = `${index + 1} / ${this.rounds.length}`;
    if (this.titleEl) this.titleEl.innerText = r.title;
    if (this.starterEl) this.starterEl.innerText = r.starter;
    if (this.quoteEl) this.quoteEl.innerText = r.starterQuote;
    if (this.feedbackBox) this.feedbackBox.classList.add('hidden');
    if (this.optionsGrid) this.optionsGrid.innerHTML = '';

    r.options.forEach((opt, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'sentence-opt-btn';
      btn.innerHTML = `<span class="sentence-opt-icon">✧</span> <span>${opt.text}</span>`;
      btn.addEventListener('click', () => this.selectOption(btn, opt, r));
      this.optionsGrid.appendChild(btn);
    });
  }

  selectOption(btnEl, option, round) {
    if (option.isCorrect) {
      btnEl.classList.add('correct');
      const all = this.optionsGrid.querySelectorAll('.sentence-opt-btn');
      all.forEach(b => b.disabled = true);

      if (window.CosmicAudio) window.CosmicAudio.playCorrectChime();
      if (this.feedbackBox && this.feedbackText) {
        this.feedbackText.innerText = round.avatarReaction;
        this.feedbackBox.classList.remove('hidden');
      }

      if (window.Storyteller) {
        window.Storyteller.say(round.avatarReaction, round.avatarExpression, { duration: 4000 });
      }

      if (this.currentIndex === this.rounds.length - 1) {
        if (this.nextBtn) this.nextBtn.innerText = "All Sentences Completed! ✨ →";
      } else {
        if (this.nextBtn) this.nextBtn.innerText = "Next Sentence →";
      }
    } else {
      btnEl.classList.add('wrong');
      btnEl.disabled = true;
      if (window.CosmicAudio) window.CosmicAudio.playWrongBuzz();
      if (window.Storyteller) {
        window.Storyteller.say("Haha not that one! Try again 😄", "playful", { duration: 2500 });
      }
    }
  }

  nextRound() {
    if (this.currentIndex < this.rounds.length - 1) {
      this.loadRound(this.currentIndex + 1);
    } else {
      if (window.SceneEngine) window.SceneEngine.nextScene();
    }
  }
}

/* ==========================================================================
   3. FINAL QUESTION ENGINE (Bridge to Birthday Letter)
   ========================================================================== */
class FinalQuestionEngine {
  constructor() {
    this.container = document.getElementById('final-q-options');
    this.feedback = document.getElementById('final-q-feedback');
    this.unlockBtn = document.getElementById('final-q-continue-btn');
    this.hasAnswered = false;

    this.init();
  }

  init() {
    if (!this.container) return;
    const options = [
      { num: '7', isCorrect: false },
      { num: '11', isCorrect: true, label: '11 🔐✨' },
      { num: '26', isCorrect: false },
      { num: '27', isCorrect: false }
    ];

    this.container.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'final-key-btn';
      btn.innerHTML = `<span class="key-num">${opt.label || opt.num}</span>`;
      btn.addEventListener('click', () => this.selectKey(btn, opt));
      this.container.appendChild(btn);
    });

    if (this.unlockBtn) {
      this.unlockBtn.addEventListener('click', () => {
        if (window.SceneEngine) window.SceneEngine.nextScene();
      });
    }
  }

  selectKey(btn, opt) {
    if (this.hasAnswered) return;

    if (opt.isCorrect) {
      this.hasAnswered = true;
      btn.classList.add('correct');
      if (window.CosmicAudio) window.CosmicAudio.playUnlockBlast();
      if (this.feedback) {
        this.feedback.innerHTML = `
          <div style="font-size:2rem; margin-bottom:0.5rem;">✨ 🤍 🔐</div>
          <blockquote style="font-family:var(--font-display); font-size:1.3rem; font-style:italic; color:#fff; line-height:1.6; margin-bottom:1rem;">
            “11. Our celestial key from the very beginning. Now... let me unroll my heart for you.”
          </blockquote>
        `;
        this.feedback.classList.remove('hidden');
      }

      if (this.unlockBtn) this.unlockBtn.classList.remove('hidden');

      if (window.Storyteller) {
        window.Storyteller.say("11. Our secret key from the very beginning. Now... let me unroll my heart for you. 💌🤍", "loving", { duration: 4500 });
      }
    } else {
      btn.classList.add('wrong');
      btn.disabled = true;
      if (window.CosmicAudio) window.CosmicAudio.playWrongBuzz();
      if (window.Storyteller) {
        window.Storyteller.say("Think about the number that has been with us since the beginning! 😉", "thinking", { duration: 2800 });
      }
    }
  }
}

/* ==========================================================================
   4. SOUNDTRACK REVEAL ENGINE
   ========================================================================== */
class SoundtrackRevealEngine {
  constructor() {
    this.songs = (window.UniverseConfig && window.UniverseConfig.soundtrack) ? window.UniverseConfig.soundtrack.songs : [];
    this.currentIndex = 0;
    this.revealedMap = {};

    this.mysteryCard = document.getElementById('soundtrack-mystery-card');
    this.revealedCard = document.getElementById('soundtrack-revealed-card');
    this.revealBtn = document.getElementById('reveal-song-btn');
    this.nextTrackBtn = document.getElementById('soundtrack-next-track-btn');
    this.prevTrackBtn = document.getElementById('soundtrack-prev-track-btn');
    this.songIndicator = document.getElementById('soundtrack-song-indicator');

    this.init();
  }

  init() {
    if (!this.songs || this.songs.length === 0) return;

    if (this.revealBtn) {
      this.revealBtn.addEventListener('click', () => this.revealCurrentSong());
    }

    if (this.nextTrackBtn) {
      this.nextTrackBtn.addEventListener('click', () => this.nextSong());
    }

    if (this.prevTrackBtn) {
      this.prevTrackBtn.addEventListener('click', () => this.prevSong());
    }

    this.loadSong(0);
  }

  loadSong(index) {
    this.currentIndex = index;
    const song = this.songs[index];
    if (!song) return;

    if (this.songIndicator) {
      this.songIndicator.innerText = `Track ${index + 1} of ${this.songs.length}`;
    }

    const questionEl = document.getElementById('soundtrack-reveal-question');
    if (questionEl) {
      questionEl.innerText = song.revealQuestion || `What song feels like us?`;
    }

    const isRevealed = !!this.revealedMap[song.id];

    if (isRevealed) {
      this.showRevealedView(song);
    } else {
      this.showMysteryView(song);
    }
  }

  revealCurrentSong() {
    const song = this.songs[this.currentIndex];
    if (!song) return;

    this.revealedMap[song.id] = true;

    if (window.CosmicAudio && window.CosmicAudio.playKeypadClick) {
      window.CosmicAudio.playKeypadClick();
    }

    this.showRevealedView(song);

    if (window.Storyteller) {
      const msg = song.personalContent || song.why || `Here's our special track: ${song.title} 🎵🤍`;
      const emotion = song.avatarReaction || 'loving';
      window.Storyteller.say(msg, emotion, { duration: 4000 });
    }
  }

  showMysteryView(song) {
    if (this.mysteryCard) this.mysteryCard.classList.remove('hidden');
    if (this.revealedCard) this.revealedCard.classList.add('hidden');
  }

  showRevealedView(song) {
    if (this.mysteryCard) this.mysteryCard.classList.add('hidden');
    if (this.revealedCard) {
      this.revealedCard.classList.remove('hidden');
      
      const titleEl = document.getElementById('soundtrack-revealed-title');
      const artistEl = document.getElementById('soundtrack-revealed-artist');
      const lyricsEl = document.getElementById('soundtrack-revealed-lyrics');
      const whyEl = document.getElementById('soundtrack-revealed-why');
      const playBtn = document.getElementById('soundtrack-reveal-play-btn');

      if (titleEl) titleEl.innerText = song.title;
      if (artistEl) artistEl.innerText = song.artist;
      if (lyricsEl) lyricsEl.innerText = song.lyrics || '';
      if (whyEl) whyEl.innerText = song.personalContent || song.why || '';

      if (playBtn) {
        playBtn.setAttribute('data-song-id', song.id);
        const isPlaying = window.CosmicAudio && window.CosmicAudio.currentPlayingSongId === song.id;
        playBtn.innerHTML = isPlaying 
          ? `<span class="btn-play-icon">⏸</span> <span>Pause</span>` 
          : `<span class="btn-play-icon">▶</span> <span>Play Track</span>`;
        
        playBtn.onclick = () => {
          if (window.CosmicAudio) {
            window.CosmicAudio.toggleSongPlay(song.id, song.title, playBtn);
          }
        };
      }
    }
  }

  nextSong() {
    if (this.currentIndex < this.songs.length - 1) {
      this.loadSong(this.currentIndex + 1);
    } else {
      this.loadSong(0);
    }
  }

  prevSong() {
    if (this.currentIndex > 0) {
      this.loadSong(this.currentIndex - 1);
    } else {
      this.loadSong(this.songs.length - 1);
    }
  }
}

/* ==========================================================================
   5. WHAT IF...? INTERACTIVE ENGINE (FOCUSED AVATAR STORYTELLING)
   ========================================================================== */
class WhatIfEngine {
  constructor() {
    this.questions = (window.UniverseConfig && window.UniverseConfig.whatIf) ? window.UniverseConfig.whatIf : [];
    this.currentIndex = 0;
    this.isTyping = false;
    this.typewriterTimer = null;
    this.currentTypingFullText = '';

    // DOM Elements
    this.numEl = document.getElementById('what-if-num');
    this.barEl = document.getElementById('what-if-progress-bar');

    // Stages
    this.questionStage = document.getElementById('what-if-question-stage');
    this.revealStage = document.getElementById('what-if-reveal-stage');

    // Question Stage
    this.avatarImg = document.getElementById('what-if-avatar-img');
    this.moodBadge = document.getElementById('what-if-mood-badge');
    this.speechContainer = document.getElementById('what-if-speech-container');
    this.questionText = document.getElementById('what-if-question-text');
    this.revealContainer = document.getElementById('what-if-reveal-container');
    this.revealBtn = document.getElementById('what-if-reveal-btn');

    // Reveal Stage
    this.photoImg = document.getElementById('what-if-img');
    this.titleEl = document.getElementById('what-if-title');
    this.reactionAvatarImg = document.getElementById('what-if-reaction-avatar-img');
    this.reactionMoodBadge = document.getElementById('what-if-reaction-mood-badge');
    this.reactionText = document.getElementById('what-if-reaction-text');
    this.nextContainer = document.getElementById('what-if-next-container');
    this.nextBtn = document.getElementById('what-if-next-step-btn');
    this.completionBox = document.getElementById('what-if-completion-box');
    this.finishBtn = document.getElementById('what-if-finish-btn');

    this.init();
  }

  init() {
    if (!this.questions || this.questions.length === 0) return;

    if (this.revealBtn) {
      this.revealBtn.addEventListener('click', () => this.revealAnswer());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextQuestion());
    }

    if (this.finishBtn) {
      this.finishBtn.addEventListener('click', () => this.finishWhatIf());
    }

    // Tap speech bubble to complete typing instantly
    if (this.speechContainer) {
      this.speechContainer.addEventListener('click', () => {
        if (this.isTyping) {
          this.skipTyping();
        }
      });
    }

    this.loadQuestion(0);
  }

  loadQuestion(index) {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    this.currentIndex = index;
    const q = this.questions[index];
    if (!q) return;

    if (this.numEl) this.numEl.innerText = index + 1;
    if (this.barEl) {
      const pct = ((index + 1) / this.questions.length) * 100;
      this.barEl.style.width = `${pct}%`;
    }

    // Switch to Question Stage view
    if (this.questionStage) this.questionStage.style.display = 'flex';
    if (this.revealStage) this.revealStage.style.display = 'none';

    if (this.revealContainer) {
      this.revealContainer.style.display = 'none';
    }

    if (this.avatarImg) {
      this.avatarImg.src = 'assets/avatar.png';
    }
    if (this.moodBadge) {
      this.moodBadge.innerText = '✨';
    }

    // Start typewriter effect on question
    this.typeQuestion(q.question);
  }

  typeQuestion(text) {
    if (!this.questionText) return;
    this.currentTypingFullText = text;
    this.questionText.innerText = '';
    this.isTyping = true;

    let i = 0;
    const speed = 24;

    this.typewriterTimer = setInterval(() => {
      if (i < text.length) {
        this.questionText.innerText = text.substring(0, i + 1);
        i++;
      } else {
        clearInterval(this.typewriterTimer);
        this.isTyping = false;
        // Show Reveal button after typing completes
        if (this.revealContainer) {
          this.revealContainer.style.display = 'flex';
        }
      }
    }, speed);
  }

  skipTyping() {
    if (!this.isTyping) return;
    clearInterval(this.typewriterTimer);
    this.isTyping = false;
    if (this.questionText && this.currentTypingFullText) {
      this.questionText.innerText = this.currentTypingFullText;
    }
    if (this.revealContainer) {
      this.revealContainer.style.display = 'flex';
    }
  }

  revealAnswer() {
    const q = this.questions[this.currentIndex];
    if (!q) return;

    if (window.CosmicAudio && window.CosmicAudio.playKeypadClick) {
      window.CosmicAudio.playKeypadClick();
    }

    // Switch to Reveal Stage view
    if (this.questionStage) this.questionStage.style.display = 'none';
    if (this.revealStage) {
      this.revealStage.style.display = 'flex';
    }

    const moodEmojis = {
      happy: '😊',
      excited: '😄',
      surprised: '😲',
      wow: '🤩',
      playful: '😏',
      thinking: '🤔',
      sad: '😢',
      loving: '🤍',
      laughing: '😂',
      emotional: '🥹',
      nostalgic: '🌙',
      curious: '👀'
    };

    if (this.reactionMoodBadge) {
      this.reactionMoodBadge.innerText = moodEmojis[q.emotion] || '🤍';
    }

    if (this.photoImg) {
      this.photoImg.src = q.photo;
      this.photoImg.alt = q.answer;
    }

    if (this.titleEl) {
      this.titleEl.innerText = q.answer;
    }

    if (this.reactionText) {
      this.reactionText.innerText = q.message || q.answer;
    }

    const isLast = this.currentIndex === this.questions.length - 1;
    if (isLast) {
      // Question 15: show completion banner with CONTINUE →
      if (this.nextContainer) this.nextContainer.style.display = 'none';
      if (this.completionBox) this.completionBox.style.display = 'block';
    } else {
      // Questions 1 - 14: show ONLY ONE Next button: NEXT WHAT IF →
      if (this.nextContainer) this.nextContainer.style.display = 'flex';
      if (this.completionBox) this.completionBox.style.display = 'none';
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.loadQuestion(this.currentIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  finishWhatIf() {
    if (window.CosmicAudio && window.CosmicAudio.playUnlockBlast) {
      window.CosmicAudio.playUnlockBlast();
    }
    if (window.SceneEngine) {
      window.SceneEngine.setValidatorState('what-if-completed', true);
      window.SceneEngine.nextScene();
    }
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.MemoryUnlock = new MemoryUnlockEngine();
  window.CompleteSentence = new CompleteSentenceEngine();
  window.FinalQuestion = new FinalQuestionEngine();
  window.SoundtrackReveal = new SoundtrackRevealEngine();
  window.WhatIf = new WhatIfEngine();
});
