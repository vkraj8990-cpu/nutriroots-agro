import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DIRECT_UPI_ID, buildUpiPaymentLink } from '../utils/upi';
import {
  X,
  Wallet,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  Hash,
} from 'lucide-react';

export const RechargeModal: React.FC = () => {
  const { showRechargeModal, setShowRechargeModal, rechargeWallet, showToast, language, t } = useApp();
  const isHindi = language === 'hi';

  const [amount, setAmount] = useState<number>(1500);
  const [customInput, setCustomInput] = useState<string>('1500');
  const [utrId, setUtrId] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [upiOpened, setUpiOpened] = useState<boolean>(false);

  if (!showRechargeModal) return null;

  const presetAmounts = [500, 1500, 3500, 5000, 10000, 25000, 50000];
  const upiLink = buildUpiPaymentLink(amount);

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomInput(val.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomInput(val);
    const num = parseInt(val, 10);
    setAmount(!isNaN(num) ? num : 0);
  };

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

  const handleOpenUpiLink = () => {
    if (amount <= 0) {
      showToast(isHindi ? 'कृपया पहले सही राशि दर्ज करें' : 'Please enter a valid amount first', 'error');
      return;
    }
    setUpiOpened(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    const ok = rechargeWallet(amount, utrId);
    if (ok) {
      setUtrId('');
      setUpiOpened(false);
    }
  };

  const isUtrValid = utrId.trim().length >= 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => setShowRechargeModal(false)}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          <Wallet className="w-4 h-4 text-emerald-700" />
          <span>{t.recharge}</span>
        </div>
        <h3 className="text-xl font-extrabold text-stone-900 mb-1">
          {isHindi ? 'डायरेक्ट UPI द्वारा वॉलेट रिचार्ज' : 'Direct UPI Wallet Recharge'}
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          {isHindi
            ? 'राशि चुनें, UPI से भुगतान करें और भुगतान के बाद UTR / Transaction ID दर्ज करें।'
            : 'Enter amount, pay directly via UPI, and submit your UTR / Transaction ID.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Presets */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">
              {isHindi ? 'त्वरित राशि चुनें (Quick Select):' : 'Select Amount:'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {presetAmounts.map((preset) => {
                const isSelected = amount === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all tabular-nums ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-700 text-emerald-900 ring-1 ring-emerald-700'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    ₹{preset >= 1000 ? `${preset / 1000}K` : preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              {t.enterAmount}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={customInput}
                onChange={handleCustomChange}
                placeholder="1500"
                className="w-full pl-8 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-extrabold text-lg tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Direct UPI Payment Box */}
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 block">
                  {isHindi ? 'आधिकारिक NutriRoots UPI ID' : 'Official NutriRoots UPI ID'}
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

            {amount > 0 ? (
              <a
                href={upiLink}
                onClick={handleOpenUpiLink}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>
                  {isHindi
                    ? `₹${amount.toLocaleString('en-IN')} का UPI भुगतान खोलें`
                    : `Pay ₹${amount.toLocaleString('en-IN')} via UPI App`}
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div className="w-full py-2.5 px-4 bg-stone-200 text-stone-500 font-bold text-xs rounded-xl text-center">
                {isHindi ? 'UPI लिंक के लिए राशि दर्ज करें' : 'Enter amount to enable UPI link'}
              </div>
            )}

            {upiOpened && (
              <p className="text-[11px] text-emerald-900 font-medium leading-relaxed">
                {isHindi
                  ? 'यदि UPI ऐप अपने आप नहीं खुला, तो ऊपर दिए गए UPI ID को कॉपी करके PhonePe / GPay / Paytm से भुगतान करें और नीचे UTR नंबर डालें।'
                  : 'If your UPI app did not open automatically, copy the UPI ID above, pay via any UPI app, and enter your UTR below.'}
              </p>
            )}
          </div>

          {/* UTR / Transaction ID Input */}
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
                placeholder={isHindi ? 'जैसे: 431982749102 (12-अंकीय UTR)' : 'e.g. 431982749102 (12-digit UTR)'}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {isHindi
                ? 'कम से कम 6 अक्षरों/अंकों का वैध UTR या UPI Ref ID दर्ज करें।'
                : 'Enter at least 6 characters from your UPI payment reference / UTR.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={amount <= 0 || !isUtrValid}
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] disabled:bg-stone-300 disabled:text-stone-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isHindi
                ? `₹${amount.toLocaleString('en-IN')} का UTR सबमिट करें`
                : `Submit UTR for ₹${amount.toLocaleString('en-IN')} Verification`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
