import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { PLANS_DATA } from '../data/plansData';
import { TrendingUp, Zap, ShieldCheck } from 'lucide-react';

interface TooltipPayloadItem {
  value: number;
  name: string;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  breakEvenDay: number;
  isHindi: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  breakEvenDay,
  isHindi,
}) => {
  if (active && payload && payload.length) {
    const day = typeof label === 'number' ? label : parseInt(String(label).replace(/\D/g, ''), 10) || 0;
    const totalValue = payload.find((p) => p.dataKey === 'cumulativeValue')?.value ?? 0;
    const principal = payload.find((p) => p.dataKey === 'principal')?.value ?? 0;
    const dailyIncome = payload.find((p) => p.dataKey === 'dailyEarned')?.value ?? 0;
    const netProfit = Math.max(0, totalValue - principal);
    const isPastBreakEven = principal > 0 && totalValue >= principal;

    return (
      <div className="bg-stone-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-stone-800 text-xs min-w-[220px] space-y-2">
        <div className="flex items-center justify-between border-b border-stone-800 pb-1.5 gap-2">
          <span className="font-bold text-emerald-400">
            {day === 0
              ? isHindi
                ? 'आज (Day 0)'
                : 'Today (Day 0)'
              : isHindi
                ? `दिन +${day}`
                : `Day +${day}`}
          </span>
          {principal > 0 && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isPastBreakEven
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {isPastBreakEven
                ? isHindi
                  ? 'शुद्ध लाभ चरण'
                  : 'Pure Profit Zone'
                : isHindi
                  ? 'रिकवरी चरण'
                  : 'Recovery Zone'}
            </span>
          )}
        </div>

        <div className="space-y-1 tabular-nums">
          <div className="flex justify-between items-center text-stone-300">
            <span>{isHindi ? 'संचित रिटर्न:' : 'Cumulative Return:'}</span>
            <span className="font-extrabold text-white text-sm">
              ₹{totalValue.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between items-center text-stone-400">
            <span>{isHindi ? 'मूल निवेश राशि:' : 'Invested Principal:'}</span>
            <span className="font-medium text-stone-300">
              ₹{principal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between items-center text-stone-400">
            <span>{isHindi ? 'शुद्ध लाभ:' : 'Net Profit:'}</span>
            <span className="font-bold text-emerald-400">
              +{netProfit > 0 ? `₹${netProfit.toLocaleString('en-IN')}` : '₹0'}
            </span>
          </div>

          <div className="flex justify-between items-center text-stone-400 pt-1 border-t border-stone-800/80">
            <span>{isHindi ? 'दैनिक संचय दर:' : 'Daily Yield Rate:'}</span>
            <span className="text-amber-300 font-semibold">
              ₹{dailyIncome.toLocaleString('en-IN')}/day
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const InvestmentGrowthChart: React.FC = () => {
  const { activePlans, language } = useApp();
  const isHindi = language === 'hi';

  const [selectedScenario, setSelectedScenario] = useState<string>(
    activePlans.length > 0 ? 'portfolio' : '01'
  );
  const [maxDaysRange, setMaxDaysRange] = useState<number>(30);

  // Automatically switch to portfolio view when user activates their first plan
  useEffect(() => {
    if (activePlans.length > 0) {
      setSelectedScenario('portfolio');
    }
  }, [activePlans.length]);

  const portfolioPrincipal = useMemo(
    () => activePlans.reduce((sum, p) => sum + p.investment, 0),
    [activePlans]
  );

  const portfolioDaily = useMemo(
    () => activePlans.reduce((sum, p) => sum + (p.status === 'active' ? p.dailyIncome : 0), 0),
    [activePlans]
  );

  const portfolioEarnedSoFar = useMemo(
    () => activePlans.reduce((sum, p) => sum + p.totalEarnedSoFar, 0),
    [activePlans]
  );

  const currentScenarioData = useMemo(() => {
    if (selectedScenario === 'portfolio' && activePlans.length > 0) {
      return {
        isLivePortfolio: true,
        name: isHindi ? 'मेरा सक्रिय पोर्टफोलियो' : 'My Active Portfolio',
        principal: portfolioPrincipal,
        daily: portfolioDaily,
        earnedSoFar: portfolioEarnedSoFar,
      };
    }

    const foundPlan = PLANS_DATA.find((p) => p.id === selectedScenario) || PLANS_DATA[1];
    return {
      isLivePortfolio: false,
      name: foundPlan.name,
      principal: foundPlan.investment,
      daily: foundPlan.daily,
      earnedSoFar: 0,
    };
  }, [selectedScenario, activePlans.length, portfolioPrincipal, portfolioDaily, portfolioEarnedSoFar, isHindi]);

  const breakEvenDay = useMemo(() => {
    if (currentScenarioData.daily <= 0) return 0;
    const remainingPrincipal = Math.max(0, currentScenarioData.principal - currentScenarioData.earnedSoFar);
    return Math.ceil(remainingPrincipal / currentScenarioData.daily);
  }, [currentScenarioData]);

  // Generate daily cumulative return points for the selected timeframe (default 30 days)
  const chartData = useMemo(() => {
    const points: Array<{
      day: number;
      dayLabel: string;
      cumulativeValue: number;
      principal: number;
      dailyEarned: number;
    }> = [];

    const step = maxDaysRange <= 30 ? 2 : maxDaysRange <= 60 ? 5 : 10;

    for (let day = 0; day <= maxDaysRange; day += step) {
      let cumulative = 0;
      if (currentScenarioData.isLivePortfolio) {
        cumulative = activePlans.reduce((sum, plan) => {
          const remainingDays = Math.max(0, plan.cycleDays - plan.daysElapsed);
          const projectedDays = Math.min(day, remainingDays);
          return sum + plan.totalEarnedSoFar + plan.dailyIncome * projectedDays;
        }, 0);
      } else {
        cumulative = currentScenarioData.daily * day;
      }

      points.push({
        day,
        dayLabel: day === 0 ? (isHindi ? 'आज' : 'Today') : `D+${day}`,
        cumulativeValue: cumulative,
        principal: currentScenarioData.principal,
        dailyEarned: currentScenarioData.daily,
      });
    }

    if (points[points.length - 1]?.day !== maxDaysRange) {
      const day = maxDaysRange;
      const cumulative = currentScenarioData.isLivePortfolio
        ? activePlans.reduce((sum, plan) => {
            const remainingDays = Math.max(0, plan.cycleDays - plan.daysElapsed);
            const projectedDays = Math.min(day, remainingDays);
            return sum + plan.totalEarnedSoFar + plan.dailyIncome * projectedDays;
          }, 0)
        : currentScenarioData.daily * day;

      points.push({
        day,
        dayLabel: `D+${day}`,
        cumulativeValue: cumulative,
        principal: currentScenarioData.principal,
        dailyEarned: currentScenarioData.daily,
      });
    }

    return points;
  }, [currentScenarioData, activePlans, maxDaysRange, isHindi]);

  const projectedEndValue = chartData[chartData.length - 1]?.cumulativeValue ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>{isHindi ? 'निवेश विकास सिमुलेशन' : 'Projected Cumulative Returns'}</span>
            <span aria-hidden="true">·</span>
            <span>
              {currentScenarioData.isLivePortfolio
                ? isHindi
                  ? `${activePlans.length} सक्रिय योजनाएं`
                  : `${activePlans.length} Active Plans`
                : isHindi
                  ? 'योजना पूर्वावलोकन'
                  : 'Plan Preview'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {isHindi
              ? `अगले ${maxDaysRange} दिनों में अनुमानित संचित रिटर्न`
              : `Projected Cumulative Returns (${maxDaysRange}-Day Outlook)`}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {currentScenarioData.isLivePortfolio
              ? isHindi
                ? 'आपकी सक्रिय निवेश योजनाओं की दैनिक आय के आधार पर संचित रिटर्न ग्राफ।'
                : 'Cumulative daily payouts projected from your currently active investment plans.'
              : isHindi
                ? 'अभी कोई सक्रिय योजना नहीं है — नीचे किसी भी प्लान का 30-दिवसीय रिटर्न देखें या कोई प्लान खरीदें।'
                : 'No active plans yet — previewing projected cumulative returns below. Activate a plan to track live yields.'}
          </p>
        </div>

        {/* Plan / Portfolio Scenario Selector & Timeframe Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            aria-label={isHindi ? 'योजना चुनें' : 'Select investment scenario'}
            className="px-3 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-colors cursor-pointer"
          >
            {activePlans.length > 0 && (
              <option value="portfolio">
                {isHindi
                  ? `मेरा सक्रिय पोर्टफोलियो (${activePlans.length} योजनाएं)`
                  : `My Active Portfolio (${activePlans.length} Plans)`}
              </option>
            )}
            <optgroup label={isHindi ? 'योजना पूर्वावलोकन' : 'Preview Plans'}>
              {PLANS_DATA.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} (₹{plan.investment.toLocaleString('en-IN')})
                </option>
              ))}
            </optgroup>
          </select>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {[
              { days: 30, label: '30D' },
              { days: 60, label: '60D' },
              { days: 90, label: '90D' },
              { days: 150, label: '150D' },
            ].map(({ days, label }) => {
              const isActive = maxDaysRange === days;
              return (
                <button
                  key={days}
                  type="button"
                  onClick={() => setMaxDaysRange(days)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            {isHindi ? 'मूल निवेश' : 'Principal Base'}
          </span>
          <span className="text-lg font-extrabold text-stone-900 tabular-nums">
            ₹{currentScenarioData.principal.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            {isHindi ? 'दैनिक आय दर' : 'Daily Yield Rate'}
          </span>
          <span className="text-lg font-extrabold text-emerald-700 tabular-nums">
            +₹{currentScenarioData.daily.toLocaleString('en-IN')}/d
          </span>
        </div>

        <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
            {isHindi ? `${maxDaysRange}-दिन संचित रिटर्न` : `${maxDaysRange}-Day Projected`}
          </span>
          <span className="text-lg font-black text-emerald-900 tabular-nums">
            ₹{projectedEndValue.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-100">
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
            {isHindi ? 'ब्रेक-ईवन दिन' : 'Break-Even Point'}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-sm font-extrabold text-amber-900 tabular-nums">
              {breakEvenDay === 0
                ? isHindi
                  ? 'पूर्ण रिकवर'
                  : 'Recovered'
                : isHindi
                  ? `दिन ${breakEvenDay} पर 100%`
                  : `Day ${breakEvenDay}`}
            </span>
          </div>
        </div>
      </div>

      {/* Recharts ResponsiveContainer + LineChart */}
      <div className="w-full h-[320px] sm:h-[360px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 16, left: -6, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: '#e7e5e4' }}
              tick={{ fontSize: 11, fill: '#78716c' }}
              tickFormatter={(v) => (v === 0 ? (isHindi ? 'आज' : 'Now') : `D+${v}`)}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#78716c' }}
              tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `₹${v}`)}
              domain={[0, 'auto']}
            />

            <Tooltip
              content={
                <CustomTooltip
                  breakEvenDay={breakEvenDay}
                  isHindi={isHindi}
                />
              }
            />

            {breakEvenDay > 0 && breakEvenDay <= maxDaysRange && (
              <ReferenceLine
                x={breakEvenDay}
                stroke="#d97706"
                strokeDasharray="4 4"
                label={{
                  value: isHindi ? `ब्रेक-ईवन (D+${breakEvenDay})` : `Break-Even (D+${breakEvenDay})`,
                  position: 'top',
                  fill: '#b45309',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="principal"
              name={isHindi ? 'मूल निवेश' : 'Principal Base'}
              stroke="#a8a29e"
              strokeWidth={1.75}
              strokeDasharray="5 5"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="cumulativeValue"
              name={isHindi ? 'संचित रिटर्न' : 'Cumulative Returns'}
              stroke="#047857"
              strokeWidth={3}
              dot={{ r: 3, fill: '#047857', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 5, fill: '#059669', strokeWidth: 2, stroke: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Footer Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs text-stone-500">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-emerald-700 rounded-full" />
            <span className="font-medium text-stone-700">
              {isHindi ? 'अनुमानित संचित रिटर्न' : 'Projected Cumulative Returns'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-stone-400" />
            <span className="font-medium text-stone-600">
              {isHindi ? 'मूल निवेश आधार' : 'Principal Base'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-emerald-800 font-semibold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {isHindi
              ? `दैनिक संचय: ₹${currentScenarioData.daily.toLocaleString('en-IN')} / दिन`
              : `Accruing ₹${currentScenarioData.daily.toLocaleString('en-IN')} / day`}
          </span>
        </div>
      </div>
    </div>
  );
};
