import { motion } from 'framer-motion'
import { FaCode, FaCheckCircle, FaRocket, FaShieldAlt, FaBolt, FaChartLine, FaArrowRight, FaPython, FaJava, FaJs } from 'react-icons/fa'

function Dashboard({ onStartAnalysis, onCodeEditorClick }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const stats = [
    { icon: FaCode, label: 'Code Languages', value: '3', color: 'from-blue-400 to-blue-600' },
    { icon: FaCheckCircle, label: 'Analysis Tools', value: '3', color: 'from-green-400 to-green-600' },
    { icon: FaShieldAlt, label: 'Security Checks', value: 'Advanced', color: 'from-red-400 to-red-600' },
    { icon: FaChartLine, label: 'Metrics', value: 'Real-time', color: 'from-purple-400 to-purple-600' },
  ]

  const features = [
    {
      icon: FaCode,
      title: 'Multi-Language Support',
      description: 'Analyze Python, JavaScript, and Java code with specialized tools for each language.',
      color: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: FaShieldAlt,
      title: 'Security Analysis',
      description: 'Detect vulnerabilities, security risks, and best practice violations automatically.',
      color: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200'
    },
    {
      icon: FaBolt,
      title: 'Performance Metrics',
      description: 'Get detailed metrics on complexity, maintainability, and code quality scores.',
      color: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200'
    },
    {
      icon: FaRocket,
      title: 'AI-Powered Suggestions',
      description: 'Receive intelligent recommendations to improve your code efficiency and quality.',
      color: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: FaChartLine,
      title: 'Batch Analysis',
      description: 'Analyze multiple files at once and get comprehensive comparison reports.',
      color: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      icon: FaArrowRight,
      title: 'Export & Reports',
      description: 'Download detailed PDF, Markdown, and JSON reports for documentation.',
      color: 'from-indigo-50 to-blue-50',
      borderColor: 'border-indigo-200'
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
      className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Code Quality Analyzer
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed max-w-3xl mx-auto">
              Comprehensive code analysis for Python, JavaScript, and Java with security scanning, complexity metrics, and AI-powered suggestions.
            </p>
            <p className="text-gray-500 text-lg">Get actionable insights to improve code quality instantly</p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              onClick={onStartAnalysis}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <FaBolt className="group-hover:rotate-12 transition-transform" />
              Start Analysis
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              onClick={onCodeEditorClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group"
            >
              <FaCode className="group-hover:rotate-12 transition-transform" />
              Code Editor
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ translateY: -5 }}
                className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg`}
              >
                <stat.icon className="text-3xl mb-2 opacity-90" />
                <p className="text-sm opacity-90 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Language Highlights */}
      <motion.section variants={itemVariants} className="py-16 container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Specialized Analysis for Every Language
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {languageHighlights.map((lang, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ translateY: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all border border-gray-100"
            >
              <div className={`bg-gradient-to-br ${lang.color} w-14 h-14 rounded-lg flex items-center justify-center text-white mb-4 shadow-lg`}>
                <lang.icon className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{lang.name}</h3>
              <p className="text-gray-600 mb-4 text-sm">{lang.description}</p>
              <div className="flex flex-wrap gap-2">
                {lang.tools.map((tool, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section variants={itemVariants} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Powerful Features at Your Fingertips
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ translateY: -8 }}
                className={`bg-gradient-to-br ${feature.color} border-2 ${feature.borderColor} rounded-xl p-8 shadow-sm hover:shadow-lg transition-all`}
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <feature.icon className="text-xl text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Quick Start Guide */}
      <motion.section variants={itemVariants} className="py-16 container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Quick Start Guide
        </h2>
        <div className="grid md:grid-cols-4 gap-4 md:gap-6">
          {quickStartSteps.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="relative"
            >
              {/* Connector Line */}
              {idx < quickStartSteps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[calc(100%-30px)] h-1 bg-gradient-to-r from-blue-400 to-transparent -z-10"></div>
              )}

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100 h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg">
                    {item.step}
                  </div>
                  <item.icon className="text-gray-400 text-xl" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section variants={itemVariants} className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 max-w-7xl text-white text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Improve Your Code?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Get comprehensive analysis, detailed insights, and actionable recommendations to make your code cleaner, safer, and more maintainable.
            </p>
            <motion.button
              onClick={onStartAnalysis}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group mx-auto"
            >
              <FaBolt className="group-hover:rotate-12 transition-transform" />
              Start Analyzing Now
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  )
}

export default Dashboard
