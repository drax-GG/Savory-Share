import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from 'firebase/auth';
import { Camera, Plus, Trash2, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';

interface RecipeUploadProps {
  onComplete: () => void;
  user: User;
}

export function RecipeUpload({ onComplete, user }: RecipeUploadProps) {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Dinner',
    imageUrl: '',
    ingredients: [''],
    instructions: ['']
  });

  const handleSuggest = async () => {
    if (formData.ingredients.filter(i => i.trim()).length < 2) {
      alert("Please enter at least 2 ingredients for a suggestion!");
      return;
    }
    
    setAiLoading(true);
    try {
      const res = await fetch('/api/recipes/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: formData.ingredients.filter(i => i.trim()) })
      });
      const data = await res.json();
      if (data.title) {
        setFormData({
          ...formData,
          title: data.title,
          description: data.description,
          ingredients: data.ingredients,
          instructions: data.instructions
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
  };

  const handleUpdateIngredient = (index: number, value: string) => {
    const newIng = [...formData.ingredients];
    newIng[index] = value;
    setFormData({ ...formData, ingredients: newIng });
  };

  const handleRemoveIngredient = (index: number) => {
    const newIng = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIng.length ? newIng : [''] });
  };

  const handleAddInstruction = () => {
    setFormData({ ...formData, instructions: [...formData.instructions, ''] });
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    const newInst = [...formData.instructions];
    newInst[index] = value;
    setFormData({ ...formData, instructions: newInst });
  };

  const handleRemoveInstruction = (index: number) => {
    const newInst = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInst.length ? newInst : [''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'recipes'), {
        ...formData,
        ingredients: formData.ingredients.filter(i => i.trim() !== ''),
        instructions: formData.instructions.filter(i => i.trim() !== ''),
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp()
      });
      onComplete();
    } catch (error) {
      console.error("Error uploading recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-black text-[#333] mb-4">Share Your Secret</h1>
        <p className="text-gray-500 font-sans italic text-lg">Every masterpiece begins with a simple thought. Let's build yours.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12 bg-white p-8 sm:p-16 rounded-[4rem] shadow-xl border border-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="group">
              <label className="block text-xs uppercase tracking-widest font-black text-[#d48c45] mb-3">Recipe Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Grandma's Famous Lasagna"
                className="w-full bg-[#fdfaf6] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#d48c45] text-lg font-serif transition-all"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-black text-[#d48c45] mb-3">Short Story / Description</label>
              <textarea
                required
                rows={4}
                placeholder="Tell us what makes this dish special..."
                className="w-full bg-[#fdfaf6] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#d48c45] font-sans leading-relaxed transition-all"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest font-black text-[#d48c45] mb-3">Category</label>
                <select
                  className="w-full bg-[#fdfaf6] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#d48c45] font-medium transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Vegan', 'Keto'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="relative group">
                <label className="block text-xs uppercase tracking-widest font-black text-[#d48c45] mb-3">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="Paste URL..."
                  className="w-full bg-[#fdfaf6] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#d48c45] text-sm transition-all"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#fdfaf6] p-8 rounded-[3rem] border border-[#d48c45]/5">
              <div className="flex items-center justify-between mb-6">
                <label className="text-xs uppercase tracking-widest font-black text-[#d48c45]">Ingredients</label>
                <button
                  type="button"
                  onClick={handleSuggest}
                  disabled={aiLoading}
                  className="flex items-center gap-2 text-xs font-bold bg-white px-3 py-1.5 rounded-full shadow-sm hover:text-[#d48c45] transition-colors disabled:opacity-50"
                >
                  {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  AI Perfecter
                </button>
              </div>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2 group">
                    <input
                      type="text"
                      placeholder={`Ingredient ${i + 1}`}
                      className="flex-1 bg-white border-transparent rounded-xl py-2 px-4 focus:ring-1 focus:ring-[#d48c45] text-sm transition-all shadow-sm"
                      value={ing}
                      onChange={(e) => handleUpdateIngredient(i, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(i)}
                      className="p-2 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-[#d48c45]/20 rounded-xl text-xs font-bold text-[#d48c45] hover:bg-[#d48c45]/5 transition-all"
              >
                <Plus size={14} /> Add Ingredient
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-100">
          <label className="block text-xs uppercase tracking-widest font-black text-[#d48c45] mb-6">Step-by-Step Instructions</label>
          <div className="space-y-4">
            {formData.instructions.map((inst, i) => (
              <div key={i} className="flex gap-4 group">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#fdfaf6] flex items-center justify-center font-serif font-black text-[#d48c45] border border-[#d48c45]/10">
                  {i + 1}
                </span>
                <input
                  type="text"
                  placeholder="What's the next step?"
                  className="flex-1 bg-[#fdfaf6] border-none rounded-2xl py-3 px-6 focus:ring-2 focus:ring-[#d48c45] font-sans transition-all"
                  value={inst}
                  onChange={(e) => handleUpdateInstruction(i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveInstruction(i)}
                  className="p-2 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddInstruction}
            className="mt-6 flex items-center gap-2 text-sm font-bold text-[#d48c45] hover:underline"
          >
            <Plus size={18} /> Add next step
          </button>
        </div>

        <div className="flex justify-end pt-12">
          <button
            disabled={loading}
            type="submit"
            className="w-full sm:w-auto bg-[#333] text-white px-12 py-5 rounded-3xl font-black text-xl hover:bg-[#d48c45] transition-all disabled:opacity-50 shadow-2xl flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Publish Recipe
          </button>
        </div>
      </form>
    </div>
  );
}
