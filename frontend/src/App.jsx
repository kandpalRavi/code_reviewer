import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import HistoryDashboard from './components/HistoryDashboard'
import CodeInput from './components/CodeInput'
import CodeEditor from './components/CodeEditor'
import AnalysisResults from './components/AnalysisResults'
import BatchAnalysisResults from './components/BatchAnalysisResults'
import LoadingAnimation from './components/LoadingAnimation'
import ToastContainer from './components/ToastContainer'

const API = 'http://localhost:8000/api'

function App() {
  const { user, loading: authLoading } = useAuth()
  const [authed, setAuthed] = useState(false) // true once user passes auth screen

  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }

  // Still checking localStorage
  if (authLoading) return null

  // Show auth screen until user passes it
  if (!authed && !user) {
    return <AuthPage onSuccess={() => setAuthed(true)} />
  }

  const handleAnalyze = async (codeToAnalyze = null, langToAnalyze = null) => {
    const codeContent = codeToAnalyze || code
    const codeLang = langToAnalyze || language
    if (!codeContent.trim()) { showToast('Please enter some code', 'error'); return }

    setIsAnalyzing(true)
    setResults(null)
    setCode(codeContent)
    setLanguage(codeLang)

    try {
      const userParam = user?.id ? `?user_id=${user.id}` : ''
      const res = await fetch(`${API}/analyze${userParam}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeContent, language: codeLang, security_deep_scan: true, performance_hints: true })
      })
      if (!res.ok) throw new Error('Analysis failed')
      setResults(await res.json())
      showToast('Analysis complete', 'success')
    } catch (err) {
      console.error(err)
      showToast('Failed to analyze code. Check backend on port 8000.', 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleBatchAnalyze = async (files) => {
    if (!files?.length) { showToast('Please upload files for batch analysis', 'error'); return }
    setIsAnalyzing(true)
    setResults(null)
    try {
      const res = await fetch(`${API}/analyze/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files, security_deep_scan: true, performance_hints: true })
      })
      if (!res.ok) throw new Error('Batch analysis failed')
      setResults(await res.json())
      showToast('Batch analysis complete', 'success')
    } catch {
      showToast('Batch analysis failed. Check backend and uploaded files.', 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRepoAnalyze = async (githubUrl) => {
    if (!githubUrl?.trim()) { showToast('Please enter a GitHub repository URL', 'error'); return }
    setIsAnalyzing(true)
    setResults(null)
    try {
      const res = await fetch(`${API}/analyze/repo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ github_url: githubUrl.trim(), max_files: 250, security_deep_scan: true, performance_hints: true })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Repository analysis failed')
      setResults(data)
      showToast('Repository analysis complete', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to analyze GitHub repository.', 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const tabs = [
    { id: 'dashboard', label: '🏠 Dashboard' },
    { id: 'history', label: '📊 History & Trends' },
    { id: 'home', label: '📋 Analyzer' },
    { id: 'editor', label: '✏️ Code Editor' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Navigation Tabs */}
      <motion.div className="bg-white border-b border-gray-200 shadow-sm"
        initial={{ y: -10 }} animate={{ y: 0 }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                onClick={() => setActiveTab(t.id)}
                className={`py-4 px-3 font-medium border-b-2 whitespace-nowrap transition-all text-sm ${
                  activeTab === t.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Dashboard
                onStartAnalysis={() => setActiveTab('home')}
                onCodeEditorClick={() => setActiveTab('editor')}
              />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HistoryDashboard userId={user?.id} />
            </motion.div>
          )}

          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">Code Quality Analyzer</h1>
                  <p className="text-lg text-gray-600">Upload or paste your code to get instant feedback on quality, security, and best practices</p>
                </div>
                <CodeInput
                  code={code} setCode={setCode}
                  language={language} setLanguage={setLanguage}
                  onAnalyze={() => handleAnalyze(code, language)}
                  onBatchAnalyze={handleBatchAnalyze}
                  onRepoAnalyze={handleRepoAnalyze}
                  notify={showToast}
                  isAnalyzing={isAnalyzing}
                />
                {isAnalyzing && <LoadingAnimation />}
                {results && !isAnalyzing && (
                  results.mode === 'batch'
                    ? <BatchAnalysisResults results={results} />
                    : <AnalysisResults results={results} />
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'editor' && (
            <motion.div key="editor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <CodeEditor onAnalyze={handleAnalyze} language={language} setLanguage={setLanguage} notify={showToast} />
              {isAnalyzing && <LoadingAnimation />}
              {results && !isAnalyzing && (
                <div className="container mx-auto px-4 max-w-7xl mb-6 mt-6">
                  <AnalysisResults results={results} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ToastContainer toasts={toasts} />

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Code Reviewer. Built with React, FastAPI, and MongoDB.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
