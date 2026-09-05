/**
 * Secret Entrance & Keypad Controller
 * Manages the cosmic passcode input, celestial validation, and portal transitions.
 */

class SecretEntrance {
  constructor() {
    this.enteredCode = "";
    this.maxDigits = 2;
    this.isUnlocked = false;

    this.slot0 = document.getElementById('slot-0');
    this.slot1 = document.getElementById('slot-1');
    this.feedback = document.getElementById('keypad-feedback');
    this.entranceSection = document.getElementById('scene-entrance');
    this.mainJourney = document.getElementById('main-journey');

    this.initKeypad();
    this.checkStoredUnlock();
  }

  initKeypad() {
    const keys = document.querySelectorAll('.key-btn');
    keys.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = btn.getAttribute('data-key');
        this.handleKeyPress(key);
      });
    });

    // Keyboard support for desktop
    window.addEventListener('keydown', (e) => {
      if (this.isUnlocked) return;
      if (e.key >= '0' && e.key <= '9') {
        this.handleKeyPress(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Escape') {
        this.handleKeyPress('clear');
      } else if (e.key === 'h' || e.key === 'H') {
        this.handleKeyPress('hint');
      }
    });
  }

  checkStoredUnlock() {
    if (sessionStorage.getItem('universe_unlocked') === 'true') {
      this.unlockPortal(true);
    }
  }

  handleKeyPress(key) {
    if (this.isUnlocked) return;

    if (window.CosmicAudio) {
      window.CosmicAudio.playKeypadClick();
    }

    if (key === 'clear') {
      this.clearCode();
      return;
    }

    if (key === 'hint') {
      this.showHint();
      return;
    }

    if (this.enteredCode.length < this.maxDigits) {
      this.enteredCode += key;
      this.updateDisplay();

      if (this.enteredCode.length === this.maxDigits) {
        setTimeout(() => this.validateCode(), 80);
      }
    }
  }

  updateDisplay() {
    if (this.slot0) {
      if (this.enteredCode.length >= 1) {
        this.slot0.innerText = "✦";
        this.slot0.classList.add('filled');
      } else {
        this.slot0.innerText = "";
        this.slot0.classList.remove('filled');
      }
    }

    if (this.slot1) {
      if (this.enteredCode.length >= 2) {
        this.slot1.innerText = "✦";
        this.slot1.classList.add('filled');
      } else {
        this.slot1.innerText = "";
        this.slot1.classList.remove('filled');
      }
    }
  }

  clearCode() {
    this.enteredCode = "";
    this.updateDisplay();
    if (this.feedback) {
      this.feedback.innerText = "Touch the starry digits below";
      this.feedback.className = "keypad-hint";
    }
  }

  showHint() {
    if (this.feedback) {
      this.feedback.innerText = "Hint: A magical repeating 2-digit number connected to our story (11) 🔐";
      this.feedback.className = "keypad-hint";
    }
  }

  validateCode() {
    const expected = (window.UniverseConfig && window.UniverseConfig.secretPasscode) || "11";
    if (this.enteredCode === expected) {
      // Success feedback
      if (this.feedback) {
        this.feedback.innerText = "Access Granted! Welcome to your universe ✨";
        this.feedback.className = "keypad-hint success";
      }

      if (window.CosmicAudio) {
        window.CosmicAudio.playCorrectChime();
      }

      this.unlockPortal(false);
    } else {
      // Error feedback
      if (this.feedback) {
        this.feedback.innerText = "Incorrect celestial key. Try again.";
        this.feedback.className = "keypad-hint error";
      }

      if (window.CosmicAudio) {
        window.CosmicAudio.playWrongBuzz();
      }

      if (this.slot0) this.slot0.classList.add('shake-error');
      if (this.slot1) this.slot1.classList.add('shake-error');

      setTimeout(() => {
        if (this.slot0) this.slot0.classList.remove('shake-error');
        if (this.slot1) this.slot1.classList.remove('shake-error');
        this.clearCode();
      }, 500);
    }
  }

  unlockPortal(immediate = false) {
    this.isUnlocked = true;
    sessionStorage.setItem('universe_unlocked', 'true');
    document.body.classList.remove('locked');

    if (immediate) {
      if (window.SceneEngine) {
        window.SceneEngine.maxUnlockedIndex = Math.max(window.SceneEngine.maxUnlockedIndex || 0, 1);
        window.SceneEngine.goToSceneId('scene-welcome');
      }
    } else {
      setTimeout(() => {
        if (window.SceneEngine) {
          window.SceneEngine.maxUnlockedIndex = Math.max(window.SceneEngine.maxUnlockedIndex || 0, 1);
          window.SceneEngine.transitionToScene(1, 'forward');
        }
        
        if (window.CosmicAudio && !window.CosmicAudio.isPlayingAmbience) {
          window.CosmicAudio.toggleAmbience();
        }

        if (window.Storyteller) {
          setTimeout(() => {
            window.Storyteller.say("Heyyy... you finally made it! Welcome to our little universe 🤍", "happy", { duration: 5000 });
          }, 600);
        }
      }, 400);
    }
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.SecretPortal = new SecretEntrance();
});
