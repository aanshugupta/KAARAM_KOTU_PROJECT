
import React, { useState, useMemo, useEffect } from 'react';
// Changed import from react-router-dom to react-router to resolve missing export errors
import { useParams, Link, useNavigate } from 'react-router';
import { Star, ShoppingCart, Plus, Minus, MessageCircle, ShieldCheck, Truck, RefreshCw, ChevronLeft, Check, PackageCheck, Heart, Maximize2, Leaf, Info, Timer, UserCheck, X, Quote } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface ProductDetailProps {
  onAddToCart: (product: Product, quantity: number, giftData?: { isGift: boolean, note: string }) => void;
  onProductView: (id: string) => void;
  recentIds: string[];
  compareIds: string[];
  onToggleCompare: (id: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onAddToCart, onProductView, recentIds, compareIds, onToggleCompare }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'storage' | 'reviews'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  const product = useMemo(() => PRODUCTS.find(p => p.id === id), [id]);

  useEffect(() => { 
    if (id) onProductView(id); 
    window.scrollTo(0, 0);
  }, [id, onProductView]);

  const [mainImage, setMainImage] = useState(product?.image || '');
  useEffect(() => { if (product) setMainImage(product.image); }, [product]);

  const thumbnails = [
    product?.image, 
    `https://picsum.photos/seed/${id}1/600/600`, 
    `https://picsum.photos/seed/${id}2/600/600`,
    `https://picsum.photos/seed/${id}3/600/600`
  ].filter(Boolean) as string[];

  const handlePincodeCheck = () => {
    if (pincode.length === 6) setDeliveryEstimate("Estimated delivery in 3-5 business days.");
    else setDeliveryEstimate(null);
  };

  const relatedProducts = useMemo(() => 
    PRODUCTS.filter(p => p.category === product?.category && p.id !== id).slice(0, 4), 
  [product?.category, id]);

  const recentProducts = useMemo(() => 
    PRODUCTS.filter(p => recentIds.includes(p.id) && p.id !== id).slice(0, 4),
  [recentIds, id]);

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const phoneNumber = "919000000000"; 
    const message = encodeURIComponent(
      `Hi Heritage Flavors, I'm interested in ordering:\n\n*Product:* ${product.name}\n*Quantity:* ${quantity}\n*Price:* ₹${product.price * quantity}\n\nPlease share payment details.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (!product) return <div className="pt-40 text-center serif text-3xl text-olive">Product not found.</div>;

  return (
    <div className="pt-28 pb-20 container mx-auto px-6 fade-in relative">
      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4">
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-8 right-8 text-white hover:text-gold transition-colors"><X size={32} /></button>
          <img src={mainImage} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" alt="Full view" />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-16 mb-20">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-white shadow-xl border border-gray-100 group">
            <img 
              src={mainImage} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
              alt={product.name}
            />
            <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="bg-white/90 p-2.5 rounded-full shadow-lg hover:bg-gold hover:text-white transition-all text-olive"><Heart size={18} /></button>
               <button className="bg-white/90 p-2.5 rounded-full shadow-lg hover:bg-gold hover:text-white transition-all text-olive" onClick={() => setIsLightboxOpen(true)}><Maximize2 size={18} /></button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
             {thumbnails.map((img, i) => (
               <button 
                key={i} 
                onClick={() => setMainImage(img)} 
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 ${mainImage === img ? 'border-gold shadow-md scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
               >
                 <img src={img} className="w-full h-full object-cover rounded-lg" alt={`Thumb ${i}`} />
               </button>
             ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-2">
               <span className="text-gold font-bold tracking-[0.2em] text-[9px] uppercase">{product.category}</span>
               <span className="w-1 h-1 bg-gray-200 rounded-full" />
               <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Small Batch Fresh</span>
             </div>
             <button 
              onClick={() => onToggleCompare(product.id)} 
              className={`text-[9px] font-bold uppercase tracking-widest py-1 px-3 rounded-full border transition-all flex items-center gap-2 ${compareIds.includes(product.id) ? 'bg-gold text-white border-gold' : 'bg-cream-bg border-gold/10 text-olive hover:border-gold hover:text-gold'}`}
             >
               {compareIds.includes(product.id) ? 'Comparing' : 'Compare'}
             </button>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-olive serif mb-4 tracking-tight leading-tight">{product.name}</h1>
          
          <div className="flex items-center space-x-5 mb-6 pb-6 border-b border-gray-100">
             <div className="flex items-center text-gold">
               {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} className={i < Math.floor(product.rating) ? 'fill-gold' : ''} />)}
               <span className="ml-2 font-bold text-olive text-xs">{product.rating}</span>
             </div>
             <span className="text-xs text-gray-400 font-medium">Verified {product.reviews} reviews</span>
          </div>

          <div className="flex items-baseline space-x-3 mb-6">
            <span className="text-4xl font-bold text-olive serif">₹{product.price}</span>
            {product.originalPrice && <span className="text-xl text-gray-300 line-through serif">₹{product.originalPrice}</span>}
            {product.onOffer && <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-red-100 ml-2">Offer</div>}
          </div>

          <p className="text-gray-500 text-md mb-8 leading-relaxed italic border-l-4 border-gold/20 pl-5">"{product.description}"</p>

          <div className="space-y-6 mb-10">
             <div className="flex items-center gap-4">
                <div className="flex items-center border border-olive rounded-full h-14 px-3 bg-white shadow-sm">
                   <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-8 h-8 flex items-center justify-center text-olive hover:text-gold transition-colors"><Minus size={16} /></button>
                   <span className="w-10 text-center font-bold text-lg text-olive">{quantity}</span>
                   <button onClick={() => setQuantity(q => q+1)} className="w-8 h-8 flex items-center justify-center text-olive hover:text-gold transition-colors"><Plus size={16} /></button>
                </div>
                <button 
                  onClick={() => {
                     setIsLoading(true);
                     setTimeout(() => {
                       onAddToCart(product, quantity);
                       setIsLoading(false);
                     }, 600);
                  }}
                  disabled={isLoading}
                  className="flex-1 bg-olive text-white h-14 rounded-full font-bold shadow-xl hover:bg-gold transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-[0.15em] text-[10px]"
                >
                  {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ShoppingCart size={18} /> Add to Basket</>}
                </button>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { onAddToCart(product, quantity); navigate('/checkout'); }} className="h-14 border border-olive text-olive font-bold rounded-full hover:bg-olive hover:text-white transition-all uppercase tracking-widest text-[10px] shadow-sm">Buy Now</button>
                <button 
                  onClick={handleWhatsAppOrder}
                  className="h-14 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] shadow-sm group"
                >
                  <MessageCircle size={18} className="group-hover:scale-110 transition-transform" /> WhatsApp Order
                </button>
             </div>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-3 mb-10">
             <div className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-1.5">
                <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold"><ShieldCheck size={16} /></div>
                <span className="text-[9px] font-bold text-olive uppercase tracking-tighter">100% Natural</span>
             </div>
             <div className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-1.5">
                <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold"><PackageCheck size={16} /></div>
                <span className="text-[9px] font-bold text-olive uppercase tracking-tighter">Hygienic Prep</span>
             </div>
             <div className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-1.5">
                <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold"><RefreshCw size={16} /></div>
                <span className="text-[9px] font-bold text-olive uppercase tracking-tighter">Stone Ground</span>
             </div>
          </div>

          {/* Pincode Check */}
          <div className="bg-cream-bg p-5 rounded-2xl border border-gold/10 mb-8">
             <h4 className="text-[9px] font-bold text-olive uppercase tracking-widest mb-3 flex items-center gap-2"><Truck size={12} className="text-gold" /> Check Delivery</h4>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={6} 
                  placeholder="Enter Pincode" 
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 bg-white border border-gray-100 rounded-full px-5 py-2.5 text-[10px] focus:outline-none focus:border-gold"
                />
                <button 
                  onClick={handlePincodeCheck}
                  className="bg-olive text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all"
                >
                  Check
                </button>
             </div>
             {deliveryEstimate && <p className="mt-2 text-[9px] font-bold text-green-600 flex items-center gap-1"><Check size={10} /> {deliveryEstimate}</p>}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <section className="mb-24">
        <div className="flex flex-wrap border-b border-gray-100 mb-8 gap-6 md:gap-12">
          {[
            { id: 'desc', label: 'How to Enjoy' },
            { id: 'ingredients', label: 'Ingredients' },
            { id: 'storage', label: 'Shelf Life' },
            { id: 'reviews', label: 'Stories' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? 'text-olive' : 'text-gray-300 hover:text-gold'}`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold rounded-full" />}
            </button>
          ))}
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-50 min-h-[250px]">
          {activeTab === 'desc' && (
            <div className="grid md:grid-cols-2 gap-12 animate-fade-in">
              <div className="space-y-6">
                 <h3 className="text-2xl font-bold text-olive serif">The Artisan Experience</h3>
                 <p className="text-sm text-gray-500 leading-relaxed italic">{product.prepMethod || "Every batch is prepared with love and mastery, using time-honored techniques passed down through generations."}</p>
                 <div className="space-y-3">
                    <h4 className="font-bold text-olive text-xs uppercase tracking-widest">Serving Suggestions:</h4>
                    <ul className="space-y-2">
                       {product.usageTips?.map((tip, i) => (
                         <li key={i} className="flex items-start gap-3 text-xs text-gray-400">
                           <div className="w-1 h-1 bg-gold rounded-full mt-1.5 shrink-0" /> {tip}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
              <div className="bg-cream-bg rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                 <Quote className="text-gold/20" size={32} />
                 <p className="text-olive font-bold serif text-lg italic">"Tastes just like home. The texture and aroma are incredibly nostalgic."</p>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white shadow-sm"><img src="https://i.pravatar.cc/100?u=a2" className="w-full h-full object-cover" /></div>
                    <div className="text-left"><p className="text-[9px] font-bold text-olive uppercase tracking-widest">Meera R.</p><p className="text-[8px] text-gray-400 uppercase tracking-widest">Verified Buyer</p></div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-green-100">
                    <Leaf size={12} /> 100% Vegetarian & Pure
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    {product.ingredients.map((ing, i) => (
                       <div key={i} className="flex items-center gap-2 bg-cream-bg p-3 rounded-xl">
                          <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                          <span className="text-[10px] font-bold text-olive">{ing}</span>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="space-y-4">
                 <h4 className="text-olive font-bold serif text-xl">Artisan Prep</h4>
                 <p className="text-xs text-gray-500 leading-relaxed italic">Handmade using unrefined jaggery, pure cow ghee, and stone-ground grains to preserve natural nutrients and fibers.</p>
                 <div className="p-5 bg-olive text-white rounded-2xl space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gold">Stone Ground Mastery</p>
                    <p className="text-xs italic">Preserves the essential oils and natural texture of the grains.</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <div className="flex items-center gap-6 p-6 bg-cream-bg rounded-2xl border border-gold/10">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gold shadow-sm shrink-0"><Timer size={28} /></div>
                    <div>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Peak Freshness For</p>
                       <p className="text-2xl font-bold text-olive serif">{product.shelfLife}</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <h4 className="font-bold text-olive text-xs uppercase tracking-widest flex items-center gap-2"><Info size={14} className="text-gold" /> Storage Tips:</h4>
                    <p className="text-xs text-gray-500 leading-relaxed italic border-l-4 border-gold/20 pl-5">{product.storage}</p>
                 </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden group">
                 <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Storage context" />
                 <div className="absolute inset-0 bg-olive/40 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="text-center text-white p-6">
                       <PackageCheck size={28} className="mx-auto mb-3 text-gold" />
                       <h5 className="font-bold serif text-lg mb-1">Quality Guaranteed</h5>
                       <p className="text-[10px] italic opacity-80">Moisture-lock packaging ensures aroma stays intact.</p>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-olive serif">Customer Stories</h3>
                    <p className="text-gray-400 text-[9px] mt-0.5 uppercase tracking-widest font-bold">Trusted by over 1,200 families</p>
                  </div>
                  <button className="bg-olive text-white px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-md">Add Review</button>
               </div>
               
               <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { name: 'Arjun V.', date: 'Oct 2024', stars: 5, comment: "I've tried many Ariselu brands, but this one is outstanding. Not too sweet, perfectly crisp." },
                    { name: 'Priya M.', date: 'Dec 2024', stars: 5, comment: "The ginger pickle is a life saver. Amazing kick of spice!" }
                  ].map((rev, i) => (
                    <div key={i} className="bg-cream-bg/50 p-6 rounded-2xl space-y-3 border border-gray-100">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-olive rounded-full flex items-center justify-center text-gold font-bold text-[10px] uppercase">{rev.name[0]}</div>
                             <div>
                                <p className="text-[10px] font-bold text-olive uppercase tracking-widest">{rev.name}</p>
                                <p className="text-[8px] text-gray-400 uppercase tracking-widest">{rev.date}</p>
                             </div>
                          </div>
                          <div className="flex text-gold">
                             {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={10} fill={s < rev.stars ? 'currentColor' : 'none'} className={s < rev.stars ? 'fill-gold' : ''} />)}
                          </div>
                       </div>
                       <p className="text-xs text-gray-500 italic leading-relaxed">"{rev.comment}"</p>
                       <div className="flex items-center gap-1 text-green-600 text-[8px] font-bold uppercase tracking-widest">
                          <UserCheck size={10} /> Verified
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mb-24">
          <div className="flex justify-between items-end mb-10">
             <div className="space-y-1">
               <h2 className="text-2xl md:text-3xl font-bold serif text-olive uppercase tracking-tight">You May Also Love</h2>
               <div className="w-10 h-1 bg-gold" />
             </div>
             <Link to="/shop" className="text-[9px] font-bold text-gold uppercase tracking-[0.2em] border-b border-gold/30 pb-0.5 hover:text-olive hover:border-olive transition-all">Explore All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {relatedProducts.map(p => (
               <ProductCard 
                key={p.id} 
                product={p} 
                onAddToCart={(p) => onAddToCart(p, 1)} 
                isComparing={compareIds.includes(p.id)}
                onToggleCompare={onToggleCompare}
               />
             ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-8">
             <div className="space-y-1">
               <h2 className="text-xl md:text-2xl font-bold serif text-olive uppercase tracking-tight opacity-50">Recently Viewed</h2>
             </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
             {recentProducts.map(p => (
               <Link key={p.id} to={`/product/${p.id}`} className="group space-y-2">
                  <div className="aspect-square rounded-xl overflow-hidden bg-cream-bg shadow-sm">
                     <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h4 className="text-[9px] font-bold text-olive uppercase tracking-widest truncate group-hover:text-gold transition-colors">{p.name}</h4>
               </Link>
             ))}
          </div>
        </section>
      )}
      
      {/* Sticky Mobile Add to Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-gray-100 p-3 shadow-2xl flex gap-3 animate-[slideUp_0.4s_ease-out]">
         <div className="flex items-center bg-cream-bg rounded-full px-3 h-10">
            <button onClick={() => setQuantity(q => Math.max(1, q-1))}><Minus size={14} /></button>
            <span className="w-8 text-center font-bold text-xs">{quantity}</span>
            <button onClick={() => setQuantity(q => q+1)}><Plus size={14} /></button>
         </div>
         <button 
           onClick={() => onAddToCart(product, quantity)}
           className="flex-1 bg-olive text-white h-10 rounded-full font-bold uppercase tracking-widest text-[9px] shadow-lg flex items-center justify-center gap-1.5"
         >
            <ShoppingCart size={14} /> Add to Basket
         </button>
      </div>

      <style>{`
         @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
         }
         @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
         }
         .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
         }
      `}</style>
    </div>
  );
};

export default ProductDetail;
