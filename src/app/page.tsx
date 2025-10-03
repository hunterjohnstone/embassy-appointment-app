'use client';

import { useState } from 'react';

type Language = 'de' | 'en';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  const translations = {
    de: {
      title: "Termin Finder",
      subtitle: "Deutsche Botschaft Windhoek (Nationale Visa)",
      mission: "Wir informieren Sie per E-Mail, sobald neue Termine an der Deutschen Botschaft in Windhoek verfügbar sind. Einfach E-Mail eintragen und benachrichtigt werden.",
      placeholder: "Ihre E-Mail-Adresse",
      button: "Benachrichtigen",
      loading: "Wird gesendet...",
      success: "Erfolg! Wir senden Ihnen eine Benachrichtigung.",
      error: "Fehler! Bitte versuchen Sie es erneut.",
      copyright: "Deutsche Botschaft Windhoek Termin Finder"
    },
    en: {
      title: "Appointment Finder", 
      subtitle: "German Embassy Windhoek (National Visa)",
      mission: "We'll email you as soon as new appointments become available at the German Embassy in Windhoek. Just enter your email and get notified.",
      placeholder: "Your email address",
      button: "Get Notified",
      loading: "Sending...",
      success: "Success! We'll send you a notification.",
      error: "Error! Please try again.",
      copyright: "German Embassy Windhoek Appointment Finder"
    }
  };

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with German color accents */}
      <header className="border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-white py-6 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-1 h-8 bg-black rounded-full"></div>
              <div className="w-1 h-8 bg-red-500 rounded-full"></div>
              <div className="w-1 h-8 bg-yellow-400 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">{t.title}</h1>
          </div>
          
          {/* Language Switcher */}
          <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLanguage('de')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                language === 'de' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              DE
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                language === 'en' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="max-w-md w-full space-y-8">
          {/* Header Section with German colors */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg mb-2">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {t.subtitle}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.mission}
            </p>
          </div>

          {/* Status Messages with German colors */}
          {status === 'success' && (
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

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t.placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? t.loading : t.button}
            </button>
          </form>

          {/* Trust Indicators with German color dots */}
          <div className="text-center space-y-2 pt-8">
            <div className="flex items-center justify-center space-x-6 text-gray-500 text-sm">
              <span className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                <span>{language === 'de' ? 'Kein Spam' : 'No Spam'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                <span>{language === 'de' ? 'Ein Klick Abbestellen' : 'One-click Unsubscribe'}</span>
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {language === 'de' 
                ? 'Ihre Daten sind geschützt und werden nur für Terminbenachrichtigungen verwendet.'
                : 'Your data is protected and only used for appointment notifications.'
              }
            </p>
          </div>
        </div>
      </main>

      {/* Footer with German color accent */}
      <footer className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white py-6 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 text-sm">{t.copyright} @ {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}