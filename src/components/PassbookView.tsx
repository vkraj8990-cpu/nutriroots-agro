import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Receipt, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Sparkles, 
  ShoppingBag, 
  Users, 
  Download,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const PassbookView: React.FC = () => {
  const { transactions, language, t, showToast } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');

  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'all') return true;
    if (filterType === 'credit') {
      return tx.type === 'recharge' || tx.type === 'daily_yield' || tx.type === 'referral_bonus';
    }
    if (filterType === 'debit') {
      return tx.type === 'plan_buy' || tx.type === 'withdraw';
    }
    return true;
  });

  const getTxIcon = (type: string) => {
    switch (type) {
      case 'recharge':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-700" />;
      case 'withdraw':
        return <ArrowUpRight className="w-4 h-4 text-rose-700" />;
      case 'plan_buy':
        return <ShoppingBag className="w-4 h-4 text-blue-700" />;
      case 'daily_yield':
        return <Sparkles className="w-4 h-4 text-amber-700" />;
      case 'referral_bonus':
        return <Users className="w-4 h-4 text-purple-700" />;
      default:
        return <Receipt className="w-4 h-4 text-stone-700" />;
    }
  };

  const isCredit = (type: string) => {
    return type === 'recharge' || type === 'daily_yield' || type === 'referral_bonus';
  };

  const getStatusMeta = (status: string) => {
    switch (status) {
      case 'pending_verification':
        return {
          label: 'Pending Verification',
          colorClass: 'text-amber-700',
          icon: <Clock className="w-3.5 h-3.5 shrink-0" />,
        };
      case 'processing':
        return {
          label: language === 'hi' ? 'प्रक्रियाधीन (Processing)' : 'Processing',
          colorClass: 'text-amber-700',
          icon: <Clock className="w-3.5 h-3.5 shrink-0" />,
        };
      case 'rejected':
        return {
          label: language === 'hi' ? 'अस्वीकृत (Rejected)' : 'Rejected',
          colorClass: 'text-rose-700',
          icon: <XCircle className="w-3.5 h-3.5 shrink-0" />,
        };
      default:
        return {
          label: language === 'hi' ? 'सफल (Completed)' : 'Completed',
          colorClass: 'text-emerald-700',
          icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4" />
            <span>{language === 'hi' ? 'लेखा-जोखा एवं खाता बही' : 'Financial Ledger & Passbook'}</span>
            <span aria-hidden="true">·</span>
            <span>{transactions.length} {language === 'hi' ? 'प्रविष्टियां' : 'Records'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {t.recentTransactions}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {language === 'hi' 
              ? 'आपके वॉलेट के सभी रिचार्ज, योजना सक्रियण, दैनिक कृषि लाभ और निकासी का पूरा ब्यौरा।'
              : 'Complete transparent statement of recharges, plan purchases, daily yields, and withdrawals.'}
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.typeAll}
            </button>
            <button
              onClick={() => setFilterType('credit')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'credit' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.typeCredit}
            </button>
            <button
              onClick={() => setFilterType('debit')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'debit' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.typeDebit}
            </button>
          </div>

          <button
            onClick={() => showToast(language === 'hi' ? 'पासबुक स्टेटमेंट डाउनलोड हो गया (PDF)' : 'Statement downloaded (PDF)', 'success')}
            className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            title="Download Statement"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-sm">
            {t.emptyTransactions}
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredTransactions.map((tx) => {
              const credit = isCredit(tx.type);
              const statusMeta = getStatusMeta(tx.status);
              return (
                <div
                  key={tx.id}
                  className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.status === 'pending_verification'
                        ? 'bg-amber-50'
                        : credit
                          ? 'bg-emerald-50'
                          : 'bg-stone-100'
                    }`}>
                      {getTxIcon(tx.type)}
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                        {tx.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5 flex-wrap">
                        <span>{tx.date}</span>
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

                  <div className="text-right shrink-0">
                    <span className={`text-sm sm:text-base font-extrabold tabular-nums ${
                      credit ? 'text-emerald-800' : 'text-stone-800'
                    }`}>
                      {credit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                    <span className={`flex items-center justify-end gap-1 text-[11px] font-semibold mt-0.5 ${statusMeta.colorClass}`}>
                      {statusMeta.icon}
                      <span>{statusMeta.label}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
