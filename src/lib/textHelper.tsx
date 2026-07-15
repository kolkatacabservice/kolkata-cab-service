import React from 'react';

/**
 * Parses inline markdown-like bold syntax (`**text**`) and wraps it in strong tags.
 * Returns an array of React elements or strings.
 */
export function formatBoldText(text: string): React.ReactNode {
  if (!text) return '';
  const parts = text.split('**');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <strong key={index} className="text-secondary font-bold">
          {part}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Splits a text by double newlines into paragraphs, and formats bold syntax inside each.
 */
export function parseParagraphsWithBold(text: string, paragraphClass: string = "mb-3 last:mb-0"): React.ReactNode {
  if (!text) return null;
  return text.split('\n\n').map((para, i) => (
    <p key={i} className={paragraphClass}>
      {formatBoldText(para)}
    </p>
  ));
}
