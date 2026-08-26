/**
 * Robustly parses any date string format (YYYY-MM-DD or DD-MM-YYYY)
 * using hyphens or slashes as delimiters and returns a Vedic-standard DD/MM/YYYY string.
 */
export function parseDateToDdmmyyyy(dobStr: string): string {
  if (!dobStr) return "";
  
  // Clean string and split by hyphen or slash
  const parts = dobStr.trim().split(/[-\/]/).map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return "";

  let y = 0, m = 0, d = 0;
  
  if (parts[0] > 1000) {
    // Format: YYYY-MM-DD (standard HTML5 date input)
    [y, m, d] = parts;
  } else if (parts[2] > 1000) {
    // Format: DD-MM-YYYY or MM-DD-YYYY
    [d, m, y] = parts;
  } else {
    // Fallback if no 4-digit year is present
    return "";
  }

  // Double-check month vs day boundaries
  if (m > 12 && d <= 12) {
    const temp = m;
    m = d;
    d = temp;
  }

  // Ensure valid date ranges
  if (m < 1 || m > 12 || d < 1 || d > 31) return "";

  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}
