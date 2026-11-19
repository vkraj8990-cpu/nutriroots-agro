import React from 'react';
import { useApp } from '../context/AppContext';
import { AGRO_PROJECTS } from '../data/plansData';
import { 
  Sprout, 
  MapPin, 
  Layers, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const AgroProjectsView: React.FC = () => {
  const { language, t, setCurrentTab } = useApp();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
            <Sprout className="w-4 h-4" />
            <span>{language === 'hi' ? 'जमीनी हकीकत एवं पारदर्शिता' : 'Verified Farmland Operations'}</span>
            <span aria-hidden="true">·</span>
            <span>610+ Hectares Under Cultivation</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
            {t.farmProofTitle}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t.farmProofSubtitle}
          </p>
        </div>
      </div>

      {/* Projects Showcase Cards */}
      <div className="space-y-8">
        {AGRO_PROJECTS.map((project, idx) => {
          const isReversed = idx % 2 === 1;
          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-12 items-stretch"
            >
              {/* Image Column */}
              <div className={`lg:col-span-5 relative min-h-[260px] lg:min-h-[340px] ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent lg:hidden" />
                <div className="absolute bottom-3 left-3 text-white text-xs font-semibold bg-stone-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{project.location}</span>
                </div>
              </div>

              {/* Content Column */}
              <div className={`lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 uppercase tracking-wider">
                      {project.hectares}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mt-2">
                      {language === 'hi' ? project.titleHi : project.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-emerald-800 mt-1">
                      {language === 'hi' ? project.subtitleHi : project.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {language === 'hi' ? project.descriptionHi : project.description}
                  </p>

                  {/* Tech Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-start gap-2 text-xs text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-100">
                      <Cpu className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-stone-900 font-semibold">{language === 'hi' ? 'तकनीक:' : 'Technology:'}</strong>
                        <span>{project.technology}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-100">
                      <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-stone-900 font-semibold">{language === 'hi' ? 'उपज चक्र:' : 'Yield Cadence:'}</strong>
                        <span>{project.yieldCycle}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Returns contribution pill */}
                <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-stone-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-medium text-stone-800">{project.returnsContribution}</span>
                  </div>

                  <button
                    onClick={() => setCurrentTab('dashboard')}
                    className="text-emerald-800 font-bold hover:text-emerald-900 flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <span>{language === 'hi' ? 'संबंधित प्लान देखें' : 'View Matching Plans'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
