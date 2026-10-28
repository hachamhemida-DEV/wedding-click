'use client';

import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

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

export default function CategoryDetailsPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const params = useParams();
  const router = useRouter();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      if (!params.slug) return;
      
      setLoading(true);
      try {
        const response = await api.get(`/services?category=${params.slug}`);
        setServices(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch category services', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [params.slug]);

  return (
    <div className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <Link href="/categories" className="text-sm font-medium text-primary hover:underline mb-4 inline-block">
            {isRtl ? 'العودة للفئات' : 'Retour aux catégories'}
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal capitalize">
            {params.slug}
          </h1>
          <p className="mt-2 text-brown">
            {services.length} {isRtl ? 'نتائج' : 'résultats'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-heading font-bold text-lg text-charcoal mb-1 line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-brown mb-3 line-clamp-1">
                      {service.vendor?.vendorProfile?.business_name}
                    </p>
                    
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
          <div className="bg-white rounded-2xl p-12 text-center border border-gold/10 max-w-2xl mx-auto">
            <Search className="w-12 h-12 text-gold-pale mx-auto mb-4" />
            <h3 className="text-xl font-bold text-charcoal mb-2">
              {isRtl ? 'لا توجد نتائج' : 'Aucun résultat'}
            </h3>
            <p className="text-brown mb-6">
              {isRtl ? 'لا توجد خدمات حالياً في هذه الفئة' : 'Aucun service n\'est actuellement disponible dans cette catégorie'}
            </p>
            <button 
              onClick={() => router.push('/search')}
              className="btn-gold py-2 px-6 rounded-full font-medium"
            >
              {isRtl ? 'تصفح كل الخدمات' : 'Parcourir tous les services'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
