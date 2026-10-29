'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Search, MapPin, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import { AuthModal } from '@/components/auth/AuthModal';

export function Hero() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="relative w-full min-h-[100vh] flex items-center overflow-hidden">
      
      {/* === FULL BLEED BACKGROUND IMAGE === */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-wedding.jpg"
          alt="Algerian Wedding"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Gradient overlay — stronger on text side */}
        <div className={`absolute inset-0 ${isRtl
          ? 'bg-gradient-to-l from-black/85 via-black/60 to-black/20'
          : 'bg-gradient-to-r from-black/85 via-black/60 to-black/20'
        }`} />
        {/* Bottom fade for search bar */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* === FLOATING GOLD PARTICLES (decorative) === */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-gold/70 hidden lg:block"
          style={{
            top: `${20 + i * 12}%`,
            [isRtl ? 'right' : 'left']: `${5 + i * 3}%`,
          }}
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 3 + i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* === MAIN CONTENT === */}
      <div className="container mx-auto px-4 z-20 relative pt-24 pb-44">
        <div className={`max-w-2xl ${isRtl ? 'mr-0 ml-auto text-right' : 'ml-0 mr-auto text-left'}`}>

          {/* ★ Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-gold/50 bg-black/30 backdrop-blur-sm text-gold-pale font-semibold text-xs tracking-widest uppercase shadow-sm">
              <Star className="w-3 h-3 fill-gold text-gold" />
              {isRtl ? 'رقم ١ في الجزائر' : 'N°1 en Algérie'}
              <Star className="w-3 h-3 fill-gold text-gold" />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]"
          >
            {isRtl ? (
              <>
                عرسك الجزائري<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-pale via-gold to-amber-300">
                  في ضغطة زر
                </span>
              </>
            ) : (
              <>
                Votre mariage<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-pale via-gold to-amber-300">
                  algérien de rêve
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/75 text-lg md:text-xl mb-10 leading-relaxed"
          >
            {isRtl
              ? 'اكتشف أفضل قاعات الأفراح، مصوري الزفاف وخبراء التجميل في الجزائر — كل ما تحتاجه ليومك الكبير في مكان واحد.'
              : 'Découvrez les meilleures salles, photographes et experts beauté en Algérie — tout pour votre grand jour en un seul endroit.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className={`flex flex-col sm:flex-row gap-4 mb-14 ${isRtl ? 'sm:flex-row-reverse' : ''}`}
          >
            <Link
              href="/search"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-gold to-amber-600 text-white font-bold text-lg shadow-[0_4px_24px_rgba(184,149,106,0.5)] hover:shadow-[0_8px_32px_rgba(184,149,106,0.7)] hover:scale-[1.03] transition-all duration-300"
            >
              {isRtl ? 'تصفح الخدمات' : 'Explorer les services'}
              <ChevronRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`} />
            </Link>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold text-lg hover:bg-white/20 hover:border-gold/50 transition-all duration-300 cursor-pointer"
            >
              {isRtl ? 'انضم كمزود خدمة' : 'Devenir prestataire'}
            </button>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`flex gap-8 ${isRtl ? 'justify-end' : 'justify-start'}`}
          >
            {[
              { num: '500+', label: isRtl ? 'مزود خدمة' : 'Prestataires' },
              { num: '58', label: isRtl ? 'ولاية' : 'Wilayas' },
              { num: '10K+', label: isRtl ? 'زوج سعيد' : 'Couples heureux' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-gold-pale">{stat.num}</div>
                <div className="text-white/55 text-sm mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* === GLASSMORPHISM SEARCH PANEL (pinned to bottom) === */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.85 }}
        className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Service search */}
              <div className="relative">
                <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} text-gold pointer-events-none`}>
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder={isRtl ? 'قاعة، مصور، تجميل...' : 'Salle, Photographe, Beauté...'}
                  className={`w-full h-14 bg-white/90 border border-gold/20 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'} text-charcoal placeholder:text-gray-400`}
                />
              </div>

              {/* Wilaya selector */}
              <div className="relative">
                <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} text-gold pointer-events-none`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <select
                  defaultValue=""
                  className={`w-full h-14 bg-white/90 border border-gold/20 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'} text-charcoal appearance-none`}
                >
                  <option value="" disabled>{isRtl ? 'اختر الولاية' : 'Choisir une wilaya'}</option>
                  <option value="16">Alger (16)</option>
                  <option value="31">Oran (31)</option>
                  <option value="25">Constantine (25)</option>
                  <option value="09">Blida (09)</option>
                  <option value="06">Béjaïa (06)</option>
                  <option value="05">Batna (05)</option>
                </select>
              </div>

              {/* Search button */}
              <button className="h-14 rounded-xl bg-gradient-to-r from-gold to-amber-600 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(184,149,106,0.5)] hover:shadow-[0_6px_24px_rgba(184,149,106,0.7)] hover:scale-[1.02] transition-all duration-300">
                <Search className="w-5 h-5" />
                {isRtl ? 'ابحث الآن' : 'Rechercher'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative gold corner brackets */}
      <div className="absolute top-24 left-8 w-10 h-10 border-t-2 border-l-2 border-gold/40 hidden lg:block" />
      <div className="absolute top-24 right-8 w-10 h-10 border-t-2 border-r-2 border-gold/40 hidden lg:block" />

      {/* Auth Modal for Vendor Registration */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialView="register-vendor"
      />
    </div>
  );
}
