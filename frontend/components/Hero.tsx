'use client';

import {useTranslations} from 'next-intl';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="text-center py-16 relative">
      <div className="relative z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          <span 
            className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradient 8s ease infinite',
            }}
          >
            {t('title')}
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
      </div>
    </section>
  );
}

