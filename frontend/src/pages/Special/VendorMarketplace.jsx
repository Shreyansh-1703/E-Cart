import React, { useState, useEffect } from 'react';
import { vendorService } from '../../services/api';
import VendorCard from '../../components/wedding/VendorCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const VendorMarketplace = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Services', icon: '✨' },
    { id: 'PHOTOGRAPHER', name: 'Photographers', icon: '📸' },
    { id: 'MAKEUP_ARTIST', name: 'Makeup Artists', icon: '💅' },
    { id: 'MEHNDI_ARTIST', name: 'Mehendi Artists', icon: '🌿' },
  ];

  useEffect(() => {
    loadVendors();
  }, [selectedCategory]);

  const loadVendors = async () => {
    setLoading(true);
    try {
      const catParam = selectedCategory === 'all' ? null : selectedCategory;
      const data = await vendorService.getAll(catParam);
      setVendors(data);
    } catch (error) {
      console.error('Failed to load vendors', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(v => 
    v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdf2f8]/30 pt-20 pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
            Find Your Perfect <span className="text-pink-600">Wedding Partners</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Discover the finest photographers, makeup artists, and mehendi artists to make your special day truly unforgettable.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-pink-100 flex flex-col lg:flex-row gap-4 mb-12 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by business name or city..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl whitespace-nowrap font-bold transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-200' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="h-[400px] bg-white animate-pulse rounded-2xl border border-slate-100"></div>)}
          </div>
        ) : filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVendors.map(vendor => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No vendors found</h3>
            <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorMarketplace;
