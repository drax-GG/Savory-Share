import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs, query, limit, addDoc } from 'firebase/firestore';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RecipeGrid } from './components/RecipeGrid';
import { RecipeDetail } from './components/RecipeDetail';
import { RecipeUpload } from './components/RecipeUpload';
import { Profile } from './components/Profile';
import { AuthModal } from './components/AuthModal';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'recipe' | 'upload' | 'profile'>('home');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const discoveryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // --- SEEDING LOGIC ---
        // Check if recipes exist, if not seed them using this user's ID
        const qSeed = query(collection(db, 'recipes'), limit(1));
        const seedSnapshot = await getDocs(qSeed);
        
        if (seedSnapshot.empty) {
          const sampleRecipes = [
            {
              title: "Sunset Mediterranean Pasta",
              description: "A vibrant, sun-drenched pasta dish featuring roasted cherry tomatoes, salty kalamata olives, and fresh basil, finished with a generous shaving of pecorino.",
              ingredients: ["400g Penne pasta", "2 cups cherry tomatoes", "1/2 cup Kalamata olives", "3 cloves garlic", "Fresh basil leaves", "Olive oil", "Pecorino cheese"],
              instructions: ["Roast tomatoes and garlic in olive oil at 200°C for 20 mins.", "Cook pasta according to package instructions.", "Toss pasta with roasted mixture and olives.", "Garnish with basil and cheese."],
              category: "Dinner",
              imageUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=1200&q=80",
              authorId: firebaseUser.uid,
              authorName: firebaseUser.displayName || "SavoryShare Chef",
              likesCount: 124,
              commentsCount: 8,
              createdAt: serverTimestamp()
            },
            {
              title: "Honey Garlic Glazed Salmon",
              description: "Perfectly seared salmon fillets coated in a sticky, sweet, and savory honey garlic glaze. A sophisticated meal that comes together in under 20 minutes.",
              ingredients: ["2 Salmon fillets", "3 tbsp Honey", "2 tbsp Soy sauce", "1 tbsp Lemon juice", "2 cloves minced garlic", "1 tsp Ginger", "Scallions for garnish"],
              instructions: ["Whisk honey, soy sauce, lemon juice, garlic, and ginger.", "Sear salmon in a hot pan for 4 minutes per side.", "Pour glaze into pan and let it thicken for 2 minutes.", "Spoon glaze over salmon and serve cold."],
              category: "Lunch",
              imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
              authorId: firebaseUser.uid,
              authorName: firebaseUser.displayName || "Chef Isabella",
              likesCount: 89,
              commentsCount: 3,
              createdAt: serverTimestamp()
            },
            {
              title: "Breakfast Berry Crepes",
              description: "Paper-thin delicate crepes stuffed with a velvety mascarpone cream and overflowing with fresh, seasonal berries and a dusting of powdered sugar.",
              ingredients: ["1 cup Flour", "2 Eggs", "1/2 cup Milk", "1/2 cup Water", "1/4 tsp Salt", "2 tbsp Butter", "Mascarpone", "Fresh Berries"],
              instructions: ["Whisk together flour and eggs. Gradually add milk and water.", "Add salt and butter; beat until smooth.", "Heat a lightly oiled griddle; pour batter and tilt pan.", "Flip after 2 mins. Fill with cream and berries."],
              category: "Breakfast",
              imageUrl: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1200&q=80",
              authorId: firebaseUser.uid,
              authorName: firebaseUser.displayName || "Morning Muse",
              likesCount: 215,
              commentsCount: 12,
              createdAt: serverTimestamp()
            },
            {
              title: "Zesty Lemon Herb Chicken",
              description: "Juicy chicken thighs marinated in a vibrant blend of lemon zest, fresh rosemary, and smoked paprika. Roasted to golden perfection.",
              ingredients: ["4 Chicken thighs", "2 Lemons", "3 sprigs Rosemary", "4 cloves Garlic", "2 tbsp Olive oil", "1 tsp Smoked paprika", "Salt & Pepper"],
              instructions: ["Marinate chicken with lemon, herbs, and oil for 1 hour.", "Preheat oven to 200°C.", "Roast chicken for 35-40 minutes until skin is crispy.", "Rest for 5 minutes before serving with lemon wedges."],
              category: "Dinner",
              imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
              authorId: firebaseUser.uid,
              authorName: firebaseUser.displayName || "Rustic Kitchen",
              likesCount: 56,
              commentsCount: 2,
              createdAt: serverTimestamp()
            },
            {
              title: "Rainbow Vegan Buddha Bowl",
              description: "A nutrient-dense feast for the eyes and the palate. Featuring roasted sweet potatoes, quinoa, avocado, and a creamy tahini dressing.",
              ingredients: ["1 cup Quinoa", "1 Sweet potato", "1 cup Chickpeas", "1 Avocado", "Red cabbage", "Kale", "Tahini", "Lemon"],
              instructions: ["Roast diced sweet potatoes and chickpeas for 25 mins.", "Cook quinoa as per package.", "Assemble bowl with kale, cabbage, quinoa, and roasted veg.", "Drizzle with lemon-tahini dressing and top with avocado."],
              category: "Vegan",
              imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
              authorId: firebaseUser.uid,
              authorName: firebaseUser.displayName || "Garden Gourmet",
              likesCount: 178,
              commentsCount: 15,
              createdAt: serverTimestamp()
            }
          ];

          for (const recipe of sampleRecipes) {
            try {
              await addDoc(collection(db, 'recipes'), recipe);
            } catch (err) {
              console.error("Seed failed for one recipe", err);
            }
          }
        }
        // --- END SEEDING LOGIC ---

        // Ensure user document exists in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            userId: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Guest User',
            photoURL: firebaseUser.photoURL || '',
            bio: '',
            favoriteRecipeIds: [],
            createdAt: serverTimestamp()
          });
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRecipeClick = (id: string) => {
    setSelectedRecipeId(id);
    setView('recipe');
  };

  const handleExplore = () => {
    discoveryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#fdfaf6]">
        <Loader2 className="w-8 h-8 animate-spin text-[#d48c45]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-[#333333] selection:bg-[#d48c45]/30">
      <Navbar 
        user={user} 
        onViewChange={setView} 
        onAuthClick={() => setIsAuthModalOpen(true)}
        currentView={view}
      />

      <main className="pb-20">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <Hero onExploreClick={handleExplore} />
              <div ref={discoveryRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative mb-8">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-4 border-none bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-[#d48c45] text-lg font-sans"
                    placeholder="Search recipes, ingredients, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <RecipeGrid onRecipeClick={handleRecipeClick} searchQuery={searchQuery} />
              </div>
            </motion.div>
          )}

          {view === 'recipe' && selectedRecipeId && (
            <motion.div
              key="recipe"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <RecipeDetail 
                id={selectedRecipeId} 
                onBack={() => setView('home')} 
                user={user}
                onAuthRequired={() => setIsAuthModalOpen(true)}
              />
            </motion.div>
          )}

          {view === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              {user ? (
                <RecipeUpload onComplete={() => setView('home')} user={user} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <h2 className="text-2xl font-serif mb-4">Please sign in to upload a recipe</h2>
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-6 py-2 bg-[#d48c45] text-white rounded-full font-medium"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {view === 'profile' && user && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Profile user={user} onRecipeClick={handleRecipeClick} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p className="font-serif italic text-xl text-[#333] mb-4">SavoryShare</p>
          <p className="max-w-md mx-auto mb-8 font-sans">Discover, share, and celebrate the joy of cooking with food enthusiasts from around the world.</p>
          <div className="text-xs tracking-widest uppercase">© 2026 SavoryShare. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
