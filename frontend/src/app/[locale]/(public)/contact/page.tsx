'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API endpoint
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="py-24 bg-gradient-to-b from-cream via-white to-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8">
            <MessageSquare size={16} />
            <span>{isRtl ? 'نحن هنا لمساعدتك' : 'Nous sommes là pour vous aider'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            {isRtl ? 'تواصل معنا' : 'Contactez-nous'}
          </h1>
          <p className="text-lg text-brown">
            {isRtl 
              ? 'لديك سؤال أو اقتراح؟ فريقنا جاهز للإجابة على استفساراتك.'
              : 'Vous avez une question ou une suggestion ? Notre équipe est prête à répondre à vos demandes.'}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Contact Info Side */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-heading font-bold text-charcoal mb-6">
                  {isRtl ? 'معلومات الاتصال' : 'Informations de Contact'}
                </h2>
                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal text-sm mb-1">
                        {isRtl ? 'العنوان' : 'Adresse'}
                      </h4>
                      <p className="text-brown text-sm">
                        {isRtl ? 'الجزائر العاصمة، الجزائر' : 'Alger, Algérie'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal text-sm mb-1">
                        {isRtl ? 'الهاتف' : 'Téléphone'}
                      </h4>
                      <p className="text-brown text-sm" dir="ltr">+213 (0) 555 12 34 56</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal text-sm mb-1">
                        {isRtl ? 'البريد الإلكتروني' : 'Email'}
                      </h4>
                      <a href="mailto:contact@wedinclick.dz" className="text-primary text-sm hover:underline">
                        contact@wedinclick.dz
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-cream/30 rounded-2xl p-6 border border-gold/10">
                <h3 className="font-bold text-charcoal mb-3 text-sm">
                  {isRtl ? 'ساعات العمل' : 'Horaires d\'ouverture'}
                </h3>
                <div className="space-y-2 text-sm text-brown">
                  <div className="flex justify-between">
                    <span>{isRtl ? 'الأحد — الخميس' : 'Dimanche — Jeudi'}</span>
                    <span className="font-medium text-charcoal">09:00 — 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRtl ? 'الجمعة — السبت' : 'Vendredi — Samedi'}</span>
                    <span className="font-medium text-red-500">{isRtl ? 'مغلق' : 'Fermé'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm">
                <h2 className="text-xl font-heading font-bold text-charcoal mb-6">
                  {isRtl ? 'أرسل لنا رسالة' : 'Envoyez-nous un message'}
                </h2>

                {submitted && (
                  <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 text-green-800 rounded-xl border border-green-200">
                    <CheckCircle size={20} />
                    <span className="text-sm font-medium">
                      {isRtl ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' : 'Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.'}
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        {isRtl ? 'الاسم الكامل' : 'Nom complet'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder={isRtl ? 'أدخل اسمك' : 'Votre nom'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        {isRtl ? 'البريد الإلكتروني' : 'Adresse e-mail'}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder={isRtl ? 'بريدك الإلكتروني' : 'Votre e-mail'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      {isRtl ? 'الموضوع' : 'Sujet'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder={isRtl ? 'موضوع رسالتك' : 'Sujet de votre message'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      {isRtl ? 'الرسالة' : 'Message'}
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gold/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      placeholder={isRtl ? 'اكتب رسالتك هنا...' : 'Écrivez votre message ici...'}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-gold py-3.5 font-bold flex items-center justify-center gap-2 text-sm"
                  >
                    <Send size={16} />
                    {isRtl ? 'إرسال الرسالة' : 'Envoyer le message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
