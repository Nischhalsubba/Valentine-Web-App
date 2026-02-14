const reasons = [
  "You make simple days feel safe.",
  "You love in small ways that stay forever.",
  "You feel like home, even through a screen.",
  "You are brave. You started new chapters.",
  "You are beautiful in every version.",
  "You make me create songs, poems, and dreams.",
  "With you, distance feels smaller than love."
];

const memoryChapters = [
  {
    chapter: "Chapter 1: The Beginning",
    cards: [
      { date: "Dec 14, 2024 - 9:19 PM", title: "The first add", caption: "The smallest click that started the biggest change." },
      { date: "Dec 22, 2024", title: "First time seeing you", caption: "That moment when online became real." },
      { date: "Dec 25, 2024 - around 1 PM", title: "Godawari, just us", caption: "First real us moment, quiet, personal, unforgettable." }
    ]
  },
  {
    chapter: "Chapter 2: Feelings got real",
    cards: [
      { date: "Jan 4, 2025", title: "First song for my mutu", caption: "You made me write what I could not say normally." },
      { date: "Jan 12, 2025", title: "Destiny parking lot", caption: "Accidentally meeting again, like the universe nudged us." },
      { date: "Jan 22, 2025", title: "Our first date", caption: "The day maybe turned into this is it." },
      { date: "Jan 25, 2025", title: "Dinner with my family", caption: "My heart was full watching you fit into my world." },
      { date: "Jan 26, 2025", title: "Personal became personal-er", caption: "The day stories started having deeper meaning." }
    ]
  },
  {
    chapter: "Chapter 3: Love language unlocked",
    cards: [
      { date: "Feb 1, 2025", title: "A poem for my mutu", caption: "Small words. Big feelings." },
      { date: "Feb 14, 2025", title: "First I love you (voice)", caption: "I still remember how real it sounded." },
      { date: "Feb 22, 2025", title: "Her love letter", caption: "The kind of message you do not delete. Ever." },
      { date: "Mar 2, 2025", title: "First video call", caption: "Seeing you live felt like magic." },
      { date: "Mar 11, 2025", title: "First tika (video)", caption: "Distance lost that day." }
    ]
  },
  {
    chapter: "Chapter 4: Only we know",
    cards: [
      { date: "Mar 28, 2025", title: "That famous moment", caption: "A core memory, private edition." },
      { date: "Apr 2, 2025", title: "The selfie", caption: "One of the most beautiful photos I have ever seen." },
      { date: "Apr 7, 2025", title: "Childhood photo unlock", caption: "Pure side shared. Trust leveled up." },
      { date: "Apr 15, 2025", title: "Fell asleep on call", caption: "Love sounded like breathing and silence." },
      { date: "Apr 25, 2025", title: "My first gift", caption: "I felt so cared for." },
      { date: "Apr 27, 2025", title: "Makeup photo saved", caption: "Yes, I saved it. Of course I did." }
    ]
  },
  {
    chapter: "Chapter 5: Her era",
    cards: [
      { date: "Jul 14, 2025", title: "The yellow dress", caption: "Still in my mind like a highlight." },
      { date: "Aug 2025", title: "First kiss voice note: wana", caption: "I smiled like an idiot. Worth it." },
      { date: "Aug 23, 2025 - 10:29 PM", title: "First kiss video and hand gesture", caption: "A signature moment. Only ours." },
      { date: "Sep 14, 2025", title: "First virtual chess match", caption: "I won. Proof is written here. No appeals." },
      { date: "Oct 7, 2025", title: "First no-filter snap", caption: "Real face. Real her. Real love." },
      { date: "Oct 22, 2025", title: "Sari on video call", caption: "Elegant, stunning. I was quiet for a second." },
      { date: "Oct 25, 2025", title: "Kitchen call, then bathroom call", caption: "No distance, no shyness. Just us life." },
      { date: "Oct 28, 2025", title: "New chapter begins", caption: "You chose growth. I am proud of you." },
      { date: "Nov 21, 2025", title: "6 hours 58 minutes", caption: "We talked all night and slept on call. Love felt easy." }
    ]
  },
  {
    chapter: "Chapter 6: Here and now",
    cards: [
      { date: "Jan 14, 2026", title: "Flower on Bhaisipati colony road", caption: "A simple gift that stayed loud in my heart." },
      { date: "Jan 15, 2026", title: "Skirt moment", caption: "A new first, and I felt close to you." },
      { date: "After we met", title: "First movie: Kantara", caption: "Kantara, with Teaching Hospital friends." }
    ]
  }
];

