'use client';

import {useTranslations} from 'next-intl';
import React, {useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import {
  Music,
  TrendingUp,
  Gauge,
  Waves,
  Layers,
} from 'lucide-react';

type Platform = 'finalCutPro' | 'premierePro' | 'davinciResolve';

const PLATFORMS: {key: Platform; name: string; logoPath: string}[] = [
  {key: 'finalCutPro', name: 'Final Cut Pro', logoPath: '/logos/final-cut-pro-logo.png'},
  {key: 'premierePro', name: 'Premiere Pro', logoPath: '/logos/premiere-pro-logo.png'},
  {key: 'davinciResolve', name: 'DaVinci Resolve', logoPath: '/logos/davinci-resolve-logo.png'},
];

interface FeatureCardProps {
  feature: {
    key: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    iconBg: string;
  };
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function FeatureCard({ feature, index, isHovered, onMouseEnter, onMouseLeave }: FeatureCardProps) {
  const Icon = feature.icon;
  const [cardMousePos, setCardMousePos] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCardMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const colorMap: Record<string, string> = {
    'beatDrops': 'rgba(74, 222, 128, 0.5)',
    'buildUps': 'rgba(251, 146, 60, 0.5)',
    'bpmMarkers': 'rgba(248, 113, 113, 0.5)',
    'songBoundaries': 'rgba(96, 165, 250, 0.5)',
    'multiPlatform': 'rgba(167, 139, 250, 0.5)',
  };
  const glowColorMap: Record<string, string> = {
    'beatDrops': 'rgba(74, 222, 128, 0.3)',
    'buildUps': 'rgba(251, 146, 60, 0.3)',
    'bpmMarkers': 'rgba(248, 113, 113, 0.3)',
    'songBoundaries': 'rgba(96, 165, 250, 0.3)',
    'multiPlatform': 'rgba(167, 139, 250, 0.3)',
  };
  const borderColorMap: Record<string, string> = {
    'beatDrops': 'rgba(74, 222, 128, 0.5)',
    'buildUps': 'rgba(251, 146, 60, 0.5)',
    'bpmMarkers': 'rgba(248, 113, 113, 0.5)',
    'songBoundaries': 'rgba(96, 165, 250, 0.5)',
    'multiPlatform': 'rgba(167, 139, 250, 0.5)',
  };
  const haloColor = isHovered ? (colorMap[feature.key] || 'rgba(0, 0, 0, 0.3)') : 'rgba(0, 0, 0, 0.3)';
  const outwardGlowColor = glowColorMap[feature.key] || 'rgba(0, 0, 0, 0.2)';
  const borderColor = isHovered ? (borderColorMap[feature.key] || 'rgba(168, 85, 247, 0.3)') : 'rgba(168, 85, 247, 0.3)';

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={handleMouseMove}
      className={`
        group relative overflow-hidden rounded-2xl p-6
        glass-effect
        transition-all duration-300
        hover:scale-[1.02]
        ${index === 4 ? 'md:col-span-2 lg:col-span-1' : ''}
      `}
      style={{
        border: `1px solid ${borderColor}`,
        transition: 'border-color 0.3s ease, transform 0.3s ease',
      }}
    >
      {/* Outward glow effect on hover */}
      <div
        className="absolute -inset-2 pointer-events-none transition-all duration-300 ease-out rounded-2xl opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at center, ${outwardGlowColor}, transparent 80%)`,
          filter: 'blur(25px)',
          zIndex: -1,
        }}
      />
      
      {/* Mouse halo effect - contained within card */}
      <div
        className="absolute pointer-events-none transition-all duration-500 ease-out"
        style={{
          left: `${cardMousePos.x}px`,
          top: `${cardMousePos.y}px`,
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${haloColor}, transparent 70%)`,
          filter: 'blur(60px)',
          opacity: isHovered ? 0.6 : 0,
          transition: 'opacity 0.5s ease-out, background 0.5s ease-out',
        }}
      />
      
      {/* Shine effect overlay */}
      <div className="absolute inset-0 shine-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className={`
          inline-flex p-3 rounded-xl mb-4
          bg-gradient-to-br ${feature.iconBg}
        `}>
          <Icon 
            className={`
              w-6 h-6 ${feature.iconColor}
            `}
          />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">
          {feature.title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export default function FeaturesAndInstructions() {
  const t = useTranslations('Features');
  const tInstructions = useTranslations('Instructions');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('finalCutPro');
  const [displayLogo, setDisplayLogo] = useState<string>('');
  const [previousLogo, setPreviousLogo] = useState<string>('');
  const [newLogoOpacity, setNewLogoOpacity] = useState(0.6);
  const [prevLogoOpacity, setPrevLogoOpacity] = useState(0.6);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Randomly select platform on mount
  useEffect(() => {
    const randomPlatform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)].key;
    setSelectedPlatform(randomPlatform);
    const initialLogo = PLATFORMS.find(p => p.key === randomPlatform)?.logoPath || PLATFORMS[0].logoPath;
    setDisplayLogo(initialLogo);
  }, []);

  // Handle logo crossfade on platform change
  useEffect(() => {
    const newLogo = PLATFORMS.find(p => p.key === selectedPlatform)?.logoPath || PLATFORMS[0].logoPath;
    if (newLogo !== displayLogo && displayLogo !== '') {
      // Start transition: keep old logo visible, prepare new one
      setPreviousLogo(displayLogo);
      setPrevLogoOpacity(0.6);
      setNewLogoOpacity(0);
      // Update to new logo immediately
      setDisplayLogo(newLogo);
      // Trigger fade in/out after a tiny delay to ensure both images are rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNewLogoOpacity(0.6);
          setPrevLogoOpacity(0);
        });
      });
      // After transition completes, clear the old logo
      const timer = setTimeout(() => {
        setPreviousLogo('');
        setPrevLogoOpacity(0.6);
      }, 500);
      return () => clearTimeout(timer);
    } else if (displayLogo === '') {
      setDisplayLogo(newLogo);
    }
  }, [selectedPlatform, displayLogo]);

  const features = [
    {
      key: 'songBoundaries',
      title: t('songBoundaries.title'),
      description: t('songBoundaries.description'),
      icon: Waves,
      iconColor: 'text-blue-400',
      iconBg: 'from-blue-500/20 to-cyan-500/20',
      glowColor: 'from-blue-500/30 to-cyan-500/30',
    },
    {
      key: 'bpmMarkers',
      title: t('bpmMarkers.title'),
      description: t('bpmMarkers.description'),
      icon: Gauge,
      iconColor: 'text-red-400',
      iconBg: 'from-red-500/20 to-rose-500/20',
      glowColor: 'from-red-500/30 to-rose-500/30',
    },
    {
      key: 'buildUps',
      title: t('buildUps.title'),
      description: t('buildUps.description'),
      icon: TrendingUp,
      iconColor: 'text-orange-400',
      iconBg: 'from-orange-500/20 to-amber-500/20',
      glowColor: 'from-orange-500/30 to-amber-500/30',
    },
    {
      key: 'beatDrops',
      title: t('beatDrops.title'),
      description: t('beatDrops.description'),
      icon: Music,
      iconColor: 'text-green-400',
      iconBg: 'from-green-500/20 to-emerald-500/20',
      glowColor: 'from-green-500/30 to-emerald-500/30',
    },
    {
      key: 'multiPlatform',
      title: t('multiPlatform.title'),
      description: t('multiPlatform.description'),
      icon: Layers,
      iconColor: 'text-violet-400',
      iconBg: 'from-violet-500/20 to-purple-500/20',
      glowColor: 'from-violet-500/30 to-purple-500/30',
    },
  ];

  const steps = [
    tInstructions(`${selectedPlatform}.step1`),
    tInstructions(`${selectedPlatform}.step2`),
    tInstructions(`${selectedPlatform}.step3`),
    tInstructions(`${selectedPlatform}.step4`),
    tInstructions(`${selectedPlatform}.step5`),
  ];


  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Feature Cards - Small Bento Items */}
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.key}
              feature={feature}
              index={index}
              isHovered={hoveredCard === feature.key}
              onMouseEnter={() => setHoveredCard(feature.key)}
              onMouseLeave={() => setHoveredCard(null)}
            />
          ))}

          {/* Instructions Card - Large Bento Item */}
          <div className="
            md:col-span-2 lg:col-span-3
            group relative overflow-hidden rounded-2xl p-8
            glass-effect gradient-border
            hover:shadow-glow-purple-lg transition-all duration-300
          ">
            {/* Shine effect overlay */}
            <div className="absolute inset-0 shine-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {tInstructions('title')}
              </h2>

              {/* Platform Toggle Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                {PLATFORMS.map((platform) => (
                  <button
                    key={platform.key}
                    onClick={() => setSelectedPlatform(platform.key)}
                    className={`
                      relative flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm
                      transition-all duration-300
                      ${
                        selectedPlatform === platform.key
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-glow-purple-lg scale-105'
                          : 'bg-undrstnd-gray text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700'
                      }
                    `}
                  >
                    <Image
                      src={platform.logoPath}
                      alt={platform.name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <span>{platform.name}</span>
                    {selectedPlatform === platform.key && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/50 to-blue-500/50 blur-md -z-10" />
                    )}
                  </button>
                ))}
              </div>

              {/* Instructions List */}
              <ol className="space-y-4">
                {steps.map((step, index) => (
                  <li
                    key={`${selectedPlatform}-${index}`}
                    className="flex items-start gap-4 text-gray-300 group/item transition-opacity duration-300"
                  >
                    <span className="
                      flex-shrink-0 w-8 h-8 rounded-full
                      bg-gradient-to-br from-purple-500/30 to-blue-500/30
                      border border-purple-500/50
                      flex items-center justify-center
                      font-semibold text-white text-sm
                      group-hover/item:scale-110 transition-transform duration-200
                    ">
                      {index + 1}
                    </span>
                    <span className="text-base leading-relaxed pt-1">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Glow effect on hover */}
            <div className="
              absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
              transition-opacity duration-300 pointer-events-none
              bg-gradient-to-br from-purple-500/10 to-blue-500/10
              blur-2xl
            " />

            {/* Large blurred logo in bottom right */}
            <div className="absolute bottom-0 right-0 w-96 h-96 md:w-[28rem] md:h-[28rem] pointer-events-none">
              {/* Previous logo fading out */}
              {previousLogo && previousLogo !== displayLogo && (
                <Image
                  key={`prev-${previousLogo}`}
                  src={previousLogo}
                  alt=""
                  width={448}
                  height={448}
                  className="
                    absolute bottom-0 right-0
                    w-full h-full object-contain
                    transition-opacity duration-500 ease-in-out
                  "
                  style={{ 
                    filter: 'blur(30px)',
                    transform: 'translate(25%, 25%)',
                    opacity: prevLogoOpacity
                  }}
                />
              )}
              {/* Current logo fading in */}
              {displayLogo && (
                <Image
                  key={`current-${displayLogo}`}
                  src={displayLogo}
                  alt=""
                  width={448}
                  height={448}
                  className="
                    absolute bottom-0 right-0
                    w-full h-full object-contain
                    transition-opacity duration-500 ease-in-out
                  "
                  style={{ 
                    filter: 'blur(30px)',
                    transform: 'translate(25%, 25%)',
                    opacity: newLogoOpacity
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

