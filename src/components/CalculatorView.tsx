import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLANS_DATA } from '../data/plansData';
import { Plan } from '../types';
import { Calculator, ArrowRight, TrendingUp, Sparkles, Sprout, CheckCircle2 } from 'lucide-react';

export const CalculatorView: React.FC = () => {
  const { language, t, setSelectedPlanForBuy, setCurrentTab } = useApp();
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(1); // Default Plan A

  const currentPlan = PLANS_DATA[selectedPlanIndex];

  const daily = currentPlan.daily;
  const weekly = daily * 7;
  const monthly = daily * 30;
  const totalReturn = currentPlan.total;
  const netProfit = totalReturn - currentPlan.investment;
  const profitPercentage = Math.round((netProfit / currentPlan.investment) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
            <Calculator className="w-4 h-4" />
            <span>{language === 'hi' ? 'स्मार्ट यील्ड सिमुलेटर' : 'Agro Yield Simulator'}</span>
            <span aria-hidden="true">·</span>
            <span>150-Day Compounding</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
            {t.calculatorTitle}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t.calculatorSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Plan Selector & Sliders */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
              {language === 'hi' ? 'योजना चुनें (Starter से Plan K):' : 'Select Plan to Simulate:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLANS_DATA.map((plan, idx) => {
                const isSelected = idx === selectedPlanIndex;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlanIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 text-emerald-950 font-bold'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="text-[11px] text-stone-500 flex justify-between">
                      <span>Plan {plan.id}</span>
                      <span className="font-semibold text-emerald-800">{plan.roiMultiplier}</span>
                    </div>
                    <div className="text-sm font-extrabold mt-0.5 tabular-nums">
                      ₹{plan.investment.toLocaleString('en-IN')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Plan Detail Box */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900">{currentPlan.name}</span>
              <span className="text-emerald-800 font-semibold">{currentPlan.cropType}</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'hi'
                ? `यह योजना ${currentPlan.harvestCycle} पर आधारित है और 150 दिनों तक प्रति दिन ₹${currentPlan.daily} का रिटर्न देती है।`
                : `Underwritten by ${currentPlan.harvestCycle} agro production yielding ₹${currentPlan.daily}/day for 150 consecutive days.`}
            </p>
          </div>
        </div>

        {/* Right Column: Projected Returns Cards */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
          <div>
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block mb-1">
              {language === 'hi' ? '150-दिवसीय अनुमानित कुल लाभ' : '150-Day Total Agro Yield'}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white tabular-nums">
              ₹{totalReturn.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-200 mt-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>+{profitPercentage}% {language === 'hi' ? 'शुद्ध लाभ' : 'Net Profit'} (₹{netProfit.toLocaleString('en-IN')})</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-emerald-800/80 text-xs sm:text-sm">
            <div className="flex justify-between py-1.5 border-b border-emerald-800/50">
              <span className="text-emerald-200">{t.dailyProjected}:</span>
              <span className="font-extrabold text-white tabular-nums">
                ₹{daily.toLocaleString('en-IN')} / {language === 'hi' ? 'दिन' : 'day'}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-emerald-800/50">
              <span className="text-emerald-200">{language === 'hi' ? 'साप्ताहिक आय (7 दिन):' : '7-Day Return:'}</span>
              <span className="font-extrabold text-white tabular-nums">
                ₹{weekly.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-emerald-800/50">
              <span className="text-emerald-200">{t.monthlyProjected}:</span>
              <span className="font-extrabold text-white tabular-nums">
                ₹{monthly.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-emerald-200">{language === 'hi' ? 'कुल रिटर्न गुणक:' : 'Yield Multiplier:'}</span>
              <span className="font-extrabold text-amber-300 tabular-nums text-base">
                {currentPlan.roiMultiplier}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedPlanForBuy(currentPlan);
              setCurrentTab('dashboard');
            }}
            className="w-full py-3 px-4 bg-white hover:bg-emerald-50 active:scale-[0.99] text-emerald-950 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{language === 'hi' ? `₹${currentPlan.investment.toLocaleString('en-IN')} में यह प्लान खरीदें` : `Activate for ₹${currentPlan.investment.toLocaleString('en-IN')}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
