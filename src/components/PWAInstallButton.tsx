import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useApp();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
        title={language === 'hi' ? 'मोबाइल ऐप इंस्टॉल करें' : 'Install App'}
      >
        <Download className="w-3.5 h-3.5 text-emerald-700" />
        <span className="hidden sm:inline">
          {language === 'hi' ? 'ऐप इंस्टॉल' : 'Install App'}
        </span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          title={language === 'hi' ? 'iPhone पर इंस्टॉल करें' : 'Install App on iOS'}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
          <span className="hidden sm:inline">
            {language === 'hi' ? 'ऐप इंस्टॉल' : 'Install App'}
          </span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-stone-900">
                  {language === 'hi' ? 'iPhone / iPad पर ऐप इंस्टॉल करें' : 'Install on iPhone / iPad'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                {language === 'hi' ? (
                  <>
                    1. Safari ब्राउज़र में नीचे <strong>Share</strong> बटन दबाएँ।<br />
                    2. स्क्रॉल करके <strong>Add to Home Screen</strong> पर टैप करें।
                  </>
                ) : (
                  <>
                    1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
                    2. Scroll down and tap <strong>Add to Home Screen</strong>.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-emerald-700 hover:bg-emerald-800 py-2 text-sm font-semibold text-white transition-colors"
              >
                {language === 'hi' ? 'समझ गया' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
