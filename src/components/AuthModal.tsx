import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChefHat, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Using setTimeout to simulate an async check
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        const mockUser = {
          uid: 'admin-id',
          email: 'admin@savoryshare.com',
          displayName: 'Admin Chef',
          photoURL: null
        };
        onLogin(mockUser);
        onClose();
      } else {
        setError('Invalid username or password. Please use admin / admin123');
      }
      setLoading(false);
    }, 600);
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
              <p className="text-gray-500 font-sans mb-10">Sign in with your admin credentials to start sharing your flavors.</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-left">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-red-600 font-sans">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                  <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full bg-gray-50 border-2 border-transparent px-6 py-4 rounded-2xl font-sans focus:bg-white focus:border-[#d48c45] transition-all outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="admin123"
                    className="w-full bg-gray-50 border-2 border-transparent px-6 py-4 rounded-2xl font-sans focus:bg-white focus:border-[#d48c45] transition-all outline-none"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-[#d48c45] text-white py-4 rounded-2xl font-bold hover:bg-[#c37b34] transition-all shadow-xl shadow-[#d48c45]/20 disabled:opacity-50 mt-4"
                >
                  {loading ? 'Verifying...' : 'Sign In'}
                </button>
              </form>

              <p className="mt-10 text-xs text-gray-400 leading-relaxed">
                Use <span className="font-bold">admin</span> / <span className="font-bold">admin123</span> to login.
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
