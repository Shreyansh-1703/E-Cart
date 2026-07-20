import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { productService } from '../../services/api';

const RecommendationEngine = ({ currentProduct }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const recommendationRules = {
    'bridal jewellery set': ['bridal lehenga', 'bridal makeup package', 'wedding footwear'],
    'bridal lehenga': ['bridal jewellery set', 'bridal makeup package', 'wedding dupatta'],
    'wedding cake': ['decoration package', 'photography package'],
    'sherwani': ['groom accessories', 'wedding footwear'],
    'decoration package': ['photography package', 'wedding cake'],
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const prodData = await productService.getAll({ size: 100 });
        const products = prodData.content || prodData.products || [];
        const productName = currentProduct.name.toLowerCase();
        
        let recommendedNames = [];
        for (const [key, value] of Object.entries(recommendationRules)) {
          if (productName.includes(key)) {
            recommendedNames = value;
            break;
          }
        }

        const recs = products.filter(p => 
          recommendedNames.some(name => p.name.toLowerCase().includes(name)) && p.id !== currentProduct.id
        );

        const similar = products.filter(p => 
          p.category?.id === currentProduct.category?.id && p.id !== currentProduct.id
        ).slice(0, 5);

        setRecommendations(recs);
        setSimilarItems(similar);
      } catch (error) {
        console.error('Failed to load recommendations', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProduct) {
      fetchRecommendations();
    }
  }, [currentProduct]);

  if (loading || (recommendations.length === 0 && similarItems.length === 0)) return null;

  return (
    <div className="space-y-16 mt-20">
      {recommendations.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-8">
             <div>
               <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Frequently Purchased Together</h2>
               <p className="text-sm text-slate-500 font-medium">Perfect combinations curated for your needs</p>
             </div>
             <Link to="/products" className="text-primary-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Shop Essentials <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommendations.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {similarItems.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-8">
             <div>
               <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight text-left">You May Also Like</h2>
               <p className="text-sm text-slate-500 font-medium text-left">Other products in this category</p>
             </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {similarItems.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const ProductCard = ({ product }) => (
  <Link to={`/products/${product.id}`} className="group bg-white rounded-3xl p-4 border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
    <div className="aspect-square rounded-2xl bg-slate-50 overflow-hidden mb-4 relative">
       <img src={product.imageUrl || 'https://via.placeholder.com/200'} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
       <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-sm text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
         <ShoppingCart className="w-4 h-4" />
       </div>
    </div>
    <h3 className="font-bold text-slate-900 text-sm mb-1 truncate text-left">{product.name}</h3>
    <div className="flex items-center justify-between">
       <span className="font-black text-slate-900 text-base">₹{product.price.toLocaleString()}</span>
       <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{product.category?.name}</span>
    </div>
  </Link>
);

export default RecommendationEngine;
