'use client';

import {useTranslations} from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Hero from '@/components/Hero';
import FeaturesAndInstructions from '@/components/FeaturesAndInstructions';
import BetaSignup from '@/components/BetaSignup';

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-undrstnd-dark text-undrstnd-light relative z-10">
      {/* Animated gradient background circles for entire page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-pink-500/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>

        <Hero />
            <BetaSignup />
            <FeaturesAndInstructions />

      </div>

      {/* Footer */}
      <footer className="text-center py-8 mt-16 relative z-10">
        <p className="text-gray-500 text-sm">
          {t('Footer.beingDeveloped')}
        </p>
      </footer>
    </main>
  );
}

