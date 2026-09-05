/**
 * Main Application Coordinator & Content Renderer
 * Connects all sections and renders authentic Obsidian vault content with real photos.
 */

// Global Lightbox Utility
window.openPhotoModal = function(src, caption) {
  let modal = document.getElementById('global-lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'global-lightbox-modal';
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close-btn" id="lightbox-close-btn" aria-label="Close photo">&times;</button>
        <img src="" alt="Enlarged photo" class="lightbox-img" id="lightbox-img">
        <div class="lightbox-caption" id="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeHandler = () => modal.classList.remove('active');
    modal.querySelector('#lightbox-close-btn').addEventListener('click', closeHandler);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeHandler();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeHandler();
    });
  }

  const imgEl = modal.querySelector('#lightbox-img');
  const capEl = modal.querySelector('#lightbox-caption');
  imgEl.src = src;
  capEl.innerText = caption || '';
  modal.classList.add('active');
};

class ApplicationCoordinator {
  constructor() {
    this.initDOM();
    this.renderTimeline();
    this.renderSoundtrack();
    this.renderPlaces('been');
    this.renderReasons('all');
    this.initPlacesTabs();
    this.initReasonsFilters();
    this.initBirthdayLetter();
    this.initFinale();
  }

  initDOM() {
    this.nav = document.getElementById('journey-nav');
    this.progressFill = document.getElementById('journey-progress-fill');
    this.progressText = document.getElementById('journey-progress-text');
  }

