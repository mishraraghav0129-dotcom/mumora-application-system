import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Smartphone,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LoginScreenProps {
  onBackToWelcome: () => void;
  onSwitchToSignup: () => void;
  onOpenForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onBackToWelcome,
  onSwitchToSignup,
  onOpenForgotPassword,
}) => {
  const { language, login } = useApp();
  const isHi = language === 'hi';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg(isHi ? 'कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें।' : 'Please enter your email or mobile number.');
      return;
    }

    if (!password) {
      setErrorMsg(isHi ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(identifier.trim(), password);
      if (!result.success) {
        setErrorMsg(result.error || (isHi ? 'लॉगिन असफल रहा। कृपया पुनः प्रयास करें।' : 'Login failed. Please check your credentials.'));
      }
    } catch (err: any) {
      setErrorMsg(err?.message || (isHi ? 'सर्वर त्रुटि। कृपया पुनः प्रयास करें।' : 'Server error. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] via-purple-50/40 to-[#FAF7F2] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={onBackToWelcome}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHi ? 'मुख्य पृष्ठ पर वापस' : 'Back to Welcome'}</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6 relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 p-1 mx-auto flex items-center justify-center shadow-xs">
              <img
                src="/mumora-logo.png"
                alt="Mumora"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isHi ? 'खाते में लॉगिन करें' : 'Login to Mumora'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHi
                ? 'अपने सुरक्षित व्यक्तिगत स्वास्थ्य रिकॉर्ड तक पहुँचें'
                : 'Access your private maternal & child health records'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email or Phone Input */}
            <div>
              <label className="font-extrabold text-slate-700 block mb-1.5">
                {isHi ? 'ईमेल पता या मोबाइल नंबर *' : 'Email Address or Mobile Number *'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder={isHi ? 'उदा. ananya@example.in या 9876543210' : 'e.g. ananya@example.in or +91 98765 43210'}
                  className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all text-xs"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {identifier.includes('@') ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <Smartphone className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-extrabold text-slate-700">
                  {isHi ? 'पासवर्ड *' : 'Password *'}
                </label>
                <button
                  type="button"
                  onClick={onOpenForgotPassword}
                  className="text-[11px] text-purple-700 hover:text-purple-900 font-bold hover:underline"
                >
                  {isHi ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all text-xs"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-900/10 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isHi ? 'डैशबोर्ड में प्रवेश करें' : 'Login to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Link to Signup */}
          <div className="pt-2 text-center text-xs text-slate-500">
            <span>{isHi ? 'नया खाता बनाना चाहते हैं? ' : "Don't have an account yet? "}</span>
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="font-extrabold text-purple-700 hover:text-purple-900 hover:underline"
            >
              {isHi ? 'नया खाता बनाएं' : 'Create New Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
