/**
 * Visual Novel & Interactive Storybook Scene Engine
 * Manages viewport-sized scene progression, transitions, validation hooks,
 * chapter/scene indicators, and HUD navigation.
 */

class StorySceneEngine {
  constructor() {
    this.scenes = [];
    this.currentSceneIndex = 0;
    this.maxUnlockedIndex = 0;
    this.isTransitioning = false;

    this.initDOM();
  }

  initDOM() {
    this.hud = document.getElementById('storybook-hud');
    this.backBtn = document.getElementById('hud-back-btn');
    this.nextBtn = document.getElementById('hud-next-btn');
    this.chapterTitleEl = document.getElementById('hud-chapter-title');
    this.sceneIndicatorEl = document.getElementById('hud-scene-indicator');
    this.progressFillEl = document.getElementById('hud-progress-fill');
    this.mainJourney = document.getElementById('main-journey');

    // Register all scene elements in DOM
    this.refreshScenes();
    this.bindEvents();
  }

  refreshScenes() {
    const sceneElements = document.querySelectorAll('.story-scene');
    this.scenes = Array.from(sceneElements).map((el, index) => {
      return {
        element: el,
        index: index,
        chapter: el.getAttribute('data-chapter') || 'Prologue',
        chapterNum: parseInt(el.getAttribute('data-chapter-num') || '1', 10),
        sceneId: el.getAttribute('data-scene-id') || `scene-${index}`,
        validator: el.getAttribute('data-validator') || null,
        onEnterHook: el.getAttribute('data-on-enter') || null
      };
    });
  }

