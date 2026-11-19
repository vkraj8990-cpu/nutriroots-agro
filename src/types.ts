export type Language = 'hi' | 'en';

export interface Plan {
  id: string;
  name: string;
  investment: number;
  daily: number;
  cycle: number;
  total: number;
  category: 'starter' | 'standard' | 'advanced' | 'premium';
  cropType: string;
  harvestCycle: string;
  roiMultiplier: string;
}

export interface ActivePlan {
  id: string;
  planId: string;
  planName: string;
  investment: number;
  dailyIncome: number;
  purchaseDate: string;
  cycleDays: number;
  daysElapsed: number;
  totalEarnedSoFar: number;
  nextPayoutHours: number;
  status: 'active' | 'pending_verification' | 'completed';
}

export interface User {
  name: string;
  phone: string;
  referralCode: string;
  referredBy?: string;
  walletBalance: number;
  dailyIncome: number;
  totalEarned: number;
  activePlanCount: number;
  isLoggedIn: boolean;
  joinDate: string;
  kycStatus: 'verified' | 'pending' | 'not_submitted';
}

export interface RegisteredUser {
  id: string;
  name: string;
  phone: string;
  referralCode: string;
  referredBy?: string;
  joinDate: string;
  walletBalance: number;
}

export interface Transaction {
  id: string;
  type: 'recharge' | 'withdraw' | 'plan_buy' | 'daily_yield' | 'referral_bonus';
  amount: number;
  title: string;
  date: string;
  status: 'completed' | 'processing' | 'pending_verification' | 'rejected';
  method?: string;
  refCode?: string;
  userName?: string;
  userPhone?: string;
  payoutDetails?: string;
  relatedPlanId?: string;
}

export interface ReferralMember {
  id: string;
  name: string;
  phoneMasked: string;
  level: 1 | 2 | 3;
  joinDate: string;
  investmentAmount: number;
  commissionEarned: number;
  activePlans: number;
}

export interface AgroProject {
  id: string;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  image: string;
  location: string;
  hectares: string;
  yieldCycle: string;
  technology: string;
  description: string;
  descriptionHi: string;
  returnsContribution: string;
}
