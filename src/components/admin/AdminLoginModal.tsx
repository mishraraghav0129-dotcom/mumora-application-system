import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Mail,
  X,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminRole, DEFAULT_ADMINS } from '../../services/adminService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { adminLogin, language } = useApp();
  const isHi = language === 'hi';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('super_admin');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const result = adminLogin(selectedRole);
      if (result.success) {
        onLoginSuccess();
        onClose();
      } else {
        setErrorMsg('Invalid administrative credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authorization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRolePreset = (admin: (typeof DEFAULT_ADMINS)[0]) => {
    setEmail(admin.email);
    setPassword('••••••••••••');
    setSelectedRole(admin.role);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden border border-slate-200">
        {/* Top security banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-purple-600" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                {isHi ? 'प्रशासक पोर्टल लॉगिन' : 'Admin Portal Authorization'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Authorized clinical &amp; operational personnel only
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Role Presets for Quick Testing & Evaluation */}
        <div className="space-y-1.5 text-xs">
          <span className="font-extrabold text-slate-700 text-[11px] block">
            Select Role Authorization:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_ADMINS.map(admin => (
              <button
                key={admin.id}
                type="button"
                onClick={() => handleSelectRolePreset(admin)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedRole === admin.role
                    ? 'border-red-500 bg-red-50/70 text-red-950 font-bold shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px]'
                }`}
              >
                <span className="block truncate font-extrabold">{admin.name}</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                  {admin.role.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Admin Email / Username</label>
            <div className="relative">
              <input
                type="text"
                required
                value={email || 'admin@mumora.internal'}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border rounded-xl bg-slate-50/50 text-xs"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Security Key / Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password || 'SuperAdmin@Mumora2026'}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border rounded-xl bg-slate-50/50 text-xs"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl font-bold text-slate-600 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <span>Authorize &amp; Enter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
