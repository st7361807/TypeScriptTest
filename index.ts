// index.ts
import { Article, Product } from './contentTypes';
import { articleValidator, productValidator } from './validators';
import { AccessControl } from './accessControl';
import { versionedArticle } from './versioning';

const newArticle: Article = {
  id: '2',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'draft',
  title: 'Advanced TypeScript',
  body: 'In-depth TypeScript tutorial...',
  author: 'Jane Smith',
  tags: ['typescript', 'advanced'],
  categories: ['tutorials']
};

const articleValidation = articleValidator.validate(newArticle);
console.log(articleValidation);

const adminAccess: AccessControl<Article> = {
  role: 'admin',
  permissions: { create: true, read: true, update: true, delete: true },
  contentType: newArticle
};

console.log(versionedArticle);
