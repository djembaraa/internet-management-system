import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff, X, ShieldCheck, Phone, SendHorizonal } from "lucide-react";

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Register modal state
  const [showRegister, setShowRegister] = useState(false);
  const [regFullname, setRegFullname] = useState("");
  const [regWhatsapp, setRegWhatsapp] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regAlamat, setRegAlamat] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirmPw, setShowRegConfirmPw] = useState(false);

  // Register error
  const [regError, setRegError] = useState("");

  // Forgot password state
  const [showForgotPw, setShowForgotPw] = useState(false);
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSubmitted(true);
  };

  const handleForgotClose = () => {
    setShowForgotPw(false);
    setForgotPhone("");
    setForgotSubmitted(false);
  };

  // OTP state
  const [showOtp, setShowOtp] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleRegisterNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setRegError("Password dan konfirmasi password tidak cocok!");
      return;
    }
    setRegError("");
    setError("");
    
    try {
      const { supabase } = await import("../../../services/supabase");
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: {
          data: {
            full_name: regFullname,
            username: regUsername,
            phone: regWhatsapp,
            address: regAlamat,
          },
        },
      });

      if (signUpError) throw signUpError;
      
      // Jika berhasil, pendaftaran sukses
      setRegError("Pendaftaran sukses! Silakan login (abaikan error merah ini, ini notif sukses sementara).");
      setTimeout(() => {
        setShowRegister(false);
        setUsername(regEmail);
        setPassword(regPassword);
      }, 3000);
      
    } catch (err: any) {
      setRegError(err.message || "Pendaftaran gagal");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otpValues];
    next[index] = value;
    setOtpValues(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtpValues(next);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleOtpVerify = () => {
    // Handle OTP verification here — send to API in production
    const code = otpValues.join("");
    void code; // placeholder until API integration
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { supabase } = await import("../../../services/supabase");
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (authError) throw authError;

      if (data.user) {
        // Cek role asli dari tabel profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        const actualRole = profile?.role || data.user.user_metadata?.role || "client";

        // Validasi apakah tab yang dipilih sesuai dengan role asli
        if (isAdmin && actualRole === "client") {
          await supabase.auth.signOut();
          throw new Error("Akses ditolak: Akun ini adalah Klien. Silakan gunakan tab 'Client Login'.");
        }
        
        if (!isAdmin && (actualRole === "admin" || actualRole === "root")) {
          await supabase.auth.signOut();
          throw new Error("Akses ditolak: Akun ini adalah Admin. Silakan gunakan tab 'Admin Login'.");
        }

        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/dj-logo.jpg"
            alt="DJ IMS Logo"
            className="mx-auto h-16 w-auto object-contain"
          />
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-800 p-8">
          {/* Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsAdmin(true)}
              className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all ${isAdmin
                ? "bg-white dark:bg-slate-700 text-[#155b96] shadow-sm"
                : "text-slate-500 dark:text-slate-100 hover:text-slate-600"
                }`}
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => setIsAdmin(false)}
              className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all ${!isAdmin
                ? "bg-white dark:bg-slate-700 text-[#155b96] shadow-sm"
                : "text-slate-500 dark:text-slate-100 hover:text-slate-600"
                }`}
            >
              Client Login
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/40 text-red-600 dark:text-red-400 text-[13px] font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-100 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan email"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 text-sm outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-100 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 text-sm outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-[#155b96] focus:ring-[#155b96]"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-[13px] text-slate-500 dark:text-slate-100"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPw(true)}
                className="text-[13px] text-[#155b96] dark:text-blue-400 font-medium hover:underline transition-colors"
              >
                Lupa Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-[#155b96] hover:bg-[#0e4a7a] text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
            >
              {isAdmin ? "Sign In as Admin" : "Sign In as Client"}
            </button>

            {isAdmin && (
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-[12px] text-slate-400 dark:text-slate-100 shrink-0">atau</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>
            )}
            {isAdmin && (
              <div className="text-center">
                <p className="text-[13px] text-slate-500 dark:text-slate-100 mb-2">
                  Ingin mendaftarkan client baru?{" "}
                  <span className="text-[#155b96] dark:text-blue-400 font-semibold">
                    Daftar Client
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="w-full py-2.5 border-2 border-[#155b96] text-[#155b96] dark:text-blue-400 dark:border-blue-400 rounded-xl text-sm font-semibold hover:bg-[#155b96]/5 dark:hover:bg-blue-400/10 transition-all active:scale-[0.98]"
                >
                  Daftar Client Baru
                </button>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
          © 2026 DJ Internet Management System
        </p>
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                Daftar Akun Client
              </h2>
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleRegisterNext} className="p-6">
              {regError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/40 text-red-600 dark:text-red-400 text-[13px] font-medium">
                  {regError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* Fullname */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-100 mb-1.5">
                    Fullname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={regFullname}
                    onChange={(e) => setRegFullname(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 text-sm outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Nomor Whatsapp */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-100 mb-1.5">
                    Nomor Whatsapp
                  </label>
                  <input
                    type="text"
                    value={regWhatsapp}
                    onChange={(e) => setRegWhatsapp(e.target.value)}
                    placeholder="(62) ___-____-____"
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 text-sm outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-100 mb-1.5">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="johndoe"
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 text-sm outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-100 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="someemail@email.com"
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 text-sm outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-100 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPw ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Your password"
                      required
                      className="w-full px-3 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 text-sm outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPw(!showRegPw)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showRegPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="row-span-2">
                  <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-100 mb-1.5">
                    Alamat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={regAlamat}
                    onChange={(e) => setRegAlamat(e.target.value)}
                    required
                    rows={5}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 text-sm outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-100 mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegConfirmPw ? "text" : "password"}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Your password"
                      required
                      className="w-full px-3 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 text-sm outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPw(!showRegConfirmPw)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showRegConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#155b96] hover:bg-[#0e4a7a] text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Phone size={17} className="text-[#155b96]" />
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  Lupa Password
                </h2>
              </div>
              <button
                type="button"
                onClick={handleForgotClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {!forgotSubmitted ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-[13px] text-slate-500 dark:text-slate-100 leading-relaxed">
                    Masukkan nomor WhatsApp yang terdaftar. Kami akan mengirimkan instruksi reset password.
                  </p>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-100 mb-1.5">
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone size={15} />
                      </div>
                      <input
                        type="tel"
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value)}
                        placeholder="62812xxxxxxxx"
                        required
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 text-sm outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleForgotClose}
                      className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-100 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#155b96] hover:bg-[#0e4a7a] text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <SendHorizonal size={15} />
                      Kirim
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto">
                    <SendHorizonal size={26} className="text-emerald-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                    Instruksi telah dikirim!
                  </p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-100 leading-relaxed">
                    Silakan cek WhatsApp Anda di nomor{" "}
                    <span className="font-semibold text-[#155b96] dark:text-blue-400">{forgotPhone}</span>
                    {" "}untuk instruksi reset password.
                  </p>
                  <button
                    type="button"
                    onClick={handleForgotClose}
                    className="mt-2 w-full py-2.5 bg-[#155b96] hover:bg-[#0e4a7a] text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#155b96]" />
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  Verifikasi OTP
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowOtp(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <p className="text-sm text-slate-500 dark:text-slate-100 text-center mb-1">
                Kode OTP telah dikirim ke email
              </p>
              <p className="text-sm font-semibold text-[#155b96] dark:text-blue-400 text-center mb-6 truncate">
                {regEmail || "alamat email Anda"}
              </p>

              {/* 6-digit OTP inputs */}
              <div className="flex justify-center gap-3 mb-6">
                {otpValues.map((val, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={handleOtpPaste}
                    className="w-11 h-12 text-center text-lg font-bold border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/20 transition-all"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleOtpVerify}
                disabled={otpValues.some((v) => v === "")}
                className="w-full py-2.5 bg-[#155b96] hover:bg-[#0e4a7a] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
              >
                Verifikasi
              </button>

              <div className="mt-4 text-center">
                <span className="text-[13px] text-slate-500 dark:text-slate-100">
                  Tidak menerima kode?{" "}
                </span>
                <button
                  type="button"
                  className="text-[13px] text-[#155b96] dark:text-blue-400 font-semibold hover:underline"
                >
                  Kirim ulang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
