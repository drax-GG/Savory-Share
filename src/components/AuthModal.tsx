import { motion, AnimatePresence } from 'motion/react';
import { X, ChefHat, Chrome } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#333]/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl overflow-hidden"
          >
            <div className="relative p-12 text-center">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
                id="close-auth-modal"
              >
                <X size={20} className="text-gray-400" />
              </button>

              <div className="w-20 h-20 bg-[#fdfaf6] rounded-[2rem] flex items-center justify-center text-[#d48c45] mx-auto mb-8 border border-[#d48c45]/10">
                <ChefHat size={40} />
              </div>

              <h2 className="text-4xl font-serif font-black text-[#333] mb-4">Welcome Back</h2>
              <p className="text-gray-500 font-sans mb-10">Join our community of culinary creators and start sharing your flavors with the world.</p>

              <div className="space-y-4">
                <button 
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold text-[#333] hover:border-[#d48c45] hover:bg-[#fdfaf6] transition-all group"
                  id="google-sign-in-btn"
                >
                  <div className="bg-gray-100 p-1.5 rounded-lg group-hover:bg-white transition-colors">
                    <Chrome size={20} className="text-[#333]" />
                  </div>
                  Continue with Google
                </button>
              </div>

              <p className="mt-10 text-xs text-gray-400 leading-relaxed">
                By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
            
            <div className="bg-[#fdfaf6] py-6 px-12 border-t border-gray-100 text-center">
              <p className="text-sm font-sans text-gray-500 italic">"Good food is the foundation of genuine happiness."</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
