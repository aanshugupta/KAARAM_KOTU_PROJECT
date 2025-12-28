
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES, PRODUCTS } from '../constants';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';
  
  // Theme logic for text and logo colors
  const textColorClass = isScrolled || (isHomePage && !isScrolled) ? 'text-white' : 'text-olive';
  const logoColorClass = isScrolled ? 'bg-gold text-olive' : (isHomePage ? 'bg-white text-olive' : 'bg-olive text-gold');
  const inputBgClass = isScrolled || isHomePage ? 'bg-white/10 text-white placeholder:text-white/50' : 'bg-olive/5 text-olive placeholder:text-olive/40';

  const navCategories = [
    { name: 'Sweets', filter: 'Sweets' },
    { name: 'Pickles', filter: 'Pickles' },
    { name: 'Powders', filter: 'Spicy Powders' },
    { name: 'Snacks', filter: 'Snacks' },
    { name: 'Combos', filter: 'Combos' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          isScrolled 
            ? 'h-16 bg-olive/95 backdrop-blur-md shadow-xl border-b border-white/10' 
            : 'h-20 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6 h-full flex lg:grid lg:grid-cols-[1fr_auto_1fr] items-center justify-between">
          
          {/* Column 1: Logo (Left) */}
          <div className="flex items-center min-w-[150px]">
            <Link to="/" className="flex items-center space-x-3 shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-500 ${logoColorClass}`}>KK</div>
              <span className={`font-bold text-lg serif tracking-[0.2em] hidden sm:inline transition-colors duration-500 ${textColorClass}`}>Kaaram kotu</span>
            </Link>
          </div>

          {/* Column 2: Centered Navigation (Middle - Desktop Only) */}
          <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 h-full">
            <Link to="/" className={`text-[10px] font-bold tracking-[0.2em] uppercase hover:text-gold transition-colors shrink-0 ${textColorClass}`}>Home</Link>
            
            {navCategories.map((cat) => (
              <div key={cat.name} className="group h-full flex items-center">
                <Link to={`/shop?category=${cat.filter}`} className={`text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-1 transition-colors shrink-0 ${textColorClass} group-hover:text-gold`}>
                  {cat.name} <ChevronDown size={10} className="group-hover:rotate-180 transition-transform" />
                </Link>
                
                {/* Mega Menu Content */}
                <div className="mega-menu absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 grid grid-cols-4 p-12 gap-10 overflow-hidden">
                  <div className="col-span-1 space-y-5 border-r border-gray-100 pr-10">
                    <h4 className="text-olive font-bold serif text-2xl">{cat.name} Collection</h4>
                    <p className="text-xs text-gray-500 leading-relaxed italic">Hand-prepared using premium stone-ground ingredients and age-old family recipes.</p>
                    <div className="pt-4">
                      <Link to={`/shop?category=${cat.filter}`} className="inline-block text-[10px] font-bold text-gold border-b border-gold/30 pb-1 hover:text-olive hover:border-olive transition-all uppercase tracking-[0.2em]">Explore All Items</Link>
                    </div>
                  </div>
                  <div className="col-span-3 grid grid-cols-3 gap-8">
                    {PRODUCTS.filter(p => p.category === cat.filter).length > 0 ? (
                      PRODUCTS.filter(p => p.category === cat.filter).slice(0, 3).map(p => (
                        <Link key={p.id} to={`/product/${p.id}`} className="group/item space-y-4">
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cream-bg shadow-sm">
                             <img src={p.image} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-olive uppercase tracking-[0.2em] truncate">{p.name}</div>
                            <div className="text-[10px] text-gold font-bold mt-1">₹{p.price}</div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-3 flex items-center justify-center text-gray-400 italic text-sm">
                        No products available in this category yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <Link to="/shop" className={`text-[10px] font-bold tracking-[0.2em] uppercase hover:text-gold transition-colors shrink-0 ${textColorClass}`}>Shop All</Link>
          </nav>

          {/* Column 3: Icons & Search (Right) */}
          <div className="flex items-center justify-end space-x-5 min-w-[150px]">
            {/* Search Implementation */}
            <div className="relative flex items-center">
               <form 
                 onSubmit={handleSearch} 
                 className={`flex items-center overflow-hidden transition-all duration-500 ease-in-out ${isSearchOpen ? 'w-32 md:w-56 opacity-100 mr-2' : 'w-0 opacity-0'}`}
               >
                  <input 
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full py-1.5 px-4 rounded-full text-[10px] font-bold uppercase tracking-widest focus:outline-none border border-white/10 ${inputBgClass}`}
                  />
               </form>
               <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`transition-colors p-2 rounded-full hover:bg-white/10 ${textColorClass} hover:text-gold`}
               >
                {isSearchOpen ? <X size={18} /> : <Search size={20} />}
              </button>
            </div>

            <button className={`${textColorClass} hover:text-gold transition-colors hidden sm:block`}><User size={20} /></button>
            <button 
              onClick={onOpenCart}
              className={`relative transition-colors ${textColorClass} hover:text-gold`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Toggle */}
            <button className={`lg:hidden ${textColorClass} ml-2`} onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[1100] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-[85%] bg-cream-bg p-8 transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="flex justify-between items-center mb-12">
             <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center text-gold font-bold serif">KK</div>
             <button onClick={() => setIsMobileMenuOpen(false)} className="text-olive"><X size={28} /></button>
           </div>
           <div className="flex flex-col space-y-6">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold serif text-olive border-b border-olive/5 pb-4 uppercase tracking-[0.1em]">Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold serif text-olive border-b border-olive/5 pb-4 uppercase tracking-[0.1em]">Shop All</Link>
              {navCategories.map(cat => (
                <Link key={cat.name} to={`/shop?category=${cat.filter}`} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold serif text-olive border-b border-olive/5 pb-4 uppercase tracking-[0.1em]">{cat.name}</Link>
              ))}
           </div>
        </div>
      </div>
    </>
  );
};

export default Header;
