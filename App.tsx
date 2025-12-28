
import React, { useState, useCallback, useEffect, useMemo } from 'react';
// Changed import from react-router-dom to react-router to resolve missing export errors
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home';
import Shop from './views/Shop';
import ProductDetail from './views/ProductDetail';
import SnowEffect from './components/SnowEffect';
import ConfettiEffect from './components/ConfettiEffect';
import CartDrawer from './components/CartDrawer';
import { Product, CartItem } from './types';
import { ShoppingBag, GitCompare, X } from 'lucide-react';
import { PRODUCTS } from './constants';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// Component to determine snow density based on current path
const SnowManager: React.FC<{ festiveMode: boolean }> = ({ festiveMode }) => {
  const location = useLocation();
  
  const density = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/product/')) return 'reduced';
    if (path.includes('/checkout')) return 'minimal';
    return 'full';
  }, [location.pathname]);

  if (!festiveMode) return null;
  return <SnowEffect density={density as any} />;
};

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [festiveMode, setFestiveMode] = useState(true); // Enabled by default
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRecent = localStorage.getItem('recentlyViewed');
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = useCallback((product: Product, quantity: number = 1, giftData?: { isGift: boolean, note: string }) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity, ...giftData } : item);
      }
      return [...prev, { ...product, quantity, ...giftData }];
    });
    
    // Trigger confetti celebration
    setConfettiTrigger(false);
    setTimeout(() => setConfettiTrigger(true), 10);
    
    // Open drawer after a short delay
    setTimeout(() => setIsCartOpen(true), 800);
  }, []);

  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const addToRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed(prev => {
      const next = [id, ...prev.filter(i => i !== id)].slice(0, 4);
      localStorage.setItem('recentlyViewed', JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  const clearCompare = () => setCompareIds([]);

  const compareProducts = PRODUCTS.filter(p => compareIds.includes(p.id));

  return (
    <Router>
      <ScrollToTop />
      <div className={`relative min-h-screen flex flex-col selection:bg-gold selection:text-white ${festiveMode ? 'festive-active' : ''}`}>
        <SnowManager festiveMode={festiveMode} />
        <ConfettiEffect trigger={confettiTrigger} />
        
        <Header 
          cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)}
        />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home onAddToCart={handleAddToCart} festiveMode={festiveMode} compareIds={compareIds} onToggleCompare={toggleCompare} />} />
            <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} compareIds={compareIds} onToggleCompare={toggleCompare} />} />
            <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} onProductView={addToRecentlyViewed} recentIds={recentlyViewed} compareIds={compareIds} onToggleCompare={toggleCompare} />} />
            <Route path="*" element={<Home onAddToCart={handleAddToCart} festiveMode={festiveMode} compareIds={compareIds} onToggleCompare={toggleCompare} />} />
          </Routes>
        </main>

        <Footer />

        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />

        {/* Comparison Bar */}
        {compareIds.length > 0 && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[1000] bg-white border border-gold/30 rounded-full px-6 py-3 shadow-2xl flex items-center space-x-6 animate-bounce-subtle">
            <div className="flex -space-x-3">
              {compareProducts.map(p => (
                <div key={p.id} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md">
                   <img src={p.image} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-xs font-bold text-olive uppercase tracking-widest">
              {compareIds.length} Products to Compare
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsCompareModalOpen(true)}
                className="bg-gold text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-olive transition-all"
              >
                COMPARE NOW
              </button>
              <button onClick={clearCompare} className="text-gray-400 hover:text-red-500"><X size={18} /></button>
            </div>
          </div>
        )}

        {/* Comparison Modal */}
        {isCompareModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCompareModalOpen(false)} />
             <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-[fadeIn_0.4s_ease-out]">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-cream-bg">
                   <h2 className="text-2xl font-bold serif text-olive">Product Comparison</h2>
                   <button onClick={() => setIsCompareModalOpen(false)}><X size={24} /></button>
                </div>
                <div className="p-8 overflow-x-auto">
                   <table className="w-full border-collapse">
                      <thead>
                         <tr>
                            <th className="p-4 text-left font-bold text-gray-400 uppercase text-[10px] tracking-[0.2em]">Features</th>
                            {compareProducts.map(p => (
                               <th key={p.id} className="p-4 text-center min-w-[200px]">
                                  <img src={p.image} className="w-32 h-32 object-cover rounded-2xl mx-auto mb-4 border border-gold/10" />
                                  <h3 className="font-bold text-olive serif text-lg">{p.name}</h3>
                                  <p className="text-gold font-bold">₹{p.price}</p>
                               </th>
                            ))}
                         </tr>
                      </thead>
                      <tbody>
                         <tr className="border-t border-gray-50">
                            <td className="p-4 font-bold text-olive text-sm">Category</td>
                            {compareProducts.map(p => <td key={p.id} className="p-4 text-center text-sm text-gray-500">{p.category}</td>)}
                         </tr>
                         <tr className="border-t border-gray-50">
                            <td className="p-4 font-bold text-olive text-sm">Best For</td>
                            {compareProducts.map(p => <td key={p.id} className="p-4 text-center text-sm text-gray-500">{p.bestFor}</td>)}
                         </tr>
                         <tr className="border-t border-gray-50">
                            <td className="p-4 font-bold text-olive text-sm">Shelf Life</td>
                            {compareProducts.map(p => <td key={p.id} className="p-4 text-center text-sm text-gray-500">{p.shelfLife}</td>)}
                         </tr>
                         <tr className="border-t border-gray-50">
                            <td className="p-4 font-bold text-olive text-sm">Ingredients</td>
                            {compareProducts.map(p => <td key={p.id} className="p-4 text-center text-xs text-gray-400 leading-relaxed italic">{p.ingredients.join(', ')}</td>)}
                         </tr>
                         <tr className="border-t border-gray-50">
                            <td className="p-4 font-bold text-olive text-sm">Rating</td>
                            {compareProducts.map(p => <td key={p.id} className="p-4 text-center text-sm font-bold text-gold">{p.rating} / 5.0</td>)}
                         </tr>
                         <tr>
                            <td></td>
                            {compareProducts.map(p => (
                               <td key={p.id} className="p-6 text-center">
                                  <button 
                                    onClick={() => {
                                      handleAddToCart(p, 1);
                                      setIsCompareModalOpen(false);
                                    }}
                                    className="bg-olive text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all"
                                  >
                                    ADD TO CART
                                  </button>
                               </td>
                            ))}
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        <style>{`
           @keyframes bounce-subtle {
             0%, 100% { transform: translate(-50%, 0); }
             50% { transform: translate(-50%, -5px); }
           }
           .animate-bounce-subtle {
             animation: bounce-subtle 3s infinite ease-in-out;
           }
        `}</style>

        {cartItems.length > 0 && !isCartOpen && (
          <button 
            onClick={() => setIsCartOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-[999] bg-olive text-white p-4 rounded-full shadow-2xl border-2 border-gold active:scale-95 transition-all"
          >
            <div className="relative">
              <ShoppingBag size={24} />
              <span className="absolute -top-3 -right-3 bg-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
          </button>
        )}
      </div>
    </Router>
  );
};

export default App;
