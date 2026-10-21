export interface VocabItem {
  id: string;
  word: string;
  context: string;
  displayTitle: string;
  phonics: string[];
  letters: string[];
  ipa: string;
  chinese: string;
  category: 'objects' | 'nature' | 'people' | 'appearance' | 'hair';
  oppositeId?: string;
  oppositeWord?: string;
  exampleSentence: string;
  sentenceChinese: string;
  funFact: string;
  accentColor: string;
}

export type GameMode = 'explore' | 'puzzle' | 'pk' | 'memory' | 'wheel';
