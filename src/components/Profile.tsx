import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from 'firebase/auth';
import { RecipeCard } from './RecipeCard';
import { Settings, Heart, ChefHat, Grid } from 'lucide-react';
import { motion } from 'motion/react';

import { Recipe } from '../types';

interface ProfileProps {
  user: User;
  onRecipeClick: (id: string) => void;
}

export function Profile({ user, onRecipeClick }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'my' | 'favorites'>('my');
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    // My Recipes
    const myQ = query(collection(db, 'recipes'), where('authorId', '==', user.uid));
    const unsubMy = onSnapshot(myQ, (snapshot) => {
      setMyRecipes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recipe[]);
    });

    // Favorites
    const userRef = doc(db, 'users', user.uid);
    const unsubFavs = onSnapshot(userRef, async (snap) => {
      if (snap.exists()) {
        const favIds = snap.data().favoriteRecipeIds || [];
        // Fetch details for each favId - simplified for prototype
        const favData: Recipe[] = [];
        for (const id of favIds) {
          const rSnap = await getDoc(doc(db, 'recipes', id));
          if (rSnap.exists()) {
            favData.push({ id: rSnap.id, ...rSnap.data() } as Recipe);
          }
        }
        setFavorites(favData);
      }
    });

    return () => {
      unsubMy();
      unsubFavs();
    };
  }, [user.uid]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-20 flex flex-col md:flex-row items-center gap-12">
        <div className="relative">
          <div className="absolute inset-0 bg-[#d48c45]/20 blur-3xl rounded-full transform -rotate-12"></div>
          <img 
            src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
            className="relative w-48 h-48 rounded-[4rem] object-cover shadow-2xl border-4 border-white"
            alt={user.displayName || ''}
          />
        </div>

        <div className="text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
            <h1 className="text-5xl font-serif font-black text-[#333]">{user.displayName}</h1>
            <button className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:text-[#d48c45] transition-colors">
              <Settings size={20} />
            </button>
          </div>
          <p className="text-xl text-gray-500 font-sans leading-relaxed mb-6 italic">"Passionate home chef exploring flavors and sharing culinary joy."</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
            <div>
              <p className="text-2xl font-serif font-black text-[#333]">{myRecipes.length}</p>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Recipes Shared</p>
            </div>
            <div className="h-8 w-[1px] bg-gray-100" />
            <div>
              <p className="text-2xl font-serif font-black text-[#333]">{favorites.length}</p>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Favorites</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div className="flex border-b border-gray-100 gap-12">
          <button 
            onClick={() => setActiveTab('my')}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
              activeTab === 'my' ? 'text-[#d48c45]' : 'text-gray-400 hover:text-[#333]'
            }`}
          >
            <div className="flex items-center gap-2">
              <ChefHat size={18} /> My Recipes
            </div>
            {activeTab === 'my' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d48c45]" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
              activeTab === 'favorites' ? 'text-[#d48c45]' : 'text-gray-400 hover:text-[#333]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart size={18} /> Favorites
            </div>
            {activeTab === 'favorites' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d48c45]" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {(activeTab === 'my' ? myRecipes : favorites).map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onClick={() => onRecipeClick(recipe.id)} 
            />
          ))}
          {(activeTab === 'my' ? myRecipes : favorites).length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-serif italic text-lg">No recipes found in this collection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
