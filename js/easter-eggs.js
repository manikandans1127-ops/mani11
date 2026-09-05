/**
 * Easter Egg System & Secret Clues Manager
 * Sourced directly from 08 - Secrets & Easter Eggs/Hidden Easter Eggs.md
 */

class EasterEggManager {
  constructor() {
    this.toast = document.getElementById('cosmic-toast');
    this.toastTitle = document.getElementById('toast-title');
    this.toastMsg = document.getElementById('toast-msg');
    this.toastTimer = null;

    this.currentQuoteIndex = 0;
    this.quotes = UniverseConfig.hiddenQuotes;

    this.initPillEasterEgg();
    this.initQuotesCarousel();
    this.initCluesModal();
  }

  showToast(title, message) {
    if (!this.toast) return;
    if (this.toastTimer) clearTimeout(this.toastTimer);

    if (this.toastTitle) this.toastTitle.innerText = title;
    if (this.toastMsg) this.toastMsg.innerText = message;

    this.toast.classList.remove('hidden');

    this.toastTimer = setTimeout(() => {
      this.toast.classList.add('hidden');
    }, 4000);
  }

  initPillEasterEgg() {
    const pillTrigger = document.getElementById('pill-easter-trigger');
    const pillStatus = document.getElementById('egg-pill-status');

    if (pillTrigger) {
      pillTrigger.addEventListener('click', () => {
        if (window.CosmicAudio) window.CosmicAudio.playUnlockBlast();
        
        this.showToast(
          "💊 Secret Memory Unlocked!",
          "“Do you need a tablet?” — Yeah... I still haven't recovered from that embarrassment! 😭🤍"
        );

        if (window.Storyteller) {
          window.Storyteller.say("“Do you need a tablet?” — Yeah... I still haven't recovered from that embarrassment! 😭🤍", "playful", { duration: 4500 });
        }

        if (pillStatus) {
          pillStatus.innerText = "Status: Unlocked ✦ (Bus Tablet Memory)";
          pillStatus.className = "secret-status unlocked-status";
        }
      });
    }
  }

  initQuotesCarousel() {
    const quoteText = document.getElementById('hidden-message-text');
    const prevBtn = document.getElementById('prev-quote-btn');
    const nextBtn = document.getElementById('next-quote-btn');
    const indicator = document.getElementById('quote-index-indicator');

    const updateQuote = (idx) => {
      this.currentQuoteIndex = (idx + this.quotes.length) % this.quotes.length;
      if (quoteText) {
        quoteText.style.opacity = '0';
        setTimeout(() => {
          quoteText.innerText = this.quotes[this.currentQuoteIndex];
          quoteText.style.opacity = '1';
        }, 200);
      }
      if (indicator) {
        indicator.innerText = `${this.currentQuoteIndex + 1} / ${this.quotes.length}`;
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => updateQuote(this.currentQuoteIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => updateQuote(this.currentQuoteIndex + 1));
    }
  }

  initCluesModal() {
    const cluesBtn = document.getElementById('open-clues-btn');
    if (cluesBtn) {
      cluesBtn.addEventListener('click', () => {
        if (window.AppCoordinator) {
          window.AppCoordinator.showSection('section-secrets');
        }
      });
    }
  }
}

// Global instance
window.addEventListener('DOMContentLoaded', () => {
  window.EasterEggs = new EasterEggManager();
});
