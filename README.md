<div align="center">
  <img src="logo-lime.png" alt="iBudget Logo" width="96">
  <h1>Aura — Budget Rule Finder</h1>
  <p>Answer 5 quick questions and Aura suggests a budget rule that fits you, then splits your monthly income (in RM) using that rule.</p>
</div>

No build step, no dependencies, no backend. Plain HTML, CSS and JavaScript. Your answers stay on your device.

## How it works

1. **Welcome**: start the quiz.
2. **Quiz**: 5 questions about your needs, emergency fund, high-interest debt, income stability and priorities.
3. **Result**: each answer adds points to one of two rules, and the higher score is recommended with a short reason. You can pick either rule or retake the quiz.
4. **Calculator**: enter your monthly income to see the amount for each category.

## Budget rules

| Rule | Best for | Split |
| --- | --- | --- |
| **50/30/20** | Balanced: room to save or clear debt | 50% needs · 30% wants · 20% savings and debt |
| **60/25/10/5** | Tight budget: high living costs | 60% needs · 25% wants · 10% savings · 5% investments |

Example on RM3,000 with 50/30/20: RM1,500 needs, RM900 wants, RM600 savings or debt.

## Run locally

Open `Index.html` in a browser. That's it.

Or serve the folder if you prefer:

```bash
npx serve .
```

## Project structure

```
Index.html      Page shell, fonts, loads style.css and script.js
style.css       Design tokens, components, responsive layout (mobile + desktop)
script.js       Rules, questions, scoring and screen rendering
design.md       Design notes
logo-lime.png   Brand app logo (lime vector mark)
```

## Customising

All content lives at the top of `script.js`:

- `RULES`: name, summary and category split (`[label, percent, description, colour token, icon]`).
- `QUESTIONS`: question text, hint, icon and options (`[label, points for 50/30/20, points for 60/25/10/5]`).

## Tech

- Vanilla HTML / CSS / JS
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) and [Material Symbols Rounded](https://fonts.google.com/icons) from Google Fonts

## Disclaimer

iBudget is a calculator for general guidance, not financial advice.
