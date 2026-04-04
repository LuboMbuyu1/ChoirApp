import Fuse from 'fuse.js';
import { SongEntry } from '../types';

export function buildSearchIndex(entries: SongEntry[]) {
  return new Fuse(entries, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'number', weight: 0.25 },
      { name: 'chorusText', weight: 0.15 },
      { name: 'chorus', weight: 0.05 },
      { name: 'verses.text', weight: 0.05 },
    ],
    threshold: 0.35,
    includeScore: true,
  });
}