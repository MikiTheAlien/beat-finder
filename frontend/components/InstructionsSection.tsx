'use client';

import {useTranslations} from 'next-intl';

export default function InstructionsSection() {
  const t = useTranslations('Instructions');

  const steps = [
    t('step1'),
    t('step2'),
    t('step3'),
    t('step4'),
    t('step5'),
  ];

  return (
    <section className="py-16 bg-undrstnd-gray rounded-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">{t('title')}</h2>
      <ol className="space-y-4 list-decimal list-inside">
        {steps.map((step, index) => (
          <li key={index} className="text-lg text-gray-300">
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}

