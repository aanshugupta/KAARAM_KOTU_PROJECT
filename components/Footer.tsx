
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send, Map } from 'lucide-react';
// Changed import from react-router-dom to react-router to resolve missing export errors
import { Link } from 'react-router';

const Footer: React.FC = () => {
  return (
    <footer className="bg-olive text-[#f3e8dc] pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Story */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-olive font-bold text-2xl serif group-hover:scale-110 transition-transform">KK</div>
              <span className="text-white font-bold text-2xl serif tracking-[0.2em]">Kaaram kotu</span>
            </Link>
            <p className="text-sm leading-relaxed text-[#f3e8dc]/70 italic pr-6">
              "Crafting the authentic soul of Indian tradition since 1984. We believe in purity, mastery, and the joy of sharing heritage through flavor."
            </p>
            <div className="flex space-x-5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-white transition-all duration-500 border border-white/10"><Icon size={18} /></a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase border-b border-gold/10 pb-4">Explore Heritage</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/shop" className="text-[#f3e8dc]/70 hover:text-gold transition-colors">Our Full Collection</Link></li>
              <li><Link to="/shop?category=Sweets" className="text-[#f3e8dc]/70 hover:text-gold transition-colors">Traditional Sweets</Link></li>
              <li><Link to="/shop?category=Pickles" className="text-[#f3e8dc]/70 hover:text-gold transition-colors">Home-style Pickles</Link></li>
              <li><Link to="/shop?filter=bestsellers" className="text-[#f3e8dc]/70 hover:text-gold transition-colors">Best Sellers</Link></li>
              <li><Link to="/about" className="text-[#f3e8dc]/70 hover:text-gold transition-colors">Our Legacy Story</Link></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase border-b border-gold/10 pb-4">Get In Touch</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start space-x-4">
                <MapPin className="text-gold mt-1 shrink-0" size={20} />
                <span className="text-[#f3e8dc]/70 leading-relaxed italic">123 Tradition Lane, <br /> Flavor City, India - 500001</span>
              </li>
              <li className="flex items-center space-x-4">
                <Phone className="text-gold shrink-0" size={20} />
                <span className="text-[#f3e8dc]/70">+91 90000 00000</span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail className="text-gold shrink-0" size={20} />
                <span className="text-[#f3e8dc]/70">hello@kaaramkotu.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase border-b border-gold/10 pb-4"> Join Our Family</h4>
            <p className="text-sm text-[#f3e8dc]/70 leading-relaxed italic">Subscribe for seasonal collections, festive offers, and heritage recipes.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-gold transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gold text-olive rounded-full flex items-center justify-center hover:bg-white transition-all shadow-xl group-focus-within:scale-110">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex space-x-10 text-[9px] font-bold tracking-[0.3em] uppercase opacity-40">
            <Link to="/privacy" className="hover:text-gold">Privacy</Link>
            <Link to="/terms" className="hover:text-gold">Terms</Link>
            <Link to="/shipping" className="hover:text-gold">Shipping</Link>
          </div>
          <p className="text-[10px] text-[#f3e8dc]/30 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Kaaram kotu. Handcrafted with passion in India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
