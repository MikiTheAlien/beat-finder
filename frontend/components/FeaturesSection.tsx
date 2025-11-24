'use client';

import {useTranslations} from 'next-intl';

export default function FeaturesSection() {
  const t = useTranslations('Features');

  const features = [
    {
      key: 'beatDrops',
      title: t('beatDrops.title'),
      description: t('beatDrops.description'),
    },
    {
      key: 'buildUps',
      title: t('buildUps.title'),
      description: t('buildUps.description'),
    },
    {
      key: 'bpmMarkers',
      title: t('bpmMarkers.title'),
      description: t('bpmMarkers.description'),
    },
    {
      key: 'songBoundaries',
      title: t('songBoundaries.title'),
      description: t('songBoundaries.description'),
    },
    {
      key: 'multiPlatform',
      title: t('multiPlatform.title'),
      description: t('multiPlatform.description'),
    },
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        {t('title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature) => (
          <div
            key={feature.key}
            className="bg-undrstnd-gray p-6 rounded-lg border border-gray-800"
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

