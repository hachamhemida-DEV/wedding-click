'use client';

import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Loader2, Star } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ALGERIA_WILAYAS } from '@/lib/constants';
import { WishlistButton } from '@/components/shared/WishlistButton';
import { StarRating } from '@/components/shared/StarRating';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  wilaya: string;
  images: string[] | null;
  category: {
    slug: string;
    name_ar: string;
    name_fr: string;
  };
  vendor: {
    vendorProfile: {
      business_name: string;
    };
  };
  reviews_count?: number;
  reviews_avg_rating?: number;
}

interface Category {
  id: number;
  slug: string;
  name_ar: string;
  name_fr: string;
}

export default function SearchPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [wilaya, setWilaya] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (wilaya) params.append('wilaya', wilaya);
      if (minPrice) params.append('min_price', minPrice);
      if (maxPrice) params.append('max_price', maxPrice);

      const response = await api.get(`/services?${params.toString()}`);
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  return (
    <div className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <div className="glass-panel p-6 rounded-2xl sticky top-24 border border-gold/20">
            <h3 className="text-xl font-heading font-bold text-charcoal mb-6 flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              {isRtl ? 'تصفية النتائج' : 'Filtres'}
            </h3>
            
            <form onSubmit={handleFilter} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {isRtl ? 'الفئة' : 'Catégorie'}
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-gold/30 rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">{isRtl ? 'الكل' : 'Tous'}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {isRtl ? c.name_ar : c.name_fr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {isRtl ? 'الولاية' : 'Wilaya'}
                </label>
                <select 
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  className="w-full bg-white border border-gold/30 rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">{isRtl ? 'جميع الولايات' : 'Toutes les wilayas'}</option>
                  {ALGERIA_WILAYAS.map((w) => (
                    <option key={w.id} value={w.name_fr}>
                      {w.id} - {isRtl ? w.name_ar : w.name_fr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {isRtl ? 'نطاق السعر' : 'Prix'}
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-1/2 bg-white border border-gold/30 rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary outline-none"
                  />
                  <input 
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-1/2 bg-white border border-gold/30 rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <button type="submit" className="w-full btn-gold py-3 rounded-xl font-medium">
                {isRtl ? 'تطبيق' : 'Appliquer'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="w-full md:w-3/4">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-heading font-bold text-charcoal">
              {isRtl ? 'استكشف الخدمات' : 'Découvrir les services'}
            </h1>
            <span className="text-brown">
              {services.length} {isRtl ? 'نتائج' : 'résultats'}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link key={service.id} href={`/services/${service.id}`} className="group block h-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(184,149,106,0.15)] transition-all duration-300 border border-gold/10 h-full flex flex-col"
                  >
                    <div className="h-48 bg-cream relative overflow-hidden">
                      {service.images && service.images[0] ? (
                        <img 
                          src={service.images[0]} 
                          alt={service.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-brown-light">
                          <Search className="w-8 h-8 opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <WishlistButton serviceId={service.id} className="drop-shadow-lg" />
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                        {isRtl ? service.category?.name_ar : service.category?.name_fr}
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-heading font-bold text-lg text-charcoal mb-1 line-clamp-1">
                        {service.title}
                      </h3>
                      <p className="text-sm text-brown mb-3 line-clamp-1">
                        {service.vendor?.vendorProfile?.business_name}
                      </p>

                      {service.reviews_count && service.reviews_count > 0 ? (
                        <div className="flex items-center gap-1.5 mb-2">
                          <StarRating rating={Math.round(service.reviews_avg_rating || 0)} size={14} />
                          <span className="text-xs font-semibold text-charcoal">
                            {Number(service.reviews_avg_rating).toFixed(1)}
                          </span>
                          <span className="text-xs text-brown">
                            ({service.reviews_count})
                          </span>
                        </div>
                      ) : null}
                      
                      <div className="mt-auto">
                        <div className="flex items-center gap-1 text-xs text-brown-light mb-3">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{service.wilaya}</span>
                        </div>
                        
                        <div className="flex justify-between items-center border-t border-gold/10 pt-3">
                          <span className="font-semibold text-charcoal">
                            {service.price ? `${service.price} DZD` : (isRtl ? 'السعر عند الطلب' : 'Sur devis')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gold/10">
              <Search className="w-12 h-12 text-gold-pale mx-auto mb-4" />
              <h3 className="text-xl font-bold text-charcoal mb-2">
                {isRtl ? 'لا توجد نتائج' : 'Aucun résultat'}
              </h3>
              <p className="text-brown">
                {isRtl ? 'حاول تغيير معايير البحث الخاصة بك' : 'Essayez de modifier vos critères de recherche'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
