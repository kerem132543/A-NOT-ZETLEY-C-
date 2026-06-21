export interface Summary {
  id: string;
  title: string;
  intro: string;
  keyPoints: string[];
  tags: string[];
  readingTime: string;
  date: string;
  isFavorite: boolean;
  isDeleted?: boolean;
  originalText?: string;
}
