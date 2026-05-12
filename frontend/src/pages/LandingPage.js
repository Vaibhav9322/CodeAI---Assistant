import { Link } from "react-router-dom";
import { Zap, Code2, Bug, Languages, Sparkles, ArrowRight, Shield, Clock } from "lucide-react";

const features = [
  { icon: Code2, title: "Code Generation", desc: "Generate production-ready code from plain English prompts instantly.", color: "text-purple-400" },
  { icon: Bug, title: "Debug Assistant", desc: "Paste your error and get instant fixes with detailed explanations.", color: "text-red-400" },
  { icon: Sparkles, title: "Code Explanation", desc: "Understand any code snippet with line-by-line AI explanations.", color: "text-cyan-400" },
  { icon: Languages, title: "Language Converter", desc: "Convert code between Python, Java, C++, JavaScript, and C.", color: "text-green-400" },
  { icon: Shield, title: "Code Optimizer", desc: "Improve performance and readability of your existing code.", color: "text-yellow-400" },
  { icon: Clock, title: "Chat History", desc: "All your conversations saved and searchable anytime.", color: "text-blue-400" },
];

const LandingPage = () => (
  <div className="min-h-screen bg-dark-900 text-white">
    {/* Navbar */}
    <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 glass sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-bold text-lg gradient-text">CodeAI</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">
          Sign In
        </Link>
        <Link to="/register" className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
          Get Started
        </Link>
      </div>
    </nav>

    {/* Hero */}
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-purple-300 mb-6 border border-purple-500/20">
          <Sparkles size={14} />
          Powered by Google Gemini AI
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Your AI-Powered
          <br />
          <span className="gradient-text">Coding Assistant</span>
        </h1>
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Generate, debug, explain, and convert code instantly. Built for students and beginner programmers who want to learn faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all glow-purple"
          >
            Start Coding for Free <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 glass glass-hover text-white px-8 py-3.5 rounded-xl font-semibold transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-3">Everything you need to code smarter</h2>
      <p className="text-slate-400 text-center mb-12">Six powerful AI tools in one platform</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="glass glass-hover rounded-2xl p-6 transition-all duration-200">
            <div className={`${color} mb-4`}><Icon size={28} /></div>
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="px-6 py-20 text-center">
      <div className="glass rounded-3xl p-12 max-w-2xl mx-auto border border-purple-500/20">
        <h2 className="text-3xl font-bold mb-4">Ready to code smarter?</h2>
        <p className="text-slate-400 mb-8">Join thousands of students already using CodeAI.</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Get Started Free <ArrowRight size={18} />
        </Link>
      </div>
    </section>

    <footer className="text-center py-8 text-slate-600 text-sm border-t border-white/5">
      © 2024 CodeAI — Built for learners, by learners.
    </footer>
  </div>
);

export default LandingPage;
