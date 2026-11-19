import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { MyInvestmentsView } from './components/MyInvestmentsView';
import { ReferralView } from './components/ReferralView';
import { AgroProjectsView } from './components/AgroProjectsView';
import { PassbookView } from './components/PassbookView';
import { CalculatorView } from './components/CalculatorView';
import { BuyConfirmModal } from './components/BuyConfirmModal';
import { RechargeModal } from './components/RechargeModal';
import { WithdrawModal } from './components/WithdrawModal';
import { AuthModal } from './components/AuthModal';
import { AdminPinModal } from './components/AdminPinModal';
import { AdminPanelView } from './components/AdminPanelView';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';

const MainContent: React.FC = () => {
  const { currentTab } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {currentTab === 'dashboard' && <DashboardView />}
      {currentTab === 'my_plans' && <MyInvestmentsView />}
      {currentTab === 'referral' && <ReferralView />}
      {currentTab === 'projects' && <AgroProjectsView />}
      {currentTab === 'passbook' && <PassbookView />}
      {currentTab === 'calculator' && <CalculatorView />}
      {currentTab === 'admin' && <AdminPanelView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-stone-50 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
        <div>
          <Navbar />
          <MainContent />
        </div>

        <Footer />

        {/* Global Dialogs & Alerts */}
        <BuyConfirmModal />
        <RechargeModal />
        <WithdrawModal />
        <AuthModal />
        <AdminPinModal />
        <Toast />
        <OfflineIndicator />
      </div>
    </AppProvider>
  );
}