  /* ------------------------------------------------------------------------
     1. Dynamic Content Renderers
     ------------------------------------------------------------------------ */
  renderTimeline() {
    const listEl = document.getElementById('timeline-nodes-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    UniverseConfig.timeline.forEach((item, index) => {
      const node = document.createElement('div');
      node.className = 'timeline-node';
      node.innerHTML = `
        <div class="node-star-marker">${item.icon || '✧'}</div>
        <div class="node-card glass-panel">
          <div class="node-date">${item.date}</div>
          <h4 class="node-title">${item.title}</h4>
          <p class="node-desc">${item.desc}</p>
          ${item.photo ? `
            <div class="timeline-photo-wrapper">
              <div class="timeline-photo-card" onclick="window.openPhotoModal('${item.photo}', '${item.date}: ${item.title}')">
                <img src="${item.photo}" alt="${item.title}" loading="lazy" class="timeline-img">
                <div class="photo-zoom-hint">🔍 Tap to view photo</div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
      listEl.appendChild(node);
    });
  }

  renderSoundtrack() {
    const gridEl = document.getElementById('songs-grid');
    if (!gridEl || !UniverseConfig.soundtrack || !UniverseConfig.soundtrack.songs) return;
    gridEl.innerHTML = '';

    UniverseConfig.soundtrack.songs.forEach(song => {
      const card = document.createElement('div');
      card.className = 'song-card glass-panel';
      card.innerHTML = `
        <div class="song-card-header">
          <div class="song-info-box">
            <h4 class="song-title-text">${song.title}</h4>
            <span class="song-artist-text">${song.artist}</span>
          </div>
          <span class="song-category-tag">${song.category}</span>
        </div>
        <p class="song-why-text">${song.why}</p>
        ${song.lyrics ? `<div class="song-lyrics-quote">${song.lyrics}</div>` : ''}
        <div class="song-actions-row">
          <button class="song-play-btn" data-song-id="${song.id}" onclick="window.CosmicAudio.toggleSongPlay('${song.id}', '${song.title.replace(/'/g, "\\'")}', this)">
            <span>▶</span> <span>Play</span>
          </button>
        </div>
      `;
      gridEl.appendChild(card);
    });
  }

  renderPlaces(category = 'been') {
    const gridEl = document.getElementById('places-grid-container');
    if (!gridEl || !UniverseConfig.places) return;
    gridEl.innerHTML = '';

    const items = UniverseConfig.places[category] || [];

    items.forEach(place => {
      const card = document.createElement('div');
      card.className = `place-card-detailed glass-panel ${category === 'future' ? 'future-card' : ''}`;

      if (category === 'been') {
        card.innerHTML = `
          <h4 class="place-title">📍 ${place.name}</h4>
          <div class="place-meta">📅 ${place.date} · 👥 ${place.who}</div>
          <p class="place-desc"><strong>What happened:</strong> ${place.what}</p>
          <div class="place-memory-box">
            <strong>Favorite Memory:</strong> ${place.memory}
          </div>
          ${place.photo ? `
            <div class="place-real-photo-box" onclick="window.openPhotoModal('${place.photo}', '${place.name}')">
              <img src="${place.photo}" alt="${place.name}" loading="lazy" class="place-real-img">
              <div class="photo-zoom-hint">🔍 Tap to enlarge</div>
            </div>
          ` : ''}
        `;
      } else if (category === 'love') {
        card.innerHTML = `
          <h4 class="place-title">💖 ${place.name}</h4>
          <p class="place-desc"><strong>Why we love it:</strong> ${place.why}</p>
          <div class="place-memory-box">
            <strong>Memory Connected:</strong> ${place.memory}
          </div>
          ${place.photo ? `
            <div class="place-real-photo-box" onclick="window.openPhotoModal('${place.photo}', '${place.name}')">
              <img src="${place.photo}" alt="${place.name}" loading="lazy" class="place-real-img">
              <div class="photo-zoom-hint">🔍 Tap to enlarge</div>
            </div>
          ` : ''}
        `;
      } else if (category === 'future') {
        card.innerHTML = `
          <h4 class="place-title">✈️ ${place.name}</h4>
          <p class="place-desc">${place.why}</p>
        `;
      }

      gridEl.appendChild(card);
    });
  }

  initPlacesTabs() {
    const tabBtns = document.querySelectorAll('.places-tab-nav .tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const pane = btn.getAttribute('data-pane');
        this.renderPlaces(pane);
      });
    });
  }

  renderReasons(filterCategory = 'all') {
    const deckEl = document.getElementById('reasons-deck');
    if (!deckEl || !UniverseConfig.reasons) return;
    deckEl.innerHTML = '';

    let items = [];
    if (filterCategory === 'all') {
      items = [
        ...UniverseConfig.reasons.core.map(t => ({ text: t, type: 'Core Reason' })),
        ...UniverseConfig.reasons.quirks.map(t => ({ text: t, type: 'Little Quirk' })),
        ...UniverseConfig.reasons.notice.map(t => ({ text: t, type: 'Things I Notice' }))
      ];
    } else if (filterCategory === 'core') {
      items = UniverseConfig.reasons.core.map(t => ({ text: t, type: 'Core Reason' }));
    } else if (filterCategory === 'quirks') {
      items = UniverseConfig.reasons.quirks.map(t => ({ text: t, type: 'Little Quirk' }));
    } else if (filterCategory === 'notice') {
      items = UniverseConfig.reasons.notice.map(t => ({ text: t, type: 'Things I Notice' }));
    }

    items.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'reason-card glass-panel';
      card.style.cssText = "padding: 1.2rem; border-radius: 12px; border-left: 3px solid var(--pink-400); text-align: left;";
      card.innerHTML = `
        <div style="font-size:0.75rem; color:var(--pink-300); font-weight:600; text-transform:uppercase; margin-bottom:0.4rem;">
          ${item.type} #${idx + 1} ✦
        </div>
        <p style="font-size:0.95rem; color:#fff; line-height:1.5;">${item.text}</p>
      `;
      deckEl.appendChild(card);
    });
  }

  initReasonsFilters() {
    const filterBtns = document.querySelectorAll('.reasons-filters .filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-category');
        this.renderReasons(filter);
      });
    });
  }

  initBirthdayLetter() {
    const sealBtn = document.getElementById('wax-seal-btn');
    const sealWrapper = document.getElementById('wax-seal-wrapper');
    const parchmentBody = document.getElementById('parchment-body-container');
    const letterHint = document.getElementById('wax-seal-hint');

    if (sealBtn && parchmentBody) {
      sealBtn.addEventListener('click', () => {
        if (window.CosmicAudio) window.CosmicAudio.playWaxSealBreak();
        sealBtn.classList.add('broken');
        
        setTimeout(() => {
          if (sealWrapper) sealWrapper.style.display = 'none';
          parchmentBody.classList.remove('parchment-rolled');
          parchmentBody.classList.add('parchment-unrolled');
          
          if (window.SceneEngine) {
            window.SceneEngine.setValidatorState('letter-unsealed', true);
          }

          if (window.Storyteller) {
            window.Storyteller.say("Here is my heartfelt letter written for your special day... 💌🤍", "loving", { duration: 4500 });
          }
        }, 500);
      });
    }
  }

  initFinale() {
    const fakeBtn = document.getElementById('reveal-true-finale-btn');
    if (fakeBtn) {
      fakeBtn.addEventListener('click', () => {
        if (window.CosmicAudio) window.CosmicAudio.playUnlockBlast();
        if (window.SceneEngine) {
          window.SceneEngine.nextScene();
        }
      });
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.AppCoordinator = new ApplicationCoordinator();
});
