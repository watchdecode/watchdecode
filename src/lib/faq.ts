export type FaqItem = {
  question: string;
  answer: string;
};

function normalizeLine(line: string): string {
  return line.replace(/\s+/g, " ").trim();
}

/**
 * Best-effort FAQ extraction from MDX source.
 * Expected format (anywhere in the "FAQ"/"FAQs" section):
 * - Q: Question text
 * - A: Answer text
 *
 * Returns an empty array if no FAQ items are detected.
 */
export function extractFaqItemsFromMdx(source: string): FaqItem[] {
  const lines = source.split(/\r?\n/);

  // Find a level-2 heading that includes "FAQ" / "FAQs"
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (/^\s*##\s+.+\bFAQs?\b/i.test(line)) {
      startIdx = i + 1;
      break;
    }
  }

  if (startIdx < 0) return [];

  // End at the next level-2 (or level-1) heading
  let endIdx = lines.length;
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (/^\s*#\s+/.test(line) || /^\s*##\s+/.test(line)) {
      endIdx = i;
      break;
    }
  }

  const blockLines = lines.slice(startIdx, endIdx);

  const items: FaqItem[] = [];
  let currentQuestion: string | null = null;
  let currentAnswerLines: string[] = [];

  const pushCurrent = () => {
    if (!currentQuestion) return;
    const answer = currentAnswerLines.join(" ").trim();
    if (!answer) return;
    items.push({ question: currentQuestion.trim(), answer });
    currentQuestion = null;
    currentAnswerLines = [];
  };

  for (const rawLine of blockLines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Accept list/bold variants like: - **Q:** ... / * Q: ...
    const qMatch = line.match(/^(?:[-*]\s*)?(?:\*\*)?\bQ(?:uestion)?\s*:?\s*(.+)$/i);
    if (qMatch) {
      // New question; flush previous one.
      pushCurrent();
      currentQuestion = normalizeLine(qMatch[1] ?? "");
      continue;
    }

    const aMatch = line.match(/^(?:[-*]\s*)?(?:\*\*)?\bA(?:nswer)?\s*:?\s*(.*)$/i);
    if (aMatch && currentQuestion) {
      const first = (aMatch[1] ?? "").trim();
      if (first) currentAnswerLines.push(first);
      continue;
    }

    // Continuation lines for an answer.
    if (currentQuestion) {
      // Avoid accidental capture of unrelated list bullets that don't belong to Q/A.
      if (/^(?:[-*]\s*)\w+:\s*/.test(line)) continue;
      currentAnswerLines.push(normalizeLine(line));
    }
  }

  // Flush last
  pushCurrent();

  return items;
}

