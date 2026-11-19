import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
} from 'lucide-react';

export const RecentTransactions: React.FC = () => {
  const { transactions, language, t, setCurrentTab, setShowRechargeModal } = useApp();
  const isHindi = language === 'hi';

  // Fetch the last 5 account activities: deposits, plan purchases, or withdrawals
  const recentActivities = useMemo(
    () =>
      transactions
        .filter(
          (tx) =>
            tx.type === 'recharge' ||
            tx.type === 'plan_buy' ||
            tx.type === 'withdraw'
        )
        .slice(0, 5),
    [transactions]
  );

  const getActivityMeta = (type: 'recharge' | 'plan_buy' | 'withdraw') => {
    switch (type) {
      case 'recharge':
        return {
          label: isHindi ? 'वॉलेट डिपॉजिट' : 'Deposit',
          isCredit: true,
          iconBg: 'bg-emerald-50 text-emerald-700',
          icon: <ArrowDownLeft className="w-4 h-4" />,
        };
      case 'plan_buy':
        return {
          label: isHindi ? 'योजना खरीद' : 'Plan Purchase',
          isCredit: false,
          iconBg: 'bg-stone-100 text-stone-700',
          icon: <ShoppingBag className="w-4 h-4" />,
        };
      case 'withdraw':
        return {
          label: isHindi ? 'बैंक / UPI निकासी' : 'Withdrawal',
          isCredit: false,
          iconBg: 'bg-amber-50 text-amber-700',
          icon: <ArrowUpRight className="w-4 h-4" />,
        };
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-5 sm:px-7 sm:py-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4" />
            <span>{isHindi ? 'खाता गतिविधि' : 'Account Activity'}</span>
            <span aria-hidden="true">·</span>
            <span>{isHindi ? 'अंतिम 5 लेन-देन' : 'Last 5 Activities'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-stone-900">
            {isHindi ? 'हाल के लेन-देन (Recent Transactions)' : 'Recent Transactions'}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isHindi
              ? 'आपके हाल के डिपॉजिट, योजना खरीदारी और निकासी अनुरोधों का विवरण।'
              : 'Your latest 5 deposits, plan purchases, and withdrawals with live status.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentTab('passbook')}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <span>{isHindi ? 'पूरा पासबुक देखें' : 'View All in Passbook'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentActivities.length === 0 ? (
        <div className="p-8 text-center space-y-3">
          <p className="text-sm text-stone-500">
            {isHindi
              ? 'अभी कोई डिपॉजिट, खरीद या निकासी दर्ज नहीं हुई है।'
              : 'No deposits, purchases, or withdrawals recorded yet.'}
          </p>
          <button
            type="button"
            onClick={() => setShowRechargeModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {t.recharge}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 border-b border-stone-100">
              <tr>
                <th className="px-5 sm:px-7 py-3 font-semibold uppercase tracking-wider text-[11px]">
                  {isHindi ? 'गतिविधि (Activity)' : 'Activity'}
                </th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">
                  {isHindi ? 'समय (Timestamp)' : 'Timestamp'}
                </th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px]">
                  {isHindi ? 'स्थिति (Status)' : 'Status'}
                </th>
                <th className="px-5 sm:px-7 py-3 font-semibold uppercase tracking-wider text-[11px] text-right">
                  {isHindi ? 'राशि (Amount)' : 'Amount'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentActivities.map((tx) => {
                const meta = getActivityMeta(tx.type as 'recharge' | 'plan_buy' | 'withdraw');
                const statusLabel =
                  tx.status === 'completed'
                    ? isHindi
                      ? 'सफल (Completed)'
                      : 'Completed'
                    : tx.status === 'pending_verification'
                      ? 'Pending Verification'
                      : tx.status === 'processing'
                        ? isHindi
                          ? 'प्रक्रियाधीन (Processing)'
                          : 'Processing'
                        : isHindi
                          ? 'अस्वीकृत (Rejected)'
                          : 'Rejected';

                return (
                  <tr key={tx.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 sm:px-7 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${meta.iconBg}`}
                        >
                          {meta.icon}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-xs sm:text-sm">
                            {tx.title}
                          </div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span>{meta.label}</span>
                            {tx.method && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{tx.method}</span>
                              </>
                            )}
                            {tx.refCode && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono text-stone-600">UTR/Ref: {tx.refCode}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-stone-600 tabular-nums whitespace-nowrap">
                      {tx.date}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 font-semibold ${
                          tx.status === 'completed'
                            ? 'text-emerald-700'
                            : tx.status === 'pending_verification' || tx.status === 'processing'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                        }`}
                      >
                        {tx.status === 'completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        ) : tx.status === 'pending_verification' || tx.status === 'processing' ? (
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{statusLabel}</span>
                      </span>
                    </td>

                    <td className="px-5 sm:px-7 py-3.5 text-right whitespace-nowrap">
                      <span
                        className={`text-sm font-extrabold tabular-nums ${
                          meta.isCredit ? 'text-emerald-800' : 'text-stone-900'
                        }`}
                      >
                        {meta.isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
