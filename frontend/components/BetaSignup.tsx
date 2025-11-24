'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';
import axios from 'axios';
import {buildApiUrl} from '@/utils/api';

export default function BetaSignup() {
  const t = useTranslations('BetaSignup');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError(t('emailRequired'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('invalidEmail'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(buildApiUrl('/beta-signup'), {
        email,
      });

      if (response.data.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(response.data.message || t('signupFailed'));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detail || t('signupFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-undrstnd-gray p-8 rounded-lg border border-gray-800 space-y-6 text-center">
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2 text-green-200">{t('successTitle')}</h2>
            <p className="text-green-200">{t('successMessage')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-undrstnd-gray p-8 rounded-lg border border-gray-800 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-gray-400 text-lg">{t('description')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-3 bg-undrstnd-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white text-lg"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? t('submitting') : t('submit')}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

