import React, { useState } from 'react';
import { Sparkles, Heart, Activity, Eye, Info, Camera, Layers, CheckCircle2 } from 'lucide-react';

interface DynamicFetalGraphicProps {
  week: number;
  currentWeek: number;
  currentDay: number;
  trimester: 1 | 2 | 3;
  language: string;
  fruitName: string;
  lengthCm: number;
  weightGrams: number;
  babyDevelopmentText: string;
}

interface StageGraphicConfig {
  stageNameEn: string;
  stageNameHi: string;
  presentationEn: string;
  presentationHi: string;
  fhrBpm: string;
  sacScale: number; // 0.3 to 1.0
  fetalScale: number; // 0.2 to 1.0
  rotationDeg: number; // 0 for early, 180 for cephalic head-down
  eyeStatus: 'fused' | 'open' | 'blinking';
  amnioticVolume: string;
  keyFeatureEn: string;
  keyFeatureHi: string;
  svgPosture: 'embryo_tiny' | 'embryo_c_shape' | 'fetus_early' | 'fetus_mid' | 'fetus_viable' | 'fetus_late' | 'fetus_cephalic';
}

function getStageConfig(week: number): StageGraphicConfig {
  if (week <= 6) {
    return {
      stageNameEn: 'Early Embryonic Stage',
      stageNameHi: 'प्रारंभिक भ्रूणावस्था',
      presentationEn: 'Implanted in Uterine Wall',
      presentationHi: 'गर्भाशय की दीवार से संलग्न',
      fhrBpm: '100–120 bpm',
      sacScale: 0.35,
      fetalScale: 0.25,
      rotationDeg: 0,
      eyeStatus: 'fused',
      amnioticVolume: '5–10 ml',
      keyFeatureEn: 'Neural tube closure & primitive heart tube formation',
      keyFeatureHi: 'न्यूरल ट्यूब का बंद होना और हृदय नलिका का निर्माण',
      svgPosture: 'embryo_tiny',
    };
  } else if (week <= 10) {
    return {
      stageNameEn: 'Organogenesis Phase',
      stageNameHi: 'अंग निर्माण अवस्था',
      presentationEn: 'Floating in Early Amniotic Sac',
      presentationHi: 'एमनियोटिक थैली में स्वतंत्र',
      fhrBpm: '155–170 bpm',
      sacScale: 0.45,
      fetalScale: 0.38,
      rotationDeg: 15,
      eyeStatus: 'fused',
      amnioticVolume: '30–50 ml',
      keyFeatureEn: 'Limb buds, distinct fingers, nasal tip & heartbeat peak',
      keyFeatureHi: 'हाथ-पैर की कलियां, उंगलियां और उच्च हृदय गति',
      svgPosture: 'embryo_c_shape',
    };
  } else if (week <= 14) {
    return {
      stageNameEn: 'Early Fetal Period',
      stageNameHi: 'प्रारंभिक फीटल काल',
      presentationEn: 'Active Limb Motility',
      presentationHi: 'सक्रिय हाथ-पैर की हलचल',
      fhrBpm: '150–160 bpm',
      sacScale: 0.58,
      fetalScale: 0.5,
      rotationDeg: 25,
      eyeStatus: 'fused',
      amnioticVolume: '100–150 ml',
      keyFeatureEn: 'Reflexes active, curling toes, fully formed facial profile',
      keyFeatureHi: 'चेहरे की बनावट स्पष्ट, उंगलियां मुड़ने की क्षमता',
      svgPosture: 'fetus_early',
    };
  } else if (week <= 20) {
    return {
      stageNameEn: 'Mid-Gestation / Quickening',
      stageNameHi: 'मध्य गर्भावस्था (पहली हलचल)',
      presentationEn: 'Transverse / Free Floating',
      presentationHi: 'आरामदायक स्वतंत्र स्थिति',
      fhrBpm: '145–155 bpm',
      sacScale: 0.72,
      fetalScale: 0.65,
      rotationDeg: 35,
      eyeStatus: 'fused',
      amnioticVolume: '350–450 ml',
      keyFeatureEn: 'Auditory development, sucking thumb, vernix coating',
      keyFeatureHi: 'आवाज सुनने की क्षमता, अंगूठा चूसना, वर्निक्स परत',
      svgPosture: 'fetus_mid',
    };
  } else if (week <= 26) {
    return {
      stageNameEn: 'Viability Milestone',
      stageNameHi: 'वायबिलिटी (जीवन सक्षमता) पड़ाव',
      presentationEn: 'Active Kicking & Somnolence Cycles',
      presentationHi: 'किकिंग एवं सक्रिय नींद-जागने का चक्र',
      fhrBpm: '135–145 bpm',
      sacScale: 0.82,
      fetalScale: 0.76,
      rotationDeg: 45,
      eyeStatus: 'open',
      amnioticVolume: '600–750 ml',
      keyFeatureEn: 'Surfactant synthesis in alveoli, distinct sleep-wake states',
      keyFeatureHi: 'फेफड़ों में सर्फेक्टेंट का बनना, पलकें खुलना',
      svgPosture: 'fetus_viable',
    };
  } else if (week <= 34) {
    return {
      stageNameEn: 'Rapid Maturation Period',
      stageNameHi: 'तीव्र परिपक्वता काल',
      presentationEn: 'Settling toward Cephalic Turn',
      presentationHi: 'सिर नीचे की ओर मुड़ना शुरू',
      fhrBpm: '130–140 bpm',
      sacScale: 0.9,
      fetalScale: 0.88,
      rotationDeg: 120,
      eyeStatus: 'blinking',
      amnioticVolume: '800–1000 ml',
      keyFeatureEn: 'Subcutaneous fat accumulation, rhythmic chest wall movements',
      keyFeatureHi: 'त्वचा के नीचे वसा का जमाव, सांस लेने का अभ्यास',
      svgPosture: 'fetus_late',
    };
  } else {
    return {
      stageNameEn: 'Full Term / Ready for Delivery',
      stageNameHi: 'पूर्ण परिपक्व (प्रसव के लिए तैयार)',
      presentationEn: 'Cephalic / Vertex Presentation (Head-Down)',
      presentationHi: 'सिफैलिक प्रजेंटेशन (सिर नीचे पेल्विस में)',
      fhrBpm: '120–140 bpm',
      sacScale: 1.0,
      fetalScale: 1.0,
      rotationDeg: 180,
      eyeStatus: 'blinking',
      amnioticVolume: '600–800 ml (snug fit)',
      keyFeatureEn: 'Firm grasp reflex, fully matured lungs, engaged in pelvis',
      keyFeatureHi: 'मजबूत पकड़, पूर्ण परिपक्व फेफड़े, पेल्विस में स्थापित',
      svgPosture: 'fetus_cephalic',
    };
  }
}

