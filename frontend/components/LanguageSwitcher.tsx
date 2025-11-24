'use client';

import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/routing';
import {useState, useEffect} from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="px-2 py-1">EN</span>
        <span className="text-gray-500">|</span>
        <span className="px-2 py-1">DE</span>
      </div>
    );
  }

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale});
    localStorage.setItem('locale', newLocale);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 rounded ${
          locale === 'en' ? 'bg-white text-black font-semibold' : 'hover:bg-gray-800'
        }`}
      >
        EN
      </button>
      <span className="text-gray-500">|</span>
      <button
        onClick={() => switchLocale('de')}
        className={`px-2 py-1 rounded ${
          locale === 'de' ? 'bg-white text-black font-semibold' : 'hover:bg-gray-800'
        }`}
      >
        DE
      </button>
    </div>
  );
}

