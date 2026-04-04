// Helper functions for data extraction

export function isChorusTitle(rawLine: string): boolean {
  return rawLine.strip().endsWith('-C-');
}

export function cleanTitle(rawTitle: string): string {
  return rawTitle.replace(/-C-\s*$/, '').trim();
}

export function hasSongNumber(rawLine: string): boolean {
  return /^\d+\s*[-–]/.test(rawLine.trim());
}

export function extractNumber(rawLine: string): number | null {
  const match = rawLine.trim().match(/^(\d+)\s*[-–]/);
  return match ? parseInt(match[1]) : null;
}

export function parseVerses(textBlock: string): { number: number; text: string }[] {
  const verses: { number: number; text: string }[] = [];
  const parts = textBlock.split(/(\d+)\.\s*\n/);
  for (let i = 1; i < parts.length; i += 2) {
    const num = parseInt(parts[i]);
    const text = parts[i + 1]?.trim() || '';
    verses.push({ number: num, text });
  }
  return verses;
}

export function detectLanguage(title: string, text: string): string {
  const content = (title + ' ' + text).toLowerCase();
  if (content.includes('dieu') || content.includes('seigneur') || content.includes('jésus')) {
    return 'french';
  }
  if (content.includes('nkosi') || content.includes('uthando') || content.includes('yehova')) {
    return 'zulu';
  }
  if (content.includes('bwana') || content.includes('siku') || content.includes('sifu') || content.includes('tusifu')) {
    return 'swahili';
  }
  if (content.includes('nazali') || content.includes('mopaya')) {
    return 'lingala';
  }
  return 'english';
}