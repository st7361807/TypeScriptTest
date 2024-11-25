// validators.ts
import { Article, Product } from './contentTypes';

export type ValidationResult = {
  isValid: boolean;
  errors?: string[];
}

export interface Validator<T> {
  validate: (data: T) => ValidationResult;
}

export const articleValidator: Validator<Article> = {
  validate: (data) => {
    const errors: string[] = [];
    if (!data.title) errors.push('Title is required');
    if (!data.body) errors.push('Body is required');
    if (!data.author) errors.push('Author is required');
    return { isValid: errors.length === 0, errors };
  }
}

export const productValidator: Validator<Product> = {
  validate: (data) => {
    const errors: string[] = [];
    if (!data.name) errors.push('Name is required');
    if (data.price <= 0) errors.push('Price must be greater than zero');
    if (data.stock < 0) errors.push('Stock cannot be negative');
    return { isValid: errors.length === 0, errors };
  }
}
