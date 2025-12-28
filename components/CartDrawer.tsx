
import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Gift } from 'lucide-react';
import { CartItem } from '../types';
// Changed import from react-router-dom to react-router to resolve missing export errors
import { Link } from 'react-router';
import { PRODUCTS } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const bestSellers = PRODUCTS.slice(0, 3);

  return (
    <div className={`fixed inset-0 z-[1200] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-cream-bg shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-8 bg-olive text-white flex justify-between items-center rounded-bl-[3rem]">
          <div className="flex items-center gap-3"><ShoppingBag className="text-gold" /> <h2 className="text-xl font-bold serif">Your Basket</h2></div>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="text-6xl grayscale opacity-30">🍯</div>
              <h3 className="text-2xl font-bold text-olive serif uppercase tracking-widest">Your basket is empty</h3>
              <p className="text-gray-500">But our best sellers are waiting for you!</p>
              <div className="w-full space-y-4 pt-6">
                 {bestSellers.map(p => (
                   <Link key={p.id} to={`/product/${p.id}`} onClick={onClose} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 group">
                      <img src={p.image} className="w-12 h-12 object-cover rounded-xl" />
                      <div className="flex-1 text-left"><h4 className="text-xs font-bold text-olive truncate">{p.name}</h4><p className="text-xs text-gold">₹{p.price}</p></div>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
                 ))}
              </div>
              <button onClick={onClose} className="bg-olive text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs">Start Shopping</button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-50 group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0"><img src={item.image} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start"><h4 className="font-bold text-olive text-sm truncate pr-2">{item.name}</h4><button onClick={() => onRemoveItem(item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button></div>
                    <p className="text-xs text-gray-400 mb-3">Unit Price: ₹{item.price}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-cream-bg rounded-full px-3 py-1">
                        <button onClick={() => onUpdateQuantity(item.id, -1)}><Minus size={14} /></button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)}><Plus size={14} /></button>
                      </div>
                      <span className="font-bold text-olive">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 bg-white rounded-tl-[3rem] border-t border-gray-50 space-y-6">
            <div className="flex justify-between text-xl font-bold text-olive serif"><span>Total</span><span>₹{subtotal}</span></div>
            <Link to="/checkout" onClick={onClose} className="w-full bg-olive text-white py-5 rounded-full font-bold flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-2xl hover:bg-gold transition-all">Proceed to Checkout <ArrowRight size={18} /></Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
