import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  UserPlus, 
  MessageCircle, 
  Percent, 
  ExternalLink 
} from 'lucide-react';

export const ReferralView: React.FC = () => {
  const { user, referralMembers, language, t, showToast } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'all' | 1 | 2 | 3>('all');

  const referralUrl = `https://nutriroots.ai.studio/?ref=${user.referralCode}`;

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    try {
      navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2500);
      }
      showToast(
        language === 'hi' ? 'क्लिपबोर्ड पर कॉपी हो गया!' : 'Copied to clipboard!',
        'success'
      );
    } catch {
      showToast('Could not copy automatically', 'info');
    }
  };

  const shareViaWhatsApp = () => {
    const textHi = `🌱 NutriRoots Agro Growth Platform - प्रकृति में निवेश करें और 150 दिनों तक दैनिक लाभ पाएं! मेरे रेफरल कोड ${user.referralCode} से जुड़ें: ${referralUrl}`;
    const textEn = `🌱 NutriRoots Agro Growth Platform - Invest in sustainable agriculture & earn daily income for 150 days! Join using my referral code ${user.referralCode}: ${referralUrl}`;
    const message = encodeURIComponent(language === 'hi' ? textHi : textEn);
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const totalReferralCommission = referralMembers.reduce((sum, m) => sum + m.commissionEarned, 0);
  const filteredMembers = referralMembers.filter(m => {
    if (selectedLevelFilter === 'all') return true;
    return m.level === selectedLevelFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" />
            <span>{t.referralTitle}</span>
            <span aria-hidden="true">·</span>
            <span>3-Tier Passive Income</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
            {language === 'hi' ? 'मित्रों को जोड़ें, साथ मिलकर कमाएं' : 'Grow Together, Earn Daily Referral Rewards'}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t.referralSubtitle}
          </p>
        </div>

        {/* Referral Link & Code Inputs */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-stone-100">
          {/* Referral Code Box */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col justify-between">
            <span className="text-xs font-medium text-stone-500 mb-1">
              {t.yourRefCode}
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xl font-extrabold text-emerald-800 tracking-wider">
                {user.referralCode}
              </span>
              <button
                onClick={() => copyToClipboard(user.referralCode, 'code')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? (language === 'hi' ? 'कॉपी हुआ' : 'Copied') : (language === 'hi' ? 'कोड कॉपी' : 'Copy Code')}</span>
              </button>
            </div>
          </div>

          {/* Referral Link Box */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col justify-between">
            <span className="text-xs font-medium text-stone-500 mb-1">
              {t.yourRefLink}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs text-stone-700 font-mono select-all truncate"
              />
              <button
                onClick={() => copyToClipboard(referralUrl, 'link')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? (language === 'hi' ? 'कॉपी हुआ' : 'Copied') : t.copyLink}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Social Share Action */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={shareViaWhatsApp}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.shareWhatsapp}</span>
          </button>
          <span className="text-xs text-stone-500">
            {language === 'hi' ? 'प्रत्येक मित्र के सक्रियण पर त्वरित वॉलेट क्रेडिट।' : 'Instant commission credit on partner activation.'}
          </span>
        </div>
      </div>

      {/* Commission Tiers Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Level 1
            </span>
            <span className="text-2xl font-black text-emerald-700 tabular-nums">
              10%
            </span>
          </div>
          <h4 className="text-sm font-bold text-stone-900 mb-1">
            {language === 'hi' ? 'प्रत्यक्ष आमंत्रण (Direct Referrals)' : 'Direct Referrals'}
          </h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            {language === 'hi' 
              ? 'आपके द्वारा सीधे आमंत्रित मित्र के प्रत्येक निवेश का 10% तुरंत आपके वॉलेट में जमा।'
              : 'Earn 10% instant direct commission on every agricultural plan purchased by your invites.'}
          </p>
        </div>

        {/* Tier 2 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Level 2
            </span>
            <span className="text-2xl font-black text-emerald-700 tabular-nums">
              5%
            </span>
          </div>
          <h4 className="text-sm font-bold text-stone-900 mb-1">
            {language === 'hi' ? 'द्वितीयक टीम (Secondary Team)' : 'Secondary Team'}
          </h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            {language === 'hi' 
              ? 'जब आपके Level 1 मित्र आगे किसी को जोड़ते हैं, तो उनकी खरीदारी पर 5% कमीशन।'
              : 'Earn 5% commission automatically whenever your Level 1 partners expand their team.'}
          </p>
        </div>

        {/* Tier 3 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Level 3
            </span>
            <span className="text-2xl font-black text-emerald-700 tabular-nums">
              2%
            </span>
          </div>
          <h4 className="text-sm font-bold text-stone-900 mb-1">
            {language === 'hi' ? 'तृतीयक नेटवर्क (Community Pool)' : 'Network Community'}
          </h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            {language === 'hi' 
              ? 'आपकी तीसरी पीढ़ी के नेटवर्क से 2% आजीवन कृषि कम्युनिटी बोनस।'
              : 'Earn 2% on third-generation partner investments to build lasting passive income.'}
          </p>
        </div>
      </div>

      {/* Team Performance Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              {language === 'hi' ? 'आपकी टीम एवं रेफरल सदस्य' : 'Your Referral Team Directory'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {language === 'hi' ? 'कुल संचित रेफरल बोनस:' : 'Total referral commissions earned:'}{' '}
              <strong className="text-emerald-800 font-bold tabular-nums">₹{totalReferralCommission.toLocaleString('en-IN')}</strong>
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setSelectedLevelFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                selectedLevelFilter === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'hi' ? 'सभी सदस्य' : 'All'}
            </button>
            <button
              onClick={() => setSelectedLevelFilter(1)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                selectedLevelFilter === 1 ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Level 1 (10%)
            </button>
            <button
              onClick={() => setSelectedLevelFilter(2)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                selectedLevelFilter === 2 ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Level 2 (5%)
            </button>
            <button
              onClick={() => setSelectedLevelFilter(3)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                selectedLevelFilter === 3 ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Level 3 (2%)
            </button>
          </div>
        </div>

        {/* Table or Clean Empty State */}
        {filteredMembers.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">
              {language === 'hi' ? 'अभी कोई रेफरल सदस्य नहीं जुड़ा है' : 'No Referral Members Yet'}
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              {language === 'hi'
                ? 'अपना रेफरल कोड या लिंक मित्रों के साथ शेयर करें। जब कोई वास्तविक सदस्य आपके कोड से जुड़कर निवेश करेगा, तो वह यहां दिखाई देगा।'
                : 'Share your referral code or invite link above. When real members join and invest using your code, they will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">{language === 'hi' ? 'सदस्य का नाम' : 'Member Name'}</th>
                  <th className="px-5 py-3 font-semibold">{language === 'hi' ? 'मोबाइल' : 'Mobile'}</th>
                  <th className="px-5 py-3 font-semibold">{language === 'hi' ? 'टीयर लेवल' : 'Tier Level'}</th>
                  <th className="px-5 py-3 font-semibold">{language === 'hi' ? 'शामिल होने की तिथि' : 'Join Date'}</th>
                  <th className="px-5 py-3 font-semibold text-right">{language === 'hi' ? 'कुल निवेश' : 'Invested'}</th>
                  <th className="px-5 py-3 font-semibold text-right">{language === 'hi' ? 'आपका कमीशन' : 'Commission'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-stone-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <span>{member.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-stone-500 font-mono">
                      {member.phoneMasked}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        member.level === 1 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : member.level === 2 
                            ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        Level {member.level}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-stone-500 tabular-nums">
                      {member.joinDate}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-stone-800 tabular-nums">
                      ₹{member.investmentAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-emerald-800 tabular-nums">
                      +₹{member.commissionEarned.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
