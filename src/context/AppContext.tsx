import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Plan, ActivePlan, User, RegisteredUser, Transaction, ReferralMember, Language } from '../types';
import { PLANS_DATA, INITIAL_REFERRAL_MEMBERS } from '../data/plansData';
import { translations } from '../data/translations';

interface AppContextType {
  user: User;
  registeredUsers: RegisteredUser[];
  language: Language;
  t: typeof translations['hi'];
  currentTab: string;
  activePlans: ActivePlan[];
  transactions: Transaction[];
  referralMembers: ReferralMember[];
  showAuthModal: boolean;
  authMode: 'login' | 'register';
  urlReferralCode: string;
  showRechargeModal: boolean;
  showWithdrawModal: boolean;
  showAdminPinModal: boolean;
  isAdminUnlocked: boolean;
  selectedPlanForBuy: Plan | null;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  canHarvest: boolean;
  harvestTimer: string;
  
  // Actions
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setCurrentTab: (tab: string) => void;
  setShowAuthModal: (show: boolean, mode?: 'login' | 'register') => void;
  setShowRechargeModal: (show: boolean) => void;
  setShowWithdrawModal: (show: boolean) => void;
  setShowAdminPinModal: (show: boolean) => void;
  setSelectedPlanForBuy: (plan: Plan | null) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  
  login: (phone: string, pass: string, name?: string) => boolean;
  register: (name: string, phone: string, pass: string, refCode?: string, otpVerified?: boolean) => boolean;
  logout: () => void;
  buyPlan: (plan: Plan) => boolean;
  buyPlanWithUpi: (plan: Plan, utrId: string) => boolean;
  rechargeWallet: (amount: number, utrId: string) => boolean;
  withdrawFunds: (amount: number, destination: string, details: string) => boolean;
  harvestDailyYield: () => void;

