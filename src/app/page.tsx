'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const generateParticleStyles = (count: number) => {
  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return Array.from({ length: count }, (_, i) => {
    const left = pseudoRandom(i + 1) * 100;
    const delay = pseudoRandom(i + 2) * 15;
    const duration = 10 + pseudoRandom(i + 3) * 10;

    return {
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    };
  });
};

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({ students: 0, tutorials: 0, success: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const particleStyles = useMemo(() => generateParticleStyles(50), []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate stats counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
          animateStats();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsAnimated]);

  const animateStats = () => {
    const targets = { students: 500, tutorials: 50, success: 98 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let current = { students: 0, tutorials: 0, success: 0 };
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;

      current = {
        students: Math.floor(targets.students * progress),
        tutorials: Math.floor(targets.tutorials * progress),
        success: Math.floor(targets.success * progress),
      };

      setStats(current);

      if (step >= steps) {
        setStats(targets);
        clearInterval(interval);
      }
    }, stepDuration);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const emailInput = formElement.elements.namedItem('email') as HTMLInputElement;
    alert(`Thank you for subscribing with ${emailInput.value}! You'll receive updates soon.`);
    formElement.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#2d1b4e] text-white overflow-x-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {particleStyles.map((style, i) => (
          <div
            key={i}
            className="absolute w-[3px] h-[3px] bg-cyan-400/50 rounded-full animate-float"
            style={style}
          />
        ))}
      </div>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-[5%] transition-all duration-300 border-b-2 border-cyan-400/30 backdrop-blur-lg ${
          scrolled ? 'py-4 bg-[#0a0e27]/95' : 'py-6 bg-[#0a0e27]/90'
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            ⚡ PLC Master
          </div>
          <nav className="flex gap-8">
            {['home', 'courses', 'tutorials', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="relative text-white font-medium hover:text-cyan-400 transition-colors group"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <span className="absolute bottom-[-5px] left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative z-10 min-h-screen flex items-center justify-center text-center px-[5%] pt-32 pb-16">
        <div className="space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
            Master PLC Programming
          </h1>
          <p className="text-2xl text-cyan-400 mb-4">
            Learn Siemens TIA Portal from Industry Experts
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Transform your engineering career with comprehensive tutorials, hands-on projects, and real-world applications
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => router.push('/login')}
              className="px-10 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-full font-semibold hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,255,200,0.4)] transition-all duration-300"
            >
              Login
            </button>
          </div>

          <div ref={statsRef} className="flex flex-col sm:flex-row gap-12 justify-center mt-12">
            {[
              { value: stats.students, label: 'Students' },
              { value: stats.tutorials, label: 'Tutorials' },
              { value: stats.success, label: '% Success Rate' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="text-white/70 text-sm mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="courses" className="relative z-10 py-20 px-[5%]">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          What You'll Learn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: '🔧', title: 'TIA Portal Basics', desc: 'Master the fundamentals of Siemens TIA Portal including project setup, hardware configuration, and navigation' },
            { icon: '💻', title: 'Ladder Logic', desc: 'Learn ladder logic programming, timers, counters, and boolean operations for industrial automation' },
            { icon: '📌', title: 'HMI Design', desc: 'Create professional human-machine interfaces with advanced visualization and user interaction' },
            { icon: '📊', title: 'SCADA Systems', desc: 'Build supervisory control and data acquisition systems for process monitoring and control' },
            { icon: '🛠️', title: 'Troubleshooting', desc: 'Develop diagnostic skills to identify and resolve common PLC programming issues efficiently' },
            { icon: '🚀', title: 'Real Projects', desc: 'Work on industry-standard projects including conveyor systems, packaging lines, and more' },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white/5 p-8 rounded-3xl border border-cyan-400/20 backdrop-blur-lg hover:scale-105 hover:border-cyan-400/50 hover:shadow-[0_20px_40px_rgba(0,255,200,0.2)] transition-all duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-cyan-400 mb-4">{feature.title}</h3>
              <p className="text-white/70">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tutorials Section */}
      <section id="tutorials" className="relative z-10 py-20 px-[5%]">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Popular Tutorials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { badge: 'Beginner', badgeColor: 'bg-cyan-400', title: 'Getting Started with TIA Portal V18', desc: 'Complete introduction to TIA Portal installation, licensing, and first project setup', time: '45 min', students: '320' },
            { badge: 'Intermediate', badgeColor: 'bg-blue-500', title: 'Advanced Function Blocks', desc: 'Deep dive into creating reusable function blocks and structured programming techniques', time: '90 min', students: '180' },
            { badge: 'Advanced', badgeColor: 'bg-purple-500', title: 'Industrial Communication Protocols', desc: 'Master PROFINET, PROFIBUS, and industrial Ethernet communication setup', time: '120 min', students: '95' },
          ].map((tutorial, i) => (
            <div
              key={i}
              className="relative bg-white/5 p-8 rounded-3xl border border-cyan-400/20 hover:scale-105 hover:border-cyan-400/50 transition-all duration-300"
            >
              <span className={`absolute top-4 right-4 ${tutorial.badgeColor} text-[#0a0e27] px-4 py-1 rounded-full text-sm font-bold`}>
                {tutorial.badge}
              </span>
              <h3 className="text-xl font-semibold mb-4 mt-2">{tutorial.title}</h3>
              <p className="text-white/70 mb-6">{tutorial.desc}</p>
              <div className="flex gap-6 text-white/60 text-sm mb-6">
                <span>⏱️ {tutorial.time}</span>
                <span>👥 {tutorial.students} students</span>
              </div>
              <button
                onClick={() => alert(`Starting tutorial: ${tutorial.title}\n\nThis would launch the tutorial in a full implementation.`)}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-xl font-semibold hover:scale-105 hover:shadow-[0_5px_20px_rgba(0,255,200,0.4)] transition-all duration-300"
              >
                Start Tutorial
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-[5%]">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Get in Touch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h3 className="text-3xl font-semibold text-cyan-400 mb-4">Have Questions?</h3>
            <p className="text-white/70 mb-8">
              I'm here to help you on your PLC programming journey. Feel free to reach out!
            </p>
            <div className="space-y-4 text-white/80">
              <p>📧 contact@plcmaster.com</p>
              <p>📱 +254 XXX XXX XXX</p>
              <p>📍 Chuka, Kenya</p>
            </div>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 bg-white/5 border border-cyan-400/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-400 focus:bg-white/8 transition-all"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 bg-white/5 border border-cyan-400/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-400 focus:bg-white/8 transition-all"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full p-4 bg-white/5 border border-cyan-400/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-400 focus:bg-white/8 transition-all"
            />
            <button
              onClick={(e) => {
                alert("Thank you for your message! We'll get back to you soon.");
              }}
              className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-xl font-semibold hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,255,200,0.4)] transition-all duration-300"
            >
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0a0e27]/95 border-t-2 border-cyan-400/30 py-16 px-[5%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 max-w-7xl mx-auto mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              ⚡ PLC Master
            </h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Empowering the next generation of automation engineers with cutting-edge PLC programming education.
            </p>
            <div className="flex gap-4">
              {['📘', '🐦', '💼', '📺'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center bg-cyan-400/10 border border-cyan-400/30 rounded-full hover:bg-cyan-400/20 hover:border-cyan-400 hover:scale-110 hover:shadow-[0_5px_20px_rgba(0,255,200,0.3)] transition-all duration-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-cyan-400 font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Courses', 'Tutorials', 'Contact'].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollToSection(link.toLowerCase())}
                    className="text-white/70 hover:text-cyan-400 hover:pl-2 transition-all"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-cyan-400 font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {['Documentation', 'Community Forum', 'Video Library', 'Download Materials'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/70 hover:text-cyan-400 hover:pl-2 transition-all">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-cyan-400 font-semibold mb-6">Newsletter</h4>
            <p className="text-white/70 text-sm mb-4">
              Stay updated with the latest tutorials and industry insights.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                name="email"
                id="newsletter-email"
                placeholder="Enter your email"
                className="w-full p-3 bg-white/5 border border-cyan-400/30 rounded-lg text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/8 transition-all"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('newsletter-email') as HTMLInputElement;
                  if (input && input.value) {
                    alert(`Thank you for subscribing with ${input.value}! You'll receive updates soon.`);
                    input.value = '';
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-lg font-semibold text-sm hover:scale-105 hover:shadow-[0_5px_20px_rgba(0,255,200,0.4)] transition-all duration-300"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-cyan-400/20 text-white/60 space-y-2">
          <p>&copy; 2025 PLC Master. All rights reserved. | Designed with ❤️ for Engineers</p>
          <p className="text-white/50 text-sm">🌍 Based in Chuka, Kenya | Serving Engineers Worldwide</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0; 
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translateY(-100vh) translateX(100px); 
            opacity: 0; 
          }
        }
        .animate-float {
          animation: float 15s infinite;
        }
      `}</style>
    </div>
  );
}