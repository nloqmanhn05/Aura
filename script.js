/* ==========================================================================
   Budget Rule Finder - Application Logic
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Configuration & Data
// --------------------------------------------------------------------------

const RULES = {
  A: {
    key: "A",
    name: "50/30/20",
    tag: "Balanced",
    sum: "Splits your after-tax income: 50% needs (rent, bills), 30% wants (dining, hobbies), 20% savings or debt.",
    info: "50/30/20 splits your after-tax income: 50% needs (rent, bills), 30% wants (dining, hobbies), 20% savings or debt. Example on RM3,000: RM1,500 needs, RM900 wants, RM600 savings or debt.",
    parts: [
      ["Needs", 50, "Rent, food, transport, bills, minimum debt payments", "--c1", "home"],
      ["Wants", 30, "Dining out, subscriptions, shopping, hobbies", "--c2", "shopping_bag"],
      ["Savings and debt", 20, "Emergency fund, investments, extra debt payments", "--c3", "savings"]
    ]
  },
  B: {
    key: "B",
    name: "60/25/10/5",
    tag: "Tight budget",
    sum: "More room for living costs, 10% to save, and 5% to invest.",
    info: "60/25/10/5 splits your after-tax income: 60% needs, 25% wants, 10% savings, 5% giving or buffer. Example on RM3,000: RM1,800 needs, RM750 wants, RM300 savings, RM150 buffer.",
    parts: [
      ["Needs", 60, "Rent/room + bills, groceries + transport, medical card + PTPTN (student loan), family commitments", "--c1", "home"],
      ["Wants", 25, "Eating out, matcha, shopping, hobbies, movies, theme parks", "--c2", "shopping_bag"],
      ["Savings", 10, "Emergency fund, house deposit, travel fund", "--c3", "savings"],
      ["Investments", 5, "Long-term goals", "--c4", "trending_up"]
    ]
  }
};

const QUESTIONS = [
  {
    q: "How much of your income goes to needs each month?",
    h: "Rent, food, transport, bills.",
    ic: "home",
    o: [
      ["Under 50%", 2, 0],
      ["About 50% to 60%", 1, 1],
      ["Over 60%", 0, 2]
    ]
  },
  {
    q: "Do you have an emergency fund?",
    h: "Money set aside for surprises.",
    ic: "shield",
    o: [
      ["Yes, 3 months or more", 1, 0],
      ["Yes, but less than 3 months", 0, 0],
      ["Not yet", 0, 1]
    ]
  },
  {
    q: "Do you have debt with high interest?",
    h: "Credit cards, BNPL, personal loans.",
    ic: "credit_card",
    o: [
      ["Yes, a lot", 2, 0],
      ["A little", 1, 0],
      ["No debt", 0, 1]
    ]
  },
  {
    q: "How steady is your income?",
    h: "Think about the last 6 months.",
    ic: "calendar_month",
    o: [
      ["Same amount every month", 1, 0],
      ["It changes month to month", 0, 1]
    ]
  },
  {
    q: "What matters most right now?",
    h: "Pick the closest one.",
    ic: "flag",
    o: [
      ["Save faster or clear debt", 2, 0],
      ["Cover living costs comfortably", 0, 2],
      ["A bit of both", 1, 1]
    ]
  }
];

// --------------------------------------------------------------------------
// 2. Application State
// --------------------------------------------------------------------------

const state = {
  screen: "welcome", // "welcome" | "quiz" | "result" | "calc"
  i: 0,              // Current question index
  ans: [],           // User answers per question index
  income: 3000,      // Monthly income for calculation
  sel: "A"           // Selected rule key ("A" or "B")
};

const app = document.getElementById("app");
let lastScreenKey = "";

// --------------------------------------------------------------------------
// 3. Helper Functions
// --------------------------------------------------------------------------

/**
 * Material Symbols icon helper (rendered as icon font ligature)
 */
const icon = name => `<span class="ic" aria-hidden="true">${name}</span>`;

/**
 * Empty / prompt state for detail box
 */
const emptyState = msg => `<div class="empty"><p>${msg}</p></div>`;

/**
 * Format a number as Malaysian Ringgit (RM)
 */