  // Admin Actions
  unlockAdmin: (pin: string) => boolean;
  lockAdmin: () => void;
  updateAdminPin: (currentPin: string, newPin: string) => boolean;
  approveRechargeRequest: (txId: string) => void;
  rejectRechargeRequest: (txId: string) => void;
  markWithdrawalPaid: (txId: string) => void;
  rejectWithdrawalRequest: (txId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LEGACY_STORAGE_KEY = 'nutriroots_agro_state_v1';
const STORAGE_KEY = 'nutriroots_agro_state_v2';

// Clear legacy v1 demo state so old fake/demo balances and passbook entries never persist
try {
  ['_user', '_plans', '_tx', '_ref', '_last_harvest'].forEach((suffix) => {
    localStorage.removeItem(`${LEGACY_STORAGE_KEY}${suffix}`);
  });
} catch {
  // ignore storage cleanup errors
}

const DEFAULT_USER: User = {
  name: 'Vinod Kumar Raj',
  phone: '9876543210',
  referralCode: 'NUTRIROOTS',
  referredBy: 'AGRO_OFFICIAL',
  walletBalance: 0,
  dailyIncome: 0,
  totalEarned: 0,
  activePlanCount: 0,
  isLoggedIn: true,
  joinDate: '2026-11-01',
  kycStatus: 'verified'
};

const DEFAULT_TRANSACTIONS: Transaction[] = [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('hi');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
      if (saved) {
        const parsed = JSON.parse(saved) as User;
        if (parsed.referralCode === 'VINOD786') {
          parsed.referralCode = 'NUTRIROOTS';
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_USER;
  });

  const [activePlans, setActivePlans] = useState<ActivePlan[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_plans`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tx`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_TRANSACTIONS;
  });

  const [referralMembers, setReferralMembers] = useState<ReferralMember[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ref`);
      if (saved) {
        const parsed = JSON.parse(saved) as ReferralMember[];
        const demoIds = new Set(['ref-101', 'ref-102', 'ref-103', 'ref-104']);
        return Array.isArray(parsed) ? parsed.filter((m) => !demoIds.has(m.id)) : [];
      }
    } catch {
      // fallback
    }
    return INITIAL_REFERRAL_MEMBERS;
  });

  const [urlReferralCode, setUrlReferralCode] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = (params.get('ref') || '').trim().toUpperCase();
      if (fromUrl) {
        localStorage.setItem(`${STORAGE_KEY}_url_ref`, fromUrl);
        return fromUrl;
      }
      return (localStorage.getItem(`${STORAGE_KEY}_url_ref`) || '').trim().toUpperCase();
    } catch {
      return '';
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_admin_pin`);
      if (saved) return saved;
    } catch {
      // fallback
    }
    return (import.meta.env.VITE_ADMIN_PIN as string) || '202600';
  });

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [showAdminPinModal, setShowAdminPinModal] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === '1';
    } catch {
      return false;
    }
  });

  const [showAuthModal, setShowAuthModalState] = useState<boolean>(() => !user.isLoggedIn);
  const [authMode, setAuthMode] = useState<'login' | 'register'>(() =>
    !user.isLoggedIn && urlReferralCode ? 'register' : 'login'
  );
  const [showRechargeModal, setShowRechargeModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [selectedPlanForBuy, setSelectedPlanForBuy] = useState<Plan | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [lastHarvestTime, setLastHarvestTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_last_harvest`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [canHarvest, setCanHarvest] = useState<boolean>(true);
  const [harvestTimer, setHarvestTimer] = useState<string>('00:00:00');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_plans`, JSON.stringify(activePlans));
    } catch (e) {
      console.error(e);
    }
  }, [activePlans]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_tx`, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_ref`, JSON.stringify(referralMembers));
    } catch (e) {
      console.error(e);
    }
  }, [referralMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(registeredUsers));
    } catch (e) {
      console.error(e);
    }
  }, [registeredUsers]);

  // Keep matching registered user wallet balance synced
  useEffect(() => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.phone === user.phone ? { ...u, walletBalance: user.walletBalance } : u))
    );
  }, [user.walletBalance, user.phone]);

  // Secret keyboard shortcut Ctrl+Shift+A to open Admin PIN modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (isAdminUnlocked) {
          setCurrentTab('admin');
        } else {
          setShowAdminPinModal(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminUnlocked]);

  // Recalculate daily income and active plan count whenever activePlans change
  useEffect(() => {
    const totalDaily = activePlans.reduce((sum, p) => sum + (p.status === 'active' ? p.dailyIncome : 0), 0);
    const activeCount = activePlans.filter(p => p.status === 'active').length;
    setUser(prev => ({
      ...prev,
      dailyIncome: totalDaily,
      activePlanCount: activeCount
    }));
  }, [activePlans]);

  // Harvest timer ticker
  useEffect(() => {
    const checkHarvest = () => {
      if (user.dailyIncome <= 0) {
        setCanHarvest(false);
        setHarvestTimer('00:00:00');
        return;
      }
      const now = Date.now();
      const COOLDOWN = 1000 * 60 * 30; // 30 min simulated daily cycle for engaging demo
      const elapsed = now - lastHarvestTime;
      if (elapsed >= COOLDOWN || lastHarvestTime === 0) {
        setCanHarvest(true);
        setHarvestTimer('Ready Now');
      } else {
        setCanHarvest(false);
        const remaining = Math.max(0, COOLDOWN - elapsed);
        const mins = Math.floor(remaining / (1000 * 60));
        const secs = Math.floor((remaining % (1000 * 60)) / 1000);
        setHarvestTimer(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
      }
    };

    checkHarvest();
    const interval = setInterval(checkHarvest, 1000);
    return () => clearInterval(interval);
  }, [lastHarvestTime, user.dailyIncome]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'hi' ? 'en' : 'hi');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setShowAuthModal = (show: boolean, mode: 'login' | 'register' = 'login') => {
    if (!show && !user.isLoggedIn) {
      return;
    }
    setShowAuthModalState(show);
    setAuthMode(mode);
  };

  const login = (phone: string, pass: string, name?: string) => {
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 6) {
      showToast(language === 'hi' ? 'कृपया सही मोबाइल नंबर दर्ज करें' : 'Please enter valid mobile number', 'error');
      return false;
    }
    if (!pass || !pass.trim()) {
      showToast(language === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें' : 'Please enter your password', 'error');
      return false;
    }
    const userName = name || (user.phone === cleanPhone && user.name ? user.name : `Kisan Member (${cleanPhone.slice(-4)})`);
    setUser(prev => ({
      ...prev,
      name: userName,
      phone: cleanPhone,
      isLoggedIn: true
    }));
    setShowAuthModalState(false);
    showToast(language === 'hi' ? `नमस्ते ${userName}, आपका स्वागत है!` : `Welcome back, ${userName}!`, 'success');
    return true;
  };

  const register = (
    name: string,
    phone: string,
    pass: string,
    refCode?: string,
    otpVerified: boolean = false
  ) => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanRef = (refCode || urlReferralCode || '').trim().toUpperCase();
    if (!cleanName) {
      showToast(language === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name', 'error');
      return false;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      showToast(language === 'hi' ? 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number', 'error');
      return false;
    }
    if (!otpVerified) {
      showToast(
        language === 'hi'
          ? 'पंजीकरण से पहले मोबाइल OTP सत्यापित करना अनिवार्य है।'
          : 'Please verify your mobile OTP before registering.',
        'error'
      );
      return false;
    }
    if (!pass || !pass.trim()) {
      showToast(language === 'hi' ? 'कृपया पासवर्ड दर्ज करें' : 'Please enter a password', 'error');
      return false;
    }

    const newCode = `${cleanName.slice(0, 4).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
    const todayDate = new Date().toISOString().split('T')[0];
    const resolvedReferredBy = cleanRef || 'ORGANIC_ROOTS';

    setUser({
      name: cleanName,
      phone: cleanPhone,
      referralCode: newCode,
      referredBy: resolvedReferredBy,
      walletBalance: 0,
      dailyIncome: 0,
      totalEarned: 0,
      activePlanCount: 0,
      isLoggedIn: true,
      joinDate: todayDate,
      kycStatus: 'verified'
    });

    setRegisteredUsers(prev => {
      const exists = prev.some(u => u.phone === cleanPhone);
      if (exists) {
        return prev.map(u =>
          u.phone === cleanPhone
            ? { ...u, name: cleanName, referralCode: newCode, referredBy: resolvedReferredBy }
            : u
        );
      }
      return [
        {
          id: `usr-${Date.now()}`,
          name: cleanName,
          phone: cleanPhone,
          referralCode: newCode,
          referredBy: resolvedReferredBy,
          joinDate: todayDate,
          walletBalance: 0
        },
        ...prev
      ];
    });

    setActivePlans([]);
    setTransactions([]);
    setReferralMembers([]);
    if (urlReferralCode) {
      setUrlReferralCode('');
      try {
        localStorage.removeItem(`${STORAGE_KEY}_url_ref`);
      } catch {
        // ignore
      }
    }

    setShowAuthModalState(false);
    showToast(
      language === 'hi'
        ? `पंजीकरण सफल! आपका स्वागत है ${cleanName}${cleanRef ? ` (रेफरल: ${cleanRef})` : ''}`
        : `Registration successful! Welcome ${cleanName}${cleanRef ? ` (Referred by: ${cleanRef})` : ''}`,
      'success'
    );
    return true;
  };

  const logout = () => {
    setUser(prev => ({
      ...prev,
      isLoggedIn: false
    }));
    setAuthMode('login');
    setShowAuthModalState(true);
    showToast(language === 'hi' ? 'आप सफलतापूर्वक लॉग आउट हो गए हैं' : 'Logged out successfully', 'info');
  };

  const buyPlan = (plan: Plan) => {
    if (user.walletBalance < plan.investment) {
      showToast(
        language === 'hi' 
          ? `अपर्याप्त बैलेंस! इस योजना के लिए ₹${plan.investment.toLocaleString('en-IN')} की आवश्यकता है।` 
          : `Insufficient funds! ₹${plan.investment.toLocaleString('en-IN')} required.`,
        'error'
      );
      setSelectedPlanForBuy(null);
      setShowRechargeModal(true);
      return false;
    }

    // Deduct balance, add active plan, add transaction
    setUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - plan.investment
    }));

    const newActivePlan: ActivePlan = {
      id: `plan-act-${Date.now()}`,
      planId: plan.id,
      planName: plan.name,
      investment: plan.investment,
      dailyIncome: plan.daily,
      purchaseDate: new Date().toISOString().split('T')[0],
      cycleDays: plan.cycle,
      daysElapsed: 1,
      totalEarnedSoFar: plan.daily, // immediate first day credit
      nextPayoutHours: 24,
      status: 'active'
    };

    setActivePlans(prev => [newActivePlan, ...prev]);

    const newTx: Transaction = {
      id: `tx-buy-${Date.now()}`,
      type: 'plan_buy',
      amount: plan.investment,
      title: `Plan Activated: ${plan.name}`,
      date: new Date().toLocaleString(),
      status: 'completed',
      method: 'Wallet Balance',
      refCode: `PLN-${plan.id}`
    };

    setTransactions(prev => [newTx, ...prev]);
    setSelectedPlanForBuy(null);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    showToast(
      language === 'hi'
        ? `बधाई हो! 🎉 ${plan.name} सक्रिय हो गया है। दैनिक आय: ₹${plan.daily}`
        : `Congratulations! 🎉 ${plan.name} activated. Daily yield: ₹${plan.daily}`,
      'success'
    );
    return true;
  };

  const buyPlanWithUpi = (plan: Plan, utrId: string) => {
    const cleanUtr = utrId.trim();
    if (cleanUtr.length < 6) {
      showToast(
        language === 'hi'
          ? 'कृपया सही UTR / ट्रांजेक्शन ID (कम से कम 6 अक्षर) दर्ज करें।'
          : 'Please enter a valid UTR / Transaction ID (minimum 6 characters).',
        'error'
      );
      return false;
    }

    const newActivePlanId = `plan-act-${Date.now()}`;
    const newActivePlan: ActivePlan = {
      id: newActivePlanId,
      planId: plan.id,
      planName: plan.name,
      investment: plan.investment,
      dailyIncome: plan.daily,
      purchaseDate: new Date().toISOString().split('T')[0],
      cycleDays: plan.cycle,
      daysElapsed: 0,
      totalEarnedSoFar: 0,
      nextPayoutHours: 24,
      status: 'pending_verification'
    };

    setActivePlans(prev => [newActivePlan, ...prev]);

    const newTx: Transaction = {
      id: `tx-buy-upi-${Date.now()}`,
      type: 'plan_buy',
      amount: plan.investment,
      title: `Plan Purchase (${plan.name})`,
      date: new Date().toLocaleString(),
      status: 'pending_verification',
      method: 'Direct UPI (999669968@ybl)',
      refCode: cleanUtr,
      userName: user.name,
      userPhone: user.phone,
      relatedPlanId: newActivePlanId
    };

    setTransactions(prev => [newTx, ...prev]);
    setSelectedPlanForBuy(null);

    showToast(
      language === 'hi'
        ? `UTR (${cleanUtr}) सबमिट हो गया! ${plan.name} पासबुक में 'Pending Verification' के साथ दर्ज किया गया है।`
        : `UTR (${cleanUtr}) submitted! ${plan.name} recorded in Passbook as 'Pending Verification'.`,
      'info'
    );
    return true;
  };

  const rechargeWallet = (amount: number, utrId: string) => {
    if (amount <= 0) {
      showToast(
        language === 'hi' ? 'कृपया सही राशि दर्ज करें' : 'Please enter a valid amount',
        'error'
      );
      return false;
    }
    const cleanUtr = utrId.trim();
    if (cleanUtr.length < 6) {
      showToast(
        language === 'hi'
          ? 'कृपया भुगतान के बाद UTR / Transaction ID दर्ज करें'
          : 'Please enter your UTR / Transaction ID after payment',
        'error'
      );
      return false;
    }

    const newTx: Transaction = {
      id: `tx-rec-${Date.now()}`,
      type: 'recharge',
      amount,
      title: `UPI Deposit (UTR: ${cleanUtr})`,
      date: new Date().toLocaleString(),
      status: 'pending_verification',
      method: 'Direct UPI (999669968@ybl)',
      refCode: cleanUtr,
      userName: user.name,
      userPhone: user.phone
    };

    setTransactions(prev => [newTx, ...prev]);
    setShowRechargeModal(false);

    showToast(
      language === 'hi'
        ? `UTR ${cleanUtr} सबमिट हो गया! ₹${amount.toLocaleString('en-IN')} की एंट्री पासबुक में 'Pending Verification' स्टेटस के साथ जोड़ दी गई है।`
        : `UTR ${cleanUtr} submitted! ₹${amount.toLocaleString('en-IN')} entry added to Passbook with 'Pending Verification' status.`,
      'info'
    );
    return true;
  };

  const withdrawFunds = (amount: number, destination: string, details: string) => {
    const pendingWithdrawTotal = transactions
      .filter(tx => tx.type === 'withdraw' && tx.status === 'processing')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const availableBalance = Math.max(0, user.walletBalance - pendingWithdrawTotal);

    if (amount < 100) {
      showToast(language === 'hi' ? 'न्यूनतम निकासी राशि ₹100 है' : 'Minimum withdrawal is ₹100', 'error');
      return false;
    }
    if (amount > availableBalance) {
      showToast(
        language === 'hi'
          ? `वॉलेट में पर्याप्त उपलब्ध राशि नहीं है (उपलब्ध: ₹${availableBalance.toLocaleString('en-IN')})`
          : `Insufficient available balance (Available: ₹${availableBalance.toLocaleString('en-IN')})`,
        'error'
      );
      return false;
    }
    if (!details || !details.trim()) {
      showToast(language === 'hi' ? 'कृपया सही UPI ID या बैंक विवरण दर्ज करें' : 'Please enter valid UPI ID or bank details', 'error');
      return false;
    }

    const newTx: Transaction = {
      id: `tx-wth-${Date.now()}`,
      type: 'withdraw',
      amount,
      title: `Withdrawal to ${destination} (${details})`,
      date: new Date().toLocaleString(),
      status: 'processing',
      method: destination,
      userName: user.name,
      userPhone: user.phone,
      payoutDetails: details
    };

    setTransactions(prev => [newTx, ...prev]);
    setShowWithdrawModal(false);

    showToast(
      language === 'hi'
        ? `निकासी अनुरोध सबमिट हो गया! ₹${amount.toLocaleString('en-IN')} एडमिन द्वारा Paid करने पर वॉलेट व पासबुक अपडेट होंगे।`
        : `Withdrawal request submitted! Balance & Passbook will update once Admin marks ₹${amount.toLocaleString('en-IN')} Paid.`,
      'info'
    );
    return true;
  };

  // Admin PIN & Approval Actions
  const unlockAdmin = (pin: string) => {
    if (pin.trim() === adminPin) {
      setIsAdminUnlocked(true);
      setShowAdminPinModal(false);
      setCurrentTab('admin');
      showToast(
        language === 'hi' ? 'Admin Panel अनलॉक हो गया।' : 'Admin Panel unlocked.',
        'success'
      );
      return true;
    }
    showToast(
      language === 'hi' ? 'गलत Admin PIN / पासवर्ड!' : 'Incorrect Admin PIN / Password!',
      'error'
    );
    return false;
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    if (currentTab === 'admin') {
      setCurrentTab('dashboard');
    }
    showToast(language === 'hi' ? 'Admin Panel लॉक कर दिया गया।' : 'Admin Panel locked.', 'info');
  };

  const updateAdminPin = (currentPinInput: string, newPinInput: string) => {
    if (currentPinInput.trim() !== adminPin) {
      showToast(
        language === 'hi' ? 'मौजूदा PIN गलत है।' : 'Current PIN is incorrect.',
        'error'
      );
      return false;
    }
    const cleanNew = newPinInput.trim();
    if (cleanNew.length < 4) {
      showToast(
        language === 'hi' ? 'नया PIN कम से कम 4 अक्षरों का होना चाहिए।' : 'New PIN must be at least 4 characters.',
        'error'
      );
      return false;
    }
    setAdminPin(cleanNew);
    try {
      localStorage.setItem(`${STORAGE_KEY}_admin_pin`, cleanNew);
    } catch {
      // ignore
    }
    showToast(
      language === 'hi' ? 'Admin PIN सफलतापूर्वक बदल दिया गया!' : 'Admin PIN updated successfully!',
      'success'
    );
    return true;
  };

  const approveRechargeRequest = (txId: string) => {
    const targetTx = transactions.find(tx => tx.id === txId);
    if (!targetTx || targetTx.status !== 'pending_verification') return;

    if (targetTx.type === 'recharge') {
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === txId
            ? {
                ...tx,
                status: 'completed',
                title: `UPI Deposit Approved (UTR: ${tx.refCode || '-'})`
              }
            : tx
        )
      );

      if (!targetTx.userPhone || targetTx.userPhone === user.phone) {
        setUser(prev => ({
          ...prev,
          walletBalance: prev.walletBalance + targetTx.amount
        }));
      } else {
        setRegisteredUsers(prev =>
          prev.map(u =>
            u.phone === targetTx.userPhone
              ? { ...u, walletBalance: u.walletBalance + targetTx.amount }
              : u
          )
        );
      }

      showToast(
        language === 'hi'
          ? `₹${targetTx.amount.toLocaleString('en-IN')} रिचार्ज Approve हुआ — वॉलेट बैलेंस अपडेट हो गया!`
          : `₹${targetTx.amount.toLocaleString('en-IN')} recharge approved — wallet balance credited!`,
        'success'
      );
    } else if (targetTx.type === 'plan_buy') {
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === txId
            ? {
                ...tx,
                status: 'completed'
              }
            : tx
        )
      );
      if (targetTx.relatedPlanId) {
        setActivePlans(prev =>
          prev.map(p =>
            p.id === targetTx.relatedPlanId
              ? { ...p, status: 'active', daysElapsed: 1, totalEarnedSoFar: p.dailyIncome }
              : p
          )
        );
      }
      showToast(
        language === 'hi'
          ? `योजना भुगतान (UTR: ${targetTx.refCode}) Approve हुआ और योजना सक्रिय हो गई!`
          : `Plan payment (UTR: ${targetTx.refCode}) approved & plan activated!`,
        'success'
      );
    }
  };

  const rejectRechargeRequest = (txId: string) => {
    const targetTx = transactions.find(tx => tx.id === txId);
    if (!targetTx || targetTx.status !== 'pending_verification') return;

    setTransactions(prev =>
      prev.map(tx =>
        tx.id === txId
          ? {
              ...tx,
              status: 'rejected'
            }
          : tx
      )
    );

    if (targetTx.type === 'plan_buy' && targetTx.relatedPlanId) {
      setActivePlans(prev => prev.filter(p => p.id !== targetTx.relatedPlanId));
    }

    showToast(
      language === 'hi'
        ? `UTR अनुरोध (${targetTx.refCode || targetTx.id}) Reject कर दिया गया।`
        : `UTR request (${targetTx.refCode || targetTx.id}) rejected.`,
      'info'
    );
  };

  const markWithdrawalPaid = (txId: string) => {
    const targetTx = transactions.find(tx => tx.id === txId);
    if (!targetTx || targetTx.type !== 'withdraw' || targetTx.status !== 'processing') return;

    const isCurrentUser = !targetTx.userPhone || targetTx.userPhone === user.phone;
    const targetBalance = isCurrentUser
      ? user.walletBalance
      : registeredUsers.find(u => u.phone === targetTx.userPhone)?.walletBalance ?? 0;

    if (targetBalance < targetTx.amount) {
      showToast(
        language === 'hi'
          ? 'यूज़र के वॉलेट में पर्याप्त बैलेंस नहीं है।'
          : 'User does not have sufficient wallet balance for this payout.',
        'error'
      );
      return;
    }

    if (isCurrentUser) {
      setUser(prev => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - targetTx.amount)
      }));
    } else {
      setRegisteredUsers(prev =>
        prev.map(u =>
          u.phone === targetTx.userPhone
            ? { ...u, walletBalance: Math.max(0, u.walletBalance - targetTx.amount) }
            : u
        )
      );
    }

    setTransactions(prev =>
      prev.map(tx =>
        tx.id === txId
          ? {
              ...tx,
              status: 'completed',
              title: `Withdrawal Paid to ${tx.method || 'Account'} (${tx.payoutDetails || ''})`
            }
          : tx
      )
    );

    showToast(
      language === 'hi'
        ? `₹${targetTx.amount.toLocaleString('en-IN')} Paid मार्क किया गया — बैलेंस और पासबुक अपडेट हो गए!`
        : `₹${targetTx.amount.toLocaleString('en-IN')} marked Paid — balance and Passbook updated!`,
      'success'
    );
  };

  const rejectWithdrawalRequest = (txId: string) => {
    const targetTx = transactions.find(tx => tx.id === txId);
    if (!targetTx || targetTx.type !== 'withdraw' || targetTx.status !== 'processing') return;

    setTransactions(prev =>
      prev.map(tx =>
        tx.id === txId
          ? {
              ...tx,
              status: 'rejected'
            }
          : tx
      )
    );

    showToast(
      language === 'hi'
        ? `₹${targetTx.amount.toLocaleString('en-IN')} का निकासी अनुरोध Reject किया गया।`
        : `Withdrawal request for ₹${targetTx.amount.toLocaleString('en-IN')} rejected.`,
      'info'
    );
  };

  const harvestDailyYield = () => {
    if (user.dailyIncome <= 0) {
      showToast(language === 'hi' ? 'आपके पास कोई सक्रिय योजना नहीं है' : 'No active plans yielding currently', 'info');
      return;
    }
    if (!canHarvest) {
      showToast(language === 'hi' ? `कृपया प्रतीक्षा करें: अगला हार्वेस्ट ${harvestTimer} में` : `Please wait: Next harvest ready in ${harvestTimer}`, 'info');
      return;
    }

    const harvestAmount = user.dailyIncome;

    setUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + harvestAmount,
      totalEarned: prev.totalEarned + harvestAmount
    }));

    // update active plans days elapsed & earned
    setActivePlans(prev => prev.map(p => ({
      ...p,
      daysElapsed: Math.min(p.cycleDays, p.daysElapsed + 1),
      totalEarnedSoFar: p.totalEarnedSoFar + p.dailyIncome
    })));

    const newTx: Transaction = {
      id: `tx-harv-${Date.now()}`,
      type: 'daily_yield',
      amount: harvestAmount,
      title: `Daily Agro Harvest Yield (दैनिक कृषि आय)`,
      date: new Date().toLocaleString(),
      status: 'completed',
      method: 'Automated Harvest Engine'
    };

    setTransactions(prev => [newTx, ...prev]);
    setLastHarvestTime(Date.now());
    localStorage.setItem(`${STORAGE_KEY}_last_harvest`, Date.now().toString());

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }

    showToast(
      language === 'hi'
        ? `दैनिक लाभ प्राप्त! ₹${harvestAmount.toLocaleString('en-IN')} आपके वॉलेट में जमा कर दिया गया।`
        : `Daily yield harvested! ₹${harvestAmount.toLocaleString('en-IN')} credited to your wallet.`,
      'success'
    );
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        user,
        registeredUsers,
        language,
        t,
        currentTab,
        activePlans,
        transactions,
        referralMembers,
        showAuthModal,
        authMode,
        urlReferralCode,
        showRechargeModal,
        showWithdrawModal,
        showAdminPinModal,
        isAdminUnlocked,
        selectedPlanForBuy,
        toast,
        canHarvest,
        harvestTimer,
        setLanguage,
        toggleLanguage,
        setCurrentTab,
        setShowAuthModal,
        setShowRechargeModal,
        setShowWithdrawModal,
        setShowAdminPinModal,
        setSelectedPlanForBuy,
        showToast,
        login,
        register,
        logout,
        buyPlan,
        buyPlanWithUpi,
        rechargeWallet,
        withdrawFunds,
        harvestDailyYield,
        unlockAdmin,
        lockAdmin,
        updateAdminPin,
        approveRechargeRequest,
        rejectRechargeRequest,
        markWithdrawalPaid,
        rejectWithdrawalRequest
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
