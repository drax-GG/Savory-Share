import { motion } from 'motion/react';
import { ArrowRight, Star, Clock, Utensils } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export function Hero({ onExploreClick }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-[#fdfaf6] pt-16 pb-12 sm:pt-24 lg:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl sm:text-7xl font-serif font-black leading-[0.9] text-[#333333] mb-6">
              Taste the World <br/>
              <span className="italic text-[#d48c45]">Every Meal</span> Tells a Story.
            </h1>
            <p className="text-xl text-gray-600 font-sans leading-relaxed mb-8 max-w-lg">
              Join our community of home chefs and culinary experts. Discover thousands of hand-crafted recipes and share your own masterpieces.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onExploreClick}
                className="bg-[#d48c45] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#c37b34] transition-all shadow-xl shadow-[#d48c45]/20"
              >
                Explore Best Sellers <ArrowRight size={20} />
              </button>
              <div className="flex items-center gap-4 text-gray-400 font-sans">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img 
                      key={i}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} 
                      className="w-10 h-10 rounded-full border-2 border-[#fdfaf6]"
                      alt="User"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium"><span className="text-[#333] font-bold">10k+</span> chefs active</span>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-gray-100 pt-8">
              <div>
                <div className="flex items-center gap-2 text-[#d48c45] mb-1">
                  <Star fill="currentColor" size={16} />
                  <span className="font-bold">4.9/5</span>
                </div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">User Rating</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#d48c45] mb-1">
                  <Clock size={16} />
                  <span className="font-bold">15-30m</span>
                </div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Avg. Prep Time</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#d48c45] mb-1">
                  <Utensils size={16} />
                  <span className="font-bold">500+</span>
                </div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">New Recipes/mo</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-4 bg-[#d48c45]/10 rounded-[3rem] blur-3xl transform -rotate-6"></div>
            <img 
              src="/src/assets/images/savory_share_hero_1779092662572.png" 
              alt="Mediterranean Feast" 
              className="relative w-full h-auto rounded-[2.5rem] shadow-2xl object-cover aspect-[4/5]"
              referrerPolicy="no-referrer"
            />
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl max-w-[200px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=chef" className="w-10 h-10 rounded-full" alt="Chef" />
                <div>
                  <p className="text-xs font-semibold text-gray-400">Chef Recommendation</p>
                  <p className="text-sm font-bold text-[#333]">Vibrant Quinoa Salad</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">"The perfect balance of fresh ingredients and zest!"</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
