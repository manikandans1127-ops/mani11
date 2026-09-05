/**
 * Romantic Mini-Games Engine
 * Sourced directly from 04 - Games/Game Ideas.md
 * Features:
 * 1. Heart Catcher (Canvas arcade + Tamil Poetry Reward)
 * 2. Memory Match (Constellation cards + Movie Date Reward)
 * 3. Who Said It? (Inside joke conversation guesser)
 */

class MiniGamesHub {
  constructor() {
    this.modal = document.getElementById('game-modal');
    this.modalTitle = document.getElementById('modal-game-title');
    this.modalBody = document.getElementById('modal-game-body');
    this.closeBtn = document.getElementById('close-game-btn');

    this.activeGame = null;
    this.gameLoopId = null;

    this.init();
  }

  init() {
    const startBtns = document.querySelectorAll('.start-game-btn');
    startBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const gameType = btn.getAttribute('data-game');
        this.openGame(gameType);
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }

    const backdrop = this.modal ? this.modal.querySelector('.modal-backdrop') : null;
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeModal());
    }
  }

  openGame(gameType) {
    if (!this.modal || !this.modalBody) return;
    this.modal.classList.remove('hidden');

    if (gameType === 'heart-catcher') {
      this.startHeartCatcher();
    } else if (gameType === 'memory-match') {
      this.startMemoryMatch();
    } else if (gameType === 'who-said-it') {
      this.startWhoSaidIt();
    }
  }

  closeModal() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
    if (this.modal) this.modal.classList.add('hidden');
    if (this.modalBody) this.modalBody.innerHTML = '';
  }

  /* ------------------------------------------------------------------------
     1. Heart Catcher Mini-Game
     ------------------------------------------------------------------------ */
  startHeartCatcher() {
    this.modalTitle.innerText = "💖 Starlight Heart Catcher";
    this.modalBody.innerHTML = `
      <div class="game-play-area text-center">
        <div class="game-hud-bar" style="display:flex; justify-content:space-between; margin-bottom:10px; color:#fda4af; font-weight:600;">
          <span>Score: <span id="catcher-score">0</span> / 100</span>
          <span>Goal: Catch 10 Hearts</span>
        </div>
        <canvas id="catcher-canvas" width="400" height="320" style="width:100%; max-width:400px; height:320px; background:rgba(0,0,0,0.5); border:1px solid rgba(253,164,175,0.3); border-radius:12px; touch-action:none;"></canvas>
        <p style="font-size:0.85rem; color:rgba(255,255,255,0.6); margin-top:10px;">Drag or move cursor left & right to catch falling pink hearts!</p>
      </div>
    `;

    const canvas = document.getElementById('catcher-canvas');
    const ctx = canvas.getContext('2d');
    const scoreSpan = document.getElementById('catcher-score');

    let score = 0;
    const basket = { x: 170, y: 280, width: 60, height: 20 };
    const items = [];

    const spawnItem = () => {
      if (items.length < 5) {
        items.push({
          x: Math.random() * (canvas.width - 30) + 15,
          y: -20,
          radius: 12,
          speed: Math.random() * 2 + 2,
          symbol: Math.random() > 0.3 ? '💖' : '✨'
        });
      }
    };

    const handleInput = (clientX) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      basket.x = (clientX - rect.left) * scaleX - basket.width / 2;
      if (basket.x < 0) basket.x = 0;
      if (basket.x > canvas.width - basket.width) basket.x = canvas.width - basket.width;
    };

    canvas.addEventListener('mousemove', (e) => handleInput(e.clientX));
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) handleInput(e.touches[0].clientX);
    }, { passive: true });

    let spawnTimer = setInterval(spawnItem, 600);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Basket
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.roundRect(basket.x, basket.y, basket.width, basket.height, 8);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '12px Outfit';
      ctx.fillText('Love', basket.x + 18, basket.y + 14);

      // Draw Falling Items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;

        ctx.font = '20px serif';
        ctx.fillText(item.symbol, item.x - 10, item.y + 7);

        // Check Collision with Basket
        if (
          item.y + item.radius >= basket.y &&
          item.x >= basket.x &&
          item.x <= basket.x + basket.width
        ) {
          score += 10;
          scoreSpan.innerText = score;
          if (window.CosmicAudio) window.CosmicAudio.playCorrectChime();
          items.splice(i, 1);

          if (score >= 100) {
            clearInterval(spawnTimer);
            this.winHeartCatcher();
            return;
          }
          continue;
        }

        if (item.y > canvas.height + 20) {
          items.splice(i, 1);
        }
      }

      this.gameLoopId = requestAnimationFrame(render);
    };

    this.gameLoopId = requestAnimationFrame(render);
  }

  winHeartCatcher() {
    this.modalBody.innerHTML = `
      <div class="game-reward-box text-center" style="padding:1.5rem 0;">
        <div style="font-size:3rem; margin-bottom:1rem;">🎉 💖 🌟</div>
        <h3 style="font-size:1.6rem; color:#fff; margin-bottom:0.8rem;">Heart Catcher Mastered!</h3>
        <p style="color:var(--pink-200); font-size:1rem; margin-bottom:1.5rem;">You unlocked the hidden romantic poetry:</p>
        
        <blockquote style="padding:1.4rem; background:rgba(244,63,94,0.12); border-left:3px solid var(--pink-400); border-radius:12px; font-family:var(--font-display); font-size:1.25rem; font-style:italic; color:#fff; line-height:1.8; margin-bottom:1.8rem;">
          ${UniverseConfig.games.heartCatcherReward}
        </blockquote>

        <button class="cosmic-btn primary-btn" onclick="window.MiniGames.closeModal()">Keep Exploring ✦</button>
      </div>
    `;
    if (window.CosmicAudio) window.CosmicAudio.playUnlockBlast();
    if (window.EasterEggs) window.EasterEggs.showToast("Poetry Unlocked 💌", "Secret Tamil poem discovered!");
    if (window.Storyteller) {
      window.Storyteller.say("Heart Catcher Mastered! The secret poetry is unlocked for you 💖✨", "wow", { duration: 4000 });
    }
  }

  /* ------------------------------------------------------------------------
     2. Memory Match Mini-Game
     ------------------------------------------------------------------------ */
  startMemoryMatch() {
    this.modalTitle.innerText = "🃏 Constellation Memory Match";
    const symbols = ['💖', '⚽', '🎬', '🌹', '💖', '⚽', '🎬', '🌹'].sort(() => Math.random() - 0.5);

    let html = `
      <div class="memory-grid" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; max-width:360px; margin:1.5rem auto;">
    `;

    symbols.forEach((sym, idx) => {
      html += `
        <button class="memory-card" data-symbol="${sym}" data-idx="${idx}" style="height:75px; background:rgba(255,255,255,0.06); border:1px solid rgba(253,164,175,0.3); border-radius:10px; font-size:1.8rem; display:flex; align-items:center; justify-content:center; color:transparent; transition:all 0.3s ease;">
          ${sym}
        </button>
      `;
    });

    html += `</div>
      <p class="text-center" style="font-size:0.85rem; color:var(--text-muted);">Match all 4 pairs to reveal the memory reward!</p>
    `;

    this.modalBody.innerHTML = html;

    const cards = this.modalBody.querySelectorAll('.memory-card');
    let flipped = [];
    let matchedCount = 0;

    cards.forEach(card => {
      card.addEventListener('click', () => {
        if (flipped.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
          card.classList.add('flipped');
          card.style.color = '#fff';
          card.style.background = 'rgba(244,63,94,0.3)';
          card.style.borderColor = 'var(--pink-400)';
          flipped.push(card);

          if (flipped.length === 2) {
            const sym1 = flipped[0].getAttribute('data-symbol');
            const sym2 = flipped[1].getAttribute('data-symbol');

            if (sym1 === sym2) {
              flipped[0].classList.add('matched');
              flipped[1].classList.add('matched');
              matchedCount += 2;
              if (window.CosmicAudio) window.CosmicAudio.playCorrectChime();
              flipped = [];

              if (matchedCount === symbols.length) {
                setTimeout(() => this.winMemoryMatch(), 500);
              }
            } else {
              if (window.CosmicAudio) window.CosmicAudio.playWrongBuzz();
              setTimeout(() => {
                flipped.forEach(c => {
                  c.classList.remove('flipped');
                  c.style.color = 'transparent';
                  c.style.background = 'rgba(255,255,255,0.06)';
                  c.style.borderColor = 'rgba(253,164,175,0.3)';
                });
                flipped = [];
              }, 800);
            }
          }
        }
      });
    });
  }

  winMemoryMatch() {
    this.modalBody.innerHTML = `
      <div class="game-reward-box text-center" style="padding:1rem 0;">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🏆 🎬 ⚽</div>
        <h3 style="font-size:1.5rem; color:#fff; margin-bottom:0.4rem;">Memory Constellation Aligned!</h3>
        <p style="color:var(--pink-200); font-size:0.95rem; margin-bottom:1rem;">You unlocked our movie date memory:</p>
        
        <div style="padding:1rem; background:rgba(255,255,255,0.06); border-radius:12px; border:1px dashed var(--pink-400); margin-bottom:1.2rem; font-size:1.05rem; color:#fff;">
          ${UniverseConfig.games.memoryMatchReward}
        </div>

        <div style="margin-bottom:1.5rem; border-radius:12px; overflow:hidden; border:1px solid rgba(253,164,175,0.4); cursor:pointer;" onclick="window.openPhotoModal('${UniverseConfig.games.memoryMatchPhoto}', 'Our Movie Date — Messi & Neymar Jerseys')">
          <img src="${UniverseConfig.games.memoryMatchPhoto}" alt="Movie Date Football Jersey" style="width:100%; max-height:220px; object-fit:cover; display:block;">
          <div style="font-size:0.75rem; color:var(--pink-200); padding:4px 8px; background:rgba(10,4,15,0.85);">🔍 Tap to view full size</div>
        </div>

        <button class="cosmic-btn primary-btn" onclick="window.MiniGames.closeModal()">Back to Journey ✦</button>
      </div>
    `;
    if (window.CosmicAudio) window.CosmicAudio.playUnlockBlast();
    if (window.EasterEggs) window.EasterEggs.showToast("Memory Unlocked 🎬", "Movie date story revealed!");
    if (window.Storyteller) {
      window.Storyteller.say("You matched all the memory constellations! 🎬⚽", "excited", { duration: 4000 });
    }
  }

  /* ------------------------------------------------------------------------
     3. Who Said It? Mini-Game
     ------------------------------------------------------------------------ */
  startWhoSaidIt() {
    this.modalTitle.innerText = "💬 Who Said It?";
    this.modalBody.innerHTML = `
      <div class="who-said-container text-center" style="padding:1rem 0;">
        <div style="font-size:2rem; margin-bottom:0.5rem;">🗣️</div>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">Guess who playfully said this during our conversations:</p>
        
        <blockquote style="font-family:var(--font-display); font-size:1.8rem; font-style:italic; color:#fff; padding:1.2rem; background:rgba(244,63,94,0.1); border-radius:12px; border:1px solid var(--border-glass-pink); margin-bottom:2rem;">
          “Let's break up”
        </blockquote>

        <div style="display:flex; justify-content:center; gap:1.2rem; flex-wrap:wrap; margin-bottom:1.5rem;">
          <button id="who-me-btn" class="cosmic-btn secondary-btn" style="min-width:140px;">Me (Malfoy)</button>
          <button id="who-bavya-btn" class="cosmic-btn primary-btn" style="min-width:140px;">Bavya Sri</button>
        </div>

        <div id="who-reaction-box" class="hidden" style="margin-top:1.5rem; padding:1.2rem; background:rgba(255,255,255,0.05); border-radius:12px;">
          <p id="who-reaction-text" style="font-size:1.15rem; color:var(--pink-200); margin-bottom:1.2rem; font-family:var(--font-display); font-style:italic;"></p>
          <button class="cosmic-btn primary-btn btn-sm" onclick="window.MiniGames.closeModal()">Awesome 😂</button>
        </div>
      </div>
    `;

    const meBtn = document.getElementById('who-me-btn');
    const bavyaBtn = document.getElementById('who-bavya-btn');
    const reactionBox = document.getElementById('who-reaction-box');
    const reactionText = document.getElementById('who-reaction-text');

    const handleChoice = (isBavya) => {
      meBtn.disabled = true;
      bavyaBtn.disabled = true;
      reactionBox.classList.remove('hidden');

      if (isBavya) {
        reactionText.innerHTML = `
          <span>Correct! But when asked later, you immediately reply: <strong>'Na epo sonnen!'</strong> 😂🤍</span>
          <div style="margin-top:0.8rem; border-radius:12px; overflow:hidden; border:1px solid rgba(253,164,175,0.3); cursor:pointer;" onclick="window.openPhotoModal('${UniverseConfig.games.whoSaidItPhoto}', 'Na epo sonnen! 😂')">
            <img src="${UniverseConfig.games.whoSaidItPhoto}" alt="Who Said It" style="width:100%; max-height:180px; object-fit:cover; display:block;">
          </div>
        `;
        if (window.CosmicAudio) window.CosmicAudio.playCorrectChime();
        if (window.EasterEggs) window.EasterEggs.showToast("Inside Joke Revealed 😂", "Na epo sonnen!");
        if (window.Storyteller) {
          window.Storyteller.say("Correct! But when asked later, you immediately reply: 'Na epo sonnen!' 😂🤍", "playful", { duration: 4000 });
        }
      } else {
        reactionText.innerText = "Nope! It was you, Bavya... though you always pretend: 'Na epo sonnen!' 🤭";
        if (window.CosmicAudio) window.CosmicAudio.playWrongBuzz();
        if (window.Storyteller) {
          window.Storyteller.say("Nope! It was you, Bavya... though you always pretend: 'Na epo sonnen!' 🤭", "playful", { duration: 4000 });
        }
      }
    };

    meBtn.addEventListener('click', () => handleChoice(false));
    bavyaBtn.addEventListener('click', () => handleChoice(true));
  }
}

// Global instance
window.addEventListener('DOMContentLoaded', () => {
  window.MiniGames = new MiniGamesHub();
});
