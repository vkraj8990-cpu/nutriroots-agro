import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sprout,
  Lock,
  Phone,
  User as UserIcon,
  Tag,
  CheckCircle2,
  ShieldAlert,
  KeyRound,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    user,
    showAuthModal,
    setShowAuthModal,
    authMode,
    urlReferralCode,
    login,
    register,
    showToast,
    language,
    t,
  } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(authMode);
  const isHindi = language === 'hi';

  // Login form state (starts blank, no demo values)
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regRef, setRegRef] = useState(urlReferralCode || '');

  // OTP verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [testOtpCode, setTestOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    if (showAuthModal) {
      setMode(authMode);
      setLoginPhone('');
      setLoginPass('');
      setRegName('');
      setRegPhone('');
      setRegPass('');
      setRegRef(urlReferralCode || '');
      setOtpSent(false);
      setOtpVerified(false);
      setOtpInput('');
      setTestOtpCode('');
      setOtpError('');
    }
  }, [showAuthModal, authMode, urlReferralCode]);

  if (!showAuthModal) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(loginPhone, loginPass);
    if (ok) {
      setLoginPhone('');
      setLoginPass('');
    }
  };

  const handleRegPhoneChange = (val: string) => {
    const digitsOnly = val.replace(/[^0-9]/g, '').slice(0, 10);
    setRegPhone(digitsOnly);
    if (otpSent || otpVerified) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtpInput('');
      setTestOtpCode('');
      setOtpError('');
    }
  };

  const handleSendOtp = () => {
    if (regPhone.trim().length < 10) {
      showToast(
        isHindi ? 'OTP भेजने के लिए कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number to send OTP.',
        'error'
      );
      return;
    }
    const generated = String(Math.floor(100000 + Math.random() * 900000));
    setTestOtpCode(generated);
    setOtpSent(true);
    setOtpVerified(false);
    setOtpInput('');
    setOtpError('');
    showToast(
      isHindi
        ? `Test Mode OTP तैयार है (${generated})। लाइव SMS के लिए SMS Gateway API कॉन्फ़िगर करें।`
        : `Test Mode OTP generated (${generated}). Configure an SMS Gateway API for live SMS delivery.`,
      'info'
    );
  };

  const handleVerifyOtp = () => {
    const cleanOtp = otpInput.trim();
    if (cleanOtp.length !== 6) {
      setOtpError(isHindi ? 'कृपया 6 अंकों का OTP दर्ज करें।' : 'Please enter the 6-digit OTP.');
      return;
    }
    if (cleanOtp === testOtpCode) {
      setOtpVerified(true);
      setOtpError('');
      showToast(
        isHindi ? 'मोबाइल नंबर OTP सफलतापूर्वक सत्यापित हो गया!' : 'Mobile OTP verified successfully!',
        'success'
      );
    } else {
      setOtpVerified(false);
      setOtpError(
        isHindi ? 'गलत OTP दर्ज किया गया है। कृपया Test Mode OTP जांचें।' : 'Invalid OTP. Please check the Test Mode OTP and try again.'
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified) {
      showToast(
        isHindi ? 'पंजीकरण से पहले कृपया मोबाइल OTP सत्यापित करें।' : 'Please verify your mobile OTP before registering.',
        'error'
      );
      return;
    }
    const ok = register(regName, regPhone, regPass, regRef, otpVerified);
    if (ok) {
      setRegName('');
      setRegPhone('');
      setRegPass('');
      setRegRef('');
      setOtpSent(false);
      setOtpVerified(false);
      setOtpInput('');
      setTestOtpCode('');
      setOtpError('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Hide close (X) button until user logs in or registers */}
        {user.isLoggedIn && (
          <button
            type="button"
            onClick={() => setShowAuthModal(false)}
            aria-label={isHindi ? 'बंद करें' : 'Close'}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Lockup */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-800 mb-2">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-stone-900">
            🌱 NutriRoots Agro
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {mode === 'login' ? t.loginTitle : t.registerTitle}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-lg transition-colors ${
              mode === 'login' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.loginBtn}
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 rounded-lg transition-colors ${
              mode === 'register' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.registerBtn}
          </button>
        </div>

        {/* Mode: Login */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                {t.mobileNumber}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder={isHindi ? 'अपना 10 अंकों का मोबाइल नंबर' : 'Enter 10-digit mobile number'}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder={isHindi ? 'पासवर्ड दर्ज करें' : 'Enter your password'}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm"
            >
              {t.loginBtn}
            </button>

            <p className="text-center text-xs text-stone-500 pt-2">
              {t.noAccount}{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-emerald-700 hover:underline"
              >
                {t.registerBtn}
              </button>
            </p>
          </form>
        ) : (
          /* Mode: Register */
          <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                {t.fullName}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={isHindi ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Mobile Number + Send OTP */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                {t.mobileNumber}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    autoComplete="off"
                    value={regPhone}
                    onChange={(e) => handleRegPhoneChange(e.target.value)}
                    placeholder={isHindi ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={regPhone.length < 10 || otpVerified}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                    otpVerified
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                      : 'bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 text-white'
                  }`}
                >
                  {otpVerified
                    ? isHindi
                      ? 'Verified ✓'
                      : 'Verified ✓'
                    : otpSent
                      ? isHindi
                        ? 'Resend OTP'
                        : 'Resend OTP'
                      : 'Send OTP'}
                </button>
              </div>
            </div>

            {/* OTP Verification Box */}
            {otpSent && !otpVerified && (
              <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl space-y-2.5">
                <div className="flex items-start gap-2 text-[11px] text-amber-900 leading-relaxed">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      {isHindi
                        ? 'SMS गेटवे API अभी कनेक्ट नहीं है — वास्तविक SMS भेजने के लिए SMS सेवा (MSG91 / Twilio / Fast2SMS) कॉन्फ़िगर करनी होगी।'
                        : 'SMS Gateway API is not connected — configure an SMS service (MSG91 / Twilio / Fast2SMS) to send live SMS OTPs.'}
                    </p>
                    <p className="mt-1 font-mono font-bold text-stone-900">
                      Test Mode OTP: <span className="bg-white px-1.5 py-0.5 rounded border border-amber-300 select-all">{testOtpCode}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="off"
                      value={otpInput}
                      onChange={(e) => {
                        setOtpInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                        if (otpError) setOtpError('');
                      }}
                      placeholder={isHindi ? '6 अंकों का OTP दर्ज करें' : 'Enter 6-digit OTP'}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-amber-300 rounded-lg text-xs text-stone-900 font-mono tracking-widest focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpInput.length !== 6}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 disabled:text-stone-500 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    {isHindi ? 'Verify OTP' : 'Verify OTP'}
                  </button>
                </div>

                {otpError && (
                  <p className="text-[11px] text-rose-700 font-medium">{otpError}</p>
                )}
              </div>
            )}

            {otpVerified && (
              <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {isHindi
                    ? `मोबाइल नंबर (${regPhone}) OTP द्वारा सत्यापित हो गया है।`
                    : `Mobile number (${regPhone}) verified via OTP.`}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder={isHindi ? 'नया पासवर्ड बनाएं' : 'Create a password'}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                {t.referralCodeOptional}
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoComplete="off"
                  value={regRef}
                  onChange={(e) => setRegRef(e.target.value.toUpperCase())}
                  placeholder={isHindi ? 'रेफरल कोड (यदि कोई हो)' : 'Referral code (optional)'}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 uppercase font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
              {urlReferralCode && regRef === urlReferralCode && (
                <p className="text-[11px] text-emerald-700 font-medium mt-1">
                  {isHindi
                    ? `लिंक (?ref=${urlReferralCode}) से रेफरल कोड स्वतः लागू किया गया है।`
                    : `Referral code auto-applied from link (?ref=${urlReferralCode}).`}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!otpVerified}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 disabled:text-stone-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm mt-2"
            >
              {t.registerBtn}
            </button>
            {!otpVerified && (
              <p className="text-[11px] text-center text-stone-500">
                {isHindi
                  ? 'अकाउंट रजिस्टर करने के लिए पहले मोबाइल OTP सत्यापित करें।'
                  : 'Verify mobile OTP above before registering.'}
              </p>
            )}

            <p className="text-center text-xs text-stone-500 pt-2">
              {t.haveAccount}{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-emerald-700 hover:underline"
              >
                {t.loginBtn}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
