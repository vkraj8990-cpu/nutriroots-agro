import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  Calendar, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Layers 
} from 'lucide-react';

export const MyInvestmentsView: React.FC = () => {
  const { 
    activePlans, 
    user, 
    language, 
    t, 
    setCurrentTab, 
    harvestDailyYield, 
    canHarvest, 
    harvestTimer 
  } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4" />
            <span>{language === 'hi' ? 'पोर्टफोलियो प्रबंधन' : 'Portfolio Management'}</span>
            <span aria-hidden="true">·</span>
            <span>{user.activePlanCount} {language === 'hi' ? 'सक्रिय योजनाएं' : 'Active Contracts'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {language === 'hi' ? 'मेरे सक्रिय निवेश (My Active Plans)' : 'My Active Investments'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {language === 'hi' 
              ? 'आपके द्वारा सक्रिय किए गए सभी कृषि निवेश और उनकी दैनिक आय प्रगति।'
              : 'Real-time performance and countdown for all your active agricultural yield contracts.'}
          </p>
        </div>

        {/* Harvest Action Button */}
        {user.activePlanCount > 0 && (
          <button
            onClick={harvestDailyYield}
            disabled={!canHarvest}
            className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0 ${
              canHarvest
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {canHarvest 
                ? (language === 'hi' ? 'आज का लाभ कलेक्ट करें' : 'Harvest Today\'s Yield') 
                : (language === 'hi' ? `अगला हार्वेस्ट: ${harvestTimer}` : `Ready in ${harvestTimer}`)}
            </span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {language === 'hi' ? 'कुल दैनिक रिटर्न' : 'Combined Daily Yield'}
          </span>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1 tabular-nums">
            ₹{user.dailyIncome.toLocaleString('en-IN')} <span className="text-xs font-normal text-stone-500">/ {language === 'hi' ? 'दिन' : 'day'}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {language === 'hi' ? 'कुल संचित लाभ' : 'Accumulated Yield'}
          </span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1 tabular-nums">
            ₹{activePlans.filter(p => p.status === 'active').reduce((sum, p) => sum + p.totalEarnedSoFar, 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {language === 'hi' ? '150-दिन की कुल परिपक्वता' : '150-Day Total Maturity'}
          </span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1 tabular-nums">
            ₹{activePlans.filter(p => p.status === 'active').reduce((sum, p) => sum + (p.dailyIncome * p.cycleDays), 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Plans List or Empty State */}
      {activePlans.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-stone-300 max-w-lg mx-auto my-8">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">
            {language === 'hi' ? 'अभी कोई सक्रिय योजना नहीं है' : 'No Active Investment Plans Yet'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-6 leading-relaxed">
            {language === 'hi' 
              ? 'NutriRoots कृषि विकास योजनाओं में निवेश करें और प्रतिदिन अपने वॉलेट में आय प्राप्त करना शुरू करें। प्रारंभिक योजना मात्र ₹500 से उपलब्ध है।'
              : 'Activate an agricultural growth plan to begin receiving verified daily income directly into your wallet. Starter plans start from just ₹500.'}
          </p>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm inline-flex items-center gap-2"
          >
            <span>{language === 'hi' ? 'योजनाएं देखें और शुरू करें' : 'Browse Growth Plans'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activePlans.map((plan) => {
            const progressPercent = Math.min(100, Math.round((plan.daysElapsed / plan.cycleDays) * 100));
            const remainingDays = Math.max(0, plan.cycleDays - plan.daysElapsed);
            const totalProjected = plan.dailyIncome * plan.cycleDays;

            const isPending = plan.status === 'pending_verification';

            return (
              <div
                key={plan.id}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                      <span className="font-semibold text-emerald-800">Plan #{plan.planId}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{plan.purchaseDate}</span>
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900">
                      {plan.planName}
                    </h3>
                  </div>

                  {isPending ? (
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pending Verification</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.statusActive}</span>
                    </span>
                  )}
                </div>

                {/* Financial Details Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-lg text-xs">
                  <div>
                    <span className="text-stone-500 block">{t.investment}</span>
                    <span className="font-extrabold text-stone-900 tabular-nums">
                      ₹{plan.investment.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 block">{t.dailyReturn}</span>
                    <span className="font-bold text-emerald-700 tabular-nums">
                      +₹{plan.dailyIncome.toLocaleString('en-IN')}/d
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 block">{t.totalReturn}</span>
                    <span className="font-extrabold text-emerald-800 tabular-nums">
                      ₹{totalProjected.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-stone-600 font-medium">
                    <span>
                      {language === 'hi' ? 'अवधि प्रगति:' : 'Tenure Progress:'} {plan.daysElapsed} / {plan.cycleDays} {t.days}
                    </span>
                    <span className="font-bold text-stone-900 tabular-nums">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`${isPending ? 'bg-amber-500' : 'bg-emerald-600'} h-2.5 rounded-full transition-all duration-500`} 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>
                      {language === 'hi' ? 'अर्जित:' : 'Earned:'} <strong className="text-emerald-800 font-bold tabular-nums">₹{plan.totalEarnedSoFar.toLocaleString('en-IN')}</strong>
                    </span>
                    <span>
                      {remainingDays} {language === 'hi' ? 'दिन शेष' : 'days left'}
                    </span>
                  </div>
                </div>

                {/* Footer status */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  {isPending ? (
                    <span className="flex items-center gap-1 text-amber-800 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'hi' ? 'UPI / UTR सत्यापन लंबित' : 'UPI / UTR Verification Pending'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-800 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'hi' ? 'दैनिक रिटर्न सुरक्षित' : 'Yield Underwritten'}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1 tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isPending ? '999669968@ybl' : '24h Payout Engine'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