  bindEvents() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextScene());
    }

    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => this.prevScene());
    }

    // Keyboard navigation (ArrowRight / ArrowLeft / Space)
    window.addEventListener('keydown', (e) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        this.nextScene();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.prevScene();
      }
    });

    // Mobile Swipe Gestures
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Detect horizontal swipe if delta X > 60 and not scrolling vertically
      if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        if (diffX < 0) {
          // Swipe Left -> Next
          this.nextScene();
        } else {
          // Swipe Right -> Back
          this.prevScene();
        }
      }
    }, { passive: true });
  }

  /**
   * Start the Story Scene Engine at a specific scene (with persistence)
   * @param {number} [startIndex=null] 
   */
  start(startIndex = null) {
    this.refreshScenes();
    if (this.scenes.length === 0) return;

    // Load saved progress from localStorage
    const savedMax = parseInt(localStorage.getItem('bavya_universe_max_unlocked') || '0', 10);
    const savedCurrent = parseInt(localStorage.getItem('bavya_universe_current_scene') || '0', 10);

    this.maxUnlockedIndex = isNaN(savedMax) ? 0 : Math.min(savedMax, this.scenes.length - 1);
    
    let targetIndex = 0;
    if (startIndex !== null) {
      targetIndex = startIndex;
    } else {
      // If unlocked, resume from saved scene, otherwise start at entrance
      const isUnlocked = sessionStorage.getItem('universe_unlocked') === 'true';
      targetIndex = isUnlocked ? Math.min(savedCurrent, this.maxUnlockedIndex) : 0;
    }

    this.scenes.forEach(s => {
      s.element.classList.remove('active-scene', 'scene-entering-right', 'scene-entering-left', 'scene-exiting-left', 'scene-exiting-right');
      s.element.style.display = 'none';
    });

    this.currentSceneIndex = Math.max(0, Math.min(targetIndex, this.scenes.length - 1));
    this.renderScene(this.currentSceneIndex, 'initial');
    this.saveProgress();
  }

  saveProgress() {
    try {
      localStorage.setItem('bavya_universe_max_unlocked', this.maxUnlockedIndex.toString());
      localStorage.setItem('bavya_universe_current_scene', this.currentSceneIndex.toString());
    } catch (e) {
      // Ignore quota errors
    }
  }

  /**
   * Advance to the Next Scene with validation and smooth animation
   */
  nextScene() {
    if (this.isTransitioning) return;

    const currentScene = this.scenes[this.currentSceneIndex];
    if (!currentScene) return;

    // Run Scene Completion Validator
    if (!this.validateScene(currentScene)) {
      if (window.CosmicAudio && window.CosmicAudio.playWrongBuzz) {
        window.CosmicAudio.playWrongBuzz();
      }
      return;
    }

    if (this.currentSceneIndex >= this.scenes.length - 1) {
      // Reached the very end
      if (window.Storyteller) {
        window.Storyteller.say("You have journeyed through all the constellations! Happy Birthday, Bavya Sri! 🤍🎉", "loving");
      }
      return;
    }

    const nextIndex = this.currentSceneIndex + 1;
    this.transitionToScene(nextIndex, 'forward');
  }

  /**
   * Return to the Previous Scene (only allowed for previously visited scenes)
   */
  prevScene() {
    if (this.isTransitioning) return;
    if (this.currentSceneIndex <= 0) return;

    const prevIndex = this.currentSceneIndex - 1;
    this.transitionToScene(prevIndex, 'backward');
  }

  /**
   * Transition between scenes with elegant visual novel slide/fade
   */
  transitionToScene(targetIndex, direction = 'forward') {
    if (targetIndex < 0 || targetIndex >= this.scenes.length) return;
    if (targetIndex === this.currentSceneIndex && this.scenes[this.currentSceneIndex].element.style.display === 'flex') return;

    this.isTransitioning = true;
    const currentScene = this.scenes[this.currentSceneIndex];
    const targetScene = this.scenes[targetIndex];

    if (window.CosmicAudio && window.CosmicAudio.playKeypadClick) {
      window.CosmicAudio.playKeypadClick();
    }

    // Prepare target scene
    targetScene.element.style.display = 'flex';
    targetScene.element.classList.add(direction === 'forward' ? 'scene-entering-right' : 'scene-entering-left');
    
    if (currentScene && currentScene.element !== targetScene.element) {
      currentScene.element.classList.add(direction === 'forward' ? 'scene-exiting-left' : 'scene-exiting-right');
    }

    setTimeout(() => {
      if (currentScene && currentScene.element !== targetScene.element) {
        currentScene.element.classList.remove('active-scene', 'scene-exiting-left', 'scene-exiting-right');
        currentScene.element.style.display = 'none';
      }

      targetScene.element.classList.remove('scene-entering-right', 'scene-entering-left');
      targetScene.element.classList.add('active-scene');

      this.currentSceneIndex = targetIndex;
      this.maxUnlockedIndex = Math.max(this.maxUnlockedIndex, this.currentSceneIndex);
      this.saveProgress();

      this.updateHUD();
      this.executeEnterHook(targetScene);

      // Scroll smoothly to top of the scene
      window.scrollTo({ top: 0, behavior: 'smooth' });

      this.isTransitioning = false;
    }, 400);
  }

  renderScene(index, mode = 'initial') {
    const scene = this.scenes[index];
    if (!scene) return;

    scene.element.style.display = 'flex';
    scene.element.classList.add('active-scene');
    this.updateHUD();
    this.executeEnterHook(scene);
  }

  /**
   * Update the bottom Storybook HUD
   */
  updateHUD() {
    const scene = this.scenes[this.currentSceneIndex];
    if (!scene) return;

    // Filter scenes in current chapter for relative count
    const chapterScenes = this.scenes.filter(s => s.chapterNum === scene.chapterNum);
    const sceneNumInChapter = chapterScenes.findIndex(s => s.index === scene.index) + 1;
    const totalInChapter = chapterScenes.length;

    if (this.chapterTitleEl) {
      this.chapterTitleEl.innerText = scene.chapter;
    }

    if (this.sceneIndicatorEl) {
      this.sceneIndicatorEl.innerText = `Scene ${sceneNumInChapter} of ${totalInChapter}`;
    }

    if (this.progressFillEl) {
      const overallPercent = ((this.currentSceneIndex + 1) / this.scenes.length) * 100;
      this.progressFillEl.style.width = `${overallPercent}%`;
    }

    if (this.backBtn) {
      this.backBtn.disabled = this.currentSceneIndex === 0;
      this.backBtn.style.opacity = this.currentSceneIndex === 0 ? '0.4' : '1';
    }

    if (this.nextBtn) {
      const isLast = this.currentSceneIndex === this.scenes.length - 1;
      this.nextBtn.innerHTML = isLast 
        ? `<span>Finish</span> ✦` 
        : `<span>Next</span> <span class="btn-arrow">→</span>`;
    }
  }

  setValidatorState(validatorName, state = true) {
    if (!this.validatorStates) this.validatorStates = {};
    this.validatorStates[validatorName] = state;
  }

  /**
   * Scene Completion Validation
   */
  validateScene(scene) {
    if (!scene.validator) return true;

    if (scene.validator === 'secret-entrance') {
      const isUnlocked = sessionStorage.getItem('universe_unlocked') === 'true';
      if (!isUnlocked) {
        if (window.Storyteller) {
          window.Storyteller.say("Enter the secret 2-digit celestial passcode to unlock your universe! 🔑", "playful");
        }
        return false;
      }
      return true;
    }

    if (scene.validator === 'quiz-answered') {
      if (window.CoupleQuiz && !window.CoupleQuiz.hasAnswered) {
        if (window.Storyteller) {
          window.Storyteller.say("Please pick an answer before turning the page! 😉", "thinking");
        }
        return false;
      }
      return true;
    }

    if (scene.validator === 'letter-unsealed') {
      const parchment = document.getElementById('parchment-body-container');
      const isUnrolled = parchment && parchment.classList.contains('parchment-unrolled');
      if (!isUnrolled) {
        if (window.Storyteller) {
          window.Storyteller.say("Break the wax seal first to unroll and read the letter! 📜🤍", "loving");
        }
        return false;
      }
      return true;
    }

    return true;
  }

  /**
   * Execute contextual hook when a scene becomes active
   */
  executeEnterHook(scene) {
    if (!scene.onEnterHook) return;

    if (scene.onEnterHook === 'welcome-storyteller') {
      if (window.Storyteller) {
        setTimeout(() => {
          window.Storyteller.say("Welcome to our little universe! Tap Next → whenever you're ready to turn the page 🤍", "happy", { duration: 4500 });
        }, 500);
      }
    } else if (scene.onEnterHook === 'quiz-start') {
      if (window.CoupleQuiz) {
        window.CoupleQuiz.loadQuestion(0);
      }
    } else if (scene.onEnterHook === 'reasons-intro') {
      if (window.Storyteller) {
        setTimeout(() => {
          window.Storyteller.say("Here are some of the infinite reasons why I love you so much 💌", "loving", { duration: 3500 });
        }, 400);
      }
    } else if (scene.onEnterHook === 'what-if-start') {
      if (window.WhatIf) {
        window.WhatIf.loadQuestion(window.WhatIf.currentIndex || 0);
      }
    } else if (scene.onEnterHook === 'letter-intro') {
      if (window.Storyteller) {
        setTimeout(() => {
          window.Storyteller.say("A special vintage parchment sealed just for you... Tap the wax seal to open it 📜", "loving", { duration: 4000 });
        }, 400);
      }
    }
  }

  /**
   * Jump directly to a specific scene by Scene ID or index (if unlocked)
   */
  goToSceneId(sceneId) {
    const targetIdx = this.scenes.findIndex(s => s.sceneId === sceneId);
    if (targetIdx === -1) return;

    this.maxUnlockedIndex = Math.max(this.maxUnlockedIndex, targetIdx);
    this.transitionToScene(targetIdx, targetIdx > this.currentSceneIndex ? 'forward' : 'backward');
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.SceneEngine = new StorySceneEngine();
  window.SceneEngine.start();
});
