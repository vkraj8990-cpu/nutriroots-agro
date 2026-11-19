import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowUpRight, ShieldCheck, Building, Smartphone } from 'lucide-react';

export const WithdrawModal: React.FC = () => {
  const { showWithdrawModal, setShowWithdrawModal, withdrawFunds, showToast, user, transactions, language, t } = useApp();
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [destinationType, setDestinationType] = useState<'upi' | 'bank'>('upi');
  const [upiId, setUpiId] = useState<string>('');
  const [bankAcc, setBankAcc] = useState<string>('');
  const [ifsc, setIfsc] = useState<string>('');
  const [holderName, setHolderName] = useState<string>('');

  useEffect(() => {
    if (showWithdrawModal) {
      setWithdrawAmount('');
      setUpiId('');
      setBankAcc('');
      setIfsc('');
      setHolderName('');
    }
  }, [showWithdrawModal]);

  if (!showWithdrawModal) return null;

  const pendingWithdrawTotal = transactions
    .filter(tx => tx.type === 'withdraw' && tx.status === 'processing')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const availableWithdrawable = Math.max(0, user.walletBalance - pendingWithdrawTotal);

  const numAmount = parseInt(withdrawAmount, 10) || 0;
  const isAmountValid = numAmount >= 100 && numAmount <= availableWithdrawable;
  const isDestinationValid =
    destinationType === 'upi'
      ? upiId.trim().length >= 3 && upiId.includes('@')
      : holderName.trim().length >= 2 && bankAcc.trim().length >= 6 && ifsc.trim().length >= 8;
  const canSubmit = isAmountValid && isDestinationValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAmountValid) return;

    if (destinationType === 'upi') {
      const cleanUpi = upiId.trim();
      if (!cleanUpi || !cleanUpi.includes('@')) {
        showToast(
          language === 'hi' ? 'कृपया सही UPI ID दर्ज करें' : 'Please enter a valid UPI ID',
          'error'
        );
        return;
      }
      withdrawFunds(numAmount, 'UPI Payout', cleanUpi);
    } else {
      const cleanName = holderName.trim();
      const cleanAcc = bankAcc.trim();
      const cleanIfsc = ifsc.trim().toUpperCase();
      if (!cleanName || cleanAcc.length < 6 || cleanIfsc.length < 8) {
        showToast(
          language === 'hi' ? 'कृपया पूरा बैंक खाता विवरण और सही IFSC दर्ज करें' : 'Please enter complete bank account details and IFSC',
          'error'
        );
        return;
      }
      withdrawFunds(numAmount, 'Bank Transfer', `${cleanName} | A/C: ${cleanAcc} | IFSC: ${cleanIfsc}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => setShowWithdrawModal(false)}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          <ArrowUpRight className="w-4 h-4 text-emerald-700" />
          <span>{t.withdraw}</span>
        </div>
        <h3 className="text-xl font-extrabold text-stone-900 mb-1">
          {t.withdrawModalTitle}
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          {t.withdrawDesc}
        </p>

        {/* Available Balance Box */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-xs mb-4">
          <div className="flex justify-between items-center">
            <span className="text-stone-600 font-medium">{language === 'hi' ? 'उपलब्ध निकासी बैलेंस:' : 'Available Balance:'}</span>
            <span className="text-base font-extrabold text-emerald-800 tabular-nums">
              ₹{availableWithdrawable.toLocaleString('en-IN')}
            </span>
          </div>
          {pendingWithdrawTotal > 0 && (
            <div className="text-[11px] text-amber-700 font-medium flex justify-between">
              <span>{language === 'hi' ? 'प्रक्रियाधीन निकासी:' : 'Pending Withdrawal:'}</span>
              <span className="tabular-nums">₹{pendingWithdrawTotal.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          {/* Amount */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <label className="font-medium text-stone-600">{t.withdrawAmount}</label>
              <button
                type="button"
                onClick={() => setWithdrawAmount(availableWithdrawable > 0 ? availableWithdrawable.toString() : '')}
                className="text-emerald-700 hover:text-emerald-800 font-bold"
              >
                {language === 'hi' ? 'सभी निकालें' : 'Withdraw All'}
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold">₹</span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder={language === 'hi' ? 'राशि दर्ज करें (न्यूनतम 100)' : 'Enter amount (min 100)'}
                className="w-full pl-8 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-extrabold text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
            {withdrawAmount !== '' && numAmount < 100 && (
              <span className="text-[11px] text-rose-600 mt-1 block">
                {language === 'hi' ? '* न्यूनतम निकासी राशि ₹100 है।' : '* Minimum withdrawal amount is ₹100.'}
              </span>
            )}
            {numAmount > availableWithdrawable && (
              <span className="text-[11px] text-rose-600 mt-1 block">
                {language === 'hi' ? '* राशि आपके उपलब्ध निकासी बैलेंस से अधिक है।' : '* Amount exceeds available balance.'}
              </span>
            )}
          </div>

          {/* Destination Type Tabs */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">
              {t.withdrawTo}
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setDestinationType('upi')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  destinationType === 'upi'
                    ? 'bg-emerald-50 border-emerald-700 text-emerald-900'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI ID</span>
              </button>
              <button
                type="button"
                onClick={() => setDestinationType('bank')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  destinationType === 'bank'
                    ? 'bg-emerald-50 border-emerald-700 text-emerald-900'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Bank Account</span>
              </button>
            </div>

            {destinationType === 'upi' ? (
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">{t.upiIdLabel}</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder={language === 'hi' ? 'अपना UPI ID दर्ज करें' : 'Enter your UPI ID'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 font-mono focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] text-stone-500 mb-0.5">
                    {language === 'hi' ? 'खाता धारक का नाम' : 'Account Holder Name'}
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder={language === 'hi' ? 'खाता धारक का पूरा नाम' : 'Full name as per bank'}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-0.5">
                      {language === 'hi' ? 'खाता संख्या' : 'Account Number'}
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={bankAcc}
                      onChange={(e) => setBankAcc(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder={language === 'hi' ? 'खाता नंबर दर्ज करें' : 'Account number'}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-0.5">IFSC Code</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                      placeholder={language === 'hi' ? 'IFSC कोड' : 'Bank IFSC'}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono uppercase text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] disabled:bg-stone-300 disabled:text-stone-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
          >
            <span>{t.submitWithdraw}</span>
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>
            {language === 'hi'
              ? 'मैनुअल निकासी सत्यापन एवं सुरक्षित प्रोसेसिंग'
              : 'Manual Withdrawal Verification & Processing'}
          </span>
        </div>
      </div>
    </div>
  );
};
