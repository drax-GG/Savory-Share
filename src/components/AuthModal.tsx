import { motion, AnimatePresence } from 'motion/react';
import { X, ChefHat, Chrome, AlertCircle } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection to avoid transparent failures
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for sign-in. Please contact the administrator.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
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
            className="relative bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl"
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

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-left">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-red-600 font-sans">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold text-[#333] hover:border-[#d48c45] hover:bg-[#fdfaf6] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  id="google-sign-in-btn"
                >
                  <div className="bg-gray-100 p-1.5 rounded-lg group-hover:bg-white transition-colors">
                    <Chrome size={20} className={loading ? "animate-spin" : "text-[#333]"} />
                  </div>
                  {loading ? 'Connecting...' : 'Continue with Google'}
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
