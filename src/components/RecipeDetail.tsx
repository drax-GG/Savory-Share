import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, orderBy, onSnapshot, setDoc, deleteDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { ArrowLeft, Heart, MessageSquare, Clock, Users, ChefHat, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDate } from '../lib/utils';

import { Recipe, Comment } from '../types';

interface RecipeDetailProps {
  id: string;
  onBack: () => void;
  user: FirebaseUser | null;
  onAuthRequired: () => void;
}

export function RecipeDetail({ id, onBack, user, onAuthRequired }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, 'recipes', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setRecipe({ id: snap.id, ...snap.data() } as Recipe);
      }
      setLoading(false);
    };

    fetchRecipe();

    // Comments listener
    const commentsQuery = query(
      collection(db, 'recipes', id, 'comments'),
      orderBy('createdAt', 'desc')
    );
    const unsubComments = onSnapshot(commentsQuery, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[]);
    });

    // Check if liked
    if (user) {
      const likeRef = doc(db, 'recipes', id, 'likes', user.uid);
      getDoc(likeRef).then(snap => setIsLiked(snap.exists()));
    }

    return () => unsubComments();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return onAuthRequired();
    if (!recipe) return;

    const likeRef = doc(db, 'recipes', id, 'likes', user.uid);
    const recipeRef = doc(db, 'recipes', id);

    try {
      if (isLiked) {
        await deleteDoc(likeRef);
        await updateDoc(recipeRef, { likesCount: increment(-1) });
        setIsLiked(false);
      } else {
        await setDoc(likeRef, {
          userId: user.uid,
          recipeId: id,
          createdAt: serverTimestamp()
        });
        await updateDoc(recipeRef, { likesCount: increment(1) });
        setIsLiked(true);
      }
    } catch (err) {
      console.error("Like operation failed", err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return onAuthRequired();
    if (!newComment.trim()) return;

    try {
      const commentRef = doc(collection(db, 'recipes', id, 'comments'));
      await setDoc(commentRef, {
        userId: user.uid,
        userName: user.displayName || 'Guest Chef',
        userPhoto: user.photoURL || '',
        text: newComment,
        createdAt: serverTimestamp()
      });

      const recipeRef = doc(db, 'recipes', id);
      await updateDoc(recipeRef, { commentsCount: increment(1) });
      setNewComment('');
    } catch (err) {
      console.error("Comment submission failed", err);
    }
  };

  if (loading) return null;
  if (!recipe) return (
    <div className="text-center py-20">Recipe not found.</div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-[#d48c45] transition-colors font-medium"
      >
        <ArrowLeft size={18} /> Back to recipes
      </button>

      <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-50">
        <div className="relative aspect-[16/9]">
          <img 
            src={recipe.imageUrl || 'https://picsum.photos/seed/food/1600/900'} 
            className="w-full h-full object-cover" 
            alt={recipe.title}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <span className="inline-block bg-[#d48c45] px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              {recipe.category}
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-black leading-tight mb-4">{recipe.title}</h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img src={recipe.authorPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipe.authorId}`} className="w-full h-full object-cover" alt={recipe.authorName} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-300">Created by</p>
                  <p className="text-sm font-bold">{recipe.authorName}</p>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#d48c45]" />
                <span className="text-sm font-bold">Prep: 25 min</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#d48c45]" />
                <span className="text-sm font-bold">Serves: 4 people</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-serif font-black text-[#333] mb-6 flex items-center gap-3">
                <ChefHat className="text-[#d48c45]" /> The Story
              </h2>
              <p className="text-lg text-gray-600 font-sans leading-relaxed italic">"{recipe.description}"</p>
            </section>

            <section>
              <h2 className="text-3xl font-serif font-black text-[#333] mb-6">Instructions</h2>
              <div className="space-y-8">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#fdfaf6] border border-[#d48c45]/20 flex items-center justify-center font-serif font-black text-[#d48c45]">
                      {i + 1}
                    </span>
                    <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="mt-12 lg:mt-0 space-y-12">
            <section className="bg-[#fdfaf6] p-8 rounded-[2rem] border border-[#d48c45]/10">
              <h2 className="text-2xl font-serif font-black text-[#333] mb-6">Ingredients</h2>
              <ul className="space-y-4">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d48c45] mt-2 flex-shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-black text-[#333]">Social</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      isLiked ? 'bg-[#d48c45] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                    <span className="text-sm font-bold">{recipe.likesCount}</span>
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-gray-500">
                    <MessageSquare size={18} />
                    <span className="text-sm font-bold">{recipe.commentsCount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <form onSubmit={handleAddComment} className="relative">
                  <input 
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-[#d48c45] transition-all"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1.5 p-1.5 text-[#d48c45] hover:bg-[#d48c45]/10 rounded-xl transition-all"
                  >
                    <Send size={18} />
                  </button>
                </form>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-white p-4 rounded-2xl border border-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={comment.userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`} className="w-6 h-6 rounded-full" alt="" />
                        <span className="text-xs font-bold text-[#333]">{comment.userName}</span>
                        <span className="text-[10px] text-gray-400 ml-auto">
                          {comment.createdAt?.toDate ? formatDate(comment.createdAt.toDate()) : 'Recent'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{comment.text}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-center text-sm italic text-gray-400 py-4">Be the first to comment!</p>
                  )}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
