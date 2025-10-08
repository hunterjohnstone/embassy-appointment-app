import Link from 'next/link';
import Header from './components/header';
import Footer from './components/footer';

export interface PageProps {
  searchParams: {
    lang?: string;
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentLanguage = (resolvedSearchParams.lang === 'de' ? 'de' : 'en') as 'de' | 'en';
  const translations = {
    en: {
      hero: {
        titleLine1: "Never Miss",
        titleLine2: "a German Embassy", 
        titleLine3: "Appointment Again",
        subtitle: "Get <strong>instant notifications</strong> when appointment slots open up at your local German embassy",
        trustBadges: {
          monitoring: "Real-time Monitoring",
          captcha: "CAPTCHA Auto-Solving"
        }
      },
      popularLocations: {
        title: "Popular Locations",
        windhoek: {
          name: "Windhoek",
          description: "National Visa Appointments"
        },
        istanbul: {
          name: "Istanbul", 
          description: "Document Attestation"
        },
        viewAll: {
          title: "View All Embassies",
          description: ""
        }
      },
      title: "Appointment Finder",
      subtitle: "German Embassies Worldwide", 
      mission: "We monitor German embassies worldwide and email you as soon as new appointments become available. Select your embassy and stay informed.",
      howItWorksTitle: "How it works",
      howItWorksDesc: "Our systems continuously monitor German embassy websites for available appointments. We automatically solve CAPTCHAs and regularly check for new availability.",
      features: [
        "Automatic embassy website monitoring",
        "CAPTCHA recognition and solving",
        "Regular appointment availability checks",
        "Instant email notifications"
      ],
      chooseEmbassy: "Choose your embassy",
      windhoekTitle: "Windhoek, Namibia",
      windhoekDesc: "National Visa appointments at the German Embassy",
      istanbulTitle: "Istanbul, Turkey", 
      istanbulDesc: "Document attestation and signature certification",
      newdelhiTitle: "New Delhi, India",
      newdelhiDesc: "Document attestation and visa appointments",
      viewAppointments: "View appointments",
      copyright: "German Embassies Appointment Finder",
      trustedBy: "Trusted by applicants worldwide",
      monitoringActive: "Real-time monitoring active"
    },
    de: {
      hero: {
        titleLine1: "Verpassen Sie Nie",
        titleLine2: "Wieder Einen Termin",
        titleLine3: "Bei Der Botschaft",
        subtitle: "Erhalten Sie <strong>sofortige Benachrichtigungen</strong> wenn Termine an Ihrer deutschen Botschaft verfügbar werden",
        trustBadges: {
          monitoring: "Echtzeit-Überwachung",
          captcha: "CAPTCHA Automatische Lösung"
        }
      },
      popularLocations: {
        title: "Beliebte Standorte",
        windhoek: {
          name: "Windhoek",
          description: "Nationale Visumstermine"
        },
        istanbul: {
          name: "Istanbul",
          description: "Dokumentenbeglaubigung"
        },
        viewAll: {
          title: "Alle Botschaften Anzeigen",
          description: ""
        }
      },
      title: "Termin Finder",
      subtitle: "Deutsche Botschaften Weltweit",
      mission: "Wir überwachen deutsche Botschaften weltweit und benachrichtigen Sie per E-Mail, sobald neue Termine verfügbar werden. Wählen Sie Ihre Botschaft aus und bleiben Sie informiert.",
      howItWorksTitle: "So funktioniert es",
      howItWorksDesc: "Unsere Systeme überwachen kontinuierlich die Websites deutscher Botschaften auf verfügbare Termine. Wir lösen automatisch CAPTCHAs und prüfen regelmäßig auf neue Verfügbarkeiten.",
      features: [
        "Automatische Überwachung der Botschafts-Websites",
        "CAPTCHA-Erkennung und -Lösung",
        "Regelmäßige Prüfung auf Terminverfügbarkeit",
        "Sofortige E-Mail-Benachrichtigung"
      ],
      chooseEmbassy: "Wählen Sie Ihre Botschaft",
      windhoekTitle: "Windhoek, Namibia",
      windhoekDesc: "Nationalvisa-Termine an der Deutschen Botschaft",
      istanbulTitle: "Istanbul, Türkei",
      istanbulDesc: "Dokumenten-Beglaubigung und Unterschriftszertifizierung",
      newdelhiTitle: "New Delhi, Indien",
      newdelhiDesc: "Dokumenten-Beglaubigung und Visum-Termine",
      viewAppointments: "Termine anzeigen",
      copyright: "Deutsche Botschaften Termin Finder",
      trustedBy: "Vertraut von Bewerbern weltweit",
      monitoringActive: "Echtzeit-Überwachung aktiv"
    }
  };

  const t = translations[currentLanguage];

  const embassies = [
    {
      id: 'windhoek',
      title: t.windhoekTitle,
      description: t.windhoekDesc,
      href: `/windhoek${currentLanguage === 'de' ? '?lang=de' : ''}`,
      color: 'from-red-50 to-yellow-50',
      borderColor: 'border-red-200',
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        </svg>
      )
    },
    {
      id: 'istanbul',
      title: t.istanbulTitle,
      description: t.istanbulDesc,
      href: `/istanbul${currentLanguage === 'de' ? '?lang=de' : ''}`,
      color: 'from-red-50 to-white',
      borderColor: 'border-red-200',
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'newdelhi',
      title: t.newdelhiTitle,
      description: t.newdelhiDesc,
      href: `/newdelhi${currentLanguage === 'de' ? '?lang=de' : ''}`,
      color: 'from-yellow-50 to-white',
      borderColor: 'border-yellow-200',
      icon: (
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <>
      <Header title={t.title} currentLanguage={currentLanguage} />
      {/* Main Content */}
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-8">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                  <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                    {t.hero.titleLine1}
                  </span>
                  <br />
                  <span className="text-gray-900">
                    {t.hero.titleLine2}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-500 to-red-600 bg-clip-text text-transparent">
                    {t.hero.titleLine3}
                  </span>
                </h1>
                
                <p 
                  className="text-xl md:text-2xl text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: t.hero.subtitle.replace('<strong>', '<span class="font-semibold text-red-600">').replace('</strong>', '</span>')
                  }}
                />
              </div>

              {/* Trust Badges */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span>{t.hero.trustBadges.monitoring}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{t.hero.trustBadges.captcha}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Popular Locations */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">{t.popularLocations.title}</h3>
                  <div className="w-10 h-10 bg-gradient-to-br from-red-50 to-yellow-50 rounded-xl flex items-center justify-center border border-red-200">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Windhoek */}
                  <Link href={`/windhoek${currentLanguage === 'de' ? '?lang=de' : ''}`} className="group block">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 transition-all duration-300 group-hover:shadow-lg group-hover:border-red-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-red-600">🇳🇦</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{t.popularLocations.windhoek.name}</h4>
                            <p className="text-sm text-gray-500">{t.popularLocations.windhoek.description}</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>

                  {/* Istanbul */}
                  <Link href={`/istanbul${currentLanguage === 'de' ? '?lang=de' : ''}`} className="group block">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 transition-all duration-300 group-hover:shadow-lg group-hover:border-red-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-red-600">🇹🇷</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{t.popularLocations.istanbul.name}</h4>
                            <p className="text-sm text-gray-500">{t.popularLocations.istanbul.description}</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>

                  {/* See All Link */}
                  <a href="#all-embassies" className="group block">
                    <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl p-4 border border-red-200 transition-all duration-300 group-hover:shadow-lg group-hover:from-red-100 group-hover:to-yellow-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-red-200">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{t.popularLocations.viewAll.title}</h4>
                            <p className="text-sm text-gray-500">{t.popularLocations.viewAll.description}</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-red-500 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Embassy Cards Grid */}
          <div id="all-embassies" className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center">
              {t.chooseEmbassy}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {embassies.map((embassy) => (
                <Link
                  key={embassy.id}
                  href={embassy.href}
                  className="group block"
                >
                  <div className={`bg-gradient-to-br ${embassy.color} rounded-2xl p-6 border ${embassy.borderColor} transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 h-full flex flex-col`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                        {embassy.icon}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {embassy.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 flex-1">
                      {embassy.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-red-600 font-medium text-sm">
                        {t.viewAppointments}
                      </span>
                      <svg className="w-4 h-4 text-gray-400 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">
                    {t.monitoringActive}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicator */}
          {/* <div className="text-center">
            <p className="text-gray-500 text-sm uppercase tracking-wider">
              {t.trustedBy}
            </p>
          </div> */}
        </div>
      </main>

      <Footer copyright={t.copyright} />
    </>
  );
}