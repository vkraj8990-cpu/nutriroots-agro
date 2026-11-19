import React from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, Globe, LogOut, User as UserIcon, Plus } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const Navbar: React.FC = () => {
  const { 
    user, 
    language, 
    toggleLanguage, 
    currentTab, 
    setCurrentTab, 
    setShowRechargeModal, 
    setShowAuthModal, 
    logout 
  } = useApp();

  const navItems = [
    { id: 'dashboard', labelHi: 'डैशबोर्ड & प्लान्स', labelEn: 'Dashboard' },
    { id: 'my_plans', labelHi: 'सक्रिय निवेश', labelEn: 'My Plans' },
    { id: 'referral', labelHi: 'रेफरल नेटवर्क', labelEn: 'Referrals' },
    { id: 'projects', labelHi: 'कृषि फार्म्स', labelEn: 'Agro Farms' },
    { id: 'passbook', labelHi: 'पासबुक', labelEn: 'Passbook' },
    { id: 'calculator', labelHi: 'कैलकुलेटर', labelEn: 'Calculator' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single-element Brand wordmark */}
          <div 
            onClick={() => setCurrentTab('dashboard')} 
            className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 group"
          >
            <span className="text-xl font-bold tracking-tight text-emerald-800 transition-colors group-hover:text-emerald-900">
              🌱 NutriRoots Agro
            </span>
          </div>

          {/* Zone 2: 4-6 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {language === 'hi' ? item.labelHi : item.labelEn}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action cluster (PWA install + Language switch + Auth) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <PWAInstallButton />
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'hi' ? 'EN' : 'हिंदी'}</span>
            </button>

            {user.isLoggedIn ? (
              <>
                {/* Wallet Balance Chip */}
                <button
                  onClick={() => setShowRechargeModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
                  title="Click to Add Balance"
                >
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200" />
                  <span className="tabular-nums">₹{user.walletBalance.toLocaleString('en-IN')}</span>
                  <Plus className="w-3.5 h-3.5 ml-0.5 text-emerald-200" />
                </button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors shrink-0"
                  title={language === 'hi' ? 'लॉग आउट' : 'Log Out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true, 'login')}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'लॉग इन' : 'Log In'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-1.5 border-t border-stone-100 no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {language === 'hi' ? item.labelHi : item.labelEn}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
