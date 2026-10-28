'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import api from '@/lib/api';
import { Link } from '@/i18n/routing';
import { 
  Heart, 
  Search, 
  Sparkles,
  MapPin,
  Loader2,
  Trash2,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

export default function ClientWishlist() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/wishlist');
      setServices(res.data || []);
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (serviceId: number) => {
    setRemovingId(serviceId);
    try {
      await api.post(`/wishlist/${serviceId}`);
      setServices(prev => prev.filter(s => s.id !== serviceId));
    } catch (err) {
      console.error('Failed to remove', err);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-charcoal">
          {isRtl ? 'المفضلة' : 'Ma Wishlist'}
        </h1>
        <p className="text-brown mt-1">
          {isRtl ? 'الخدمات التي حفظتها للتخطيط لزفافك.' : 'Les services que vous avez sauvegardés pour votre mariage.'}
        </p>
        {services.length > 0 && (
          <p className="text-sm text-primary font-semibold mt-2">
            {services.length} {isRtl ? 'خدمات محفوظة' : 'services sauvegardés'}
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {services.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl overflow-hidden shadow-soft border border-gold/10 flex flex-col group"
              >
                <Link href={`/services/${service.id}`} className="block">
                  <div className="h-48 bg-cream relative overflow-hidden">
                    {service.images && service.images[0] ? (
                      <img 
                        src={service.images[0]} 
                        alt={service.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gold-pale">
                        <Heart size={40} className="opacity-30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                      {isRtl ? service.category?.name_ar : service.category?.name_fr}
                    </div>
                  </div>
                </Link>

                <div className="p-5 flex flex-col flex-grow">
                  <Link href={`/services/${service.id}`}>
                    <h3 className="font-heading font-bold text-lg text-charcoal mb-1 line-clamp-1 hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-brown mb-3 flex items-center gap-1">
                    <Store size={14} className="text-primary" />
                    {service.vendor?.vendorProfile?.business_name}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-1 text-xs text-brown-light mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{service.wilaya}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-gold/10 pt-3">
                      <span className="font-semibold text-primary">
                        {service.price ? `${service.price} DZD` : (isRtl ? 'عند الطلب' : 'Sur devis')}
                      </span>
                      <button
                        onClick={() => handleRemove(service.id)}
                        disabled={removingId === service.id}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title={isRtl ? 'إزالة' : 'Retirer'}
                      >
                        {removingId === service.id 
                          ? <Loader2 size={18} className="animate-spin" />
                          : <Trash2 size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gold/30">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-red-400 fill-red-400/20" />
          </div>
          <h3 className="text-2xl font-bold text-charcoal mb-2">
            {isRtl ? 'قائمة الأمنيات فارغة' : 'Votre wishlist est vide'}
          </h3>
          <p className="text-brown max-w-md mx-auto mb-8">
            {isRtl 
              ? 'احفظ الخدمات التي تعجبك بالنقر على أيقونة القلب ❤️' 
              : 'Sauvegardez les services qui vous plaisent en cliquant sur le cœur ❤️'}
          </p>
          <Link href="/search" className="btn-gold px-8 py-3 rounded-xl font-bold shadow-gold inline-flex items-center gap-2">
            <Sparkles size={20} />
            <span>{isRtl ? 'استكشف الخدمات' : 'Explorer les services'}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
