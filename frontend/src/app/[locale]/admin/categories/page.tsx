'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useLocale } from 'next-intl';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  Check,
  Grid,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: number;
  slug: string;
  name_ar: string;
  name_fr: string;
  icon?: string;
}

export default function AdminCategories() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name_fr: '',
    name_ar: '',
    slug: '',
    icon: 'grid'
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category: Category | null = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name_fr: category.name_fr,
        name_ar: category.name_ar,
        slug: category.slug,
        icon: category.icon || 'grid'
      });
    } else {
      setEditingCategory(null);
      setFormData({ name_fr: '', name_ar: '', slug: '', icon: 'grid' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, formData);
      } else {
        await api.post('/admin/categories', formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(isRtl ? 'حذف هذه الفئة؟' : 'Supprimer cette catégorie ?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="space-y-8 text-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">
            {isRtl ? 'إدارة الفئات' : 'Gestion des Catégories'}
          </h1>
          <p className="text-gray-400 mt-1">
            {isRtl ? 'إضافة وتعديل فئات الخدمات على المنصة.' : 'Gérez les catégories de services de la plateforme.'}
          </p>
        </div>
        <button 
          onClick={() => openModal()}
          className="btn-gold px-6 py-3 rounded-xl flex items-center gap-2 shadow-gold"
        >
          <Plus size={20} />
          <span>{isRtl ? 'فئة جديدة' : 'Nouvelle Catégorie'}</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-700 rounded-xl text-primary">
                  <Grid size={24} />
                </div>
                <div>
                  <p className="font-bold text-white">{category.name_fr}</p>
                  <p className="text-sm text-gray-400 font-arabic">{category.name_ar}</p>
                  <p className="text-xs text-primary mt-1">/{category.slug}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openModal(category)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-gray-700"
            >
              <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                <h2 className="text-xl font-bold text-white">
                  {editingCategory ? (isRtl ? 'تعديل الفئة' : 'Modifier') : (isRtl ? 'فئة جديدة' : 'Nouvelle')}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Nom (Français)</label>
                  <input 
                    required
                    value={formData.name_fr}
                    onChange={(e) => setFormData({...formData, name_fr: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2 text-right font-arabic">الاسم (العربية)</label>
                  <input 
                    required
                    dir="rtl"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none text-white font-arabic text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Slug (URL)</label>
                  <input 
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none text-white"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-6 rounded-xl bg-primary text-white font-bold shadow-gold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                    <span>{isRtl ? 'حفظ' : 'Enregistrer'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