const quizQuestions = [
  {
    question: "What time did we add each other first?",
    options: ["8:19 PM", "9:19 PM", "10:19 PM", "11:19 PM"],
    answer: "9:19 PM"
  },
  {
    question: "Where was our first alone meeting?",
    options: ["Godawari", "Basantapur", "Bhaisipati", "Patan"],
    answer: "Godawari"
  },
  {
    question: "When was our first date?",
    options: ["Jan 12, 2025", "Jan 22, 2025", "Feb 1, 2025", "Feb 14, 2025"],
    answer: "Jan 22, 2025"
  },
  {
    question: "What was the first movie you watched after we met?",
    options: ["Pashupati Prasad", "Kantara", "Jatra", "Kabbadi"],
    answer: "Kantara"
  },
  {
    question: "When was our first video call?",
    options: ["Feb 22, 2025", "Mar 2, 2025", "Mar 11, 2025", "Apr 2, 2025"],
    answer: "Mar 2, 2025"
  },
  {
    question: "When did you put tika on me (video)?",
    options: ["Mar 11, 2025", "Mar 28, 2025", "Apr 7, 2025", "Apr 15, 2025"],
    answer: "Mar 11, 2025"
  },
  {
    question: "Which month did wana happen?",
    options: ["June 2025", "July 2025", "Aug 2025", "Sep 2025"],
    answer: "Aug 2025"
  },
  {
    question: "What color dress do I still remember?",
    options: ["Blue", "Red", "White", "Yellow"],
    answer: "Yellow"
  },
  {
    question: "How long was our whole-night call?",
    options: ["5h 40m", "6h 58m", "7h 14m", "8h 02m"],
    answer: "6h 58m"
  },
  {
    question: "Where did you give me the flower?",
    options: ["Patan Road", "Godawari Gate", "Bhaisipati colony road", "Balkumari chowk"],
    answer: "Bhaisipati colony road"
  }
];

const coupons = [
  "One date fully planned by me. You just show up.",
  "Breakfast in bed day.",
  "Your favorite curry plus soup day.",
  "Movie night: your pick, no complaints.",
  "One long walk with no phones.",
  "Massage plus head rub combo."
];

const scoreMessages = [
  { min: 8, text: "Soulmate-level memory." },
  { min: 5, text: "Strong mutu energy." },
  { min: 0, text: "Okay, but you are cute, so forgiven." }
];

const openBtn = document.getElementById("open-surprise");
const cover = document.getElementById("cover");
const app = document.getElementById("app");
const reasonsWrap = document.getElementById("reasons");
const chapterList = document.getElementById("chapter-list");
const couponList = document.getElementById("coupon-list");

const quizCounter = document.getElementById("quiz-counter");
const quizScore = document.getElementById("quiz-score");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizNext = document.getElementById("quiz-next");
const quizResult = document.getElementById("quiz-result");
const quizWrap = document.getElementById("quiz-wrap");

const holdReveal = document.getElementById("hold-reveal");
const holdStatus = document.getElementById("hold-status");

let quizIndex = 0;
let score = 0;
let selected = "";
let holdTimer = null;

function renderReasons() {
  reasons.forEach((reason, idx) => {
    const button = document.createElement("button");
    button.className = "reason-btn";
    button.type = "button";
    button.innerHTML = `<strong>Reason ${idx + 1}</strong><span>Tap to reveal</span>`;
    button.addEventListener("click", () => {
      button.innerHTML = `<strong>Reason ${idx + 1}</strong><span>${reason}</span>`;
      button.disabled = true;
    });
    reasonsWrap.appendChild(button);
  });
}