function formatCurrency(n) {
  return "RM" + Number(n).toLocaleString("en-MY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

/**
 * Calculate total score weighting for Rule A vs Rule B
 */
function calculateScore() {
  let scoreA = 0;
  let scoreB = 0;

  state.ans.forEach((selectedOptionIndex, questionIndex) => {
    const option = QUESTIONS[questionIndex].o[selectedOptionIndex];
    scoreA += option[1];
    scoreB += option[2];
  });

  return { a: scoreA, b: scoreB };
}

/**
 * Recommend a rule based on total scores
 */
function getRecommendation() {
  const scores = calculateScore();
  return scores.b > scores.a ? "B" : "A";
}

/**
 * Generate rationale text explaining the recommendation
 */
function getExplanation() {
  const rec = getRecommendation();
  const needsAnswer = state.ans[0];
  const debtAnswer = state.ans[2];
  const explanation = [];

  if (rec === "B") {
    explanation.push(
      needsAnswer === 2
        ? "Your needs take more than 60% of income"
        : "Living costs take a big share of your income"
    );
    explanation.push("so a smaller savings slice is more realistic.");
  } else {
    explanation.push(
      debtAnswer <= 1
        ? "You have debt to clear and room to save,"
        : "Your needs leave room to save,"
    );
    explanation.push("so a bigger 20% savings and debt slice fits.");
  }

  return explanation.join(" ");
}

// --------------------------------------------------------------------------
// 4. Screen Renderers
// --------------------------------------------------------------------------

/**
 * Screen 1: Welcome Screen
 */
function renderWelcomeScreen() {
  app.innerHTML = `
    <div class="welcome">
      <div class="hero">
        <img src="logo-lime.png?v=2" alt="Budget Rule Finder" class="logo">
        <h1>Find the budget rule that fits you</h1>
        <p>Answer 5 quick questions. We’ll suggest a rule and show how to split your income.</p>
        <ul class="steps">
          <li>${icon("quiz")}<span>5 quick questions</span></li>
          <li>${icon("recommend")}<span>Get a rule that fits you</span></li>
          <li>${icon("pie_chart")}<span>See your income split</span></li>
        </ul>
      </div>
      <button class="btn" id="go">Start</button>
      <div class="note">This app is a calculator. Your answers stay on your device.</div>
    </div>
  `;

  document.getElementById("go").onclick = () => {
    state.screen = "quiz";
    state.i = 0;
    state.ans = [];
    render();
  };
}

/**
 * Screen 2: Quiz Screen
 */
function renderQuizScreen() {
  const question = QUESTIONS[state.i];
  const currentSelection = state.ans[state.i];
  const isLastQuestion = state.i === QUESTIONS.length - 1;

  const segments = QUESTIONS.map((_, idx) =>
    `<i class="${idx < state.i ? "on" : idx === state.i ? "on now" : ""}"></i>`
  ).join("");

  let html = `
    <div class="quiz-wrap">
      <div class="top">
        <button class="back" id="bk" aria-label="Back">${icon("arrow_back")}</button>
        <div class="bar" aria-hidden="true">${segments}</div>
        <div class="count">${state.i + 1}/${QUESTIONS.length}</div>
      </div>
      <div class="split split-quiz">
        <section class="intro">
          <div class="q-ic">${icon(question.ic)}</div>
          <h2>${question.q}</h2>
          <p>${question.h}</p>
        </section>
        <section class="panel">
        <div class="opts" role="radiogroup">
  `;

  question.o.forEach((opt, idx) => {
    const isChecked = currentSelection === idx;
    html += `
      <button 
        class="opt${isChecked ? " on" : ""}" 
        role="radio" 
        aria-checked="${isChecked}" 
        data-k="${idx}"
      >
        <span>${opt[0]}</span>
        <span class="tick ic" aria-hidden="true">${isChecked ? "check" : ""}</span>
      </button>
    `;
  });

  html += `
        </div>
        <div class="spacer"></div>
        <button class="btn" id="nx"${currentSelection === undefined ? " disabled" : ""}>
          ${isLastQuestion ? "See my result" : "Next"}
        </button>
        </section>
      </div>
    </div>
  `;

  app.innerHTML = html;

  // Navigation handlers
  document.getElementById("bk").onclick = () => {
    if (state.i === 0) {
      state.screen = "welcome";
    } else {
      state.i--;
    }
    render();
  };

  // Option selection handlers
  app.querySelectorAll(".opt").forEach(btn => {
    btn.onclick = () => {
      state.ans[state.i] = Number(btn.dataset.k);
      app.querySelectorAll(".opt").forEach(opt => {
        const selected = opt === btn;
        opt.classList.toggle("on", selected);
        opt.setAttribute("aria-checked", selected.toString());
        const tick = opt.querySelector(".tick");
        if (tick) tick.textContent = selected ? "check" : "";
      });
      document.getElementById("nx").disabled = false;
    };
  });

  // Next / Submit handler
  document.getElementById("nx").onclick = () => {
    if (isLastQuestion) {
      state.sel = getRecommendation();
      state.screen = "result";
    } else {
      state.i++;
    }
    render();
  };
}

/**
 * Screen 3: Result & Rule Recommendation Screen
 */
function renderResultScreen() {
  const recommendedKey = getRecommendation();
  const alternateKey = recommendedKey === "A" ? "B" : "A";

  let html = `
    <div class="split">
    <section class="intro">
      <div class="top">
        <button class="back" id="bk" aria-label="Back">${icon("arrow_back")}</button>
        <h2>Your result</h2>
      </div>
      <div class="why">${icon("lightbulb")}<span>${getExplanation()}</span></div>
    </section>
    <section class="panel">
  `;

  [recommendedKey, alternateKey].forEach(key => {
    const rule = RULES[key];
    const isSelected = state.sel === key;
    const isRecommended = key === recommendedKey;

    html += `
      <button class="rule${isSelected ? " on" : ""}" data-k="${key}">
        ${isRecommended ? `<span class="badge">Recommended for you</span>` : ""}
        <h3>${rule.name}</h3>
        <p>${rule.sum}</p>
        <div class="seg" aria-hidden="true">
          ${rule.parts.map(p => `<i style="width:${p[1]}%;background:var(${p[3]})"></i>`).join("")}
        </div>
        <div class="chips">
          ${rule.parts.map(p => `<span><i class="dot" style="background:var(${p[3]})"></i>${p[1]}% ${p[0].toLowerCase()}</span>`).join("")}
        </div>
      </button>
    `;
  });

  html += `
    <div class="spacer"></div>
    <div class="result-actions">
      <button class="btn" id="cf">Confirm ${RULES[state.sel].name}</button>
      <button class="btn ghost" id="re">Retake questions</button>
    </div>
    </section>
    </div>
  `;

  app.innerHTML = html;

  // Back to quiz
  document.getElementById("bk").onclick = () => {
    state.screen = "quiz";
    state.i = QUESTIONS.length - 1;
    render();
  };

  // Retake questions
  document.getElementById("re").onclick = () => {
    state.screen = "welcome";
    render();
  };

  // Rule selection toggle
  app.querySelectorAll(".rule").forEach(ruleCard => {
    ruleCard.onclick = () => {
      state.sel = ruleCard.dataset.k;
      app.querySelectorAll(".rule").forEach(card => {
        card.classList.toggle("on", card === ruleCard);
      });
      document.getElementById("cf").innerHTML = `Confirm ${RULES[state.sel].name} ${icon("arrow_forward")}`;
    };
  });

  // Confirm selection to calculator
  document.getElementById("cf").onclick = () => {
    state.screen = "calc";
    render();
  };
}

/**
 * Screen 4: Income Calculator Screen
 */
function renderCalcScreen() {
  const currentRule = RULES[state.sel];

  app.innerHTML = `
    <div class="split split-calc">
    <section class="intro">
      <div class="top">
        <button class="back" id="bk" aria-label="Back">${icon("arrow_back")}</button>
        <h2>Calculator</h2>
      </div>
      <p>${currentRule.info}</p>
      <label class="in">
        <span>Monthly income</span>
        <div class="amt">
          <b>RM</b>
          <input id="inc" type="number" inputmode="decimal" min="0" placeholder="e.g. 3000" aria-label="Monthly income in RM">
        </div>
      </label>
      <button class="btn" id="cl">Calculate</button>
    </section>
    <section class="panel">
      <div class="detail" id="det">${emptyState("Your split will appear here.")}</div>
      <div class="spacer"></div>
      <button class="btn ghost" id="ch">Change rule</button>
      <div class="note">A guide, not financial advice.</div>
    </section>
    </div>
  `;

  // Navigation handlers
  document.getElementById("bk").onclick = () => {
    state.screen = "result";
    render();
  };

  document.getElementById("ch").onclick = () => {
    state.screen = "result";
    render();
  };

  const incomeInput = document.getElementById("inc");
  const detailBox = document.getElementById("det");

  // Reset detail only when input is cleared
  incomeInput.oninput = () => {
    if (!incomeInput.value) {
      detailBox.innerHTML = emptyState("Your split will appear here.");
    }
  };

  // Press Enter to calculate
  incomeInput.onkeydown = e => {
    if (e.key === "Enter") {
      document.getElementById("cl").click();
    }
  };

  // Calculate action
  document.getElementById("cl").onclick = () => {
    const value = parseFloat(incomeInput.value);
    if (!(value > 0)) {
      detailBox.innerHTML = emptyState("Enter your monthly income to calculate.");
      incomeInput.focus();
      return;
    }

    state.income = value;
    renderDetailBreakdown();
    detailBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
}

/**
 * Sub-view: Display budget breakdown rows
 */
function renderDetailBreakdown() {
  const currentRule = RULES[state.sel];
  const detailBox = document.getElementById("det");
  const existingRows = detailBox.querySelectorAll(".row");

  // Only rebuild DOM if rule changed or empty; otherwise keep .n strictly fixed
  if (existingRows.length !== currentRule.parts.length) {
    let html = `
      <div class="detail-head">
        <h2>${currentRule.name} on ${formatCurrency(state.income)}</h2>
        <div class="seg" aria-hidden="true">
          ${currentRule.parts.map(p => `<i style="width:${p[1]}%;background:var(${p[3]})"></i>`).join("")}
        </div>
      </div>
      <div class="breakdown-grid">
    `;
    currentRule.parts.forEach(part => {
      html += `
        <div class="row">
          <span class="tile" style="--tile:var(${part[3]})">${icon(part[4])}</span>
          <div class="n">
            <b>${part[0]}</b>
            <span>${part[2]}</span>
          </div>
          <div class="v">
            <b>${formatCurrency((state.income * part[1]) / 100)}</b>
            <span>${part[1]}%</span>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    detailBox.innerHTML = html;
    detailBox.classList.remove("reveal");
    void detailBox.offsetWidth;
    detailBox.classList.add("reveal");
  } else {
    const heading = detailBox.querySelector("h2");
    if (heading) heading.textContent = `${currentRule.name} on ${formatCurrency(state.income)}`;

    const valueElements = detailBox.querySelectorAll(".v b");
    valueElements.forEach((el, index) => {
      el.textContent = formatCurrency((state.income * currentRule.parts[index][1]) / 100);
    });
  }
}

// --------------------------------------------------------------------------
// 5. Router & Initialization
// --------------------------------------------------------------------------

/**
 * Main application render controller
 */
function render() {
  const screenKey = state.screen + (state.screen === "quiz" ? state.i : "");

  switch (state.screen) {
    case "welcome":
      renderWelcomeScreen();
      break;
    case "quiz":
      renderQuizScreen();
      break;
    case "result":
      renderResultScreen();
      break;
    case "calc":
      renderCalcScreen();
      break;
    default:
      renderWelcomeScreen();
  }

  // Handle screen transition animation
  if (screenKey !== lastScreenKey) {
    lastScreenKey = screenKey;
    app.classList.remove("enter");
    void app.offsetWidth;
    app.classList.add("enter");

    clearTimeout(window.enterTimeout);
    window.enterTimeout = setTimeout(() => {
      app.classList.remove("enter");
    }, 1200);
  }
}

// Boot application
render();
