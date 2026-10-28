'use client';

import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2, Grid } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface Category {
  id: number;
  slug: string;
  name_ar: string;
  name_fr: string;
  icon: string | null;
}

export default function CategoriesPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <div className="bg-cream min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gold-pale/30 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            {isRtl ? 'تصفح فئات الخدمات' : 'Parcourir les catégories'}
          </h1>
          <p className="text-lg text-brown">
            {isRtl 
              ? 'كل ما تحتاجه لتنظيم زفافك المثالي، مجمع في مكان واحد' 
              : 'Tout ce dont vous avez besoin pour organiser le mariage parfait, réuni en un seul endroit'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-[0_8px_30px_rgba(184,149,106,0.15)] transition-all duration-300 border border-gold/10 group cursor-pointer h-full"
                >
                  <div className="w-16 h-16 rounded-full bg-gold-pale/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-4">
                    {/* Assuming icon is a class name or just falling back to generic grid */}
                    <Grid className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-charcoal group-hover:text-primary transition-colors">
                    {isRtl ? category.name_ar : category.name_fr}
                  </h3>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
