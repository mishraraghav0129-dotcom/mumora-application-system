import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { requestOtpVerification, verifyOtpCode, resetUserPassword } from '../../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordResetSuccess: () => void;
  isHi?: boolean;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onPasswordResetSuccess,
  isHi = false,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [testOtpNotice, setTestOtpNotice] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier.trim()) {
      setErrorMsg(isHi ? 'कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें' : 'Please enter your registered email or phone');
      return;
    }
    const res = requestOtpVerification(identifier.trim());
    setTestOtpNotice(res.message);
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otp.trim()) {
      setErrorMsg(isHi ? 'कृपया 6-अंकीय ओटीपी दर्ज करें' : 'Please enter the 6-digit verification code');
      return;
    }
    const isValid = verifyOtpCode(identifier.trim(), otp.trim());
    if (!isValid) {
      setErrorMsg(isHi ? 'गलत या समाप्त हो चुका ओटीपी कोड' : 'Invalid or expired OTP code. Use test code 123456.');
      return;
    }
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.length < 8) {
      setErrorMsg(isHi ? 'पासवर्ड में कम से कम 8 अक्षर होने चाहिए' : 'Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg(isHi ? 'दोनों पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
      return;
    }

    const res = await resetUserPassword(identifier.trim(), newPassword);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onPasswordResetSuccess();
        onClose();
      }, 1800);
    } else {
      setErrorMsg(res.error || 'Failed to update password');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between pb-2 border-b border-purple-100">
          <div className="flex items-center gap-2 text-purple-900 font-extrabold text-base">
            <KeyRound className="w-5 h-5 text-purple-700" />
            <span>{isHi ? 'पासवर्ड रीसेट करें' : 'Reset Password'}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-slate-900 text-base">
              {isHi ? 'पासवर्ड सफलतापूर्वक बदल दिया गया!' : 'Password Reset Successfully!'}
            </h4>
            <p className="text-xs text-slate-500">
              {isHi ? 'अब आप अपने नए पासवर्ड से लॉगिन कर सकते हैं।' : 'Redirecting to login with your new credentials...'}
            </p>
          </div>
        ) : (
          <>
            {/* Step 1: Identifier Input */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                <p className="text-slate-600">
                  {isHi
                    ? 'अपना पंजीकृत ईमेल या मोबाइल नंबर दर्ज करें। हम आपको एक सत्यापन कोड भेजेंगे।'
                    : 'Enter your registered email address or mobile number. We will send a secure verification code.'}
                </p>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isHi ? 'ईमेल या मोबाइल नंबर *' : 'Email or Mobile Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="e.g. ananya@example.in or 9876543210"
                    className="w-full px-3 py-2.5 border rounded-xl text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-purple-800"
                >
                  <span>{isHi ? 'ओटीपी कोड भेजें' : 'Send Verification Code'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                {testOtpNotice && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                    {testOtpNotice}
                  </div>
                )}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isHi ? '6-अंकीय ओटीपी कोड दर्ज करें *' : 'Enter 6-Digit OTP *'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2.5 border rounded-xl text-center text-lg font-mono tracking-widest font-bold"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2 border rounded-xl font-bold text-slate-600"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-purple-700 text-white rounded-xl font-bold hover:bg-purple-800"
                  >
                    Verify Code
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isHi ? 'नया पासवर्ड (कम से कम 8 अक्षर) *' : 'New Password (min 8 chars) *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3 pr-10 py-2.5 border rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isHi ? 'नए पासवर्ड की पुष्टि करें *' : 'Confirm New Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Save New Password
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
