import { motion } from 'motion/react';
import { ChefHat, Plus, User as UserIcon, Home, LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut, User } from 'firebase/auth';
import { cn } from '../lib/utils';

interface NavbarProps {
  user: User | null;
  onViewChange: (view: 'home' | 'recipe' | 'upload' | 'profile') => void;
  onAuthClick: () => void;
  currentView: string;
}

export function Navbar({ user, onViewChange, onAuthClick, currentView }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => onViewChange('home')}
          >
            <div className="w-10 h-10 bg-[#d48c45] rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12">
              <ChefHat size={24} />
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight text-[#333333]">SavoryShare</span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-sans font-medium text-gray-600">
            <button 
              onClick={() => onViewChange('home')}
              className={cn("hover:text-[#d48c45] transition-colors", currentView === 'home' && "text-[#d48c45]")}
            >
              Discover
            </button>
            <button 
              onClick={() => onViewChange('upload')}
              className={cn("hover:text-[#d48c45] transition-colors", currentView === 'upload' && "text-[#d48c45]")}
            >
              Share Recipe
            </button>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onViewChange('profile')}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors",
                    currentView === 'profile' && "bg-[#d48c45]/10 text-[#d48c45]"
                  )}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <UserIcon size={20} className="text-[#333]" />
                  )}
                  <span className="hidden sm:block text-sm font-medium">{user.displayName?.split(' ')[0]}</span>
                </button>
                <button 
                  onClick={() => signOut(auth)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onAuthClick}
                className="bg-[#333333] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#d48c45] transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
