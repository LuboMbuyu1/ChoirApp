export type Language = 'english' | 'french' | 'zulu' | 'swahili' | 'lingala' | 'mixed';

export type Category =
  | 'praise'
  | 'worship'
  | 'hymn'
  | 'evangelism'
  | 'second-coming'
  | 'prayer'
  | 'christmas'
  | 'general';

export type EntryType = 'song' | 'chorus';

export interface Verse {
  number: number;
  text: string;
}

export interface SongEntry {
  id: string;
  number: number | null;
  title: string;
  type: EntryType;
  language: Language;
  category: Category;
  verses: Verse[];
  chorus?: string;
  chorusText?: string;
  key?: string;
  tags?: string[];
}