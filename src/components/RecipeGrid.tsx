import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RecipeCard } from './RecipeCard';
import { Loader2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Recipe } from '../types';

interface RecipeGridProps {
  onRecipeClick: (id: string) => void;
  searchQuery: string;
}

export function RecipeGrid({ onRecipeClick, searchQuery }: RecipeGridProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'Keto'];

  useEffect(() => {
    const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];
      setRecipes(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching recipes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#d48c45] mb-4" />
        <p className="font-serif italic text-gray-500">Curating the finest recipes for you...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Filter size={18} className="text-[#333] mr-2" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat 
                ? 'bg-[#d48c45] text-white shadow-lg shadow-[#d48c45]/20' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
          <p className="text-xl font-serif text-gray-400">No recipes found matching your criteria.</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {filteredRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onClick={() => onRecipeClick(recipe.id)} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
