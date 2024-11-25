// versioning.ts
import { Article } from './contentTypes';

export type Versioned<T extends Article> = T & {
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export const versionedArticle: Versioned<Article> = {
  id: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: new Date(),
  status: 'published',
  title: 'TypeScript Basics',
  body: 'Learn the basics of TypeScript...',
  author: 'John Doe',
  tags: ['typescript', 'programming'],
  categories: ['tutorials'],
  version: 1
};
