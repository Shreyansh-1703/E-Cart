import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, Filter, ShoppingCart, Star, SlidersHorizontal,
  ChevronRight, X, Heart, ChevronDown, ChevronUp, Tag, Zap,
  CheckSquare, Square, Layers
} from 'lucide-react';
import { productService, categoryService } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { toast } from 'react-toastify';

const PAGE_SIZE = 20;

const Products = () => {
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage]               = useState(0);

  const [filters, setFilters] = useState({
    category:    searchParams.get('category') || searchParams.get('cat') || '',
    search:      searchParams.get('q') || '',
    sort:        'newest',
    minPrice:    '',
    maxPrice:    '',
    minRating:   0,
    inStock:     false,
    onSale:      false,
    brands:      [],
  });

  const [openSections, setOpenSections] = useState({
    category: true, price: true, rating: true, availability: true, brand: false,
  });
  const toggleSection = (k) => setOpenSections(p => ({ ...p, [k]: !p[k] }));

  // ── Fetch once ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [prodData, catData] = await Promise.all([
          productService.getAll({ size: 1000 }),
          categoryService.getAll(),
        ]);
        setAllProducts((prodData.content || prodData.products || []).filter(
          p => p.category?.name?.toLowerCase() !== 'lastminutewedding'
        ));
        setCategories(catData.filter(c => c.name.toLowerCase() !== 'lastminutewedding'));
      } catch {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Sync URL params → filters
  useEffect(() => {
    const cat = searchParams.get('category') || searchParams.get('cat') || '';
    const q   = searchParams.get('q') || '';
    setFilters(prev => ({ ...prev, category: cat, search: q }));
    setPage(0);
  }, [searchParams]);

  // ── Derived data ──────────────────────────────────────────────────
  const availableBrands = useMemo(
    () => [...new Set(allProducts.map(p => p.brand).filter(Boolean))].sort(),
    [allProducts]
  );

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();
    let list = allProducts.filter(p => {
      if (q && !p.name.toLowerCase().includes(q) &&
          !(p.description || '').toLowerCase().includes(q) &&
          !(p.brand || '').toLowerCase().includes(q)) return false;
      if (filters.category && p.category?.name !== filters.category) return false;
      if (filters.minPrice && Number(p.price) < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && Number(p.price) > parseFloat(filters.maxPrice)) return false;
      if (filters.minRating && Number(p.rating || 0) < filters.minRating) return false;
      if (filters.inStock && (p.stock <= 0 || p.status === 'OUT_OF_STOCK')) return false;
      if (filters.onSale && !(p.originalPrice && Number(p.originalPrice) > Number(p.price))) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      return true;
    });

    list.sort((a, b) => {
      switch (filters.sort) {
        case 'price-low':  return Number(a.price) - Number(b.price);
        case 'price-high': return Number(b.price) - Number(a.price);
        case 'rating':     return Number(b.rating || 0) - Number(a.rating || 0);
        case 'reviews':    return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'discount': {
          const da = a.originalPrice ? (Number(a.originalPrice)-Number(a.price))/Number(a.originalPrice) : 0;
          const db = b.originalPrice ? (Number(b.originalPrice)-Number(b.price))/Number(b.originalPrice) : 0;
          return db - da;
        }
        case 'name-asc':  return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'oldest':    return a.id - b.id;
        default:          return b.id - a.id;
      }
    });
    return list;
  }, [allProducts, filters]);

  const visible = filtered.slice(0, (page + 1) * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const activeCount = [
    filters.category, filters.minPrice, filters.maxPrice,
    filters.minRating > 0, filters.inStock, filters.onSale,
    ...filters.brands,
  ].filter(Boolean).length;

  // ── Helpers ───────────────────────────────────────────────────────
  const setF = (key, val) => { setFilters(p => ({ ...p, [key]: val })); setPage(0); };
  const toggleBrand = (b) =>
    setF('brands', filters.brands.includes(b) ? filters.brands.filter(x => x !== b) : [...filters.brands, b]);
  const resetAll = () => {
    setFilters({ category:'', search:'', sort:'newest', minPrice:'', maxPrice:'', minRating:0, inStock:false, onSale:false, brands:[] });
    setPage(0);
  };

  const handleCart = useCallback(async (e, id) => {
    e.preventDefault(); e.stopPropagation();
    try { await addToCart(id, 1); toast.success('Added to cart!'); }
    catch (err) { toast.error(err.message || 'Failed'); }
  }, [addToCart]);

  const handleWishlist = useCallback(async (e, p) => {
    e.preventDefault(); e.stopPropagation();
    try {
      if (isInWishlist(p.id)) { await removeFromWishlist(p.id); toast.info('Removed from wishlist'); }
      else { await addToWishlist(p.id); toast.success('Added to wishlist ❤️'); }
    } catch { toast.error('Failed to update wishlist'); }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  // ── Sub-components ────────────────────────────────────────────────
  const Section = ({ id, label, children }) => (
    <div className="border-b border-slate-100 py-3">
      <button onClick={() => toggleSection(id)}
        className="flex items-center justify-between w-full text-left font-black text-slate-800 text-xs uppercase tracking-widest mb-1">
        {label}
        {openSections[id] ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
      </button>
      {openSections[id] && <div className="mt-2 space-y-1">{children}</div>}
    </div>
  );

  const Chip = ({ label, onRemove }) => (
    <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 text-xs font-bold px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove}><X className="w-3 h-3" /></button>
    </span>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-primary-600 font-medium">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-900">
            {filters.category || 'All Products'}
            {!loading && <span className="text-slate-400 font-medium"> ({filtered.length})</span>}
          </span>
        </nav>

        <div className="flex gap-7">
          {/* ── Sidebar ── */}
          <aside className={`
            w-56 shrink-0 space-y-1
            ${showFilters ? 'fixed inset-0 z-[70] bg-white p-5 overflow-y-auto shadow-2xl w-72' : 'hidden lg:block'}
          `}>
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-600" />
                <span className="font-black text-slate-900">Filters</span>
                {activeCount > 0 && (
                  <span className="w-5 h-5 bg-primary-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                {activeCount > 0 && (
                  <button onClick={resetAll} className="text-xs font-black text-red-500 hover:text-red-700">Reset</button>
                )}
                <button onClick={() => setShowFilters(false)} className="lg:hidden">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <Section id="category" label="Category">
              {[{ id: 0, name: 'All Products' }, ...categories].map(cat => (
                <button key={cat.id} onClick={() => setF('category', cat.id === 0 ? '' : cat.name)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                    (cat.id === 0 ? !filters.category : filters.category === cat.name)
                      ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                  {cat.name}
                </button>
              ))}
            </Section>

            <Section id="price" label="Price Range">
              <div className="flex gap-2">
                <input type="number" placeholder="Min ₹" value={filters.minPrice}
                  onChange={e => setF('minPrice', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-300" />
                <input type="number" placeholder="Max ₹" value={filters.maxPrice}
                  onChange={e => setF('maxPrice', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[['<₹500','','500'],['₹500-2k','500','2000'],['₹2k-10k','2000','10000'],['₹10k+','10000','']].map(([l,mn,mx]) => (
                  <button key={l} onClick={() => setFilters(p => ({ ...p, minPrice: mn, maxPrice: mx }))}
                    className="px-2 py-0.5 text-[10px] font-black bg-slate-100 hover:bg-primary-50 hover:text-primary-700 rounded-full text-slate-600 transition-colors">
                    {l}
                  </button>
                ))}
              </div>
            </Section>

            <Section id="rating" label="Customer Rating">
              {[4,3,2].map(r => (
                <button key={r} onClick={() => setF('minRating', filters.minRating === r ? 0 : r)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                    filters.minRating === r ? 'bg-amber-50 text-amber-700 font-black' : 'text-slate-600 hover:bg-slate-50 font-bold'
                  }`}>
                  <div className="flex">
                    {[...Array(5)].map((_,i) => <Star key={i} className={`w-3 h-3 ${i<r?'text-amber-400 fill-amber-400':'text-slate-200 fill-slate-200'}`} />)}
                  </div>
                  <span className="text-xs">{r}★ & above</span>
                </button>
              ))}
            </Section>

            <Section id="availability" label="Availability">
              {[
                { key: 'inStock', label: 'In Stock Only', color: 'text-emerald-600' },
                { key: 'onSale',  label: 'On Sale',        color: 'text-red-500' },
              ].map(({ key, label, color }) => (
                <button key={key} onClick={() => setF(key, !filters[key])}
                  className="flex items-center gap-2 w-full text-left py-1 text-sm font-bold text-slate-700 hover:text-slate-900">
                  {filters[key]
                    ? <CheckSquare className={`w-4 h-4 ${color}`} />
                    : <Square className="w-4 h-4 text-slate-300" />}
                  <span className={filters[key] ? color : ''}>{label}</span>
                </button>
              ))}
            </Section>

            {availableBrands.length > 0 && (
              <Section id="brand" label="Brand">
                <div className="max-h-44 overflow-y-auto space-y-0.5 pr-1">
                  {availableBrands.map(brand => (
                    <button key={brand} onClick={() => toggleBrand(brand)}
                      className="flex items-center gap-2 w-full text-left py-1 text-xs font-bold text-slate-600 hover:text-slate-900 truncate">
                      {filters.brands.includes(brand)
                        ? <CheckSquare className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                        : <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                      {brand}
                    </button>
                  ))}
                </div>
              </Section>
            )}
          </aside>

          {/* Sidebar overlay backdrop */}
          {showFilters && (
            <div className="fixed inset-0 z-[60] bg-black/30 lg:hidden" onClick={() => setShowFilters(false)} />
          )}

          {/* ── Main ── */}
          <main className="flex-1 min-w-0 space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 items-center bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search products, brands..."
                  value={filters.search}
                  onChange={e => { setF('search', e.target.value); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all" />
              </div>
              <button onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm relative">
                <SlidersHorizontal className="w-4 h-4" /> Filters
                {activeCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>
              <select value={filters.sort} onChange={e => setF('sort', e.target.value)}
                className="bg-slate-100 border-none rounded-xl py-2.5 px-3 font-bold text-slate-700 text-sm outline-none cursor-pointer min-w-48">
                <option value="newest">⚡ Newest First</option>
                <option value="oldest">⭐ Featured</option>
                <option value="price-low">💰 Price: Low → High</option>
                <option value="price-high">💎 Price: High → Low</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="reviews">💬 Most Reviewed</option>
                <option value="discount">🏷️ Biggest Discount</option>
                <option value="name-asc">🔤 Name: A → Z</option>
                <option value="name-desc">🔡 Name: Z → A</option>
              </select>
            </div>

            {/* Active chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.category && <Chip label={filters.category} onRemove={() => setF('category','')} />}
                {(filters.minPrice||filters.maxPrice) && <Chip label={`₹${filters.minPrice||0}–₹${filters.maxPrice||'∞'}`} onRemove={() => setFilters(p=>({...p,minPrice:'',maxPrice:''}))} />}
                {filters.minRating > 0 && <Chip label={`${filters.minRating}★+`} onRemove={() => setF('minRating',0)} />}
                {filters.inStock && <Chip label="In Stock" onRemove={() => setF('inStock',false)} />}
                {filters.onSale  && <Chip label="On Sale"  onRemove={() => setF('onSale',false)} />}
                {filters.brands.map(b => <Chip key={b} label={b} onRemove={() => toggleBrand(b)} />)}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_,i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse space-y-3">
                    <div className="aspect-square bg-slate-100 rounded-xl" />
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-5 bg-slate-100 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100">
                <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your filters or search terms</p>
                <button onClick={resetAll} className="btn-primary px-6 py-2.5 rounded-2xl text-sm">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {visible.map(p => {
                    const inWl = isInWishlist(p.id);
                    const discPct = p.originalPrice && Number(p.originalPrice) > Number(p.price)
                      ? Math.round(((Number(p.originalPrice)-Number(p.price))/Number(p.originalPrice))*100) : null;
                    const stars = Math.round(Number(p.rating)||0);
                    const outOfStock = p.stock <= 0 || p.status === 'OUT_OF_STOCK';
                    return (
                      <Link to={`/products/${p.id}`} key={p.id}
                        className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 group flex flex-col">
                        <div className="relative aspect-square bg-slate-50 overflow-hidden">
                          <img src={p.imageUrl || 'https://via.placeholder.com/300'} alt={p.name}
                            loading="lazy"
                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                          {discPct && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                              -{discPct}%
                            </span>
                          )}
                          {p.fastDeliveryAvailable && (
                            <span className="absolute bottom-2 left-2 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Zap className="w-2.5 h-2.5" /> Fast
                            </span>
                          )}
                          {outOfStock && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                              <span className="bg-slate-800 text-white text-[10px] font-black px-3 py-1 rounded-full">Out of Stock</span>
                            </div>
                          )}
                          <button onClick={e => handleWishlist(e, p)}
                            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all ${
                              inWl ? 'bg-red-500 text-white opacity-100' : 'bg-white/90 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100'
                            }`}>
                            <Heart className={`w-4 h-4 ${inWl ? 'fill-white' : ''}`} />
                          </button>
                          <button onClick={e => {
                              e.preventDefault(); e.stopPropagation();
                              if (isInCompare(p.id)) {
                                removeFromCompare(p.id);
                              } else {
                                addToCompare(p);
                              }
                            }}
                            className={`absolute top-12 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all ${
                              isInCompare(p.id) ? 'bg-pink-600 text-white opacity-100' : 'bg-white/90 text-slate-400 hover:text-pink-600 opacity-0 group-hover:opacity-100'
                            }`}>
                            <Layers className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest mb-1">
                            {p.category?.name}
                          </p>
                          <h3 className="font-bold text-slate-900 text-xs mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug flex-1">
                            {p.name}
                          </h3>
                          <div className="flex items-center gap-0.5 mb-2">
                            {[...Array(5)].map((_,i) => (
                              <Star key={i} className={`w-3 h-3 ${i<stars?'text-amber-400 fill-amber-400':'text-slate-200 fill-slate-200'}`} />
                            ))}
                            <span className="text-[10px] text-slate-400 font-bold ml-1">({p.reviewCount||0})</span>
                          </div>
                          <div className="flex items-center justify-between pt-2.5 border-t border-slate-50">
                            <div>
                              <span className="font-black text-slate-900">₹{Number(p.price).toLocaleString()}</span>
                              {discPct && (
                                <span className="text-[10px] text-slate-400 line-through ml-1.5">
                                  ₹{Number(p.originalPrice).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <button onClick={e => handleCart(e, p.id)} disabled={outOfStock}
                              className="bg-primary-600 text-white p-2 rounded-xl hover:bg-primary-700 transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary-100">
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {hasMore && (
                  <div className="text-center pt-4">
                    <button onClick={() => setPage(p => p+1)}
                      className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all shadow-sm text-sm">
                      Load More &nbsp;·&nbsp; {filtered.length - visible.length} remaining
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
