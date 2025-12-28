
import React from 'react';
import { Star, ShoppingCart, GitCompare } from 'lucide-react';
import { Product } from '../types';
// Changed import from react-router-dom to react-router to resolve missing export errors
import { Link } from 'react-router';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isComparing: boolean;
  onToggleCompare: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isComparing, onToggleCompare }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-transparent hover:border-gold/30">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isBestSeller && (
          <span className="bg-olive text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
            Best Seller
          </span>
        )}
        {product.originalPrice && (
          <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
            Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Compare Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          onToggleCompare(product.id);
        }}
        className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isComparing ? 'bg-gold text-white scale-110' : 'bg-white/80 text-olive hover:bg-gold hover:text-white'
        }`}
        title="Add to Compare"
      >
        <GitCompare size={16} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-cream-bg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-olive/5 group-hover:bg-transparent transition-colors duration-500" />
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center space-x-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-gray-300'}
            />
          ))}
          <span className="text-[10px] text-muted-text ml-1">({product.reviews})</span>
        </div>

        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-olive font-bold serif text-lg group-hover:text-gold transition-colors duration-300 mb-1 leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-text mb-4 line-clamp-2 min-h-[2rem]">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-olive">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center w-10 h-10 bg-olive text-white rounded-full hover:bg-gold hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
