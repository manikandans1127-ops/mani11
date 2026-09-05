/**
 * StorytellerAvatar Component
 * Interactive character narrator with 8 distinct emotional expressions,
 * comic-style cosmic speech bubbles, typewriter animation, and sequence control.
 */

const StorytellerExpressions = {
  happy: {
    name: "Happy",
    emoji: "😊",
    badge: "😊",
    image: "assets/avatar.png",
    moodColor: "rgba(251, 113, 133, 0.5)",
    glowColor: "#f43f5e",
    soundPitch: 680
  },
  excited: {
    name: "Excited",
    emoji: "😄",
    badge: "✨",
    image: "assets/avatar.png",
    moodColor: "rgba(244, 63, 94, 0.7)",
    glowColor: "#ec4899",
    soundPitch: 840
  },
  surprised: {
    name: "Surprised",
    emoji: "😲",
    badge: "😲",
    image: "assets/avatar.png",
    moodColor: "rgba(254, 240, 138, 0.6)",
    glowColor: "#fef08a",
    soundPitch: 920
  },
  wow: {
    name: "Amazed",
    emoji: "🤩",
    badge: "🤩",
    image: "assets/avatar.png",
    moodColor: "rgba(217, 70, 239, 0.7)",
    glowColor: "#d946ef",
    soundPitch: 960
  },
  playful: {
    name: "Playful",
    emoji: "😏",
    badge: "😏",
    image: "assets/avatar.png",
    moodColor: "rgba(244, 114, 182, 0.6)",
    glowColor: "#fb7185",
    soundPitch: 720
  },
  thinking: {
    name: "Thinking",
    emoji: "🤔",
    badge: "🤔",
    image: "assets/avatar.png",
    moodColor: "rgba(147, 197, 253, 0.6)",
    glowColor: "#60a5fa",
    soundPitch: 540
  },
  sad: {
    name: "Sad / Disappointed",
    emoji: "😢",
    badge: "🥺",
    image: "assets/avatar.png",
    moodColor: "rgba(148, 163, 184, 0.5)",
    glowColor: "#94a3b8",
    soundPitch: 420
  },
  loving: {
    name: "Calm / Loving",
    emoji: "😌",
    badge: "🤍",
    image: "assets/avatar.png",
    moodColor: "rgba(253, 164, 175, 0.7)",
    glowColor: "#fda4af",
    soundPitch: 600
  },
  laughing: {
    name: "Laughing",
    emoji: "😂",
    badge: "😂",
    image: "assets/avatar-happy.png",
    moodColor: "rgba(251, 146, 60, 0.6)",
    glowColor: "#fb923c",
    soundPitch: 780
  },
  emotional: {
    name: "Emotional",
    emoji: "🥹",
    badge: "🥹",
    image: "assets/avatar.png",
    moodColor: "rgba(244, 114, 182, 0.7)",
    glowColor: "#f472b6",
    soundPitch: 520
  },
  nostalgic: {
    name: "Nostalgic",
    emoji: "🌙",
    badge: "✨",
    image: "assets/avatar.png",
    moodColor: "rgba(192, 132, 252, 0.6)",
    glowColor: "#c084fc",
    soundPitch: 580
  },
  curious: {
    name: "Curious",
    emoji: "👀",
    badge: "🤔",
    image: "assets/avatar.png",
    moodColor: "rgba(125, 211, 252, 0.6)",
    glowColor: "#38bdf8",
    soundPitch: 640
  }
};

