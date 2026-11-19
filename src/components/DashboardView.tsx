import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLANS_DATA } from '../data/plansData';
import { Plan } from '../types';
import { 
  Sprout, 
  ArrowUpRight, 
  Wallet, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowDownLeft, 
  Calculator, 
  Share2
} from 'lucide-react';
import { InvestmentGrowthChart } from './InvestmentGrowthChart';
import { RecentTransactions } from './RecentTransactions';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    language, 
    t, 
    activePlans,
    setSelectedPlanForBuy, 
    setShowRechargeModal, 
    setShowWithdrawModal, 
    setCurrentTab, 
    harvestDailyYield, 
    canHarvest, 
    harvestTimer 
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'starter' | 'standard' | 'premium'>('all');

  const filteredPlans = PLANS_DATA.filter(plan => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'starter') return plan.investment <= 3500;
    if (categoryFilter === 'standard') return plan.investment > 3500 && plan.investment <= 14500;
    if (categoryFilter === 'premium') return plan.investment > 14500;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Header Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-emerald-900/10">
        <img
          src="/src/assets/images/hero_agro_farm_1794502966213.jpg"
          alt="NutriRoots Agro Sustainable Farms"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/90 to-emerald-950/70 backdrop-blur-[2px]" />
        
        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 text-white max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-3">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>GROW GREEN • GROW TOGETHER</span>
            <span aria-hidden="true">·</span>
            <span>Invest in Nature · Earn Daily</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 text-balance">
            {language === 'hi' ? 'NutriRoots कृषि विकास योजनाएं' : 'NutriRoots Agro Growth Plans'}
          </h1>
          
          <p className="text-sm sm:text-base text-emerald-100 font-normal leading-relaxed mb-6 max-w-2xl">
            {language === 'hi' 
              ? 'आधुनिक पॉलीहाउस, हाई-टेक हाइड्रोपोनिक्स और सस्टेनेबल एग्रो-फॉरेस्ट्री में सीधे भागीदारी करें। 150 दिनों तक प्रति दिन सुनिश्चित लाभ प्राप्त करें।'
              : 'Direct participation in precision hydroponics, medicinal botanicals, and sustainable agro-forestry with transparent daily returns credited directly to your wallet.'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('plans-grid-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>{language === 'hi' ? 'योजनाएं देखें' : 'Explore Plans'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentTab('calculator')}
              className="px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-600/40 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Calculator className="w-4 h-4 text-emerald-300" />
              <span>{language === 'hi' ? 'रिटर्न कैलकुलेटर' : 'Yield Calculator'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('referral')}
              className="px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-600/40 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Share2 className="w-4 h-4 text-emerald-300" />
              <span>{language === 'hi' ? 'रेफरल नेटवर्क' : 'Referral Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics & Action Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Wallet Balance */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                {t.walletBalance}
              </span>
              <Wallet className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
              ₹{user.walletBalance.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {language === 'hi' ? 'उपलब्ध निकासी योग्य राशि' : 'Available withdrawable balance'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
            <button
              onClick={() => setShowRechargeModal(true)}
              className="flex-1 py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>{t.recharge}</span>
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex-1 py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{t.withdraw}</span>
            </button>
          </div>
        </div>

        {/* Metric 2: Daily Income */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                {t.dailyIncome}
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tabular-nums">
              ₹{user.dailyIncome.toLocaleString('en-IN')}<span className="text-xs text-stone-500 font-normal ml-1">/ {language === 'hi' ? 'दिन' : 'day'}</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {user.dailyIncome > 0 
                ? (language === 'hi' ? `150 दिन में कुल: ₹${(user.dailyIncome * 150).toLocaleString('en-IN')}` : `150-Day Yield: ₹${(user.dailyIncome * 150).toLocaleString('en-IN')}`)
                : (language === 'hi' ? 'योजना खरीदकर दैनिक लाभ शुरू करें' : 'Activate a plan to begin daily payouts')}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              onClick={harvestDailyYield}
              disabled={user.dailyIncome <= 0 || !canHarvest}
              className={`w-full py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                user.dailyIncome > 0 && canHarvest
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm animate-pulse'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {user.dailyIncome <= 0 
                  ? (language === 'hi' ? 'कोई योजना सक्रिय नहीं' : 'No Active Plan')
                  : canHarvest 
                    ? (language === 'hi' ? 'दैनिक लाभ कलेक्ट करें' : 'Harvest Daily Yield')
                    : (language === 'hi' ? `अगला लाभ: ${harvestTimer}` : `Next Yield in ${harvestTimer}`)}
              </span>
            </button>
          </div>
        </div>

        {/* Metric 3: Active Investment Plans */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                {t.activePlans}
              </span>
              <Layers className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
              {user.activePlanCount} <span className="text-sm font-medium text-stone-500">{language === 'hi' ? 'योजनाएं' : 'Contracts'}</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {activePlans.length > 0 
                ? (language === 'hi' ? `${activePlans[0].planName} सक्रिय है` : `${activePlans[0].planName} active`)
                : (language === 'hi' ? 'शुरुआती प्लान ₹500 से शुरू' : 'Starter plans start at ₹500')}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              onClick={() => setCurrentTab('my_plans')}
              className="w-full py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <span>{language === 'hi' ? 'सक्रिय प्लान्स ट्रैक करें' : 'View Active Plans'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Metric 4: Total Earned */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                {t.totalEarned}
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
              ₹{user.totalEarned.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {language === 'hi' ? 'कृषि यील्ड + रेफरल कमीशन' : 'Agro yield + referral bonus'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              onClick={() => setCurrentTab('passbook')}
              className="w-full py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <span>{language === 'hi' ? 'पासबुक देखें' : 'View Passbook'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Recharts Projected Investment Growth Component */}
      <InvestmentGrowthChart />

      {/* 4. Recent Transactions Component (Last 5 Deposits, Purchases & Withdrawals) */}
      <RecentTransactions />

      {/* 5. Filterable Plans Grid Section */}
      <div id="plans-grid-section" className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <span>{language === 'hi' ? 'सुरक्षित कृषि योजनाएं' : 'Verified Growth Contracts'}</span>
              <span aria-hidden="true">·</span>
              <span>150 {language === 'hi' ? 'दिन की अवधि' : 'Days Tenure'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              {t.explorePlans}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {t.plansSubtitle}
            </p>
          </div>

          {/* Category Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'hi' ? 'सभी योजनाएं (12)' : 'All Plans (12)'}
            </button>
            <button
              onClick={() => setCategoryFilter('starter')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === 'starter'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'hi' ? 'शुरुआती (₹500 - ₹3.5K)' : 'Starter (₹500 - ₹3.5K)'}
            </button>
            <button
              onClick={() => setCategoryFilter('standard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === 'standard'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'hi' ? 'मध्यम (₹4.5K - ₹14.5K)' : 'Standard (₹4.5K - ₹14.5K)'}
            </button>
            <button
              onClick={() => setCategoryFilter('premium')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === 'premium'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'hi' ? 'प्रीमियम (₹24.5K - ₹50K)' : 'Premium (₹24.5K - ₹50K)'}
            </button>
          </div>
        </div>

        {/* 12 Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPlans.map((plan) => {
            const isAffordable = user.walletBalance >= plan.investment;
            return (
              <div
                key={plan.id}
                className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group relative"
              >
                {/* Top Plan Info */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 tabular-nums">
                      Plan {plan.id}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                      {plan.roiMultiplier} Return
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors mb-1">
                    {plan.name}
                  </h3>
                  
                  <p className="text-xs text-stone-500 mb-4 line-clamp-1">
                    🌱 {plan.cropType}
                  </p>

                  {/* Plan Metrics List */}
                  <div className="space-y-2 py-3 border-y border-stone-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">{t.investment}:</span>
                      <span className="font-extrabold text-stone-900 tabular-nums text-sm">
                        ₹{plan.investment.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">{t.dailyReturn}:</span>
                      <span className="font-bold text-emerald-700 tabular-nums">
                        ₹{plan.daily.toLocaleString('en-IN')} / {language === 'hi' ? 'दिन' : 'day'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">{t.cycle}:</span>
                      <span className="font-medium text-stone-700 tabular-nums">
                        {plan.cycle} {t.days}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-dashed border-stone-100">
                      <span className="text-stone-600 font-medium">{t.totalReturn}:</span>
                      <span className="font-extrabold text-emerald-800 tabular-nums text-sm">
                        ₹{plan.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <div className="mt-5">
                  <button
                    onClick={() => setSelectedPlanForBuy(plan)}
                    className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <span>{t.buyNow}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Trust & Farm Transparency Strip */}
      <div className="bg-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">
                {language === 'hi' ? 'वास्तविक कृषि अनुबंध' : 'Real Agricultural Contracts'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'hi' 
                  ? 'हमारी सभी योजनाएं सत्यापित जैविक पॉलीहाउस, टीक वृक्षारोपण और जड़ी-बूटी फार्मिग द्वारा समर्थित हैं।'
                  : 'Every plan is underwritten by verified organic greenhouses, teak agroforestry, and institutional supply agreements.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">
                {language === 'hi' ? '24 घंटे में स्वचालित रिटर्न' : 'Automated Daily Payouts'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'hi' 
                  ? 'प्रति दिन सुबह आपके खाते में निर्धारित दैनिक लाभ जोड़ा जाता है जिसे आप तुरंत UPI द्वारा निकाल सकते हैं।'
                  : 'Daily profits are credited systematically every 24 hours, with instant withdrawal directly to your UPI ID or Bank.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">
                {language === 'hi' ? 'मल्टी-टीयर रेफरल लाभ' : 'Multi-Tier Referral Power'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'hi' 
                  ? 'लेवल 1 से 10%, लेवल 2 से 5% और लेवल 3 से 2% त्वरित कमीशन प्राप्त करें।'
                  : 'Earn 10% direct commission on Level 1, 5% on Level 2, and 2% on Level 3 referrals automatically.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
