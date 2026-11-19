import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DIRECT_UPI_ID, buildUpiPaymentLink } from '../utils/upi';
import {
  X,
  CheckCircle,
  Wallet,
  Sprout,
  Copy,
  Check,
  ExternalLink,
  Hash,
  Smartphone,
} from 'lucide-react';

export const BuyConfirmModal: React.FC = () => {
  const {
    selectedPlanForBuy,
    setSelectedPlanForBuy,
    user,
    buyPlan,
    buyPlanWithUpi,
    setShowRechargeModal,
    showToast,
    language,
    t,
  } = useApp();

  const isHindi = language === 'hi';
  const hasEnoughBalance = selectedPlanForBuy ? user.walletBalance >= selectedPlanForBuy.investment : false;

  const [paymentMode, setPaymentMode] = useState<'wallet' | 'upi'>(hasEnoughBalance ? 'wallet' : 'upi');
  const [utrId, setUtrId] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [upiOpened, setUpiOpened] = useState<boolean>(false);

  useEffect(() => {
    if (selectedPlanForBuy) {
      setPaymentMode(user.walletBalance >= selectedPlanForBuy.investment ? 'wallet' : 'upi');
      setUtrId('');
      setUpiOpened(false);
    }
  }, [selectedPlanForBuy, user.walletBalance]);

  if (!selectedPlanForBuy) return null;

  const plan = selectedPlanForBuy;
  const upiLink = buildUpiPaymentLink(plan.investment);
  const isUtrValid = utrId.trim().length >= 6;

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(DIRECT_UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
      showToast(
        isHindi ? `UPI ID (${DIRECT_UPI_ID}) कॉपी हो गया!` : `UPI ID (${DIRECT_UPI_ID}) copied!`,
        'success'
      );
    } catch {
      showToast(isHindi ? 'कृपया UPI ID मैन्युअल रूप से कॉपी करें' : 'Please copy UPI ID manually', 'info');
    }
  };

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = buyPlanWithUpi(plan, utrId);
    if (ok) {
      setUtrId('');
      setUpiOpened(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setSelectedPlanForBuy(null)}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>{isHindi ? 'निवेश योजना भुगतान' : 'Investment Plan Payment'}</span>
        </div>
        <h3 className="text-xl font-extrabold text-stone-900 mb-1">
          {plan.name}
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          {plan.cropType}
        </p>

        {/* Plan Breakdown */}
        <div className="space-y-2 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs mb-4">
          <div className="flex justify-between items-center">
            <span className="text-stone-500">{t.investment}:</span>
            <span className="font-extrabold text-stone-900 text-sm tabular-nums">
              ₹{plan.investment.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">{t.dailyReturn}:</span>
            <span className="font-bold text-emerald-700 tabular-nums">
              ₹{plan.daily.toLocaleString('en-IN')} / {isHindi ? 'दिन' : 'day'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1.5 border-t border-stone-200">
            <span className="font-semibold text-stone-700">{t.totalReturn} ({plan.cycle} {t.days}):</span>
            <span className="font-extrabold text-emerald-800 text-sm tabular-nums">
              ₹{plan.total.toLocaleString('en-IN')} ({plan.roiMultiplier})
            </span>
          </div>
        </div>

        {/* Payment Method Toggle: Direct UPI vs Wallet Balance */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setPaymentMode('upi')}
            className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              paymentMode === 'upi'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isHindi ? 'डायरेक्ट UPI' : 'Direct UPI'}</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode('wallet')}
            className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              paymentMode === 'wallet'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>
              {isHindi ? 'वॉलेट' : 'Wallet'} (₹{user.walletBalance.toLocaleString('en-IN')})
            </span>
          </button>
        </div>

        {/* Mode 1: Direct UPI Payment (999669968@ybl) */}
        {paymentMode === 'upi' ? (
          <form onSubmit={handleUpiSubmit} className="space-y-4">
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 block">
                    {isHindi ? 'आधिकारिक NutriRoots UPI ID' : 'Direct NutriRoots UPI ID'}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-stone-900 font-mono select-all">
                    {DIRECT_UPI_ID}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUpiId}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'कॉपी UPI ID' : 'Copy UPI ID')}</span>
                </button>
              </div>

              <a
                href={upiLink}
                onClick={() => setUpiOpened(true)}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>
                  {isHindi
                    ? `₹${plan.investment.toLocaleString('en-IN')} का UPI भुगतान खोलें`
                    : `Pay ₹${plan.investment.toLocaleString('en-IN')} via UPI App`}
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {upiOpened && (
                <p className="text-[11px] text-emerald-900 font-medium leading-relaxed">
                  {isHindi
                    ? 'भुगतान पूरा करने के बाद नीचे अपना 12-अंकीय UTR / Transaction ID दर्ज करें।'
                    : 'After completing your UPI payment, enter your UTR / Transaction ID below.'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isHindi ? 'भुगतान के बाद UTR / Transaction ID दर्ज करें *' : 'Enter UTR / Transaction ID after payment *'}
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={utrId}
                  onChange={(e) => setUtrId(e.target.value)}
                  placeholder={isHindi ? 'जैसे: 431982749102 (UTR नंबर)' : 'e.g. 431982749102 (UTR number)'}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                disabled={!isUtrValid}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 disabled:text-stone-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {isHindi
                    ? 'UTR सबमिट करें (Pending Verification)'
                    : 'Submit UTR for Verification'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlanForBuy(null)}
                className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
            </div>
          </form>
        ) : (
          /* Mode 2: Wallet Balance */
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border text-xs bg-white border-stone-200">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-700" />
                <span className="text-stone-600">{isHindi ? 'आपका वॉलेट बैलेंस:' : 'Your Wallet Balance:'}</span>
              </div>
              <span className="font-extrabold text-stone-900 tabular-nums text-sm">
                ₹{user.walletBalance.toLocaleString('en-IN')}
              </span>
            </div>

            {hasEnoughBalance ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => buyPlan(plan)}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isHindi ? 'वॉलेट से भुगतान करें और सक्रिय करें' : 'Pay from Wallet & Activate'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlanForBuy(null)}
                  className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  {isHindi
                    ? `वॉलेट में ₹${(plan.investment - user.walletBalance).toLocaleString('en-IN')} कम हैं। आप ऊपर "डायरेक्ट UPI" चुनकर सीधे भुगतान कर सकते हैं या वॉलेट रिचार्ज कर सकते हैं।`
                    : `Wallet is short by ₹${(plan.investment - user.walletBalance).toLocaleString('en-IN')}. Switch to Direct UPI above or add funds to your wallet.`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlanForBuy(null);
                    setShowRechargeModal(true);
                  }}
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{isHindi ? 'वॉलेट रिचार्ज करें' : 'Recharge Wallet via UPI'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
