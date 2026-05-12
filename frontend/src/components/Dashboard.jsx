import { motion } from 'framer-motion'
import { FaCode, FaCheckCircle, FaRocket, FaShieldAlt, FaBolt, FaChartLine, FaArrowRight, FaPython, FaJava, FaJs, FaStar, FaFire, FaCube, FaLightbulb } from 'react-icons/fa'
import ShaderBackground from './ShaderBackground'

function Dashboard({ onStartAnalysis, onCodeEditorClick }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 25 },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const stats = [
    { icon: FaCode, label: 'Code Languages', value: '3', color: 'from-cyan-500 to-blue-600', icon2: FaStar },
    { icon: FaCheckCircle, label: 'Analysis Tools', value: '3+', color: 'from-emerald-500 to-green-600', icon2: FaFire },
    { icon: FaShieldAlt, label: 'Security Checks', value: 'Advanced', color: 'from-rose-500 to-pink-600', icon2: FaLightbulb },
    { icon: FaChartLine, label: 'Real-time Metrics', value: 'Live', color: 'from-violet-500 to-purple-600', icon2: FaCube },
  ]

  const features = [
    {
      icon: FaCode,
      title: 'Multi-Language Support',
      description: 'Python, JavaScript, and Java with specialized analysis engines optimized for each language.',
      color: 'from-cyan-500/10 to-blue-500/10',
      borderColor: 'border-cyan-500/20',
      accentColor: 'from-cyan-400 to-blue-500'
    },
    {
      icon: FaShieldAlt,
      title: 'Security Analysis',
      description: 'Identify vulnerabilities, security risks, and compliance violations with AI-enhanced detection.',
      color: 'from-rose-500/10 to-pink-500/10',
      borderColor: 'border-rose-500/20',
      accentColor: 'from-rose-400 to-pink-500'
    },
    {
      icon: FaBolt,
      title: 'Performance Metrics',
      description: 'Comprehensive complexity, maintainability, and quality scoring in real-time.',
      color: 'from-amber-500/10 to-orange-500/10',
      borderColor: 'border-amber-500/20',
      accentColor: 'from-amber-400 to-orange-500'
    },
    {
      icon: FaRocket,
      title: 'AI-Powered Insights',
      description: 'Intelligent recommendations and actionable suggestions tailored to your code.',
      color: 'from-violet-500/10 to-purple-500/10',
      borderColor: 'border-violet-500/20',
      accentColor: 'from-violet-400 to-purple-500'
    },
    {
      icon: FaChartLine,
      title: 'Batch Processing',
      description: 'Analyze multiple files simultaneously with detailed comparison reports and trends.',
      color: 'from-emerald-500/10 to-green-500/10',
      borderColor: 'border-emerald-500/20',
      accentColor: 'from-emerald-400 to-green-500'
    },
    {
      icon: FaArrowRight,
      title: 'Export & Reports',
      description: 'Generate PDF, Markdown, and JSON reports with professional formatting.',
      color: 'from-indigo-500/10 to-blue-500/10',
      borderColor: 'border-indigo-500/20',
      accentColor: 'from-indigo-400 to-blue-500'
    },
  ]

  const quickStartSteps = [
    {
      step: 1,
      title: 'Select Language',
      description: 'Choose Python, JavaScript, or Java from the dropdown',
      icon: FaCode
    },
    {
      step: 2,
      title: 'Input Code',
      description: 'Paste your code or upload a file directly',
      icon: FaArrowRight
    },
    {
      step: 3,
      title: 'Analyze',
      description: 'Click the analyze button and get instant results',
      icon: FaBolt
    },
    {
      step: 4,
      title: 'Review & Export',
      description: 'View detailed reports and download in your preferred format',
      icon: FaCheckCircle
    },
  ]

  const languageHighlights = [
    {
      name: 'Python',
      icon: FaPython,
      tools: ['Pylint', 'Radon', 'Bandit'],
      color: 'from-blue-500 to-blue-600',
      description: 'Complete static analysis with security scanning'
    },
    {
      name: 'JavaScript',
      icon: FaJs,
      tools: ['ESLint', 'Complexity', 'Security'],
      color: 'from-yellow-500 to-yellow-600',
      description: 'Modern JS linting with best practices'
    },
    {
      name: 'Java',
      icon: FaJava,
      tools: ['Checkstyle', 'Metrics', 'Quality'],
      color: 'from-orange-500 to-orange-600',
      description: 'Enterprise-grade code quality checks'
    },
  ]

  return (
    <motion.div
      className="relative min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1429] to-[#0a0e1a] overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Shader Background */}
      <ShaderBackground />

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-5"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section variants={itemVariants} className="relative py-20 md:py-32 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Floating Badges */}
            <motion.div
              className="flex justify-center gap-3 mb-8 flex-wrap"
              variants={itemVariants}
            >
              <motion.div
                className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-cyan-300 text-sm font-semibold flex items-center gap-2">
                  <FaStar className="text-xs" /> Advanced Analysis
                </span>
              </motion.div>
              <motion.div
                className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 backdrop-blur-sm"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
              >
                <span className="text-violet-300 text-sm font-semibold flex items-center gap-2">
                  <FaFire className="text-xs" /> Real-time Scanning
                </span>
              </motion.div>
              <motion.div
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 backdrop-blur-sm"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
              >
                <span className="text-emerald-300 text-sm font-semibold flex items-center gap-2">
                  <FaRocket className="text-xs" /> AI-Powered
                </span>
              </motion.div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                  Code Excellence
                </span>
                <br />
                <span className="text-white">Redefined</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-3 max-w-3xl mx-auto leading-relaxed font-light">
                Enterprise-grade code analysis powered by AI. Detect vulnerabilities, optimize performance, and elevate your code quality instantly.
              </p>
              <p className="text-slate-400 text-sm">Trusted by developers worldwide • Supports 3 Languages • 50+ Analysis Rules</p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.button
                onClick={onStartAnalysis}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(34,197,94,0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold shadow-lg overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ pointerEvents: 'none' }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <FaBolt className="group-hover:rotate-12 transition-transform" />
                  Start Analysis
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              <motion.button
                onClick={onCodeEditorClick}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(99,179,237,0.15)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 text-cyan-300 border-2 border-cyan-500/30 hover:border-cyan-500/60 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group backdrop-blur-sm"
              >
                <FaCode className="group-hover:rotate-12 transition-transform" />
                Code Editor
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ translateY: -8, boxShadow: `0 20px 40px rgba(0,0,0,0.5)` }}
                  className={`relative group rounded-xl p-6 bg-gradient-to-br ${stat.color} overflow-hidden border border-white/10`}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100"
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ pointerEvents: 'none' }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <stat.icon className="text-3xl opacity-80" />
                      <stat.icon2 className="text-xl opacity-50" />
                    </div>
                    <p className="text-xs opacity-80 font-semibold mb-2 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-black">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Language Highlights */}
        <motion.section variants={itemVariants} className="py-20 relative">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Multi-Language Mastery
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Specialized analysis engines optimized for Python, JavaScript, and Java
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {languageHighlights.map((lang, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ translateY: -12, boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}
                  className="group relative rounded-2xl p-8 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-sm overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100"
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ pointerEvents: 'none' }}
                  />
                  <div className="relative z-10">
                    <div className={`inline-block bg-gradient-to-br ${lang.color} rounded-xl p-4 mb-6 shadow-lg group-hover:shadow-2xl transition-shadow`}>
                      <lang.icon className="text-3xl text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{lang.name}</h3>
                    <p className="text-slate-400 mb-6 leading-relaxed">{lang.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {lang.tools.map((tool, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="text-xs bg-white/10 text-slate-300 px-4 py-2 rounded-lg font-semibold border border-white/10 hover:border-white/30 transition-all"
                        >
                          {tool}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section variants={itemVariants} className="py-20 relative">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Everything you need for professional code analysis
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ translateY: -12 }}
                  className={`group relative rounded-2xl p-8 bg-gradient-to-br ${feature.color} border-2 ${feature.borderColor} backdrop-blur-sm overflow-hidden transition-all`}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <div className="relative z-10">
                    <motion.div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.accentColor} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <feature.icon className="text-2xl text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Quick Start Guide */}
        <motion.section variants={itemVariants} className="py-20 relative">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Get Started in Minutes
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Four simple steps to code excellence
              </p>
            </motion.div>
            <div className="grid md:grid-cols-4 gap-4 md:gap-6 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0 -z-10"></div>

              {quickStartSteps.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.08, translateY: -12 }}
                    className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl p-8 backdrop-blur-sm overflow-hidden hover:border-cyan-500/30 transition-all"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <motion.div
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg"
                          whileHover={{ scale: 1.15, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          {item.step}
                        </motion.div>
                        <item.icon className="text-slate-600 text-2xl" />
                      </div>
                      <h3 className="font-bold text-lg text-white mb-3">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Final CTA Section */}
        <motion.section variants={itemVariants} className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10" />
          <motion.div
            className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-cyan-500/5 to-transparent"
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <div className="container mx-auto px-4 max-w-7xl text-white text-center relative z-10">
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Ready to Transform Your Code?
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                Join thousands of developers improving code quality with AI-powered analysis. Get comprehensive insights, actionable recommendations, and professional reports in seconds.
              </p>
              <motion.button
                onClick={onStartAnalysis}
                whileHover={{ scale: 1.08, boxShadow: '0 0 50px rgba(34,197,94,0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold shadow-xl overflow-hidden group inline-flex items-center gap-2"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ pointerEvents: 'none' }}
                />
                <span className="relative flex items-center gap-2">
                  <FaRocket className="group-hover:rotate-12 transition-transform" />
                  Start Analyzing Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer Section */}
        <motion.div variants={itemVariants} className="py-12 border-t border-white/10 text-center">
          <div className="container mx-auto px-4 max-w-7xl">
            <p className="text-slate-500 text-sm">
              © 2024 CodeReviewer • Built with React, FastAPI & MongoDB • Enterprise Code Analysis
            </p>
          </div>
        </motion.div>
      </div>
      </div>
    </motion.div>
  )
}

export default Dashboard
