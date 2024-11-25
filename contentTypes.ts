// contentTypes.ts
export interface BaseContent {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    status: 'draft' | 'published' | 'archived';
  }
  
  export interface Article extends BaseContent {
    title: string;
    body: string;
    author: string;
    tags: string[];
    categories: string[];
  }
  
  export interface Product extends BaseContent {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
  }
  