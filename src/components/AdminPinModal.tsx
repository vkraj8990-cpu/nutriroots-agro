import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const AdminPinModal: React.FC = () => {
  const { showAdminPinModal, setShowAdminPinModal, unlockAdmin, language } = useApp();
  const isHindi = language === 'hi';

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    if (showAdminPinModal) {
      setPin('');
      setShowPin(false);
    }
  }, [showAdminPinModal]);

  if (!showAdminPinModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    unlockAdmin(pin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={() => setShowAdminPinModal(false)}
          aria-label={isHindi ? 'बंद करें' : 'Close'}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex p-3 rounded-2xl bg-stone-100 text-stone-800 mb-2">
            <ShieldCheck className="w-7 h-7 text-emerald-700" />
          </div>
          <h3 className="text-lg font-extrabold text-stone-900">
            {isHindi ? 'एडमिन पैनल एक्सेस' : 'Admin Panel Access'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {isHindi
              ? 'केवल अधिकृत एडमिन के लिए। जारी रखने हेतु Admin PIN / पासवर्ड दर्ज करें।'
              : 'Authorized administrators only. Enter your Admin PIN or password to unlock.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              {isHindi ? 'Admin PIN / पासवर्ड' : 'Admin PIN / Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPin ? 'text' : 'password'}
                required
                autoFocus
                autoComplete="off"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder={isHindi ? 'Admin PIN दर्ज करें' : 'Enter Admin PIN'}
                className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-mono tracking-widest focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPin(prev => !prev)}
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAdminPinModal(false)}
              className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors"
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
            >
              {isHindi ? 'अनलॉक करें' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
