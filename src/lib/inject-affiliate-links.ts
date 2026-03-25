import type { AffiliateLink } from "@/src/lib/posts";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeJsxAttribute(text: string): string {
  // We only interpolate into JSX attributes enclosed in double quotes.
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function findWatchMentionLine(lines: string[], watchName: string): number {
  const watchNameLower = watchName.toLowerCase();
  // Prefer headings (cleaner insertion point)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (/^\s*#{1,6}\s+/.test(line) && line.toLowerCase().includes(watchNameLower)) return i;
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.toLowerCase().includes(watchNameLower)) return i;
  }
  return -1;
}

export function injectAffiliateButtonsIntoMdx(source: string, links: AffiliateLink[]): string {
  if (!links.length) return source;

  const lines = source.split(/\r?\n/);
  const inserted = new Set<string>();

  for (const link of links) {
    const watchName = link.watchName?.trim();
    const affiliateUrl = link.affiliateUrl?.trim();
    const buttonLabel = (link.buttonLabel?.trim() || "Check Price on Amazon").toString();

    if (!watchName || !affiliateUrl) continue;
    const watchNameKey = watchName.toLowerCase();
    if (inserted.has(watchNameKey)) continue;
    // Avoid duplicating if the affiliate button is already authored into the MDX.
    if (source.includes(affiliateUrl)) continue;

    const mentionIdx = findWatchMentionLine(lines, watchName);
    if (mentionIdx < 0) continue;

    const escapedUrl = escapeJsxAttribute(affiliateUrl);
    const escapedLabel = escapeHtml(buttonLabel);

    // Insert after the line where the watch is mentioned.
    lines.splice(
      mentionIdx + 1,
      0,
      "",
      `<div className="mt-4">`,
      `  <a href="${escapedUrl}" target="_blank" rel="nofollow noopener sponsored" className="buy-button">`,
      `    ${escapedLabel}`,
      `  </a>`,
      `</div>`,
      "",
    );

    inserted.add(watchNameKey);
  }

  return lines.join("\n");
}

