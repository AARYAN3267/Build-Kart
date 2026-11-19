import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Truck, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Clock, 
  Sparkles, 
  HardHat, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    if (!userId.trim() || !password.trim()) {
      setErrorMessage('Please enter both User ID and Password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(userId, password);
    setIsSubmitting(false);

    if (res.success) {
      if (res.user.role === 'vendor') {
        navigate('/vendor');
      } else if (res.user.role === 'client') {
        navigate('/client');
      }
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Please verify your demo credentials.');
    }
  };

  const fillDemoVendor = () => {
    setUserId('3267');
    setPassword('0000');
    setErrorMessage('');
  };

  const fillDemoClient = () => {
    setUserId('1004');
    setPassword('1234');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F5F7FA] text-[#102A43]">
      {/* Left Column: Visual Construction & Logistics Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#102A43] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <HardHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight">BuildKart</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous Construction Commerce</p>
          </div>
        </div>

        {/* Value Proposition & Visual Elements */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-emerald-400 text-sm font-medium mb-6">
            <Clock className="w-4 h-4 text-emerald-400" /> Guaranteed 24-Hour Jobsite Delivery in Bhopal
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight text-white mb-6">
            Your Construction Needs.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Local Vendors.
            </span><br />
            Delivered Faster.
          </h1>

          <p className="text-slate-300 text-base leading-relaxed max-w-lg mb-8">
            BuildKart AI connects project contractors, builders, and homeowners with Bhopal's premier local hardware, cement, steel, and electrical suppliers with autonomous failover protection.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Autonomous Recovery</h4>
              <p className="text-xs text-slate-400">Joule AI auto-detects vendor shortages and re-routes orders in seconds.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Heavy Logistics Dispatch</h4>
              <p className="text-xs text-slate-400">Real-time matching with 2-wheelers up to 12-tonne heavy haulers.</p>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 text-xs text-slate-400 border-t border-slate-800 pt-6 flex justify-between items-center">
          <span>Enterprise Architecture Ready: SAP BTP & Joule</span>
          <span>Bhopal, MP Network</span>
        </div>
      </div>

      {/* Right Column: Clean, Polished Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-[#102A43]">BuildKart AI</span>
              <p className="text-xs text-slate-500">Local Construction Network</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">Sign In</h2>
            <p className="text-sm text-slate-500 mt-1">Access your BuildKart AI portal</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID (e.g. 3267 or 1004)"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm text-[#102A43] transition placeholder:text-slate-400"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm text-[#102A43] pr-11 transition placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 bg-[#102A43] hover:bg-[#1E3A5F] active:bg-[#0A1929] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>LOGIN</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Section (Clearly Labelled) */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Demo Access Credentials
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                Auto-Role Detection
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Vendor Card */}
              <div 
                onClick={fillDemoVendor}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/80 hover:border-blue-300 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between font-bold text-slate-800 group-hover:text-blue-700 mb-1">
                  <span>Vendor Portal</span>
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-slate-600 font-mono text-[11px] leading-tight">
                  ID: <span className="font-bold text-[#102A43]">3267</span><br />
                  Pass: <span className="font-bold text-[#102A43]">0000</span>
                </div>
                <div className="mt-2 text-[10px] text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
                  Click to Auto-fill &rarr;
                </div>
              </div>

              {/* Client Card */}
              <div 
                onClick={fillDemoClient}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50/80 hover:border-emerald-300 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between font-bold text-slate-800 group-hover:text-emerald-700 mb-1">
                  <span>Client Marketplace</span>
                  <HardHat className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-slate-600 font-mono text-[11px] leading-tight">
                  ID: <span className="font-bold text-[#102A43]">1004</span><br />
                  Pass: <span className="font-bold text-[#102A43]">1234</span>
                </div>
                <div className="mt-2 text-[10px] text-emerald-600 font-semibold group-hover:underline flex items-center gap-1">
                  Click to Auto-fill &rarr;
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-4">
              Demo sessions are simulated locally using browser state & localStorage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
