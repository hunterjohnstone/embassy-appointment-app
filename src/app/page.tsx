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
      subtitle: "Deutsche Botschaft Windhoek",
      mission: "Wir informieren Sie per E-Mail, sobald neue Termine an der Deutschen Botschaft in Windhoek verfügbar sind. Einfach E-Mail eintragen und benachrichtigt werden.",
      placeholder: "Ihre E-Mail-Adresse",
      button: "Benachrichtigen",
      loading: "Wird gesendet...",
      success: "Erfolg! Wir senden Ihnen eine Benachrichtigung.",
      error: "Fehler! Bitte versuchen Sie es erneut.",
      copyright: "Deutsche Botschaft Windhoek Termin Finder",
      howItWorksTitle: "So funktioniert es",
      howItWorksDesc: "Unser System überwacht kontinuierlich die Website der Deutschen Botschaft auf verfügbare Termine für Nationalvisa. Wir lösen automatisch die CAPTCHAs und prüfen alle paar Minuten auf neue Verfügbarkeiten.",
      features: [
        "Automatische Überwachung der Botschafts-Website",
        "CAPTCHA-Erkennung und -Lösung",
        "Prüfung auf Nationalvisa-Termine",
        "Sofortige E-Mail-Benachrichtigung"
      ],
      donationTitle: "Unterstützen Sie dieses Projekt",
      donationDesc: "Dieser Service ist kostenlos. Wenn er Ihnen geholfen hat, erwägen Sie eine kleine Spende, um die Server- und Entwicklungskosten zu decken.",
      donationButton: "Jetzt spenden",
      donationThanks: "Vielen Dank für Ihre Unterstützung!"
    },
    en: {
      title: "Appointment Finder", 
      subtitle: "German Embassy Windhoek",
      mission: "We'll email you as soon as new appointments become available at the German Embassy in Windhoek. Just enter your email and get notified.",
      placeholder: "Your email address",
      button: "Get Notified",
      loading: "Sending...",
      success: "Success! We'll send you a notification.",
      error: "Error! Please try again.",
      copyright: "German Embassy Windhoek Appointment Finder",
      howItWorksTitle: "How it works",
      howItWorksDesc: "Our system continuously monitors the German Embassy website for available National Visa appointments. We automatically solve CAPTCHAs and check for new availability every few minutes.",
      features: [
        "Automatic embassy website monitoring",
        "CAPTCHA recognition and solving",
        "National visa appointment checking",
        "Instant email notifications"
      ],
      donationTitle: "Support this project",
      donationDesc: "This service is completely free. If it has helped you, consider making a small donation to help cover server and development costs.",
      donationButton: "Donate now",
      donationThanks: "Thank you for your support!"
    }
  };

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await fetch('/api/submit', {  // Make sure this path is correct
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    console.log('Response status:', response.status); // Add this for debugging
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
      setStatus('success');
      setEmail('');
    } else {
      console.log('Error response:', await response.text());
      setStatus('error');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    setStatus('error');
  } finally {
    setLoading(false);
  }
};

  const handleDonation = () => {
    // In a real app, this would open a payment modal or redirect
    alert(t.donationThanks);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-white backdrop-blur-sm py-4 px-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-1 h-8 bg-black rounded-full"></div>
              <div className="w-1 h-8 bg-red-500 rounded-full"></div>
              <div className="w-1 h-8 bg-yellow-400 rounded-full"></div>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
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
      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Email Signup Section */}
          <div className="text-center max-w-md mx-auto space-y-8">
            <div className="space-y-4">
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

            {/* Status Messages */}
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

            {/* Trust Indicators */}
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

          {/* How It Works Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">{t.howItWorksTitle}</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t.howItWorksDesc}
              </p>
              <ul className="space-y-3">
                {t.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3 text-gray-700">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-yellow-50 rounded-2xl p-8 border border-gray-200">
              <div className="aspect-square bg-white rounded-xl border border-gray-300 flex items-center justify-center">
                <div className="text-center space-y-4 p-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">
                    {language === 'de' 
                      ? 'Automatische Überwachung läuft' 
                      : 'Automatic monitoring running'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gradient-to-br from-yellow-50 to-gray-50 rounded-2xl p-8 border border-gray-200 order-2 md:order-1">
              <div className="aspect-square bg-white rounded-xl border border-gray-300 flex items-center justify-center">
                <div className="text-center space-y-4 p-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">
                    {language === 'de' 
                      ? 'Unterstützen Sie diesen Service' 
                      : 'Support this service'
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <h3 className="text-2xl font-bold text-gray-900">{t.donationTitle}</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t.donationDesc}
              </p>
              <button
                onClick={handleDonation}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-6 rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all shadow-sm"
              >
                {t.donationButton}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white py-6 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 text-sm">{t.copyright} © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}