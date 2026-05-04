import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts'
import { FaHistory, FaChartLine, FaCode, FaTrash, FaBalanceScale, FaSyncAlt, FaDatabase } from 'react-icons/fa'

const API = 'http://localhost:8000/api'

const LANG_COLORS = { python: '#3b82f6', javascript: '#f59e0b', java: '#ef4444', unknown: '#6b7280' }
const SCORE_COLORS = { avg_quality: '#22c55e', avg_security: '#3b82f6', avg_complexity: '#f59e0b', avg_overall: '#a855f7' }

function ScoreBadge({ score }) {
  const s = score ?? 0
  const color = s >= 75 ? 'bg-green-100 text-green-700' : s >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{s.toFixed ? s.toFixed(1) : s}</span>
}

export default function HistoryDashboard({ userId }) {
  const [history, setHistory] = useState([])
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('overview') // overview | history | compare
  const [compareA, setCompareA] = useState(null)
  const [compareB, setCompareB] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const params = userId ? `?user_id=${userId}` : ''
      const [hRes, tRes] = await Promise.all([
        fetch(`${API}/history?limit=50${params ? '&' + params.slice(1) : ''}`),
        fetch(`${API}/history/trends?days=30${params ? '&' + params.slice(1) : ''}`)
      ])
      if (hRes.ok) {
        const d = await hRes.json()
        setHistory(d.history || [])
      }
      if (tRes.ok) {
        setTrends(await tRes.json())
      }
    } catch {
      setError('Could not load history. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [userId])

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this analysis?')) return
    await fetch(`${API}/history/${id}`, { method: 'DELETE' })
    setHistory(h => h.filter(x => x._id !== id))
  }

  const langPieData = trends?.languages
    ? Object.entries(trends.languages).map(([name, value]) => ({ name, value }))
    : []

  const trendChartData = (trends?.trends || []).reduce((acc, row) => {
    const existing = acc.find(r => r.date === row.date)
    if (existing) {
      existing.count = (existing.count || 0) + row.count
      existing.avg_overall = ((existing.avg_overall || 0) + row.avg_overall) / 2
    } else {
      acc.push({ date: row.date, count: row.count, avg_overall: row.avg_overall })
    }
    return acc
  }, [])

  const compareMetrics = (item) => {
    const m = item?.metrics || {}
    return [
      { label: 'Quality', a: compareA ? (compareA.metrics?.quality_score ?? 0) : 0, b: compareB ? (compareB.metrics?.quality_score ?? 0) : 0 },
      { label: 'Security', a: compareA ? (compareA.metrics?.security_score ?? 0) : 0, b: compareB ? (compareB.metrics?.security_score ?? 0) : 0 },
      { label: 'Complexity', a: compareA ? (compareA.metrics?.complexity_score ?? 0) : 0, b: compareB ? (compareB.metrics?.complexity_score ?? 0) : 0 },
      { label: 'Overall', a: compareA ? (compareA.metrics?.overall_score ?? 0) : 0, b: compareB ? (compareB.metrics?.overall_score ?? 0) : 0 },
    ]
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: FaChartLine },
    { id: 'history', label: '📋 History', icon: FaHistory },
    { id: 'compare', label: '⚖️ Compare', icon: FaBalanceScale },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Analysis Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">Track your code quality improvements over time</p>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <FaSyncAlt className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </motion.div>

        {/* Tab Nav */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-gray-200 w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
            <motion.div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
            Loading dashboard data…
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3">
            <FaDatabase /> {error}
          </div>
        )}

        {!loading && !error && (
          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {tab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Analyses', value: trends?.total_in_period ?? history.length, color: 'from-blue-500 to-blue-600' },
                    { label: 'Languages Used', value: Object.keys(trends?.languages || {}).length, color: 'from-purple-500 to-purple-600' },
                    { label: 'Last 30 Days', value: trends?.total_in_period ?? '—', color: 'from-green-500 to-green-600' },
                    { label: 'Avg Overall Score', value: trendChartData.length ? (trendChartData.reduce((s, r) => s + r.avg_overall, 0) / trendChartData.length).toFixed(1) : '—', color: 'from-orange-500 to-orange-600' },
                  ].map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -4 }}
                      className={`bg-gradient-to-br ${s.color} text-white rounded-xl p-5 shadow-md`}>
                      <p className="text-white/80 text-xs font-medium">{s.label}</p>
                      <p className="text-3xl font-bold mt-1">{s.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Trend line chart */}
                  <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">📈 Analyses Over Time (30 days)</h3>
                    {trendChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={trendChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(v, n) => [typeof v === 'number' ? v.toFixed(1) : v, n]} />
                          <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} name="Analyses" />
                          <Line type="monotone" dataKey="avg_overall" stroke="#a855f7" strokeWidth={2} dot={false} name="Avg Score" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                        No trend data yet. Run some analyses to see charts!
                      </div>
                    )}
                  </div>

                  {/* Language pie */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">🌍 Languages</h3>
                    {langPieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={langPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                            {langPieData.map((entry, i) => (
                              <Cell key={i} fill={LANG_COLORS[entry.name] || '#6b7280'} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No data yet</div>
                    )}
                  </div>
                </div>

                {/* Score bar chart */}
                {trendChartData.length > 0 && (
                  <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">📊 Daily Average Scores</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={(trends?.trends || []).slice(-14)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="avg_quality" fill="#22c55e" name="Quality" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="avg_security" fill="#3b82f6" name="Security" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="avg_overall" fill="#a855f7" name="Overall" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>
            )}

            {/* HISTORY TAB */}
            {tab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Recent Analyses ({history.length})</h3>
                    <span className="text-xs text-gray-400">Click rows to select for comparison</span>
                  </div>
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <FaHistory className="text-4xl mb-3 opacity-30" />
                      <p className="font-medium">No analyses yet</p>
                      <p className="text-sm mt-1">Analyze some code and it will appear here.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {history.map((item) => {
                        const isA = compareA?._id === item._id
                        const isB = compareB?._id === item._id
                        return (
                          <motion.div key={item._id} whileHover={{ backgroundColor: '#f9fafb' }}
                            className={`flex items-center justify-between px-5 py-4 transition-colors ${isA ? 'bg-blue-50' : isB ? 'bg-purple-50' : ''}`}>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                style={{ background: LANG_COLORS[item.language] || '#6b7280' }}>
                                {(item.language || '?')[0].toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{item.code_snippet?.slice(0, 60) || '—'}</p>
                                <p className="text-xs text-gray-400">{item.language} · {item.issue_count ?? 0} issues · {item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {item.metrics?.overall_score != null && <ScoreBadge score={item.metrics.overall_score} />}
                              <button onClick={() => { setCompareA(item); setTab('compare') }}
                                className={`text-xs px-2 py-1 rounded-lg border transition-all ${isA ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600'}`}>
                                A
                              </button>
                              <button onClick={() => { setCompareB(item); setTab('compare') }}
                                className={`text-xs px-2 py-1 rounded-lg border transition-all ${isB ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 text-gray-500 hover:border-purple-400 hover:text-purple-600'}`}>
                                B
                              </button>
                              <button onClick={() => deleteItem(item._id)}
                                className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* COMPARE TAB */}
            {tab === 'compare' && (
              <motion.div key="compare" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">⚖️ Compare Two Analyses</h3>
                  <p className="text-gray-400 text-sm mb-6">Go to the History tab and click <strong>A</strong> and <strong>B</strong> to select items to compare.</p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {[{ label: 'Analysis A', item: compareA, color: 'blue' }, { label: 'Analysis B', item: compareB, color: 'purple' }].map(({ label, item, color }) => (
                      <div key={label} className={`rounded-xl border-2 ${item ? `border-${color}-300 bg-${color}-50` : 'border-dashed border-gray-200'} p-4`}>
                        <p className={`text-xs font-bold ${item ? `text-${color}-700` : 'text-gray-400'} mb-2`}>{label}</p>
                        {item ? (
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{item.language} analysis</p>
                            <p className="text-xs text-gray-500 mt-1">{item.created_at ? new Date(item.created_at).toLocaleString() : ''}</p>
                            <p className="text-xs text-gray-400 mt-2 truncate">{item.code_snippet?.slice(0, 80)}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-300 italic">Not selected — go to History tab</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {compareA && compareB ? (
                    <div>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={compareMetrics()} layout="vertical" margin={{ left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                          <YAxis type="category" dataKey="label" tick={{ fontSize: 12 }} width={80} />
                          <Tooltip formatter={(v) => v.toFixed ? v.toFixed(1) : v} />
                          <Legend />
                          <Bar dataKey="a" name="Analysis A" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="b" name="Analysis B" fill="#a855f7" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>

                      <div className="mt-4 grid grid-cols-4 gap-3 text-center">
                        {compareMetrics().map(m => {
                          const diff = (m.b - m.a).toFixed(1)
                          const improved = m.b > m.a
                          return (
                            <div key={m.label} className={`rounded-lg p-3 ${improved ? 'bg-green-50 border border-green-200' : m.b < m.a ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                              <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                              <p className={`text-lg font-bold ${improved ? 'text-green-600' : m.b < m.a ? 'text-red-500' : 'text-gray-500'}`}>
                                {improved ? '↑' : m.b < m.a ? '↓' : '—'} {Math.abs(diff)}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12 text-gray-300">
                      <FaBalanceScale className="text-5xl" />
                      <p className="ml-4 text-sm">Select two analyses to compare</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
