export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  likesCount: number;
  commentsCount: number;
  createdAt: any;
  updatedAt?: any;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  photoURL: string;
  bio: string;
  favoriteRecipeIds: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  recipeId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  createdAt: any;
}
