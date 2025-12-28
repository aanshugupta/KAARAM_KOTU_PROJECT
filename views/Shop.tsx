
import React, { useState, useMemo, useEffect } from 'react';
// Changed import to react-router-dom for consistency
import { useLocation } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import { Product, Category } from '../types';
import { Filter, ChevronDown, LayoutGrid, List, Search } from 'lucide-react';

interface ShopProps {
  onAddToCart: (product: Product) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
}

const Shop: React.FC<ShopProps> = ({ onAddToCart, compareIds, onToggleCompare }) => {
  const location = useLocation();
  
  // Parse query params whenever the location changes
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialCategory = queryParams.get('category') as Category | null;
  const initialFilter = queryParams.get('filter');
  const initialSearch = queryParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'priceLow' | 'priceHigh' | 'rating'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<number>(2000);

  // Sync state with URL parameters when they change
  useEffect(() => {
    setSelectedCategory(initialCategory || 'All');
    setSearchQuery(initialSearch);
    // Reset price range if needed or keep user's last selection
  }, [initialCategory, initialSearch]);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    result = result.filter(p => p.price <= priceRange);

    if (initialFilter === 'bestsellers') {
      result = result.filter(p => p.isBestSeller);
    } else if (initialFilter === 'offers') {
      result = result.filter(p => p.onOffer || p.originalPrice);
    }

    switch (sortBy) {
      case 'priceLow': result.sort((a, b) => a.price - b.price); break;
      case 'priceHigh': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [selectedCategory, sortBy, initialFilter, searchQuery, priceRange]);

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 fade-in">
      <div className="mb-16 text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold serif text-olive uppercase tracking-tight">
          {selectedCategory === 'All' ? 'Our Collection' : selectedCategory}
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto italic">"Pure ingredients. Traditional mastery. Authentic taste."</p>
        <div className="w-16 h-1 bg-gold mx-auto" />
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Filters */}
        <aside className="lg:w-72 space-y-12 shrink-0">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search cravings..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-full py-4 pl-12 pr-6 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-gold shadow-sm"
            />
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-olive uppercase tracking-[0.3em] mb-8 flex items-center">
              <Filter size={14} className="mr-3 text-gold" /> Categories
            </h3>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`text-left py-3 px-6 rounded-2xl transition-all text-xs font-bold uppercase tracking-widest ${selectedCategory === 'All' ? 'bg-olive text-white shadow-xl' : 'hover:bg-gold/5 text-gray-400'}`}
              >
                Show All
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name as Category)}
                  className={`text-left py-3 px-6 rounded-2xl transition-all text-xs font-bold uppercase tracking-widest ${selectedCategory === cat.name ? 'bg-olive text-white shadow-xl' : 'hover:bg-gold/5 text-gray-400'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-[10px] font-bold text-olive uppercase tracking-[0.3em] mb-6 flex items-center">
              Price Range
            </h3>
            <div className="px-2">
              <input 
                type="range" 
                min="0" 
                max="2000" 
                step="50"
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full accent-gold h-1 bg-gray-100 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-4">
                <span className="text-[10px] font-bold text-gray-400">₹0</span>
                <span className="text-[10px] font-bold text-olive">Under ₹{priceRange}</span>
              </div>
            </div>
          </div>

          <div className="p-10 bg-olive rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <h4 className="font-bold serif text-xl text-gold">Free Shipping</h4>
            <p className="text-xs text-white/60 leading-relaxed italic">Unlock free pan-India shipping on all orders above ₹2000.</p>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gold transition-all duration-1000" style={{ width: '75%' }} />
            </div>
          </div>
        </aside>

        {/* Main Product Area */}
        <main className="flex-1">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between mb-12 gap-6 bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Found {filteredProducts.length} Specialties</p>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-cream-bg rounded-full p-1 border border-gold/10">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-olive' : 'text-gray-400 hover:text-gold'}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-olive' : 'text-gray-400 hover:text-gold'}`}
                >
                  <List size={16} />
                </button>
              </div>

              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-cream-bg border border-gold/10 px-8 py-3 pr-14 rounded-full text-[10px] font-bold uppercase tracking-widest text-olive focus:ring-1 focus:ring-gold cursor-pointer"
                >
                  <option value="popularity">Popularity</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-olive" />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className={`grid gap-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                isComparing={compareIds.includes(product.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-40 bg-white rounded-[4rem] shadow-sm border border-gray-50 space-y-6">
              <div className="text-7xl grayscale opacity-20">🍯</div>
              <h3 className="text-3xl font-bold serif text-olive">No matches found</h3>
              <p className="text-gray-400 text-sm italic">Adjust your filters or explore our best sellers below.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setPriceRange(2000); }}
                className="px-10 py-4 bg-olive text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-gold transition-all shadow-xl"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
