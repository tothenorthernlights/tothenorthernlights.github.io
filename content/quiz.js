/* ==========================================================================
   QUIZ RENDERER
   Usage: openQuiz("quiz-py-101", modalClassBodyEl)
   Loads content/<quizId>.json and renders it into the given container.
   ========================================================================== */
async function openQuiz(quizId, root) {
  root.innerHTML = '<p class="text-slate-400">Loading quiz…</p>';
  try {
    const res = await fetch(`content/${quizId}.json`);
    if (!res.ok) throw new Error("missing");
    renderQuiz(await res.json(), root);
  } catch (err) {
    root.innerHTML =
      '<p class="text-slate-400">This quiz isn\'t ready yet.</p>';
  }
}

function renderQuiz(quiz, root) {
  const LEVELS = ["easy", "medium", "hard"];
  const LABELS = { easy: "Easy", medium: "Medium", hard: "Hard" };
  const answered = {}; // question id -> chosen option index
  let active = "easy";

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };

  function draw() {
    root.innerHTML = "";
    const total = quiz.questions.length;
    const correct = quiz.questions.filter(
      (q) => answered[q.id] === q.answer,
    ).length;
    const done = Object.keys(answered).length;

    // Header: score + reset
    const header = el("div", "flex items-center justify-between gap-3 mb-5");
    header.append(
      el(
        "div",
        "font-mono text-sm text-cyan-200",
        `Score: ${correct} / ${total}  ·  Answered: ${done}`,
      ),
    );
    const reset = el(
      "button",
      "px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 font-mono text-xs text-slate-200 transition-colors",
      "Reset",
    );
    reset.type = "button";
    reset.onclick = () => {
      for (const k in answered) delete answered[k];
      draw();
    };
    header.append(reset);
    root.append(header);

    // Difficulty tabs
    const tabs = el("div", "flex gap-2 mb-6");
    LEVELS.forEach((lvl) => {
      const qs = quiz.questions.filter((q) => q.level === lvl);
      const doneInLevel = qs.filter((q) => answered[q.id] !== undefined).length;
      const on = lvl === active;
      const tab = el(
        "button",
        "flex-1 px-3 py-2.5 rounded-xl font-mono text-xs font-semibold border transition-all " +
          (on
            ? "bg-emerald-400/20 border-emerald-400/50 text-emerald-200"
            : "bg-white/[0.05] border-white/10 text-slate-300 hover:bg-white/10"),
        `${LABELS[lvl]} (${doneInLevel}/${qs.length})`,
      );
      tab.type = "button";
      tab.onclick = () => {
        active = lvl;
        draw();
      };
      tabs.append(tab);
    });
    root.append(tabs);

    // Questions for the active level
    quiz.questions
      .filter((q) => q.level === active)
      .forEach((q, i) => {
        const chosen = answered[q.id];
        const isAnswered = chosen !== undefined;

        const card = el(
          "div",
          "rounded-2xl bg-white/[0.04] border border-white/10 p-5 mb-5",
        );
        card.append(
          el(
            "div",
            "font-mono text-[11px] text-aurora-emerald mb-2",
            `QUESTION ${i + 1}`,
          ),
        );
        card.append(
          el("p", "text-white font-semibold mb-3 whitespace-pre-line", q.q),
        );

        if (q.code) {
          card.append(
            el(
              "pre",
              "rounded-xl bg-void/90 border border-white/10 p-4 mb-4 font-mono text-sm text-cyan-100 whitespace-pre-wrap",
              q.code,
            ),
          );
        }

        const list = el("div", "space-y-2");
        q.options.forEach((opt, idx) => {
          let style =
            "bg-white/[0.05] border-white/10 text-slate-200 hover:bg-white/10";
          if (isAnswered) {
            if (idx === q.answer)
              style =
                "bg-emerald-400/20 border-emerald-400/60 text-emerald-100";
            else if (idx === chosen)
              style = "bg-rose-400/20 border-rose-400/60 text-rose-100";
            else style = "bg-white/[0.03] border-white/10 text-slate-500";
          }
          const btn = el(
            "button",
            "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all " +
              style,
            opt,
          );
          btn.type = "button";
          btn.disabled = isAnswered;
          btn.onclick = () => {
            answered[q.id] = idx;
            draw();
          };
          list.append(btn);
        });
        card.append(list);

        if (isAnswered) {
          const ok = chosen === q.answer;
          card.append(
            el(
              "p",
              "mt-4 text-sm leading-relaxed " +
                (ok ? "text-emerald-200" : "text-rose-200"),
              (ok ? "✓ Correct! " : "✗ Not quite. ") + q.explain,
            ),
          );
        }
        root.append(card);
      });

    // Final message
    if (done === total) {
      const pct = Math.round((correct / total) * 100);
      const msg =
        pct >= 80
          ? "Great job! You're ready for the next class."
          : pct >= 50
            ? "Good effort! Re-read the class and try the ones you missed."
            : "Take another look at the class, then hit Reset and try again.";
      root.append(
        el(
          "div",
          "rounded-2xl bg-emerald-400/10 border border-emerald-400/30 p-5 text-emerald-100 font-semibold",
          `Quiz complete: ${correct}/${total} (${pct}%). ${msg}`,
        ),
      );
    }
  }

  draw();
}
