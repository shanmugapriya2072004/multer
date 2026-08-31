import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  ShieldAlert, 
  Activity, 
  FolderLock, 
  Sparkles 
} from 'lucide-react';

const slides = [
  {
    icon: ShieldAlert,
    tag: "Instant SOS",
    title: "Emergency Network",
    desc: "Store critical emergency contact details accessible instantly for immediate response."
  },
  {
    icon: FolderLock,
    tag: "Zero-Knowledge",
    title: "Private Medical Files",
    desc: "Your records are encrypted and accessible only by you and certified medical authorities."
  },
  {
    icon: Activity,
    tag: "All-in-One",
    title: "Unified Health Portal",
    desc: "Combine prescriptions, appointment slots, and medicine alerts in one clean interface."
  }
];

export default function Register() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    emergencyContact: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const SlideIcon = slides[activeSlide].icon;

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl rounded-3xl bg-white border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left: Animated Slideshow */}
        <div className="lg:col-span-6 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-50 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
          <div>
            <div className="flex items-center gap-2.5 mb-12">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-black tracking-wider text-base text-slate-900">
                MEDI<span className="text-blue-600">VAULT</span>
              </span>
            </div>

            <div key={activeSlide} className="transition-all duration-500 ease-in-out">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100/80 text-blue-700 border border-blue-200 mb-4">
                <Sparkles className="w-3.5 h-3.5" /> {slides[activeSlide].tag}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                <SlideIcon className="w-7 h-7" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                {slides[activeSlide].title}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm">
                {slides[activeSlide].desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-8">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === idx ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Clean White Registration Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm w-full mx-auto space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h3>
              <p className="text-xs text-slate-500 mt-1">Get started with your free secure medical vault</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    required
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency No</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    placeholder="Emergency"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : (
                  <>
                    Create Vault Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">
                Already registered?{' '}
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  Sign In
                </Link>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}