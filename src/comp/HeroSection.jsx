import React from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  Zap,
  Wifi,
  Share2,
  ChevronDown,
  ArrowRight,
  Play,
  Waves
} from 'lucide-react';
// import Button from '../../../components/ui/Button';

const HeroSection = ({ onGetStarted, onLearnMore }) => {
  return (
    <section className="relative min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center">
      {/* Background Decorative Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6">
            <Zap size={16} className="text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Next-Gen NFC Solutions</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
            Transform Your Business with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Waves NFC
            </span>
          </h1>

          <p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed">
            اجعل تواصلك أسرع وأذكى مع تقنيات Waves. شارك بياناتك، موقعك، أو ملفاتك بلمسة واحدة من خلال هوية رقمية مبتكرة.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button
              onClick={onLearnMore}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <Play size={20} /> Learn More
            </button>
          </div>
        </motion.div>

        {/* Right Side: Animated Visual */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">

            {/* Center Icon */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.3)] flex items-center justify-center z-20 rotate-12"
            >
              <Waves size={60} color="white" />
            </motion.div>

            {/* Orbiting Icons - Static positions to avoid any logic errors */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl">
              <Smartphone className="text-blue-400" size={24} />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl">
              <Wifi className="text-cyan-400" size={24} />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl">
              <Share2 className="text-purple-400" size={24} />
            </div>

            {/* Decorative Rings */}
            <div className="absolute inset-0 border border-white/5 rounded-full" />
            <div className="absolute inset-12 border border-white/5 rounded-full" />
          </div>
        </div>
      </div>

      {/* Scroll Down */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity }}>
          <ChevronDown size={20} />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;