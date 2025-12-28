
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star, Sparkles, Leaf, ShieldCheck, HeartHandshake, Box } from 'lucide-react';
// Changed import from react-router-dom to react-router to resolve missing export errors
import { Link } from 'react-router';
import { PRODUCTS, CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import EditorialMarquee from '../components/EditorialMarquee';
import { Product } from '../types';

interface HomeProps {
  onAddToCart: (product: Product) => void;
  festiveMode?: boolean;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onAddToCart, festiveMode, compareIds, onToggleCompare }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / 400, 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      if (distance < 0) clearInterval(timer);
      else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bestSellers = PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="scroll-container-outer relative">
      {/* SECTION 1: HERO (Sticky) */}
      <section 
        className={`section-sticky h-screen flex items-center overflow-hidden transition-colors duration-1000 ${festiveMode ? 'bg-[#1e2f23]' : 'bg-olive'}`}
        style={{ 
          opacity: 1 - scrollProgress,
          visibility: scrollProgress >= 1 ? 'hidden' : 'visible' 
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold rounded-full translate-x-1/3 -translate-y-1/3" />
        </div>

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 text-center lg:text-left fade-in">
            <div className="space-y-4">
              <span className="text-gold tracking-[0.4em] font-bold text-[10px] uppercase block">Est. 1984 | Small Batch Tradition</span>
              <h1 className="text-4xl md:text-7xl font-bold serif text-white leading-[1.1]">
                AUTHENTIC <br />
                <span className="text-gold italic">HOMEMADE</span> <br />
                EXPERIENCE
              </h1>
              <p className="text-lg text-white/70 max-w-md mx-auto lg:mx-0 font-light leading-relaxed">
                Discover the pure joy of traditional Indian delicacies. Handcrafted with stone-ground ingredients and a passion for preserving our heritage.
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link to="/shop" className="bg-gold text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-white hover:text-olive transition-all transform hover:-translate-y-1 active:scale-95 flex items-center group text-xs tracking-widest uppercase">
                EXPLORE COLLECTION <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Link>
              <Link to="/shop?category=Combos" className="border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-olive transition-all text-xs tracking-widest uppercase">
                FESTIVE COMBOS
              </Link>
            </div>
          </div>

          <div className="relative h-[500px] hidden lg:block">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-white/10 rounded-full animate-spin-slow" />
             <img 
               src="https://ramadevifoods.com/cdn/shop/files/pickle-love.jpg?v=1721797884&width=900" 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] object-cover rounded-[3rem] rotate-6 shadow-2xl border-2 border-gold/10 hover:rotate-0 transition-all duration-1000 cursor-pointer" 
               alt="Traditional Pickle Spread"
             />
             <div className="absolute bottom-10 right-10 bg-white p-5 rounded-2xl shadow-2xl animate-bounce">
                <div className="flex text-gold mb-1"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></div>
                <div className="text-[10px] font-bold text-olive uppercase tracking-widest">Trust Score: 4.9/5</div>
             </div>
          </div>
        </div>
      </section>

      {/* MARQUEE 1: BELOW HERO - Adjusted for Slower Motion and Smaller Text */}
      <EditorialMarquee 
        label="The Heritage Promise"
        text="HANDMADE • AUTHENTIC • TRADITIONAL • PURE" 
        direction="left"
        speed={120}
        fontSize="text-2xl md:text-4xl"
        opacity={0.8}
        className="bg-white border-y border-olive/10"
        outline
        withIcon
      />

      {/* SECTION 2: CATEGORY SHOWCASE */}
      <section className="section-overlap relative py-24 overflow-hidden z-20 bg-cream-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <span className="text-gold font-bold tracking-[0.2em] text-[10px] uppercase">Traditional Specialties</span>
            <h2 className="text-3xl md:text-4xl font-bold serif text-olive uppercase tracking-tight">Handcrafted Collections</h2>
            <div className="w-12 h-1 bg-gold mx-auto" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
             {CATEGORIES.map((cat) => (
               <Link key={cat.name} to={`/shop?category=${cat.name}`} className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <img src={cat.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-0 right-0 text-center space-y-1">
                    <h3 className="text-md font-bold serif text-white uppercase tracking-[0.1em]">{cat.name}</h3>
                    <div className="text-[9px] font-bold text-gold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">View All</div>
                  </div>
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* MARQUEE 2: SECTION DIVIDER - Adjusted for Slower Motion and Smaller Text */}
      <EditorialMarquee 
        label="Editorial Notes"
        text="FROM OUR KITCHEN TO YOUR HOME • SMALL BATCH" 
        direction="right"
        speed={150}
        fontSize="text-lg md:text-2xl"
        opacity={0.5}
        className="bg-cream-bg border-y border-gold/5"
      />

      {/* SECTION 3: STORY / FESTIVE */}
      <section className="relative py-32 bg-cream-bg z-20">
        <div className="absolute inset-0 z-0">
           <img src="https://ramadevifoods.com/cdn/shop/files/pickle-love.jpg?v=1721797884&width=900" className="w-full h-full object-cover opacity-5" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
           <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gold/10 grid lg:grid-cols-2 items-center transform -translate-y-10">
              <div className="p-12 lg:p-20 space-y-8">
                 <div className="inline-flex items-center gap-2 bg-gold/10 px-3 py-1.5 rounded-full">
                    <Sparkles size={14} className="text-gold" />
                    <span className="text-[9px] font-bold text-gold uppercase tracking-[0.2em]">Limited Festive Batch</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold serif text-olive leading-tight">THE WINTER <br /> CELEBRATION BOX</h2>
                 <p className="text-md text-gray-500 italic">"A curated assortment of our finest ghee-based sweets and spicy snacks, specially prepared for the winter season."</p>
                 
                 <div className="grid grid-cols-4 gap-3 max-w-sm">
                    {[
                      { label: 'Days', val: timeLeft.days },
                      { label: 'Hours', val: timeLeft.hours },
                      { label: 'Min', val: timeLeft.minutes },
                      { label: 'Sec', val: timeLeft.seconds }
                    ].map(t => (
                      <div key={t.label} className="text-center">
                         <div className="text-2xl font-bold text-olive serif bg-cream-bg w-full aspect-square flex items-center justify-center rounded-xl shadow-sm mb-1.5">{t.val}</div>
                         <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.label}</div>
                      </div>
                    ))}
                 </div>

                 <Link to="/shop?category=Combos" className="inline-block bg-olive text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-gold transition-all text-xs uppercase tracking-widest">RESERVE YOUR BOX</Link>
              </div>
              <div className="h-[550px] hidden lg:block p-8">
                 <img src="https://ramadevifoods.com/cdn/shop/files/Assorted-Laddu-box.png?v=1730184785&width=900" className="w-full h-full object-cover rounded-[2rem] shadow-2xl shadow-gold/20" alt="Festive Box" />
              </div>
           </div>
        </div>
      </section>

      {/* SECTION 4: BEST SELLERS */}
      <section className="py-24 bg-white relative z-30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-gold font-bold tracking-widest text-[10px] uppercase">Most Loved</span>
              <h2 className="text-3xl font-bold serif text-olive uppercase tracking-tight">Our Best Sellers</h2>
            </div>
            <Link to="/shop?filter=bestsellers" className="bg-cream-bg text-olive px-6 py-2.5 rounded-full font-bold text-[9px] uppercase tracking-widest border border-gold/10 hover:bg-gold hover:text-white transition-all">View All Favorites</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                isComparing={compareIds.includes(product.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE 3: BEFORE FOOTER - Adjusted for Slower Motion and Smaller Text */}
      <EditorialMarquee 
        label="Quality Assurance"
        text="PURE INGREDIENTS • TIME-HONORED • FRESH" 
        direction="left"
        speed={180}
        fontSize="text-xl md:text-3xl"
        opacity={0.3}
        className="bg-cream-bg py-12"
        withIcon
      />

      <style>{`
         @keyframes spin-slow {
           from { transform: translate(-50%, -50%) rotate(0deg); }
           to { transform: translate(-50%, -50%) rotate(360deg); }
         }
         .animate-spin-slow {
           animation: spin-slow 15s linear infinite;
         }
         .section-sticky {
           position: sticky;
           top: 0;
           z-index: 0;
         }
         .section-overlap {
           position: relative;
           z-index: 10;
           background-color: var(--cream-bg);
           box-shadow: 0 -30px 60px rgba(0,0,0,0.08);
           border-top-left-radius: 3rem;
           border-top-right-radius: 3rem;
         }
      `}</style>
    </div>
  );
};

export default Home;
