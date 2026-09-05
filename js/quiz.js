/**
 * Couple Quiz Interactive Engine
 * Sourced directly from 03 - Quiz/Couple Quiz.md
 * Features 10 personalized questions, dynamic feedback, and the Question 9 escaping button.
 */

class CoupleQuizEngine {
  constructor() {
    this.questions = UniverseConfig.quizQuestions;
    this.currentIndex = 0;
    this.score = 0;
    this.hasAnswered = false;

    // DOM Elements
    this.qNumSpan = document.getElementById('quiz-current-num');
    this.totalNumSpan = document.getElementById('quiz-total-num');
    this.scoreSpan = document.getElementById('quiz-score');
    this.progressBar = document.getElementById('quiz-progress-bar');
    this.questionText = document.getElementById('quiz-question-text');
    this.optionsGrid = document.getElementById('quiz-options-grid');
    this.feedbackBox = document.getElementById('quiz-feedback-box');
    this.feedbackText = document.getElementById('quiz-feedback-text');
    this.nextBtn = document.getElementById('quiz-next-btn');
    
    this.cardContainer = document.getElementById('quiz-card-container');
    this.resultsContainer = document.getElementById('quiz-results-container');
    this.finalScoreSpan = document.getElementById('quiz-final-score');
    this.evaluationText = document.getElementById('quiz-score-evaluation');
    this.restartBtn = document.getElementById('quiz-restart-btn');

    this.init();
  }

  init() {
    if (this.totalNumSpan) this.totalNumSpan.innerText = this.questions.length;
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextQuestion());
    }

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => this.restartQuiz());
    }

    this.loadQuestion(0);
  }

  loadQuestion(index) {
    this.currentIndex = index;
    this.hasAnswered = false;
    const q = this.questions[index];

    if (this.qNumSpan) this.qNumSpan.innerText = index + 1;
    if (this.progressBar) {
      const pct = ((index) / this.questions.length) * 100;
      this.progressBar.style.width = `${pct}%`;
    }

    if (this.questionText) this.questionText.innerText = q.question;
    if (this.feedbackBox) this.feedbackBox.classList.add('hidden');
    if (this.optionsGrid) this.optionsGrid.innerHTML = '';

    q.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `
        <span class="opt-prefix">${opt.label}</span>
        <span class="opt-text">${opt.text}</span>
      `;

      // Special Mechanic for Question 9: Escaping button
      if (q.isEscapingQuestion && opt.isDodging) {
        btn.id = 'dodging-quiz-btn';
        btn.style.position = 'relative';
        btn.style.transition = 'transform 0.15s ease-out';

        const dodgeHandler = (e) => {
          if (this.hasAnswered) return;
          const randomX = (Math.random() - 0.5) * 180;
          const randomY = (Math.random() - 0.5) * 80;
          btn.style.transform = `translate(${randomX}px, ${randomY}px)`;
          if (window.Storyteller && !window.Storyteller.isVisible) {
            window.Storyteller.say("Heyyy where are you trying to click? You know the answer is B! 😂", "playful", { duration: 2500 });
          }
        };

        btn.addEventListener('mouseenter', dodgeHandler);
        btn.addEventListener('touchstart', dodgeHandler, { passive: true });
      }

      btn.addEventListener('click', () => this.selectOption(btn, opt, q));
      this.optionsGrid.appendChild(btn);
    });
  }

  selectOption(buttonEl, option, question) {
    if (this.hasAnswered) return;

    if (option.isCorrect) {
      this.hasAnswered = true;
      buttonEl.classList.add('correct');
      const allButtons = this.optionsGrid.querySelectorAll('.quiz-opt-btn');
      allButtons.forEach(b => b.disabled = true);

      this.score++;
      if (this.scoreSpan) this.scoreSpan.innerText = this.score;
      if (window.CosmicAudio) window.CosmicAudio.playCorrectChime();
      
      this.showFeedback(question.correctMsg, true);

      if (window.Storyteller) {
        const expression = question.isEscapingQuestion ? "playful" : "excited";
        window.Storyteller.say(question.correctMsg || "Yayyy! You got it right! 🤍", expression, { duration: 3500 });
      }
    } else {
      buttonEl.classList.add('wrong');
      buttonEl.disabled = true;
      if (window.CosmicAudio) window.CosmicAudio.playWrongBuzz();

      this.showFeedback(question.wrongMsg || "Nalla yosichu paaru... try another one! 😂", false);

      if (window.Storyteller) {
        window.Storyteller.say(question.wrongMsg || "Nalla yosichu paaru... try again! 😂", "thinking", { duration: 2800 });
      }
    }
  }

  showFeedback(message, isCorrect) {
    if (!this.feedbackBox || !this.feedbackText) return;
    this.feedbackText.innerText = message;
    this.feedbackBox.classList.remove('hidden');

    if (this.currentIndex === this.questions.length - 1) {
      if (this.nextBtn) this.nextBtn.innerText = "View Results 🏆";
    } else {
      if (this.nextBtn) this.nextBtn.innerText = "Next Question →";
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.loadQuestion(this.currentIndex + 1);
    } else {
      this.showResults();
    }
  }

  showResults() {
    if (this.cardContainer) this.cardContainer.classList.add('hidden');
    if (this.resultsContainer) this.resultsContainer.classList.remove('hidden');
    if (this.progressBar) this.progressBar.style.width = '100%';

    if (this.finalScoreSpan) this.finalScoreSpan.innerText = this.score;

    // Evaluation text based on vault notes (0-3: good, 4-6: excellent, 7-8: poduuuu, 9-10: chikkom)
    let evalMsg = "chikkom! You know our story by heart. 🤍";
    let evalExpr = "wow";
    if (this.score <= 3) {
      evalMsg = "Good start! But we definitely need to refresh some memories 😉";
      evalExpr = "playful";
    } else if (this.score <= 6) {
      evalMsg = "Excellent! You remember so many precious moments ✨";
      evalExpr = "happy";
    } else if (this.score <= 8) {
      evalMsg = "Poduuuu! You really paid attention to every detail 🤍";
      evalExpr = "excited";
    }
    
    if (this.evaluationText) this.evaluationText.innerText = evalMsg;
    if (window.CosmicAudio) window.CosmicAudio.playUnlockBlast();
    if (window.Storyteller) {
      setTimeout(() => {
        window.Storyteller.say(evalMsg, evalExpr, { duration: 4000 });
      }, 400);
    }
  }

  restartQuiz() {
    this.score = 0;
    if (this.scoreSpan) this.scoreSpan.innerText = 0;
    if (this.cardContainer) this.cardContainer.classList.remove('hidden');
    if (this.resultsContainer) this.resultsContainer.classList.add('hidden');
    this.loadQuestion(0);
  }
}

// Global instance
window.addEventListener('DOMContentLoaded', () => {
  window.CoupleQuiz = new CoupleQuizEngine();
});
