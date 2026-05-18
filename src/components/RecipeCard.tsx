import React from 'react';
import { motion } from 'motion/react';
import { Heart, User, Sparkles } from 'lucide-react';

import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  key?: React.Key;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 flex flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={recipe.imageUrl || 'https://picsum.photos/seed/food/800/600'} 
          alt={recipe.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 left-4 scale-90 origin-top-left transition-transform duration-500 group-hover:scale-100">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-[#d48c45] shadow-sm">
            {recipe.category}
          </span>
        </div>

        {recipe.likesCount > 50 && (
          <div className="absolute top-4 right-4 animate-pulse">
            <div className="bg-[#d48c45] text-white p-2 rounded-xl shadow-lg">
              <Sparkles size={14} />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-serif font-black text-[#333] mb-2 line-clamp-1 group-hover:text-[#d48c45] transition-colors leading-tight">
          {recipe.title}
        </h3>
        <p className="text-sm text-gray-500 font-sans line-clamp-2 mb-6 flex-1 leading-relaxed">
          {recipe.description}
        </p>

        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-50 rounded-full group-hover:bg-[#d48c45]/10 transition-colors">
              <User size={14} className="text-gray-400 group-hover:text-[#d48c45]" />
            </div>
            <span className="text-xs font-semibold text-[#333]">{recipe.authorName || 'Chef'}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-[#d48c45] transition-colors">
            <Heart size={14} fill={recipe.likesCount > 0 ? "currentColor" : "none"} className={recipe.likesCount > 0 ? "text-[#d48c45]" : ""} />
            <span className="text-xs font-bold">{recipe.likesCount || 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