class StorytellerAvatarComponent {
  constructor() {
    this.expressions = StorytellerExpressions;
    this.currentExpression = "happy";
    this.isVisible = false;
    this.isTyping = false;
    this.typewriterTimer = null;
    this.sequenceQueue = [];
    this.currentSequenceIndex = 0;
    this.onContinueCallback = null;

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    let overlay = document.getElementById('storyteller-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'storyteller-overlay';
      overlay.className = 'storyteller-overlay hidden';
      overlay.innerHTML = `
        <div class="storyteller-backdrop" id="storyteller-backdrop"></div>
        <div class="storyteller-container center" id="storyteller-container">
          <!-- Speech Bubble -->
          <div class="storyteller-bubble" id="storyteller-bubble">
            <div class="bubble-header">
              <span class="bubble-speaker">Malfoy <span class="speaker-star">✦</span></span>
              <span class="bubble-expression-badge" id="bubble-expression-badge">😊</span>
              <button class="bubble-close-btn" id="storyteller-close-btn" title="Dismiss" aria-label="Close Narration">&times;</button>
            </div>
            <div class="bubble-body">
              <p class="bubble-text" id="storyteller-message-text"></p>
            </div>
            <div class="bubble-footer">
              <span class="bubble-hint" id="storyteller-hint-text">Tap anywhere to continue</span>
              <button class="bubble-next-btn" id="storyteller-next-btn">
                <span>Continue</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
            <div class="bubble-tail"></div>
          </div>

          <!-- Avatar Character -->
          <div class="storyteller-character-box" id="storyteller-character-box">
            <div class="avatar-aura-ring" id="avatar-aura-ring"></div>
            <div class="avatar-frame">
              <img src="assets/avatar.png" alt="Storyteller Avatar" class="avatar-img" id="storyteller-avatar-img">
            </div>
            <div class="avatar-mood-badge" id="avatar-mood-badge">✨</div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    this.overlay = overlay;
    this.container = document.getElementById('storyteller-container');
    this.bubble = document.getElementById('storyteller-bubble');
    this.messageText = document.getElementById('storyteller-message-text');
    this.expressionBadge = document.getElementById('bubble-expression-badge');
    this.avatarImg = document.getElementById('storyteller-avatar-img');
    this.auraRing = document.getElementById('avatar-aura-ring');
    this.moodBadge = document.getElementById('avatar-mood-badge');
    this.nextBtn = document.getElementById('storyteller-next-btn');
    this.closeBtn = document.getElementById('storyteller-close-btn');
    this.backdrop = document.getElementById('storyteller-backdrop');
    this.hintText = document.getElementById('storyteller-hint-text');
  }

  bindEvents() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleNext();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hide();
      });
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target.closest('#storyteller-close-btn')) return;
        this.handleNext();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (this.isVisible && e.key === 'Escape') {
        this.hide();
      }
    });
  }

  setExpression(expressionKey) {
    const key = (expressionKey || 'happy').toLowerCase();
    const config = this.expressions[key] || this.expressions.happy;
    this.currentExpression = key;

    if (config.image && this.avatarImg) {
      this.avatarImg.src = config.image;
    }

    if (this.expressionBadge) {
      this.expressionBadge.innerText = config.badge || config.emoji;
    }
    if (this.moodBadge) {
      this.moodBadge.innerText = config.badge || config.emoji;
      this.moodBadge.className = `avatar-mood-badge mood-${key}`;
    }

    if (this.auraRing) {
      this.auraRing.style.background = `radial-gradient(circle, ${config.moodColor} 0%, transparent 70%)`;
      this.auraRing.style.boxShadow = `0 0 35px ${config.glowColor}88`;
    }

    if (this.container) {
      this.container.setAttribute('data-expression', key);
    }
  }

  say(message, expression = 'happy', options = {}) {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);

    this.sequenceQueue = [];
    this.currentSequenceIndex = 0;
    this.onContinueCallback = options.onContinue || null;

    this.setExpression(expression);
    this.applyPosition(options.position || 'center');

    if (this.hintText) {
      this.hintText.innerText = options.hint || "Tap anywhere to continue";
    }

    if (this.nextBtn) {
      this.nextBtn.innerHTML = `<span>${options.buttonText || 'Continue'}</span> <span class="btn-arrow">→</span>`;
    }

    this.overlay.classList.remove('hidden', 'exiting');
    this.isVisible = true;

    if (options.typewriter !== false) {
      this.renderTypewriter(message);
    } else {
      if (this.messageText) this.messageText.innerHTML = message;
    }

    if (window.CosmicAudio && window.CosmicAudio.playKeypadClick) {
      window.CosmicAudio.playKeypadClick();
    }

    if (options.duration && options.duration > 0) {
      setTimeout(() => {
        if (this.isVisible) this.hide();
      }, options.duration);
    }
  }

  playSequence(sequence, onComplete = null, position = 'center') {
    if (!Array.isArray(sequence) || sequence.length === 0) return;

    this.sequenceQueue = sequence;
    this.currentSequenceIndex = 0;
    this.onContinueCallback = onComplete;
    this.applyPosition(position || 'center');

    this.showSequenceStep(0);
  }

  showSequenceStep(index) {
    if (index >= this.sequenceQueue.length) {
      this.hide();
      if (typeof this.onContinueCallback === 'function') {
        this.onContinueCallback();
      }
      return;
    }

    const step = this.sequenceQueue[index];
    const isLast = index === this.sequenceQueue.length - 1;

    this.setExpression(step.expression || 'happy');
    if (this.hintText) {
      this.hintText.innerText = `Step ${index + 1} of ${this.sequenceQueue.length}`;
    }
    if (this.nextBtn) {
      this.nextBtn.innerHTML = isLast ? `<span>Done</span> ✦` : `<span>Next</span> →`;
    }

    this.overlay.classList.remove('hidden', 'exiting');
    this.isVisible = true;
    this.renderTypewriter(step.message);
  }

  renderTypewriter(text) {
    if (!this.messageText) return;
    this.messageText.innerHTML = '';
    this.isTyping = true;

    let i = 0;
    const speed = 18;

    this.typewriterTimer = setInterval(() => {
      if (i < text.length) {
        this.messageText.innerHTML = text.substring(0, i + 1);
        i++;
      } else {
        clearInterval(this.typewriterTimer);
        this.isTyping = false;
      }
    }, speed);
  }

  handleNext() {
    if (this.isTyping && this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.isTyping = false;
      if (this.sequenceQueue.length > 0) {
        this.messageText.innerHTML = this.sequenceQueue[this.currentSequenceIndex].message;
      }
      return;
    }

    if (this.sequenceQueue.length > 0 && this.currentSequenceIndex < this.sequenceQueue.length - 1) {
      this.currentSequenceIndex++;
      this.showSequenceStep(this.currentSequenceIndex);
      return;
    }

    const cb = this.onContinueCallback;
    this.hide();
    if (typeof cb === 'function') {
      cb();
    }
  }

  hide() {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    this.isTyping = false;
    if (this.overlay && this.isVisible) {
      this.overlay.classList.add('exiting');
      setTimeout(() => {
        this.isVisible = false;
        if (this.overlay) {
          this.overlay.classList.remove('exiting');
          this.overlay.classList.add('hidden');
        }
      }, 350);
    } else {
      this.isVisible = false;
      if (this.overlay) this.overlay.classList.add('hidden');
    }
  }

  applyPosition(position) {
    if (!this.container) return;
    this.container.classList.remove('bottom-right', 'bottom-left', 'center', 'top-right');
    this.container.classList.add(position || 'center');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.Storyteller = new StorytellerAvatarComponent();
  window.StorytellerAvatar = window.Storyteller;
});
