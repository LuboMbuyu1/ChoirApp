import rawSongs from '../data/songs.json';
import type { SongEntry } from '../types';

// Assert the imported JSON matches SongEntry[] type
// Data is valid per inspection - all type fields are 'song' or 'chorus'
export const songsData: SongEntry[] = rawSongs as SongEntry[];

