/**
 * Zero-dependency JSON syntax highlighter for terminal-style display.
 * Returns an HTML string with token-* CSS classes applied to JSON values.
 *
 * Security: HTML-sensitive characters are escaped before span injection
 * to prevent XSS when the output is used with dangerouslySetInnerHTML.
 */

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default function highlightJSON(obj) {
  if (obj === undefined || obj === null) {
    return `<span class="token-null">null</span>`;
  }

  const jsonString = JSON.stringify(obj, null, 2);

  // Escape HTML-sensitive characters before injecting highlight spans.
  const escaped = escapeHtml(jsonString);

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'token-string';

      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'token-key';
          return `<span class="${cls}">${match.slice(0, -1)}</span><span class="token-colon">:</span>`;
        }
      } else if (/true|false/.test(match)) {
        cls = 'token-bool';
      } else if (/null/.test(match)) {
        cls = 'token-null';
      } else {
        cls = 'token-number';
      }

      return `<span class="${cls}">${match}</span>`;
    }
  );
}