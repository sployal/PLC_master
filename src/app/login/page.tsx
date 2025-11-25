'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ width: '0%', color: '#ff4444', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '', remember: false });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  useEffect(() => {
    // Create particles
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
      }
    }

    // Check existing session
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      showToast('Already logged in! Redirecting...', 'success');
      setTimeout(() => router.push('/'), 1500);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20;
    if (/\d/.test(password)) score += 15;
    if (/[^a-zA-Z\d]/.test(password)) score += 15;

    if (score < 40) {
      return { width: '33%', color: '#ff4444', message: 'Weak password' };
    } else if (score < 70) {
      return { width: '66%', color: '#ffaa00', message: 'Medium strength' };
    } else {
      return { width: '100%', color: '#00ffc8', message: 'Strong password!' };
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });

      if (error) throw error;

      showToast('Login successful! Redirecting...', 'success');
      setTimeout(() => router.push('/'), 1500);
    } catch (error: any) {
      showToast(error.message || 'Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    if (!signupData.terms) {
      showToast('Please accept the terms and conditions', 'error');
      return;
    }

    if (signupData.password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.name,
          }
        }
      });

      if (error) throw error;

      showToast('Account created! Please check your email to verify.', 'success');
      setTimeout(() => {
        setIsSignup(false);
        setLoginData({ ...loginData, email: signupData.email });
      }, 2000);
    } catch (error: any) {
      showToast(error.message || 'Signup failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      showToast(`${provider} login failed: ${error.message}`, 'error');
    }
  };

  const handlePasswordReset = async () => {
    if (!loginData.email) {
      showToast('Please enter your email address first', 'error');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(loginData.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      showToast('Password reset email sent! Check your inbox.', 'success');
    } catch (error: any) {
      showToast('Failed to send reset email: ' + error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#2d1b4e] text-white overflow-x-hidden relative">
      {/* Animated Background Particles */}
      <div id="particles" className="fixed top-0 left-0 w-full h-full z-[1] pointer-events-none" />

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-[480px] p-8">
        <div className="relative bg-[#0a0e27]/85 backdrop-blur-[20px] border border-[#00ffc8]/30 rounded-[30px] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(0,255,200,0.1)] overflow-hidden animate-slideIn">
          {/* Logo Section */}
          <div className="text-center mb-10">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] bg-clip-text text-transparent mb-2 animate-glow">
              ⚡ PLC Master
            </div>
            <p className="text-white/60 text-sm">Welcome Back, Engineer</p>
          </div>

          {/* Toggle Buttons */}
          <div className="relative flex bg-white/5 rounded-2xl p-1.5 mb-8">
            <button
              type="button"
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-colors z-10 relative ${
                !isSignup ? 'text-[#0a0e27]' : 'text-white/60'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-colors z-10 relative ${
                isSignup ? 'text-[#0a0e27]' : 'text-white/60'
              }`}
            >
              Sign Up
            </button>
            <div
              className={`absolute top-1.5 left-1.5 w-[calc(50%-0.375rem)] h-[calc(100%-0.75rem)] bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-xl transition-transform duration-300 ${
                isSignup ? 'translate-x-full' : ''
              }`}
            />
          </div>

          {/* Login Form */}
          {!isSignup && (
            <form onSubmit={handleLogin} className="animate-fadeIn">
              <div className="mb-6">
                <label className="block mb-2 text-white/80 text-sm font-medium">Email Address</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-xl opacity-60 pointer-events-none z-10">📧</span>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="engineer@example.com"
                    required
                    className="w-full py-4 pl-12 pr-4 bg-white/5 border border-[#00ffc8]/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00ffc8] focus:bg-white/8 focus:shadow-[0_0_20px_rgba(0,255,200,0.1)] transition-all"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-white/80 text-sm font-medium">Password</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-xl opacity-60 pointer-events-none z-10">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                    className="w-full py-4 pl-12 pr-14 bg-white/5 border border-[#00ffc8]/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00ffc8] focus:bg-white/8 focus:shadow-[0_0_20px_rgba(0,255,200,0.1)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-xl opacity-60 hover:opacity-100 transition-opacity z-10 p-2"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 text-sm">
                <label className="flex items-center cursor-pointer text-white/70">
                  <input
                    type="checkbox"
                    checked={loginData.remember}
                    onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })}
                    className="mr-2 cursor-pointer w-4 h-4"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-[#00ffc8] hover:text-[#00a8ff] hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-xl text-[#0a0e27] font-bold text-base hover:shadow-[0_10px_30px_rgba(0,255,200,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span className={isLoading ? 'opacity-0' : ''}>Sign In</span>
                {isLoading && (
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 border-3 border-[#0a0e27]/30 border-t-[#0a0e27] rounded-full animate-spin" />
                )}
              </button>

              <div className="flex items-center my-8 text-white/40 text-sm">
                <div className="flex-1 h-px bg-white/10" />
                <span className="px-4">or continue with</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="flex-1 py-3.5 border border-white/20 bg-white/5 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-white/40 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,255,200,0.2)] active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">🔍</span>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  className="flex-1 py-3.5 border border-white/20 bg-white/5 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-white/40 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,255,200,0.2)] active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">💻</span>
                  GitHub
                </button>
              </div>
            </form>
          )}

          {/* Signup Form */}
          {isSignup && (
            <form onSubmit={handleSignup} className="animate-fadeIn">
              <div className="mb-6">
                <label className="block mb-2 text-white/80 text-sm font-medium">Full Name</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-xl opacity-60 pointer-events-none z-10">👤</span>
                  <input
                    type="text"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="w-full py-4 pl-12 pr-4 bg-white/5 border border-[#00ffc8]/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00ffc8] focus:bg-white/8 focus:shadow-[0_0_20px_rgba(0,255,200,0.1)] transition-all"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-white/80 text-sm font-medium">Email Address</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-xl opacity-60 pointer-events-none z-10">📧</span>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="engineer@example.com"
                    required
                    className="w-full py-4 pl-12 pr-4 bg-white/5 border border-[#00ffc8]/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00ffc8] focus:bg-white/8 focus:shadow-[0_0_20px_rgba(0,255,200,0.1)] transition-all"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-white/80 text-sm font-medium">Password</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-xl opacity-60 pointer-events-none z-10">🔒</span>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    value={signupData.password}
                    onChange={(e) => {
                      setSignupData({ ...signupData, password: e.target.value });
                      setPasswordStrength(calculatePasswordStrength(e.target.value));
                    }}
                    placeholder="Create a strong password"
                    required
                    className="w-full py-4 pl-12 pr-14 bg-white/5 border border-[#00ffc8]/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00ffc8] focus:bg-white/8 focus:shadow-[0_0_20px_rgba(0,255,200,0.1)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-4 text-xl opacity-60 hover:opacity-100 transition-opacity z-10 p-2"
                  >
                    {showSignupPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{ width: passwordStrength.width, background: passwordStrength.color }}
                  />
                </div>
                <span className="block text-xs mt-2 transition-colors" style={{ color: passwordStrength.color }}>
                  {passwordStrength.message || 'Use 8+ characters with mix of letters, numbers & symbols'}
                </span>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-white/80 text-sm font-medium">Confirm Password</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-xl opacity-60 pointer-events-none z-10">🔒</span>
                  <input
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    placeholder="Re-enter your password"
                    required
                    className="w-full py-4 pl-12 pr-4 bg-white/5 border border-[#00ffc8]/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00ffc8] focus:bg-white/8 focus:shadow-[0_0_20px_rgba(0,255,200,0.1)] transition-all"
                  />
                </div>
              </div>

              <label className="flex items-start mb-6 text-xs text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={signupData.terms}
                  onChange={(e) => setSignupData({ ...signupData, terms: e.target.checked })}
                  required
                  className="mr-2 mt-0.5 cursor-pointer w-4 h-4 flex-shrink-0"
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="text-[#00ffc8] hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#00ffc8] hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-xl text-[#0a0e27] font-bold text-base hover:shadow-[0_10px_30px_rgba(0,255,200,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span className={isLoading ? 'opacity-0' : ''}>Create Account</span>
                {isLoading && (
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 border-3 border-[#0a0e27]/30 border-t-[#0a0e27] rounded-full animate-spin" />
                )}
              </button>

              <div className="flex items-center my-8 text-white/40 text-sm">
                <div className="flex-1 h-px bg-white/10" />
                <span className="px-4">or sign up with</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="flex-1 py-3.5 border border-white/20 bg-white/5 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-white/40 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,255,200,0.2)] active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">🔍</span>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  className="flex-1 py-3.5 border border-white/20 bg-white/5 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-white/40 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,255,200,0.2)] active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">💻</span>
                  GitHub
                </button>
              </div>
            </form>
          )}

          {/* Back to Home Link */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-white/60 hover:text-[#00ffc8] text-sm transition-colors inline-block"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Decorative Circles */}
          <div className="absolute w-[300px] h-[300px] -top-[150px] -right-[150px] rounded-full bg-[radial-gradient(circle,_rgba(0,255,200,0.1),_transparent)] pointer-events-none -z-10 animate-float-circle" />
          <div className="absolute w-[200px] h-[200px] -bottom-[100px] -left-[100px] rounded-full bg-[radial-gradient(circle,_rgba(0,255,200,0.1),_transparent)] pointer-events-none -z-10 animate-float-circle-reverse" />
          <div className="absolute w-[150px] h-[150px] top-1/2 -right-[75px] rounded-full bg-[radial-gradient(circle,_rgba(0,255,200,0.1),_transparent)] pointer-events-none -z-10 animate-float-circle" />
        </div>
      </div>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-8 right-8 bg-[#0a0e27]/95 border rounded-xl p-4 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-[10px] min-w-[280px] transition-transform duration-300 z-[1000] ${
          toast.show ? 'translate-x-0' : 'translate-x-[400px]'
        } ${
          toast.type === 'success' ? 'border-[#00ffc8]/60' : 'border-[#ff4444]/60'
        }`}
      >
        <span className={`text-2xl flex-shrink-0 ${toast.type === 'success' ? 'text-[#00ffc8]' : 'text-[#ff4444]'}`}>
          {toast.type === 'success' ? '✅' : '❌'}
        </span>
        <span className="text-white text-sm leading-normal">{toast.message}</span>
      </div>
    </div>
  );
}