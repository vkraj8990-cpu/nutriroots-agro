import React from 'react';
import { useApp } from '../context/AppContext';
import { Send, ExternalLink, ShieldCheck, Heart, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t, setCurrentTab, isAdminUnlocked, setShowAdminPinModal } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="text-xl">🌱</span>
              <span>NutriRoots Agro Platform</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              {language === 'hi' 
                ? 'GROW GREEN • GROW TOGETHER | भारत का विश्वसनीय कृषि निवेश व विकास मंच। वास्तविक पॉलीहाउस, जैविक संवर्धन और हरित ड्रिप नेटवर्क द्वारा संचालित।'
                : 'GROW GREEN • GROW TOGETHER | India\'s leading sustainable agro-growth platform backed by high-yield hydroponics, medicinal herbal estates, and verified institutional off-take agreements.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Sustainable Agriculture Partner</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              {language === 'hi' ? 'महत्वपूर्ण लिंक' : 'Platform Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => setCurrentTab('dashboard')} className="hover:text-emerald-400 transition-colors">
                  {t.navDashboard}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('my_plans')} className="hover:text-emerald-400 transition-colors">
                  {t.navMyPlans}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('referral')} className="hover:text-emerald-400 transition-colors">
                  {t.navReferral}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('projects')} className="hover:text-emerald-400 transition-colors">
                  {t.navProjects}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('calculator')} className="hover:text-emerald-400 transition-colors">
                  {t.navCalculator}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('passbook')} className="hover:text-emerald-400 transition-colors">
                  {t.navPassbook}
                </button>
              </li>
            </ul>
          </div>

          {/* Telegram Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              {t.contactSupport}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              {t.supportDesc}
            </p>
            <a
              href="https://t.me/NutriRootsAgroSupport"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.telegramSupport}</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 NutriRoots Agro. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 inline" />
              <span>for green sustainable wealth creation</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isAdminUnlocked) {
                  setCurrentTab('admin');
                } else {
                  setShowAdminPinModal(true);
                }
              }}
              className="text-stone-500 hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
              title="Admin Access"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
