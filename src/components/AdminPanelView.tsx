import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Lock,
  KeyRound,
  UserPlus,
  Clock,
} from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const {
    isAdminUnlocked,
    setShowAdminPinModal,
    lockAdmin,
    updateAdminPin,
    registeredUsers,
    transactions,
    approveRechargeRequest,
    rejectRechargeRequest,
    markWithdrawalPaid,
    rejectWithdrawalRequest,
    language,
  } = useApp();

  const isHindi = language === 'hi';
  const [showPinEditor, setShowPinEditor] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');

  if (!isAdminUnlocked) {
    return (
      <div className="py-16 max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-extrabold text-stone-900">
            {isHindi ? 'Admin Panel लॉक है' : 'Admin Panel Locked'}
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            {isHindi
              ? 'रजिस्टर्ड यूज़र्स, पेंडिंग रिचार्ज / UTR और निकासी अनुरोध देखने के लिए Admin PIN से अनलॉक करें।'
              : 'Enter your Admin PIN to manage registered users, UTR recharge approvals, and withdrawal payouts.'}
          </p>
          <button
            type="button"
            onClick={() => setShowAdminPinModal(true)}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors"
          >
            {isHindi ? 'Admin PIN दर्ज करें' : 'Enter Admin PIN'}
          </button>
        </div>
      </div>
    );
  }

  const pendingRechargeList = transactions.filter(
    tx => (tx.type === 'recharge' || tx.type === 'plan_buy') && tx.status === 'pending_verification'
  );

  const pendingWithdrawalList = transactions.filter(
    tx => tx.type === 'withdraw' && tx.status === 'processing'
  );

  const totalPendingRechargeAmount = pendingRechargeList.reduce((sum, tx) => sum + tx.amount, 0);
  const totalPendingWithdrawAmount = pendingWithdrawalList.reduce((sum, tx) => sum + tx.amount, 0);

  const handlePinSave = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = updateAdminPin(currentPin, newPin);
    if (ok) {
      setCurrentPin('');
      setNewPin('');
      setShowPinEditor(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{isHindi ? 'सुरक्षित एडमिन नियंत्रण कक्ष' : 'Protected Admin Control'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {isHindi ? 'Admin Panel — सत्यापन एवं भुगतान प्रबंधन' : 'Admin Panel — Users, UTR & Payout Management'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {isHindi
                ? 'रजिस्टर्ड सदस्यों की सूची देखें, रिचार्ज UTR Approve/Reject करें और निकासी अनुरोधों को Paid मार्क करें।'
                : 'Inspect registered users, approve or reject UTR recharge requests, and mark withdrawal payouts as Paid.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowPinEditor(prev => !prev)}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{isHindi ? 'PIN बदलें' : 'Change PIN'}</span>
            </button>
            <button
              type="button"
              onClick={lockAdmin}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isHindi ? 'लॉक व बाहर निकलें' : 'Lock & Exit'}</span>
            </button>
          </div>
        </div>

        {/* Optional Change PIN Form */}
        {showPinEditor && (
          <form
            onSubmit={handlePinSave}
            autoComplete="off"
            className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
          >
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                {isHindi ? 'मौजूदा PIN' : 'Current PIN'}
              </label>
              <input
                type="password"
                required
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                placeholder="••••••"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                {isHindi ? 'नया PIN (कम से कम 4 अक्षर)' : 'New PIN (min 4 chars)'}
              </label>
              <input
                type="password"
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="••••••"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              {isHindi ? 'नया PIN सेव करें' : 'Save New PIN'}
            </button>
          </form>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium uppercase tracking-wider mb-1">
            <span>{isHindi ? 'रजिस्टर्ड यूज़र्स' : 'Registered Users'}</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 tabular-nums">
            {registeredUsers.length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium uppercase tracking-wider mb-1">
            <span>{isHindi ? 'पेंडिंग रिचार्ज / UTR' : 'Pending Recharge / UTR'}</span>
            <ArrowDownLeft className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 tabular-nums">
            {pendingRechargeList.length}
            <span className="text-xs font-semibold text-amber-700 ml-2">
              (₹{totalPendingRechargeAmount.toLocaleString('en-IN')})
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium uppercase tracking-wider mb-1">
            <span>{isHindi ? 'पेंडिंग निकासी अनुरोध' : 'Pending Withdrawals'}</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 tabular-nums">
            {pendingWithdrawalList.length}
            <span className="text-xs font-semibold text-rose-700 ml-2">
              (₹{totalPendingWithdrawAmount.toLocaleString('en-IN')})
            </span>
          </div>
        </div>
      </div>

      {/* List 1: Pending Recharge / UTR Requests */}
      <section className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-700" />
              <span>
                {isHindi
                  ? '1. पेंडिंग रिचार्ज / UTR अनुरोध (Approve / Reject)'
                  : '1. Pending Recharge / UTR Requests'}
              </span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isHindi
                ? 'जब तक आप Approve नहीं करते, यूज़र के वॉलेट का बैलेंस नहीं बढ़ता।'
                : 'Wallet balance remains uncredited until you Approve a verified UTR entry.'}
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 tabular-nums">
            {pendingRechargeList.length} {isHindi ? 'लंबित' : 'Pending'}
          </span>
        </div>

        {pendingRechargeList.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500 flex flex-col items-center gap-2">
            <Clock className="w-5 h-5 text-stone-400" />
            <span>
              {isHindi
                ? 'अभी कोई लंबित रिचार्ज / UTR अनुरोध नहीं है।'
                : 'No pending recharge or UTR verification requests.'}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">{isHindi ? 'यूज़र' : 'User'}</th>
                  <th className="px-4 py-3 font-semibold">{isHindi ? 'प्रकार' : 'Type'}</th>
                  <th className="px-4 py-3 font-semibold">{isHindi ? 'UTR नंबर' : 'UTR Number'}</th>
                  <th className="px-4 py-3 font-semibold text-right">{isHindi ? 'राशि' : 'Amount'}</th>
                  <th className="px-5 py-3 font-semibold text-right">{isHindi ? 'कार्रवाई' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pendingRechargeList.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/70">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-stone-900">{tx.userName || 'Member'}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{tx.userPhone || '-'}</div>
                    </td>
                    <td className="px-4 py-3.5 text-stone-700">
                      <div className="font-medium">
                        {tx.type === 'plan_buy'
                          ? isHindi
                            ? 'डायरेक्ट UPI प्लान'
                            : 'Plan Direct UPI'
                          : isHindi
                            ? 'वॉलेट रिचार्ज'
                            : 'Wallet Recharge'}
                      </div>
                      <div className="text-[11px] text-stone-500">{tx.date}</div>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-stone-900">
                      {tx.refCode || '-'}
                    </td>
                    <td className="px-4 py-3.5 text-right font-extrabold text-emerald-800 tabular-nums text-sm">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => approveRechargeRequest(tx.id)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectRechargeRequest(tx.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* List 2: Pending Withdrawal Requests */}
      <section className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-rose-700" />
              <span>
                {isHindi
                  ? '2. पेंडिंग निकासी अनुरोध (Mark Paid / Reject)'
                  : '2. Pending Withdrawal Requests'}
              </span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isHindi
                ? 'Mark Paid करने पर यूज़र का बैलेंस कटेगा और पासबुक में Completed एंट्री अपडेट होगी।'
                : 'Marking Paid deducts the wallet balance and updates the Passbook record to Completed.'}
            </p>
          </div>
          <span className="text-xs font-bold text-rose-700 tabular-nums">
            {pendingWithdrawalList.length} {isHindi ? 'लंबित' : 'Pending'}
          </span>
        </div>

        {pendingWithdrawalList.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500 flex flex-col items-center gap-2">
            <Clock className="w-5 h-5 text-stone-400" />
            <span>
              {isHindi
                ? 'अभी कोई लंबित निकासी अनुरोध नहीं है।'
                : 'No pending withdrawal payout requests.'}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">{isHindi ? 'यूज़र' : 'User'}</th>
                  <th className="px-4 py-3 font-semibold">{isHindi ? 'UPI / बैंक विवरण' : 'UPI / Bank Details'}</th>
                  <th className="px-4 py-3 font-semibold text-right">{isHindi ? 'राशि' : 'Amount'}</th>
                  <th className="px-5 py-3 font-semibold text-right">{isHindi ? 'कार्रवाई' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pendingWithdrawalList.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/70">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-stone-900">{tx.userName || 'Member'}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{tx.userPhone || '-'}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-stone-800">{tx.method || 'Payout'}</div>
                      <div className="text-[11px] font-mono text-stone-600 break-all">
                        {tx.payoutDetails || tx.title}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{tx.date}</div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-extrabold text-stone-900 tabular-nums text-sm">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => markWithdrawalPaid(tx.id)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Paid</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectWithdrawalRequest(tx.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* List 3: Registered Users */}
      <section className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>
                {isHindi
                  ? '3. पंजीकृत यूज़र्स (Registered Users)'
                  : '3. Registered Users'}
              </span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isHindi
                ? 'रजिस्टर किए गए सभी सदस्यों का नाम, मोबाइल नंबर और रेफरल जानकारी।'
                : 'All registered members with name, mobile number, and referral attribution.'}
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 tabular-nums">
            {registeredUsers.length} {isHindi ? 'सदस्य' : 'Users'}
          </span>
        </div>

        {registeredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500 flex flex-col items-center gap-2">
            <UserPlus className="w-5 h-5 text-stone-400" />
            <span>
              {isHindi
                ? 'अभी तक कोई नया यूज़र रजिस्टर नहीं हुआ है।'
                : 'No users have registered yet.'}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">{isHindi ? 'नाम' : 'Name'}</th>
                  <th className="px-4 py-3 font-semibold">{isHindi ? 'मोबाइल नंबर' : 'Mobile'}</th>
                  <th className="px-4 py-3 font-semibold">{isHindi ? 'रेफरल कोड' : 'Referral Code'}</th>
                  <th className="px-4 py-3 font-semibold">{isHindi ? 'रेफरल द्वारा (Referred By)' : 'Referred By'}</th>
                  <th className="px-4 py-3 font-semibold">{isHindi ? 'जुड़ने की तिथि' : 'Join Date'}</th>
                  <th className="px-5 py-3 font-semibold text-right">{isHindi ? 'वॉलेट बैलेंस' : 'Balance'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {registeredUsers.map((regUser) => (
                  <tr key={regUser.id} className="hover:bg-stone-50/70">
                    <td className="px-5 py-3.5 font-bold text-stone-900">
                      {regUser.name}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-stone-700">
                      {regUser.phone}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-800">
                      {regUser.referralCode}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-stone-600">
                      {regUser.referredBy || '-'}
                    </td>
                    <td className="px-4 py-3.5 text-stone-500 tabular-nums">
                      {regUser.joinDate}
                    </td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-stone-900 tabular-nums">
                      ₹{regUser.walletBalance.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
