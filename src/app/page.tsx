'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Home() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#2d1b4e]">
      <main className="flex w-full max-w-6xl flex-col items-center justify-center py-16 px-8 text-white">
        <div className="text-center space-y-8">
          <div className="mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] bg-clip-text text-transparent mb-4">
              ⚡ PLC Master
            </h1>
            <p className="text-xl text-white/60">
              Industrial Automation Control System
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-semibold text-white">
              Welcome to Your Dashboard
            </h2>
            <p className="text-lg text-white/70">
              Manage your industrial automation systems with precision and ease.
              Monitor, control, and optimize your PLC operations from one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-[#00ffc8]/20 rounded-2xl p-6 hover:border-[#00ffc8]/50 transition-all hover:scale-105">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Real-Time Monitoring</h3>
              <p className="text-white/60 text-sm">
                Track system performance and status in real-time
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-[#00ffc8]/20 rounded-2xl p-6 hover:border-[#00ffc8]/50 transition-all hover:scale-105">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Smart Control</h3>
              <p className="text-white/60 text-sm">
                Automated control systems with AI optimization
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-[#00ffc8]/20 rounded-2xl p-6 hover:border-[#00ffc8]/50 transition-all hover:scale-105">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Secure Access</h3>
              <p className="text-white/60 text-sm">
                Enterprise-grade security for your operations
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] rounded-xl text-[#0a0e27] font-bold text-lg hover:shadow-[0_10px_30px_rgba(0,255,200,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Go to Dashboard
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/login');
              }}
              className="px-8 py-4 border border-white/20 bg-white/5 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}