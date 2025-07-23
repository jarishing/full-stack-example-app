/**
 * Core domain types and interfaces
 */

export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  author: User;
}

export interface Comment {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
}
