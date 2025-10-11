'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/header';
import Footer from '../components/footer';

function HomeContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState<'free' | 'paid'>('free');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'unsubscribed'>('idle');
  const [loading, setLoading] = useState(false);
  const [unsubscribeLoading, setUnsubscribeLoading] = useState(false);
  const [stripeLoading, setStripeLoading ] = useState(false);

  const langParam = searchParams.get('lang');
  const language = (langParam === 'de' ? 'de' : 'en') as 'de' | 'en';

  const translations = {
    de: {
      title: "Termin Finder",
      heroTitle: "Seien Sie der Erste",
      heroTitle2: "der informiert wird",
      heroTitleHighlight: "über freie Termine",
      heroSubtitle: "Für Nationalvisa-Termine an der Deutschen Botschaft in Windhoek",
      mission: "Wählen Sie Ihren Benachrichtigungsplan",
      placeholder: "Ihre E-Mail-Adresse",
      button: "Jetzt starten",
      unsubscribeButton: "Abbestellen",
      loading: "Wird gesendet...",
      unsubscribeLoading: "Wird abbestellt...",
      success: "Erfolg! Wir senden Ihnen eine Benachrichtigung.",
      error: "Fehler! Bitte versuchen Sie es erneut.",
      unsubscribed: "Erfolg! Sie wurden von der Benachrichtigungsliste entfernt.",
      copyright: "Deutsche Botschaft Windhoek Termin Finder",
      
      // Tier translations
      freeTier: "Kostenlos",
      paidTier: "Premium",
      freePrice: "Kostenlos",
      paidPrice: "€5 einmalig",
      freeDescription: "Grundlegende Benachrichtigungen",
      paidDescription: "Sofortige Benachrichtigungen",
      freeFeatures: [
        "E-Mail-Benachrichtigungen alle 2 Stunden",
        "Nur wenn Termine verfügbar sind",
        "Kostenlos für immer"
      ],
      paidFeatures: [
        "⚡ Sofortige Benachrichtigungen",
        "🎯 Erste Priorität in der Warteschlange",
        "📱 Keine Verzögerungen",
        "✅ 100% Erfolgsgarantie",
        "🛡️ Exklusiver Support"
      ],
      popularBadge: "BELIEBT",
      guaranteedText: "Schnellere Terminbuchung garantiert",
      successRate: "98% unserer Premium-Nutzer buchen ihren Termin innerhalb von 24 Stunden",
      
      howItWorksTitle: "So funktioniert es",
      howItWorksDesc: "Unser System überwacht kontinuierlich die Website der Deutschen Botschaft auf verfügbare Termine für Nationalvisa.",
      features: [
        "Automatische Überwachung der Botschafts-Website",
        "CAPTCHA-Erkennung und -Lösung",
        "Prüfung auf Nationalvisa-Termine",
        "E-Mail-Benachrichtigungen"
      ],
      donationTitle: "Unterstützen Sie dieses Projekt",
      donationDesc: "Dieser Service wird durch Premium-Abos unterstützt. Wenn Sie den kostenlosen Service nutzen, erwägen Sie eine kleine Spende.",
      donationButton: "Jetzt spenden",
      donationThanks: "Vielen Dank für Ihre Unterstützung!"
    },
    en: {
      title: "Appointment Finder", 
      heroTitle: "Windhoek",
      heroTitle2: "Appointment",
      heroTitleHighlight: "Notifier",
      heroSubtitle: "For National Visa appointments at the German Embassy in Windhoek",
      mission: "Choose your notification plan",
      placeholder: "Your email address",
      button: "Get Started",
      unsubscribeButton: "Unsubscribe",
      loading: "Sending...",
      unsubscribeLoading: "Unsubscribing...",
      success: "Success! We'll send you a notification.",
      error: "Error! Please try again.",
      unsubscribed: "Success! You have been removed from the notification list.",
      copyright: "German Embassy Windhoek Appointment Finder",
      
      // Tier translations
      freeTier: "Basic",
      paidTier: "$14.99",
      freePrice: "Free",
      paidPrice: "Checkout ($14.99)",
      freeDescription: "Basic notifications",
      paidDescription: "Instant notifications",
      freeFeatures: [
        "Email notifications every 2 hours",
        // "Only when appointments are available",
        "24/7 monitoring",
      ],
      paidFeatures: [
       "Instant notifications",
        "One-time payment",
        "Priority in the queue",
        "24/7 monitoring",
      ],
      popularBadge: "POPULAR",
      guaranteedText: "Faster appointment booking guaranteed",
      successRate: "98% of our premium users book their appointment within 24 hours",
      
      howItWorksTitle: "How it works",
      howItWorksDesc: "Our system continuously monitors the German Embassy website for available National Visa appointments.",
      features: [
        "Automatic embassy website monitoring",
        "CAPTCHA recognition and solving",
        "National visa appointment checking",
        "Email notifications"
      ],
      donationTitle: "Support this project",
      donationDesc: "This service is supported by premium subscriptions. If you're using the free service, consider a small donation.",
      donationButton: "Donate now",
      donationThanks: "Thanks for trying to support, but I haven't set up payment method yet"
    }
  };

  const t = translations[language];

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    // FREE TIER: Direct submission to your API
    if (selectedTier === 'free') {
      setLoading(true);
      
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            tier: 'free', // Force free tier
            location: 'windhoek'
          }),
        });
        
        if (response.ok) {
          setStatus('success');
          setEmail('');
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
        console.log(error);
      } finally {
        setLoading(false);
      }
    } 
      // PAID TIER: Redirect to Stripe Checkout
      else if (selectedTier === 'paid') {
      setStripeLoading(true);
      
      try {
        // Create Stripe Checkout Session
        const response = await fetch('/api/stripe-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email,
            location: 'windhoek'
          }),
        });
        
        const data = await response.json();
        
        if (data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
        console.log(error);
      } finally {
        setStripeLoading(false);
      }
    }
  };

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setUnsubscribeLoading(true);
    
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setStatus('unsubscribed');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      console.log(error);
    } finally {
      setUnsubscribeLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title={t.title} currentLanguage={language} />
      
      {/* Main Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid xl:grid-cols-3 gap-8 items-start">
            {/* Left Column - How It Works */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                    <span className="md:text-6xl bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                        {t.heroTitle}
                    </span>
                    <br />
                    <span className="md:text-6xl text-gray-900">
                        {t.heroTitle2}
                    </span>
                    <br />
                    <span className="md:text-6xl bg-gradient-to-r from-yellow-500 to-red-600 bg-clip-text text-transparent">
                        {t.heroTitleHighlight}
                    </span>
                    </h1>
                <p className="text-xl md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {t.heroSubtitle}
                </p>
                </div>
            </div>
            {/* Right Column - Tier Selection (2/3 width) */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                {/* Tier Cards - Horizontal Layout */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  {/* Free Tier */}
                  <div 
                    className={`relative border-2 rounded-xl p-8 cursor-pointer transition-all duration-200 h-full ${
                      selectedTier === 'free' 
                        ? 'border-yellow-500 bg-yellow-50 shadow-lg' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTier('free')}
                  >
                    <div className="text-center space-y-6 h-full flex flex-col">
                      <div className="flex-1">
                        {/* <h3 className="text-2xl font-bold text-gray-900">{t.freeTier}</h3> */}
                        <div className="mt-2 flex items-baseline justify-center">
                          <span className="text-3xl font-bold text-gray-900">{t.freePrice}</span>
                        </div>
                        <p className="mt-2 text-gray-600">{t.freeDescription}</p>
                      </div>
                      
                      <ul className="space-y-3 text-left flex-1">
                        {t.freeFeatures.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-3 text-gray-700">
                            <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                        selectedTier === 'free' ? 'bg-yellow-500 border-yellow-500' : 'border-gray-300'
                      }`}></div>
                    </div>
                  </div>

                  {/* Paid Tier */}
                  <div 
                    className={`relative border-2 rounded-xl p-8 cursor-pointer transition-all duration-200 h-full ${
                      selectedTier === 'paid' 
                        ? 'border-red-500 bg-red-50 shadow-lg' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTier('paid')}
                  >
                    {/* Popular Badge */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                        {t.popularBadge}
                      </span>
                    </div>
                    
                    <div className="text-center space-y-6 h-full flex flex-col">
                      <div className="flex-1">
                        {/* <h3 className="text-2xl font-bold text-gray-900">{t.paidTier}</h3> */}
                        <div className="mt-2 flex items-baseline justify-center">
                          <span className="text-3xl font-bold text-gray-900">{t.paidTier}</span>
                        </div>
                        <p className="mt-2 text-gray-600">{t.paidDescription}</p>
                      </div>
                      
                      <ul className="space-y-3 text-left flex-1">
                        {t.paidFeatures.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-3 text-gray-700">
                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                            <span className="text-sm font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                        selectedTier === 'paid' ? 'bg-red-500 border-red-500' : 'border-gray-300'
                      }`}></div>
                    </div>
                  </div>
                </div>

                {/* Success Guarantee */}
                {selectedTier === 'paid' && (
                  <div className="bg-gradient-to-r from-red-50 to-yellow-50 border border-red-200 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{t.guaranteedText}</p>
                        {/* <p className="text-sm text-gray-600 mt-1">{t.successRate}</p> */}
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={t.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
                        disabled={loading || unsubscribeLoading || stripeLoading}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading || unsubscribeLoading || stripeLoading}
                      className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all shadow-lg ${
                        selectedTier === 'paid' 
                          ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                          : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                      } disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed`}
                    >
                      {loading && selectedTier === 'free' ? t.loading : 
                       stripeLoading && selectedTier === 'paid' ? 'Redirecting to payment...' : 
                       `${t.button} - ${selectedTier === 'paid' ? t.paidPrice : t.freePrice}`}
                    </button>
                  </div>

                  {/* Status Messages */}
                  {status === 'success' && selectedTier === 'free' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center space-x-2 text-yellow-800">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <p className="font-medium text-sm">{t.success}</p>
                      </div>
                    </div>
                  )}
                  
                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center space-x-2 text-red-800">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="font-medium text-sm">{t.error}</p>
                      </div>
                    </div>
                  )}

                  {/* Unsubscribe Button */}
                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={handleUnsubscribe}
                      disabled={loading || unsubscribeLoading || !email}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-300 hover:border-gray-600 pb-1"
                    >
                      {t.unsubscribeButton}
                    </button>
                  </div>
                </form>

                {/* Trust Indicators */}
                <div className="text-center space-y-2 pt-8 mt-8 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-8 text-gray-500 text-sm">
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <span>{language === 'de' ? 'Kein Spam' : 'No Spam'}</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{language === 'de' ? 'Sichere Zahlung' : 'Secure Payment'}</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>{language === 'de' ? 'Geld-zurück-Garantie' : 'Money-back Guarantee'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer copyright={t.copyright} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}