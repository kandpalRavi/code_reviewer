import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Pie, Bar, Line, Doughnut, Radar } from 'react-chartjs-2'
import { FaChartPie, FaChartBar, FaChartLine, FaFire } from 'react-icons/fa'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { padding: 15, font: { size: 12 } },
    },
  },
}

function issueSeverityChart(issues = []) {
  const severityCounts = { error: 0, warning: 0, info: 0 }
  issues.forEach((issue) => {
    const severity = (issue.severity || 'info').toLowerCase()
    if (severity in severityCounts) severityCounts[severity]++
    else severityCounts['info']++
  })

  return {
    labels: ['Errors', 'Warnings', 'Info'],
    datasets: [
      {
        label: 'Issue Count',
        data: [severityCounts.error, severityCounts.warning, severityCounts.info],
        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6'],
        borderColor: ['#dc2626', '#d97706', '#1d4ed8'],
        borderWidth: 2,
      },
    ],
  }
}

function scoreBreakdownChart(scores = {}) {
  const { quality = 0, complexity = 0, security = 0, final = 0 } = scores
  return {
    labels: ['Quality', 'Complexity', 'Security'],
    datasets: [
      {
        label: 'Score',
        data: [quality, complexity, security],
        backgroundColor: ['#8b5cf6', '#06b6d4', '#ec4899'],
        borderColor: ['#7c3aed', '#0891b2', '#be185d'],
        borderWidth: 2,
      },
    ],
  }
}