function renderMemories() {
  memoryChapters.forEach((section) => {
    const chapter = document.createElement("article");
    chapter.className = "chapter";

    const title = document.createElement("h3");
    title.textContent = section.chapter;
    chapter.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "memory-grid";

    section.cards.forEach((card) => {
      const memoryCard = document.createElement("button");
      memoryCard.className = "memory-card";
      memoryCard.type = "button";
      memoryCard.innerHTML = `
        <span class="memory-inner">
          <span class="memory-face memory-front">
            <time>${card.date}</time>
            <h4>${card.title}</h4>
          </span>
          <span class="memory-face memory-back">${card.caption}</span>
        </span>
      `;
      memoryCard.addEventListener("click", () => {
        memoryCard.classList.toggle("is-flipped");
      });
      grid.appendChild(memoryCard);
    });

    chapter.appendChild(grid);
    chapterList.appendChild(chapter);
  });
}

function renderCoupons() {
  coupons.forEach((text) => {
    const coupon = document.createElement("article");
    coupon.className = "coupon";
    coupon.textContent = text;
    couponList.appendChild(coupon);
  });
}

function loadQuestion() {
  const current = quizQuestions[quizIndex];
  selected = "";
  quizNext.disabled = true;
  quizCounter.textContent = `Question ${quizIndex + 1} / ${quizQuestions.length}`;
  quizScore.textContent = `Score: ${score}`;
  quizQuestion.textContent = current.question;
  quizOptions.innerHTML = "";

  current.options.forEach((option, idx) => {
    const id = `q-${quizIndex}-opt-${idx}`;
    const label = document.createElement("label");
    label.className = "quiz-option";
    label.setAttribute("for", id);
    label.innerHTML = `
      <input id="${id}" name="quiz-option" type="radio" value="${option}" />
      <span>${option}</span>
    `;
    label.querySelector("input").addEventListener("change", (event) => {
      selected = event.target.value;
      quizNext.disabled = false;
    });
    quizOptions.appendChild(label);
  });
}

function finishQuiz() {
  quizWrap.classList.add("hidden");
  quizResult.classList.remove("hidden");
  const reaction = scoreMessages.find((entry) => score >= entry.min);
  quizResult.innerHTML = `
    <h3>Your score: ${score} / ${quizQuestions.length}</h3>
    <p>${reaction.text}</p>
    <p>No matter the score, you are still my person.</p>
  `;
}

function nextQuestion() {
  const current = quizQuestions[quizIndex];
  if (selected === current.answer) {
    score += 1;
  }

  quizIndex += 1;
  if (quizIndex >= quizQuestions.length) {
    finishQuiz();
  } else {
    loadQuestion();
  }
}

function startHold() {
  holdStatus.textContent = "Holding...";
  holdTimer = window.setTimeout(() => {
    holdStatus.textContent = "Mutu, thank you for becoming home to me. I choose you every day.";
    holdReveal.disabled = true;
    holdTimer = null;
  }, 1500);
}

function cancelHold() {
  if (holdTimer) {
    window.clearTimeout(holdTimer);
    holdTimer = null;
    holdStatus.textContent = "Press and hold a little longer.";
  }
}

function initOpenFlow() {
  openBtn.addEventListener("click", () => {
    cover.classList.add("hidden");
    app.classList.remove("hidden");
    app.setAttribute("aria-hidden", "false");
    document.getElementById("letter").scrollIntoView({ behavior: "smooth", block: "start" });
    requestAnimationFrame(() => {
      document.querySelectorAll(".reveal").forEach((section, idx) => {
        window.setTimeout(() => section.classList.add("visible"), idx * 140);
      });
    });
  });
}

function initQuiz() {
  loadQuestion();
  quizNext.addEventListener("click", nextQuestion);
}

function initHoldButton() {
  holdReveal.addEventListener("pointerdown", startHold);
  holdReveal.addEventListener("pointerup", cancelHold);
  holdReveal.addEventListener("pointerleave", cancelHold);
  holdReveal.addEventListener("pointercancel", cancelHold);
}

function init() {
  renderReasons();
  renderMemories();
  renderCoupons();
  initOpenFlow();
  initQuiz();
  initHoldButton();
}

init();