export const DynamicFetalGraphic: React.FC<DynamicFetalGraphicProps> = ({
  week,
  currentWeek,
  currentDay,
  trimester,
  language,
  fruitName,
  lengthCm,
  weightGrams,
  babyDevelopmentText,
}) => {
  const config = getStageConfig(week);
  const [viewMode, setViewMode] = useState<'anatomical' | 'photo' | 'size_metric'>('anatomical');

  const isCurrentWeek = week === currentWeek;
  const isAround24w = week >= 22 && week <= 26;

  return (
    <div className="relative min-h-[380px] sm:min-h-[440px] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#2B1B3D] via-[#1E1229] to-[#120B19] text-white p-5 sm:p-6 flex flex-col justify-between shadow-inner border border-purple-900/50">
      {/* Top Overlay Bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 bg-pink-950/70 border border-pink-700/60 px-2 py-0.5 rounded-full">
              {language === 'hi' ? `तिमाही ${trimester}` : `Trimester ${trimester}`}
            </span>
            {isCurrentWeek && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-600/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                {language === 'hi' ? 'वर्तमान स्थिति' : 'Current Status'}
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>
              {language === 'hi' ? `सप्ताह ${week} भ्रूण विकास` : `Week ${week} Fetal Anatomy`}
            </span>
            <span className="text-xs font-normal text-purple-300">
              ({language === 'hi' ? config.stageNameHi : config.stageNameEn})
            </span>
          </h3>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setViewMode('anatomical')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'anatomical'
                ? 'bg-purple-600 text-white font-semibold shadow-xs'
                : 'text-purple-200 hover:text-white'
            }`}
            title="Anatomical Visualization"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Anatomy</span>
          </button>

          {isAround24w && (
            <button
              onClick={() => setViewMode('photo')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'photo'
                  ? 'bg-purple-600 text-white font-semibold shadow-xs'
                  : 'text-purple-200 hover:text-white'
              }`}
              title="Clinical Photo View"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">24W Scan</span>
            </button>
          )}

          <button
            onClick={() => setViewMode('size_metric')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'size_metric'
                ? 'bg-purple-600 text-white font-semibold shadow-xs'
                : 'text-purple-200 hover:text-white'
            }`}
            title="Size & Fruit Scale"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Size Scale</span>
          </button>
        </div>
      </div>

      {/* Main Dynamic Graphic Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Soft Uterine Glow & Fluid Atmosphere */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full bg-radial from-rose-500/20 via-purple-600/15 to-transparent blur-2xl transition-all duration-700"
            style={{
              width: `${Math.min(340, 220 + week * 3)}px`,
              height: `${Math.min(340, 220 + week * 3)}px`,
            }}
          />
        </div>

        {/* View Mode 1: Dynamic Anatomical Vector Illustration */}
        {viewMode === 'anatomical' && (
          <div className="relative w-full max-w-[340px] h-[260px] flex items-center justify-center transition-all duration-500">
            {/* SVG Fetal & Amniotic Sac Graphic */}
            <svg
              viewBox="0 0 400 320"
              className="w-full h-full drop-shadow-[0_10px_25px_rgba(236,72,153,0.25)]"
            >
              <defs>
                {/* Amniotic Fluid Gradient */}
                <radialGradient id="amnioticGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#4f46e5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
                </radialGradient>

                {/* Fetal Body Gradient */}
                <linearGradient id="fetalSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fda4af" />
                  <stop offset="50%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>

                {/* Placenta Gradient */}
                <linearGradient id="placentaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9f1239" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.3" />
                </linearGradient>

                {/* Glow Filter */}
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Uterine Cavity Outline */}
              <ellipse
                cx="200"
                cy="160"
                rx={150 + week * 0.8}
                ry={120 + week * 0.7}
                fill="url(#amnioticGradient)"
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.85"
              />

              {/* Placenta at Uterine Fundus / Posterior Wall */}
              <path
                d="M 120 75 Q 200 45 280 75 Q 200 95 120 75 Z"
                fill="url(#placentaGrad)"
                stroke="#fda4af"
                strokeWidth="1"
                opacity="0.9"
              />
              <text x="200" y="70" fill="#fbcfe8" fontSize="9" textAnchor="middle" opacity="0.8" letterSpacing="1">
                PLACENTA
              </text>

              {/* Umbilical Cord */}
              <path
                d={`M 200 80 C ${180 + (week % 20)} 120, ${220 - (week % 15)} 140, 200 170`}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d={`M 198 80 C ${178 + (week % 20)} 120, ${218 - (week % 15)} 140, 198 170`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="3 3"
                opacity="0.8"
              />

              {/* Dynamic Fetus Figure based on gestational week */}
              <g
                transform={`translate(200, 165) rotate(${config.rotationDeg > 90 ? (week >= 36 ? 180 : 120) : 0}) scale(${config.fetalScale})`}
              >
                {/* Early Embryo Shape (Weeks 4-10) */}
                {config.svgPosture === 'embryo_tiny' || config.svgPosture === 'embryo_c_shape' ? (
                  <g filter="url(#softGlow)">
                    {/* C-shaped Embryonic Body */}
                    <path
                      d="M -30 -40 C 20 -60, 60 -10, 40 40 C 25 70, -20 60, -35 30 C -45 5, -50 -20, -30 -40 Z"
                      fill="url(#fetalSkin)"
                      opacity="0.95"
                    />
                    {/* Large Embryonic Cranium */}
                    <circle cx="15" cy="-25" r="28" fill="#fda4af" opacity="0.9" />
                    {/* Optical Pigment Dot */}
                    <circle cx="28" cy="-28" r="3.5" fill="#1e1b4b" />
                    {/* Pulsing Heart Tube Indicator */}
                    <circle cx="-5" cy="0" r="7" fill="#ffe4e6">
                      <animate attributeName="r" values="5;8;5" dur="0.45s" repeatCount="indefinite" />
                    </circle>
                    {/* Yolk Sac */}
                    <circle cx="-55" cy="15" r="16" fill="#fde047" opacity="0.5" stroke="#eab308" strokeWidth="1.5" />
                    <text x="-55" y="18" fill="#713f12" fontSize="7" textAnchor="middle" fontWeight="bold">
                      YOLK SAC
                    </text>
                  </g>
                ) : (
                  /* Formed Fetus (Weeks 12-40) */
                  <g filter="url(#softGlow)">
                    {/* Fetal Body Trunk */}
                    <path
                      d="M -20 -30 C 40 -40, 70 30, 45 80 C 20 120, -40 100, -50 50 C -60 10, -50 -20, -20 -30 Z"
                      fill="url(#fetalSkin)"
                      opacity="0.95"
                    />

                    {/* Fetal Head */}
                    <circle cx="15" cy="-45" r={week >= 30 ? 42 : 36} fill="#fca5a5" opacity="0.95" />

                    {/* Facial Profile */}
                    <path
                      d="M 40 -55 C 55 -50, 56 -35, 45 -30 C 52 -28, 50 -18, 40 -18"
                      fill="none"
                      stroke="#fda4af"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Eye */}
                    <ellipse cx="32" cy="-45" rx="3.5" ry={config.eyeStatus === 'open' || config.eyeStatus === 'blinking' ? 3 : 1} fill="#0f172a" />
                    {config.eyeStatus === 'blinking' && (
                      <circle cx="33" cy="-46" r="1" fill="#ffffff" />
                    )}

                    {/* Pulsing Fetal Heart Location */}
                    <circle cx="10" cy="15" r="9" fill="#f43f5e" opacity="0.8">
                      <animate attributeName="r" values="7;11;7" dur="0.42s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="0.42s" repeatCount="indefinite" />
                    </circle>
                    <Heart className="w-3.5 h-3.5 text-white fill-white" x="3" y="8" />

                    {/* Arms & Hands (Curled to Face) */}
                    <path
                      d="M 5 10 C 25 15, 35 -10, 28 -25"
                      fill="none"
                      stroke="#fda4af"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />

                    {/* Legs & Feet (Tucked in Fetal Position) */}
                    <path
                      d="M -15 70 C 15 105, 55 90, 48 55"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="11"
                      strokeLinecap="round"
                    />

                    {/* Spine Curve Highlight */}
                    <path
                      d="M -30 -25 C -55 20, -45 60, -20 85"
                      fill="none"
                      stroke="#fecdd3"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      opacity="0.8"
                    />
                  </g>
                )}
              </g>

              {/* Fetal Heart Rate Pulse Tag */}
              <g transform="translate(45, 260)">
                <rect width="115" height="34" rx="8" fill="#1e1b4b" opacity="0.85" stroke="#818cf8" strokeWidth="1" />
                <circle cx="16" cy="17" r="4" fill="#f43f5e">
                  <animate attributeName="r" values="3;6;3" dur="0.42s" repeatCount="indefinite" />
                </circle>
                <text x="28" y="15" fill="#fbcfe8" fontSize="9" fontWeight="bold">
                  HEART RATE
                </text>
                <text x="28" y="27" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ~{config.fhrBpm}
                </text>
              </g>

              {/* Presentation Badge */}
              <g transform="translate(240, 260)">
                <rect width="120" height="34" rx="8" fill="#1e1b4b" opacity="0.85" stroke="#ec4899" strokeWidth="1" />
                <text x="60" y="15" fill="#fbcfe8" fontSize="8" fontWeight="bold" textAnchor="middle">
                  PRESENTATION
                </text>
                <text x="60" y="27" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {week >= 36 ? 'Cephalic (Vertex)' : week >= 28 ? 'Cephalic Turning' : 'Free Floating'}
                </text>
              </g>
            </svg>
          </div>
        )}

        {/* View Mode 2: Clinical 24W Photo Scan */}
        {viewMode === 'photo' && isAround24w && (
          <div className="relative w-full max-w-[340px] h-[240px] sm:h-[260px] rounded-2xl overflow-hidden shadow-2xl border border-purple-500/50">
            <img
              src="/src/assets/images/fetal_development_24w_1792776892451.jpg"
              alt="Fetal Development 24 Weeks"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-xs text-white/90 font-medium">
                High-Definition Obstetric Ultrasound Reference (24 Weeks)
              </span>
            </div>
          </div>
        )}

        {/* View Mode 3: Biometric Size Comparison Scale */}
        {viewMode === 'size_metric' && (
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-4 animate-fadeIn text-center">
            <span className="text-xs font-bold text-pink-300 uppercase tracking-wider block">
              Gestational Metric Comparison
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {fruitName}
            </div>
            <p className="text-xs text-purple-200 max-w-xs mx-auto">
              Your baby measures approximately {lengthCm} cm from crown to heel and weighs about {weightGrams} grams.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase text-purple-300 block">Length (CRL / Stature)</span>
                <span className="text-xl font-bold font-mono text-white">~{lengthCm} cm</span>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase text-purple-300 block">Estimated Weight</span>
                <span className="text-xl font-bold font-mono text-white">~{weightGrams} g</span>
              </div>
            </div>

            <div className="text-[11px] text-pink-200/90 pt-1">
              Amniotic Fluid Volume: ~{config.amnioticVolume}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Milestone Bar */}
      <div className="relative z-10 pt-3 border-t border-purple-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="text-purple-100 truncate">
            <strong>Key Milestone:</strong>{' '}
            {language === 'hi' ? config.keyFeatureHi : config.keyFeatureEn}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-purple-300 shrink-0">
          <span>~{lengthCm} cm</span>
          <span>·</span>
          <span>~{weightGrams} g</span>
          <span>·</span>
          <span className="text-pink-300 font-semibold">{fruitName}</span>
        </div>
      </div>
    </div>
  );
};
