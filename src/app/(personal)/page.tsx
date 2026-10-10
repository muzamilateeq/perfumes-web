"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code, Briefcase, Mail, Github, Linkedin, Twitter, Target } from "lucide-react";
import Link from "next/link";

export default function PersonalHomepage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            ENTREPRENEUR.
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-white/70">
            <Link href="#about" className="hover:text-white transition-colors">About</Link>
            <Link href="#businesses" className="hover:text-white transition-colors">Ventures</Link>
            <Link href="#portfolio" className="hover:text-white transition-colors">Portfolio</Link>
            <Link href="#contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <Link href="#contact" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all flex items-center gap-2">
            Let's Talk <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-purple-300 mb-8 inline-block backdrop-blur-md">
              Founder • Developer • Strategist
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
              Building Digital <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                Empires.
              </span>
            </h1>
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              I am an entrepreneur and full-stack developer focused on creating scalable, premium digital products and e-commerce brands. 
              Currently launching my first luxury fragrance venture.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/perfumes" className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform w-full sm:w-auto flex items-center justify-center gap-2">
                Explore Perfumes
              </Link>
              <Link href="#portfolio" className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 font-semibold transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                View Tech Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="about" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Target className="w-12 h-12 text-purple-500 mb-6" />
              <h2 className="text-4xl font-bold">The Long-Term Vision</h2>
              <p className="text-lg text-white/60 leading-relaxed">
                My goal is not to build just one business, but to architect a platform that supports multiple ventures. From luxury consumer goods like perfumes to scalable SaaS applications, I build with modularity and growth in mind.
              </p>
              <p className="text-lg text-white/60 leading-relaxed">
                This platform serves as the central hub for my entrepreneurial journey, combining my skills as a senior full-stack architect with premium UI/UX design.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111] p-8 rounded-2xl border border-white/5">
                <Briefcase className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="font-semibold text-xl mb-2">Multiple Ventures</h3>
                <p className="text-white/50 text-sm">A centralized ecosystem for diverse business models.</p>
              </div>
              <div className="bg-[#111] p-8 rounded-2xl border border-white/5 mt-8">
                <Code className="w-8 h-8 text-pink-400 mb-4" />
                <h3 className="font-semibold text-xl mb-2">Scalable Tech</h3>
                <p className="text-white/50 text-sm">Built on Next.js, tailored for maximum performance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-white/40">
        <div className="flex justify-center gap-6 mb-8">
          <a href="#" className="hover:text-white transition-colors"><Github className="w-6 h-6" /></a>
          <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-6 h-6" /></a>
          <a href="#" className="hover:text-white transition-colors"><Twitter className="w-6 h-6" /></a>
          <a href="#" className="hover:text-white transition-colors"><Mail className="w-6 h-6" /></a>
        </div>
        <p>© {new Date().getFullYear()} Entrepreneur Identity. All rights reserved.</p>
      </footer>
    </div>
  );
}