function metricsComparisonChart(files = []) {
  const topFiles = files.slice(0, 8)
  return {
    labels: topFiles.map((f) => f.file_name.split('/').pop().substring(0, 20)),
    datasets: [
      {
        label: 'Complexity',
        data: topFiles.map((f) => f.result?.metrics?.complexity || 0),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Maintainability',
        data: topFiles.map((f) => f.result?.metrics?.maintainability || 0),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Final Score',
        data: topFiles.map((f) => f.result?.scores?.final || 0),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }
}

function languageDistributionChart(files = []) {
  const langCounts = {}
  files.forEach((file) => {
    const lang = file.language || 'unknown'
    langCounts[lang] = (langCounts[lang] || 0) + 1
  })

  const colors = { python: '#3b82f6', javascript: '#fbbf24', java: '#f97316' }
  return {
    labels: Object.keys(langCounts),
    datasets: [
      {
        label: 'Files per Language',
        data: Object.values(langCounts),
        backgroundColor: Object.keys(langCounts).map((lang) => colors[lang] || '#9ca3af'),
        borderColor: Object.keys(langCounts).map((lang) => colors[lang] || '#6b7280'),
        borderWidth: 2,
      },
    ],
  }
}

function issuesByLanguageChart(files = []) {
  const langIssues = {}
  files.forEach((file) => {
    const lang = file.language || 'unknown'
    const count = file.summary?.issue_count || 0
    langIssues[lang] = (langIssues[lang] || 0) + count
  })

  return {
    labels: Object.keys(langIssues),
    datasets: [
      {
        label: 'Issues by Language',
        data: Object.values(langIssues),
        backgroundColor: ['#ef4444', '#f59e0b', '#06b6d4'],
        borderColor: ['#dc2626', '#d97706', '#0891b2'],
        borderWidth: 2,
      },
    ],
  }
}

function qualityScoreDistributionChart(files = []) {
  const scores = files.map((f) => f.result?.scores?.final || f.summary?.final_score || 0)
  const ranges = { excellent: 0, good: 0, fair: 0, poor: 0 }

  scores.forEach((score) => {
    if (score >= 80) ranges.excellent++
    else if (score >= 60) ranges.good++
    else if (score >= 40) ranges.fair++
    else ranges.poor++
  })

  return {
    labels: ['Excellent (80+)', 'Good (60-80)', 'Fair (40-60)', 'Poor (<40)'],
    datasets: [
      {
        label: 'Files in Range',
        data: [ranges.excellent, ranges.good, ranges.fair, ranges.poor],
        backgroundColor: ['#10b981', '#84cc16', '#f59e0b', '#ef4444'],
        borderColor: ['#059669', '#65a30d', '#d97706', '#dc2626'],
        borderWidth: 2,
      },
    ],
  }
}

function VisualizationCard({ icon: Icon, title, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${className}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <Icon className="text-lg text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}

export default function AdvancedVisualizations({ results }) {
  const files = results?.files || []
  const issues = results?.issues || []
  const scores = results?.scores || {}
  const summary = results?.summary || {}
  const offenders = results?.worst_offenders || []

  const severityData = useMemo(() => issueSeverityChart(issues), [issues])
  const scoreData = useMemo(() => scoreBreakdownChart(scores), [scores])
  const metricsData = useMemo(() => metricsComparisonChart(files), [files])
  const langData = useMemo(() => languageDistributionChart(files), [files])
  const issuesLangData = useMemo(() => issuesByLanguageChart(files), [files])
  const qualityData = useMemo(() => qualityScoreDistributionChart(files), [files])

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border border-blue-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Visualizations</h2>
        <p className="text-gray-600">Comprehensive charts and metrics analysis across all analyzed files</p>
      </motion.div>

      {/* Single File Analysis - Issue Severity */}
      {!files.length && issues.length > 0 && (
        <VisualizationCard icon={FaChartPie} title="Issue Severity Distribution">
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Pie data={severityData} options={chartOptions} />
          </div>
        </VisualizationCard>
      )}

      {/* Single File Analysis - Score Breakdown */}
      {!files.length && scores.quality !== undefined && (
        <VisualizationCard icon={FaChartBar} title="Score Breakdown">
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={scoreData} options={chartOptions} />
          </div>
        </VisualizationCard>
      )}

      {/* Batch Analysis Charts */}
      {files.length > 0 && (
        <>
          {/* Quality Score Distribution */}
          <div className="grid lg:grid-cols-2 gap-6">
            <VisualizationCard icon={FaChartPie} title="Quality Score Distribution">
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                <Pie data={qualityData} options={chartOptions} />
              </div>
            </VisualizationCard>

            {/* Language Distribution */}
            <VisualizationCard icon={FaChartBar} title="Files by Language">
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                <Doughnut data={langData} options={chartOptions} />
              </div>
            </VisualizationCard>
          </div>

          {/* Metrics Comparison */}
          <VisualizationCard icon={FaChartLine} title="Metrics Comparison (Top Files)">
            <div style={{ height: '350px' }}>
              <Line
                data={metricsData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: { stepSize: 20 },
                    },
                  },
                }}
              />
            </div>
          </VisualizationCard>

          {/* Issues by Language */}
          <div className="grid lg:grid-cols-2 gap-6">
            <VisualizationCard icon={FaChartBar} title="Issues by Language">
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                <Bar
                  data={issuesLangData}
                  options={{
                    ...chartOptions,
                    indexAxis: 'y',
                    scales: { x: { beginAtZero: true } },
                  }}
                />
              </div>
            </VisualizationCard>

            {/* Summary Stats */}
            <VisualizationCard icon={FaFire} title="Quick Stats">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Files</span>
                  <span className="text-2xl font-bold text-blue-600">{summary.total_files || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Issues</span>
                  <span className="text-2xl font-bold text-orange-600">{summary.total_issues || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Avg Quality Score</span>
                  <span className="text-2xl font-bold text-green-600">
                    {summary.average_quality_score || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Avg Final Score</span>
                  <span className="text-2xl font-bold text-purple-600">{summary.average_score || 0}</span>
                </div>
              </div>
            </VisualizationCard>
          </div>

          {/* Worst Offenders Ranking */}
          {offenders.length > 0 && (
            <VisualizationCard icon={FaFire} title="🔥 Worst Offenders (Top 5)">
              <div className="space-y-3">
                {offenders.map((item, idx) => (
                  <motion.div
                    key={`${item.file_name}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      #{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{item.file_name}</p>
                      <p className="text-xs text-gray-600 uppercase">{item.language}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm font-bold text-red-600">{item.issue_count}</div>
                      <div className="text-xs text-gray-500">issues</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </VisualizationCard>
          )}
        </>
      )}
    </div>
  )
}
