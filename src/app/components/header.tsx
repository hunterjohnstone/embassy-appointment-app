'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type Language = 'de' | 'en';

interface HeaderProps {
  title: string;
  currentLanguage: Language;
}

export default function Header({ title, currentLanguage }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const switchLanguage = (lang: Language) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-white backdrop-blur-sm py-4 px-6 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col space-y-1">
            <div className="w-6 h-1 bg-black rounded-full"></div>
            <div className="w-6 h-1 bg-red-500 rounded-full"></div>
            <div className="w-6 h-1 bg-yellow-400 rounded-full"></div>
          </div>
          <Link className='cursor-pointer' href="/">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </Link>
        </div>
        
        {/* Language Switcher */}
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => switchLanguage('de')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              currentLanguage === 'de' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'cursor-pointer text-gray-600 hover:text-gray-900'
            }`}
          >
            DE
          </button>
          <button
            onClick={() => switchLanguage('en')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              currentLanguage === 'en' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'cursor-pointer text-gray-600 hover:text-gray-900'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}