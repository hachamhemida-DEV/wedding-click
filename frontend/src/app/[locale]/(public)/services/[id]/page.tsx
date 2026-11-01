'use client';

import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader2, Store, Phone, Mail, Image as ImageIcon, Calendar, X, Check, CalendarDays, PartyPopper, Share2, Award, ShieldCheck, Clock, MessageSquare } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/store/authStore';
import { WishlistButton } from '@/components/shared/WishlistButton';
import { StarRating } from '@/components/shared/StarRating';

interface ServiceDetails {
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
    id: number;
    email: string;
    phone: string;
    created_at: string;
    vendorProfile: {
      business_name: string;
      description: string;
      address: string;
    };
    subscriptions?: {
      plan: string;
    }[];
  };
  reviews_count?: number;
  reviews_avg_rating?: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
}

export default function ServiceDetailsPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isStartingChat, setIsStartingChat] = useState(false);

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    event_date: '',
    event_type: '',
    message: '',
  });

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      alert(isRtl ? 'يرجى تسجيل الدخول أولاً للمراسلة' : 'Veuillez vous connecter pour envoyer un message');
      return;
    }
    if (user?.role !== 'client') {
      alert(isRtl ? 'فقط العملاء يمكنهم بدء محادثة' : 'Seuls les clients peuvent contacter le prestataire');
      return;
    }
    if (!service?.vendor?.id) return;
    try {
      setIsStartingChat(true);
      await api.post('/conversations', { partner_id: service.vendor.id });
      router.push('/client/messages' as any);
    } catch (err) {
      console.error('Failed to initiate conversation', err);
      router.push('/client/messages' as any);
    } finally {
      setIsStartingChat(false);
    }
  };
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const eventTypes = [
    { value: 'wedding', ar: 'حفل زفاف', fr: 'Mariage' },
    { value: 'engagement', ar: 'خطوبة', fr: 'Fiançailles' },
    { value: 'henna', ar: 'حفل حناء', fr: 'Henné' },
    { value: 'birthday', ar: 'عيد ميلاد', fr: 'Anniversaire' },
    { value: 'other', ar: 'أخرى', fr: 'Autre' },
  ];

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${params.id}`);
        setService(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setActiveImage(response.data.images[0]);
        }
      } catch (error) {
        console.error('Failed to fetch service details', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchService();
      fetchReviews();
    }
  }, [params.id]);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await api.get(`/services/${params.id}/reviews`);
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      setReviewError(isRtl ? 'يرجى اختيار تقييم (نجوم)' : 'Veuillez sélectionner une note (étoiles)');
      return;
    }

    setReviewSubmitting(true);
    setReviewError(null);
    try {
      await api.post('/reviews', {
        service_id: service?.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewSuccess(true);
      setReviewForm({ rating: 0, comment: '' });
      fetchReviews(); // Refresh reviews
    } catch (err: any) {
      setReviewError(err.response?.data?.message || (isRtl ? 'حدث خطأ' : 'Une erreur est survenue'));
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError(null);
    try {
      await api.post('/bookings', {
        service_id: service?.id,
        ...bookingForm,
      });
      setBookingSuccess(true);
    } catch (err: any) {
      setBookingError(err.response?.data?.message || (isRtl ? 'حدث خطأ' : 'Une erreur est survenue'));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Store className="w-16 h-16 text-gold-pale mb-4" />
        <h2 className="text-2xl font-bold text-charcoal mb-2">
          {isRtl ? 'الخدمة غير موجودة' : 'Service introuvable'}
        </h2>
        <p className="text-brown">
          {isRtl ? 'عذراً، لم نتمكن من العثور على هذه الخدمة.' : 'Désolé, nous n\'avons pas pu trouver ce service.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gold/10 flex flex-col lg:flex-row">
          
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2 p-6 flex flex-col gap-4 bg-gray-50/50">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-cream border border-gold/10 relative">
              {activeImage ? (
                <img 
                  src={activeImage} 
                  alt={service.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-brown-light">
                  <ImageIcon className="w-12 h-12 opacity-20" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <WishlistButton serviceId={service.id} size={24} className="drop-shadow-lg" />
              </div>
            </div>
            
            {service.images && service.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {service.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="mb-6">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                {isRtl ? service.category?.name_ar : service.category?.name_fr}
              </div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal leading-tight">
                  {service.title}
                </h1>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert(isRtl ? 'تم نسخ الرابط بنجاح!' : 'Lien copié avec succès !');
                  }}
                  className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-brown hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors flex-shrink-0"
                  title={isRtl ? 'مشاركة' : 'Partager'}
                >
                  <Share2 size={18} />
                </button>
              </div>

              {service.reviews_count && service.reviews_count > 0 ? (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={Math.round(service.reviews_avg_rating || 0)} size={18} />
                  <span className="text-sm font-semibold text-charcoal">
                    {Number(service.reviews_avg_rating).toFixed(1)}
                  </span>
                  <span className="text-sm text-brown">
                    ({service.reviews_count} {isRtl ? 'تقييم' : 'avis'})
                  </span>
                </div>
              ) : null}
              
              <div className="flex flex-wrap items-center gap-4 text-brown mb-6 p-4 bg-gray-50 rounded-2xl border border-gold/10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-charcoal text-lg">{service.vendor?.vendorProfile?.business_name}</span>
                      {service.vendor?.subscriptions && service.vendor.subscriptions.length > 0 && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                          service.vendor.subscriptions[0].plan === 'platinum' ? 'bg-slate-800 text-yellow-400' :
                          service.vendor.subscriptions[0].plan === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          <Award size={12} />
                          {service.vendor.subscriptions[0].plan.toUpperCase()}
                        </span>
                      )}
                    </div>
                    {service.vendor?.created_at && (
                      <div className="text-xs text-brown flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        {isRtl ? 'عضو منذ' : 'Membre depuis'} {new Date(service.vendor.created_at).getFullYear()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="w-px h-10 bg-gold/20 hidden sm:block mx-2"></div>
                
                <div className="flex items-center gap-1.5 ml-auto">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">{service.wilaya}</span>
                </div>
              </div>

              <div className="text-2xl font-bold text-primary mb-8 pb-8 border-b border-gold/10">
                {service.price ? `${service.price} DZD` : (isRtl ? 'السعر عند الطلب' : 'Sur devis')}
              </div>

              <h3 className="text-lg font-bold text-charcoal mb-3">
                {isRtl ? 'تفاصيل الخدمة' : 'Détails du service'}
              </h3>
              <p className="text-brown leading-relaxed whitespace-pre-line mb-8">
                {service.description || (isRtl ? 'لا يوجد وصف متاح.' : 'Aucune description disponible.')}
              </p>

              <h3 className="text-lg font-bold text-charcoal mb-4">
                {isRtl ? 'تواصل مع المزود' : 'Contacter le prestataire'}
              </h3>
              <div className="space-y-3 mb-8">
                <button
                  type="button"
                  onClick={handleStartChat}
                  disabled={isStartingChat}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gold/15 hover:bg-gold/25 text-primary font-semibold transition-all border border-gold/30 shadow-sm"
                >
                  {isStartingChat ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  <span>{isRtl ? 'مراسلة فورية عبر الموقع' : 'Envoyer un message'}</span>
                </button>

                {service.vendor?.phone && (
                  <a href={`tel:${service.vendor.phone}`} className="flex items-center gap-3 text-brown hover:text-primary transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-primary">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span dir="ltr">{service.vendor.phone}</span>
                  </a>
                )}
                {service.vendor?.email && (
                  <a href={`mailto:${service.vendor.email}`} className="flex items-center gap-3 text-brown hover:text-primary transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-primary">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span>{service.vendor.email}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gold/10 flex gap-4">
              <button 
                onClick={() => {
                  if (!isAuthenticated) {
                    alert(isRtl ? 'يرجى تسجيل الدخول أولاً' : 'Veuillez vous connecter d\'abord');
                    return;
                  }
                  if (user?.role !== 'client') {
                    alert(isRtl ? 'فقط العملاء يمكنهم الحجز' : 'Seuls les clients peuvent réserver');
                    return;
                  }
                  setShowBookingModal(true);
                  setBookingSuccess(false);
                  setBookingError(null);
                  setBookingForm({ event_date: '', event_type: '', message: '' });
                }}
                className="flex-1 btn-gold py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
              >
                <Calendar size={22} />
                {isRtl ? 'طلب حجز' : 'Demander une réservation'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl mx-auto mt-12 bg-white rounded-3xl p-8 border border-gold/10 shadow-sm">
        <h2 className="text-2xl font-heading font-bold text-charcoal mb-8 border-b border-gold/10 pb-4">
          {isRtl ? 'التقييمات والمراجعات' : 'Évaluations et avis'}
        </h2>

        {isAuthenticated && user?.role === 'client' && (
          <div className="mb-10 bg-cream p-6 rounded-2xl border border-gold/20">
            <h3 className="text-lg font-bold text-charcoal mb-4">
              {isRtl ? 'أضف تقييمك' : 'Ajouter votre avis'}
            </h3>
            
            {reviewSuccess ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-2">
                <Check size={20} />
                <span>{isRtl ? 'شكراً لك! تم إرسال تقييمك بنجاح.' : 'Merci ! Votre avis a été soumis avec succès.'}</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                    {reviewError}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    {isRtl ? 'التقييم' : 'Note'}
                  </label>
                  <StarRating 
                    rating={reviewForm.rating} 
                    interactive={true} 
                    size={28}
                    onRatingChange={(r) => setReviewForm({ ...reviewForm, rating: r })} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    {isRtl ? 'تعليقك (اختياري)' : 'Votre commentaire (optionnel)'}
                  </label>
                  <textarea 
                    rows={3}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full bg-white border border-gold/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none resize-none"
                    placeholder={isRtl ? 'كيف كانت تجربتك؟' : 'Comment s\'est passée votre expérience ?'}
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={reviewSubmitting}
                  className="btn-gold py-3 px-6 rounded-xl font-bold flex items-center gap-2"
                >
                  {reviewSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
                  {isRtl ? 'إرسال التقييم' : 'Soumettre l\'avis'}
                </button>
              </form>
            )}
          </div>
        )}

        {reviewsLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-charcoal">{review.user?.name}</div>
                  <span className="text-sm text-brown-light">
                    {new Date(review.created_at).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <StarRating rating={review.rating} size={14} className="mb-3" />
                {review.comment && (
                  <p className="text-brown text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-brown">
              {isRtl ? 'لا توجد تقييمات بعد.' : 'Aucun avis pour le moment.'}
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-cream w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-white"
            >
              <button 
                onClick={() => setShowBookingModal(false)}
                className="absolute top-6 right-6 text-brown hover:text-primary transition-colors z-20"
              >
                <X size={24} />
              </button>

              <div className="p-8 md:p-10">
                {bookingSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-charcoal mb-3">
                      {isRtl ? 'تم إرسال طلب الحجز!' : 'Demande envoyée !'}
                    </h2>
                    <p className="text-brown max-w-sm mx-auto mb-6">
                      {isRtl 
                        ? 'سيقوم المزود بمراجعة طلبك والرد عليك قريباً.' 
                        : 'Le prestataire examinera votre demande et vous répondra bientôt.'}
                    </p>
                    <button 
                      onClick={() => setShowBookingModal(false)}
                      className="btn-gold px-8 py-3 rounded-xl font-bold"
                    >
                      {isRtl ? 'حسناً' : 'OK'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-heading font-bold text-charcoal">
                        {isRtl ? 'طلب حجز' : 'Demander une réservation'}
                      </h2>
                      <p className="text-sm text-brown mt-1">{service.title}</p>
                    </div>

                    {bookingError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm text-center">
                        {bookingError}
                      </div>
                    )}

                    <form onSubmit={handleBookingSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          <CalendarDays size={16} className="inline mr-1" />
                          {isRtl ? 'تاريخ الحدث' : 'Date de l\'événement'}
                        </label>
                        <input 
                          type="date"
                          required
                          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                          value={bookingForm.event_date}
                          onChange={(e) => setBookingForm({...bookingForm, event_date: e.target.value})}
                          className="w-full border border-gold/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          <PartyPopper size={16} className="inline mr-1" />
                          {isRtl ? 'نوع الحدث' : 'Type d\'événement'}
                        </label>
                        <select 
                          value={bookingForm.event_type}
                          onChange={(e) => setBookingForm({...bookingForm, event_type: e.target.value})}
                          className="w-full border border-gold/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none bg-white"
                        >
                          <option value="">{isRtl ? '-- اختر --' : '-- Choisir --'}</option>
                          {eventTypes.map(t => (
                            <option key={t.value} value={t.value}>{isRtl ? t.ar : t.fr}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          {isRtl ? 'رسالتك للمزود (اختياري)' : 'Votre message au prestataire (optionnel)'}
                        </label>
                        <textarea 
                          rows={4}
                          value={bookingForm.message}
                          onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                          className="w-full border border-gold/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none resize-none"
                          placeholder={isRtl ? 'أخبر المزود عن تفاصيل حفلك...' : 'Décrivez les détails de votre événement...'}
                        />
                      </div>

                      {service.price && (
                        <div className="bg-gold-pale/10 rounded-xl p-4 border border-gold/10 text-center">
                          <p className="text-sm text-brown">{isRtl ? 'السعر المقترح' : 'Prix indicatif'}</p>
                          <p className="text-2xl font-bold text-primary">{service.price} DZD</p>
                        </div>
                      )}

                      <button 
                        disabled={bookingLoading}
                        className="w-full btn-gold py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {bookingLoading ? <Loader2 className="animate-spin" size={22} /> : <Calendar size={22} />}
                        {isRtl ? 'تأكيد الطلب' : 'Confirmer la demande'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
