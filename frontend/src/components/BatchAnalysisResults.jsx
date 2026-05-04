import { motion } from 'framer-motion'
import { FaExclamationTriangle, FaFileAlt, FaShieldAlt, FaTrophy, FaFileCode, FaDownload, FaFilePdf } from 'react-icons/fa'
import { jsPDF } from 'jspdf/dist/jspdf.es.min.js'
import autoTable from 'jspdf-autotable'

function downloadTextFile(content, fileName, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function formatDisplayValue(value, digits = 1) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'number' && Number.isFinite(value)) return value.toFixed(digits)
  return String(value)
}

function drawPill(doc, x, y, text, fillColor, textColor = [255, 255, 255]) {
  const paddingX = 8
  const pillHeight = 18
  const pillWidth = doc.getTextWidth(text) + paddingX * 2
  doc.setFillColor(...fillColor)
  doc.roundedRect(x, y, pillWidth, pillHeight, 7, 7, 'F')
  doc.setTextColor(...textColor)
  doc.setFontSize(8)
  doc.text(text, x + paddingX, y + 12)
  return pillWidth
}

function drawBanner(doc, x, y, width, title, subtitle, accentColor, metaText = '') {
  const height = metaText ? 78 : 68
  doc.setFillColor(17, 24, 39)
  doc.roundedRect(x, y, width, height, 12, 12, 'F')
  doc.setFillColor(...accentColor)
  doc.roundedRect(x, y, 10, height, 12, 0, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.text(title, x + 18, y + 26)
  doc.setFontSize(10)
  doc.setTextColor(209, 213, 219)
  doc.text(subtitle, x + 18, y + 43)
  if (metaText) {
    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.text(metaText, x + 18, y + 58)
  }
  return height
}

function drawMetricCard(doc, x, y, width, height, label, value, accentColor, backgroundColor = [249, 250, 251]) {
  doc.setFillColor(...backgroundColor)
  doc.roundedRect(x, y, width, height, 10, 10, 'F')
  doc.setFillColor(...accentColor)
  doc.roundedRect(x, y, 6, height, 10, 0, 'F')
  doc.setTextColor(55, 65, 81)
  doc.setFontSize(9)
  doc.text(label, x + 14, y + 16)
  doc.setTextColor(17, 24, 39)
  doc.setFontSize(16)
  doc.text(formatDisplayValue(value), x + 14, y + 37)
}

function drawSectionTitle(doc, x, y, title, accentColor, subtitle = '') {
  doc.setFillColor(...accentColor)
  doc.circle(x + 6, y - 2, 3, 'F')
  doc.setTextColor(17, 24, 39)
  doc.setFontSize(12)
  doc.text(title, x + 16, y)
  if (subtitle) {
    doc.setTextColor(107, 114, 128)
    doc.setFontSize(8)
    doc.text(subtitle, x + 16, y + 11)
    return y + 16
  }
  return y + 10
}

function addPageFooter(doc, pageNumber, totalPages) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setDrawColor(229, 231, 235)
  doc.line(40, pageHeight - 26, pageWidth - 40, pageHeight - 26)
  doc.setTextColor(107, 114, 128)
  doc.setFontSize(8)
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 80, pageHeight - 14)
}

function drawProgressBar(doc, x, y, width, label, value, color, maxValue = 100) {
  const barHeight = 10
  const normalized = clamp(maxValue > 0 ? value / maxValue : 0, 0, 1)
  doc.setFontSize(9)
  doc.setTextColor(55, 65, 81)
  doc.text(label, x, y)
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text(String(Math.round(value)), x + width - 12, y)
  doc.setFillColor(229, 231, 235)
  doc.roundedRect(x, y + 4, width, barHeight, 4, 4, 'F')
  doc.setFillColor(...color)
  doc.roundedRect(x, y + 4, Math.max(4, width * normalized), barHeight, 4, 4, 'F')
  return y + barHeight + 10
}

function drawFileInsightBlock(doc, x, y, width, counts, scores) {
  let cursor = y
  doc.setFontSize(11)
  doc.setTextColor(17, 24, 39)
  doc.text('Visual insights', x, cursor)
  cursor += 10

  doc.setFontSize(9)
  doc.setTextColor(75, 85, 99)
  doc.text('Issue severity mix', x, cursor)
  cursor += 8

  const totalIssues = counts.error + counts.warning + counts.info
  const barWidth = width
  const barHeight = 12
  const colors = {
    error: [220, 38, 38],
    warning: [245, 158, 11],
    info: [16, 185, 129]
  }

  doc.setFillColor(229, 231, 235)
  doc.roundedRect(x, cursor, barWidth, barHeight, 4, 4, 'F')
  let runningX = x
  ;[['error', counts.error], ['warning', counts.warning], ['info', counts.info]].forEach(([key, count]) => {
    if (!count || totalIssues === 0) return
    const segmentWidth = (barWidth * count) / totalIssues
    doc.setFillColor(...colors[key])
    doc.rect(runningX, cursor, segmentWidth, barHeight, 'F')
    runningX += segmentWidth
  })

  cursor += 18
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text(`Errors: ${counts.error}`, x, cursor)
  doc.text(`Warnings: ${counts.warning}`, x + 90, cursor)
  doc.text(`Info: ${counts.info}`, x + 190, cursor)
  cursor += 14

  doc.setFontSize(9)
  doc.setTextColor(75, 85, 99)
  doc.text('Score snapshots', x, cursor)
  cursor += 8

  cursor = drawProgressBar(doc, x, cursor, width, 'Quality', scores.quality ?? 0, [59, 130, 246])
  cursor = drawProgressBar(doc, x, cursor, width, 'Security', scores.security ?? 0, [220, 38, 38])
  cursor = drawProgressBar(doc, x, cursor, width, 'Final', scores.final ?? 0, [79, 70, 229])
  cursor = drawProgressBar(doc, x, cursor, width, 'Complexity', scores.complexity ?? 0, [168, 85, 247])

  return cursor
}

function getSeverityCounts(issues = []) {
  const counts = { error: 0, warning: 0, info: 0 }
  issues.forEach((issue) => {
    const level = (issue.severity || 'info').toLowerCase()
    if (counts[level] !== undefined) counts[level] += 1
    else counts.info += 1
  })
  return counts
}

function getSuggestionCategory(text = '') {
  const value = text.toLowerCase()
  if (value.includes('security') || value.includes('auth') || value.includes('secret') || value.includes('input')) return 'Security'
  if (value.includes('complexity') || value.includes('refactor') || value.includes('branch') || value.includes('duplicate')) return 'Refactor'
  if (value.includes('test') || value.includes('unit')) return 'Testing'
  if (value.includes('doc') || value.includes('comment') || value.includes('naming')) return 'Docs'
  if (value.includes('performance') || value.includes('slow') || value.includes('optimize')) return 'Performance'
  return 'General'
}

function getSuggestionColor(category) {
  const palette = {
    Security: [220, 38, 38],
    Refactor: [79, 70, 229],
    Testing: [16, 185, 129],
    Docs: [59, 130, 246],
    Performance: [245, 158, 11],
    General: [107, 114, 128]
  }
  return palette[category] || palette.General
}

function getTopIssueRules(issues = [], limit = 2) {
  const counts = {}
  issues.forEach((issue) => {
    const rule = issue.rule || 'unknown'
    counts[rule] = (counts[rule] || 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([rule, count]) => ({ rule, count }))
}

function buildFileSuggestions(file) {
  const metrics = file.result?.metrics || {}
  const scores = file.result?.scores || {}
  const issues = file.result?.issues || []
  const securityFindings = [
    ...(file.result?.security_vulnerabilities || []),
    ...(file.result?.security_deep_scan_findings || [])
  ]

  const suggestions = []
  const addSuggestion = (text) => {
    if (!text) return
    if (!suggestions.includes(text)) suggestions.push(text)
  }

  ;(file.result?.suggestions || []).forEach(addSuggestion)

  if (metrics.complexity >= 20) {
    addSuggestion('High complexity detected: split large functions into smaller helpers and reduce nested conditionals.')
  } else if (metrics.complexity >= 12) {
    addSuggestion('Moderate complexity: extract repeated logic and simplify branching to improve readability.')
  }

  if (metrics.maintainability !== undefined && metrics.maintainability < 60) {
    addSuggestion('Maintainability is low: reduce code duplication and add clear naming + documentation.')
  }

  if (securityFindings.length > 0) {
    addSuggestion('Security findings present: prioritize fixes for risky patterns (input validation, auth, secret handling).')
  }

  if (issues.length >= 10) {
    addSuggestion('Large number of issues: address errors first, then warnings, then style issues.')
  }

  const topRules = getTopIssueRules(issues, 2)
  topRules.forEach((item) => {
    addSuggestion(`Focus on "${item.rule}" issues (${item.count} occurrence${item.count > 1 ? 's' : ''}) in this file.`)
  })

  if ((scores.final ?? 100) < 50) {
    addSuggestion('Low overall score: refactor hotspots, reduce complexity, and resolve security issues for quick gains.')
  }

  if (suggestions.length === 0) {
    addSuggestion('No major issues detected. Consider adding unit tests and comments for long-term maintainability.')
  }

  return suggestions.slice(0, 6)
}

export default function BatchAnalysisResults({ results }) {
  const summary = results?.summary || {}
  const files = results?.files || []
  const offenders = results?.worst_offenders || []
  const source = results?.source || null
  const generatedAt = new Date().toISOString()
  const baseFileName = `batch-analysis-report-${new Date().toISOString().slice(0, 10)}`

  const handleDownloadJson = () => {
    const payload = {
      generated_at: generatedAt,
      ...results
    }
    downloadTextFile(
      JSON.stringify(payload, null, 2),
      `${baseFileName}.json`,
      'application/json'
    )
  }

  const handleDownloadMarkdown = () => {
    const offendersText = offenders.length
      ? offenders.map((item, index) => `${index + 1}. ${item.file_name} (${item.language}) - issues: ${item.issue_count}, security: ${item.security_alerts}, score: ${item.final_score}`).join('\n')
      : 'No offenders found.'

    const filesText = files.length
      ? files.map((file, index) => (
        `${index + 1}. ${file.file_name} (${file.language}) - issues: ${file.summary?.issue_count ?? 0}, ` +
        `security: ${file.summary?.security_alerts ?? 0}, loc: ${file.summary?.lines_of_code ?? 0}, ` +
        `complexity: ${file.summary?.complexity ?? 0}, maintainability: ${file.summary?.maintainability ?? 0}, ` +
        `score: ${file.summary?.final_score ?? 0}`
      )).join('\n')
      : 'No files analyzed.'

    const markdown = `# Batch Analysis Report

- Generated At: ${generatedAt}
- Source Type: ${source?.type || 'uploaded_files'}
- Source URL: ${source?.url || 'N/A'}
- Total Files: ${summary.total_files ?? 0}
- Total Issues: ${summary.total_issues ?? 0}
- Average Final Score: ${summary.average_score ?? 0}
- Average Quality Score: ${summary.average_quality_score ?? 0}
- Average Complexity Score: ${summary.average_complexity_score ?? 0}
- Average Security Score: ${summary.average_security_score ?? 0}

## Worst Offenders

${offendersText}

## Per-file Summary

${filesText}
`
    downloadTextFile(markdown, `${baseFileName}.md`, 'text/markdown')
  }
 
  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 40
    const contentWidth = pageWidth - margin * 2
    let cursorY = 40

    const overallIssues = files.flatMap((file) => file.result?.issues || [])
    const overallSeverity = files.reduce((acc, file) => {
      const counts = getSeverityCounts(file.result?.issues || [])
      acc.error += counts.error
      acc.warning += counts.warning
      acc.info += counts.info
      return acc
    }, { error: 0, warning: 0, info: 0 })

    const accentForScore = (value) => {
      if ((value ?? 0) < 50) return [220, 38, 38]
      if ((value ?? 0) < 75) return [245, 158, 11]
      return [16, 185, 129]
    }

    const formatShortDate = (isoDate) => isoDate.replace('T', ' ').replace('Z', '')

    doc.setFont('helvetica', 'normal')
    cursorY = 28

    const summaryBannerHeight = drawBanner(
      doc,
      margin,
      cursorY,
      contentWidth,
      'Batch Analysis Report',
      'Executive summary, severity mix, and file-by-file guidance',
      [79, 70, 229],
      `Generated ${formatShortDate(generatedAt)} | ${source?.type || 'uploaded files'}`
    )

    const summaryPillText = `Avg score ${formatDisplayValue(summary.average_score ?? 0)}`
    const summaryPillWidth = doc.getTextWidth(summaryPillText) + 16
    drawPill(
      doc,
      pageWidth - margin - summaryPillWidth - 16,
      cursorY + 16,
      summaryPillText,
      accentForScore(summary.average_score ?? 0)
    )

    cursorY += summaryBannerHeight + 14

    const summaryCards = [
      ['Files', summary.total_files ?? 0, [59, 130, 246], [239, 246, 255]],
      ['Issues', summary.total_issues ?? 0, [220, 38, 38], [254, 242, 242]],
      ['Avg score', summary.average_score ?? 0, accentForScore(summary.average_score ?? 0), [243, 244, 246]],
      ['Quality', summary.average_quality_score ?? 0, [168, 85, 247], [250, 245, 255]],
      ['Complexity', summary.average_complexity_score ?? 0, [245, 158, 11], [255, 251, 235]],
      ['Security', summary.average_security_score ?? 0, [16, 185, 129], [236, 253, 245]],
    ]
    const cardGap = 10
    const cardWidth = (contentWidth - cardGap * 2) / 3
    const cardHeight = 52
    summaryCards.forEach((card, index) => {
      const row = Math.floor(index / 3)
      const col = index % 3
      const x = margin + (col * (cardWidth + cardGap))
      const y = cursorY + (row * (cardHeight + 10))
      drawMetricCard(doc, x, y, cardWidth, cardHeight, card[0], card[1], card[2], card[3])
    })
    cursorY += (cardHeight * 2) + 20

    cursorY = drawSectionTitle(
      doc,
      margin,
      cursorY,
      'Batch overview',
      [79, 70, 229],
      'Cross-file metrics from the current batch'
    ) + 6

    const summaryRows = [
      ['Files analyzed', summary.total_files ?? 0],
      ['Issues found', summary.total_issues ?? 0],
      ['Average final score', summary.average_score ?? 0],
      ['Average quality', summary.average_quality_score ?? 0],
      ['Average complexity', summary.average_complexity_score ?? 0],
      ['Average security', summary.average_security_score ?? 0],
    ]

    autoTable(doc, {
      startY: cursorY + 8,
      head: [['Metric', 'Value']],
      body: summaryRows,
      theme: 'grid',
      styles: {
        fontSize: 9,
        textColor: [55, 65, 81],
        lineColor: [229, 231, 235],
        lineWidth: 0.5,
        cellPadding: 6,
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
      margin: { left: margin, right: margin },
    })

    cursorY = doc.lastAutoTable.finalY + 20

    cursorY = drawSectionTitle(
      doc,
      margin,
      cursorY,
      'Severity mix',
      [220, 38, 38],
      'Aggregated across every issue in the batch'
    ) + 6

    const severityBoxHeight = 126
    doc.setFillColor(249, 250, 251)
    doc.roundedRect(margin, cursorY, contentWidth, severityBoxHeight, 12, 12, 'F')
    cursorY = drawFileInsightBlock(doc, margin + 14, cursorY + 14, contentWidth - 28, overallSeverity, {
      quality: summary.average_quality_score ?? 0,
      security: summary.average_security_score ?? 0,
      final: summary.average_score ?? 0,
      complexity: summary.average_complexity_score ?? 0,
    }) + 14

    const overallRuleRows = getTopIssueRules(overallIssues, 3).map((item, index) => ([
      index + 1,
      item.rule,
      item.count,
    ]))

    if (overallRuleRows.length > 0) {
      cursorY = drawSectionTitle(
        doc,
        margin,
        cursorY,
        'Top repeated rules',
        [245, 158, 11],
        'The most common issue patterns across the batch'
      ) + 4

      autoTable(doc, {
        startY: cursorY,
        head: [['#', 'Rule', 'Occurrences']],
        body: overallRuleRows,
        theme: 'grid',
        styles: {
          fontSize: 9,
          textColor: [55, 65, 81],
          lineColor: [229, 231, 235],
          lineWidth: 0.5,
          cellPadding: 6,
        },
        alternateRowStyles: { fillColor: [255, 251, 235] },
        headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
        columnStyles: {
          0: { cellWidth: 30 },
          2: { halign: 'center', cellWidth: 70 },
        },
        margin: { left: margin, right: margin },
      })

      cursorY = doc.lastAutoTable.finalY + 18
    }

    if (files.length > 0) {
      const perFileRows = files.map((file) => {
        const metrics = file.result?.metrics || {}
        const scores = file.result?.scores || {}
        return [
          file.file_name,
          (file.language || '').toUpperCase(),
          file.summary?.issue_count ?? 0,
          file.summary?.security_alerts ?? 0,
          metrics.lines_of_code ?? 0,
          metrics.complexity ?? 0,
          metrics.maintainability ?? 0,
          scores.quality ?? file.summary?.final_score ?? 0,
          scores.complexity ?? 0,
          scores.security ?? 0,
          scores.final ?? file.summary?.final_score ?? 0,
        ]
      })

      autoTable(doc, {
        startY: cursorY,
        head: [[
          'File', 'Lang', 'Issues', 'Security', 'LOC', 'Complexity', 'Maintainability',
          'Quality', 'Complexity Score', 'Security', 'Final'
        ]],
        body: perFileRows,
        styles: {
          fontSize: 8,
          textColor: [55, 65, 81],
          lineColor: [229, 231, 235],
          lineWidth: 0.4,
          cellPadding: 5,
        },
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [236, 253, 245] },
        theme: 'grid',
        margin: { left: margin, right: margin },
      })

      cursorY = doc.lastAutoTable.finalY + 24
    }

    files.forEach((file, index) => {
      const metrics = file.result?.metrics || {}
      const scores = file.result?.scores || {}
      const issues = file.result?.issues || []
      const securityFindings = [
        ...(file.result?.security_vulnerabilities || []),
        ...(file.result?.security_deep_scan_findings || [])
      ]
      // Build varied, contextual suggestions per file
      const suggestions = buildFileSuggestions(file).concat(file.result?.suggestions || [])
      const sevCounts = getSeverityCounts(issues)
      const finalScore = scores.final ?? file.summary?.final_score ?? 0
      const fileAccent = accentForScore(finalScore)

      doc.addPage()
      cursorY = 28

      const fileBannerHeight = drawBanner(
        doc,
        margin,
        cursorY,
        contentWidth,
        `File ${index + 1}: ${file.file_name}`,
        `${(file.language || '').toUpperCase()} • ${issues.length} issues • ${securityFindings.length} security findings`,
        fileAccent,
        `Final ${formatDisplayValue(finalScore)} | Maintainability ${formatDisplayValue(metrics.maintainability ?? 0)} | LOC ${metrics.lines_of_code ?? 0}`
      )

      const filePillText = `${formatDisplayValue(finalScore)} final score`
      const filePillWidth = doc.getTextWidth(filePillText) + 16
      drawPill(
        doc,
        pageWidth - margin - filePillWidth - 16,
        cursorY + 16,
        filePillText,
        fileAccent
      )

      cursorY += fileBannerHeight + 16

      const fileCardGap = 8
      const fileCardWidth = (contentWidth - (fileCardGap * 3)) / 4
      const fileCardHeight = 48
      const fileMetricCards = [
        ['Issues', file.summary?.issue_count ?? issues.length, [220, 38, 38], [254, 242, 242]],
        ['Security', file.summary?.security_alerts ?? securityFindings.length, [245, 158, 11], [255, 251, 235]],
        ['LOC', metrics.lines_of_code ?? 0, [59, 130, 246], [239, 246, 255]],
        ['Complexity', metrics.complexity ?? 0, [168, 85, 247], [250, 245, 255]],
      ]
      fileMetricCards.forEach((card, idx) => {
        const x = margin + (idx * (fileCardWidth + fileCardGap))
        drawMetricCard(doc, x, cursorY, fileCardWidth, fileCardHeight, card[0], card[1], card[2], card[3])
      })
      cursorY += fileCardHeight + 18

      cursorY = drawSectionTitle(
        doc,
        margin,
        cursorY,
        'Detailed issues',
        [59, 130, 246],
        'Findings highlighted by severity and rule'
      ) + 4

      autoTable(doc, {
        startY: cursorY,
        head: [['Metric', 'Value']],
        body: [
          ['Issues', file.summary?.issue_count ?? issues.length],
          ['Security Alerts', file.summary?.security_alerts ?? securityFindings.length],
          ['Lines of Code', metrics.lines_of_code ?? 0],
          ['Complexity', metrics.complexity ?? 0],
          ['Maintainability', metrics.maintainability ?? 0],
          ['Quality Score', scores.quality ?? 0],
          ['Complexity Score', scores.complexity ?? 0],
          ['Security Score', scores.security ?? 0],
          ['Final Score', scores.final ?? file.summary?.final_score ?? 0],
        ],
        styles: {
          fontSize: 9,
          textColor: [55, 65, 81],
          lineColor: [229, 231, 235],
          lineWidth: 0.45,
          cellPadding: 6,
        },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
        margin: { left: margin, right: margin },
      })

      cursorY = doc.lastAutoTable.finalY + 16

      cursorY = drawSectionTitle(
        doc,
        margin,
        cursorY,
        'Issues by rule',
        [220, 38, 38],
        'Detailed rows for each issue in this file'
      ) + 2

      const issueRows = issues.map((issue) => ([
        (issue.severity || 'info').toUpperCase(),
        issue.line ?? 0,
        issue.rule || 'unknown',
        issue.message || ''
      ]))

      if (issueRows.length > 0) {
        autoTable(doc, {
          startY: cursorY,
          head: [['Severity', 'Line', 'Rule', 'Message']],
          body: issueRows,
          styles: {
            fontSize: 8,
            textColor: [55, 65, 81],
            lineColor: [229, 231, 235],
            lineWidth: 0.35,
            cellPadding: 5,
          },
          alternateRowStyles: { fillColor: [254, 242, 242] },
          theme: 'grid',
          headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
          margin: { left: margin, right: margin },
          columnStyles: { 3: { cellWidth: pageWidth - (margin * 2) - 180 } },
        })
        cursorY = doc.lastAutoTable.finalY + 16
      } else {
        doc.setFontSize(9)
        doc.text('No issues found.', margin, cursorY + 12)
        cursorY += 24
      }

      cursorY = drawSectionTitle(
        doc,
        margin,
        cursorY,
        'Security findings',
        [245, 158, 11],
        'Security alerts and deep-scan results'
      ) + 2

      const securityRows = securityFindings.map((finding) => ([
        (finding.severity || 'low').toUpperCase(),
        finding.line ?? finding.line_number ?? 0,
        finding.rule || finding.issue || finding.message || 'security finding',
        finding.cwe || finding.cwe_id || 'N/A'
      ]))

      if (securityRows.length > 0) {
        autoTable(doc, {
          startY: cursorY,
          head: [['Severity', 'Line', 'Issue', 'CWE']],
          body: securityRows,
          styles: {
            fontSize: 8,
            textColor: [55, 65, 81],
            lineColor: [229, 231, 235],
            lineWidth: 0.35,
            cellPadding: 5,
          },
          alternateRowStyles: { fillColor: [255, 251, 235] },
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
          margin: { left: margin, right: margin },
        })
        cursorY = doc.lastAutoTable.finalY + 16
      } else {
        doc.setFontSize(9)
        doc.text('No security findings found.', margin, cursorY + 12)
        cursorY += 24
      }

      cursorY += 10
      const visualBlockHeight = 138
      if (cursorY + visualBlockHeight > pageHeight - 110) {
        doc.addPage()
        cursorY = 28
      }

      cursorY = drawSectionTitle(
        doc,
        margin,
        cursorY,
        'Visual insights',
        fileAccent,
        'Severity mix and score snapshot for this file'
      ) + 4

      doc.setFillColor(249, 250, 251)
      doc.roundedRect(margin, cursorY, contentWidth, 128, 12, 12, 'F')
      cursorY = drawFileInsightBlock(doc, margin + 14, cursorY + 14, contentWidth - 28, sevCounts, scores) + 14

      cursorY = drawSectionTitle(
        doc,
        margin,
        cursorY,
        'Suggestions',
        [79, 70, 229],
        'Actionable next steps grouped by theme'
      ) + 4

      const suggestionEntries = (suggestions.length ? suggestions : ['No suggestions provided.']).map((item) => ({
        text: item,
        category: getSuggestionCategory(item),
      }))
      let suggestionHeight = 18
      suggestionEntries.forEach((item) => {
        const wrapped = doc.splitTextToSize(item.text, contentWidth - 118)
        suggestionHeight += Math.max(20, wrapped.length * 11) + 6
      })

      if (cursorY + suggestionHeight > pageHeight - 60) {
        doc.addPage()
        cursorY = 28
        cursorY = drawSectionTitle(
          doc,
          margin,
          cursorY,
          'Suggestions',
          [79, 70, 229],
          'Actionable next steps grouped by theme'
        ) + 4
      }

      doc.setFillColor(249, 250, 251)
      doc.roundedRect(margin, cursorY, contentWidth, suggestionHeight, 12, 12, 'F')
      let suggestionY = cursorY + 14
      suggestionEntries.forEach((item) => {
        const categoryColor = getSuggestionColor(item.category)
        const categoryText = item.category
        const categoryWidth = doc.getTextWidth(categoryText) + 14
        doc.setFillColor(...categoryColor)
        doc.roundedRect(margin + 14, suggestionY, categoryWidth, 16, 6, 6, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(8)
        doc.text(categoryText, margin + 21, suggestionY + 11)

        const wrapped = doc.splitTextToSize(item.text, contentWidth - categoryWidth - 40)
        doc.setTextColor(55, 65, 81)
        doc.setFontSize(9)
        doc.text(wrapped, margin + categoryWidth + 26, suggestionY + 11)
        suggestionY += Math.max(20, wrapped.length * 11) + 8
      })

      cursorY += suggestionHeight + 10
    })

    const totalPages = doc.getNumberOfPages()
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
      doc.setPage(pageNumber)
      addPageFooter(doc, pageNumber, totalPages)
    }

    doc.save(`${baseFileName}.pdf`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mt-8"
    >
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Download Batch Report</h2>
            <p className="text-sm text-gray-600">Export full batch results and rankings.</p>
            {source?.url && (
              <p className="mt-1 text-xs text-gray-500 break-all">Source: {source.url}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleDownloadJson} className="btn-secondary flex items-center gap-2">
              <FaFileCode /> JSON
            </button>
            <button onClick={handleDownloadMarkdown} className="btn-primary flex items-center gap-2">
              <FaDownload /> Markdown
            </button>
            <button onClick={handleDownloadPdf} className="btn-secondary flex items-center gap-2">
              <FaFilePdf /> PDF
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Batch Analysis Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Files</p>
            <p className="text-3xl font-bold text-blue-700">{summary.total_files ?? 0}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Issues</p>
            <p className="text-3xl font-bold text-orange-700">{summary.total_issues ?? 0}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Average Final Score</p>
            <p className="text-3xl font-bold text-green-700">{summary.average_score ?? 0}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Average Quality</p>
            <p className="text-2xl font-bold text-purple-700">{summary.average_quality_score ?? 0}</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Average Complexity</p>
            <p className="text-2xl font-bold text-indigo-700">{summary.average_complexity_score ?? 0}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Average Security</p>
            <p className="text-2xl font-bold text-red-700">{summary.average_security_score ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaTrophy className="text-red-500" />
          Worst Offenders
        </h2>
        {offenders.length === 0 ? (
          <p className="text-gray-600">No offenders found.</p>
        ) : (
          <div className="space-y-2">
            {offenders.map((item, idx) => (
              <div key={`${item.file_name}-${idx}`} className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900">{item.file_name}</p>
                  <span className="text-xs text-gray-500 uppercase">{item.language}</span>
                </div>
                <div className="mt-2 text-sm text-gray-700 flex flex-wrap gap-4">
                  <span className="flex items-center gap-1"><FaExclamationTriangle className="text-orange-500" /> Issues: {item.issue_count}</span>
                  <span className="flex items-center gap-1"><FaShieldAlt className="text-red-500" /> Security: {item.security_alerts}</span>
                  <span>Score: {item.final_score}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaFileAlt className="text-blue-500" />
          Per-file Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-2">File</th>
                <th className="py-2">Language</th>
                <th className="py-2">Issues</th>
                <th className="py-2">Security</th>
                <th className="py-2">LOC</th>
                <th className="py-2">Complexity</th>
                <th className="py-2">Maintainability</th>
                <th className="py-2">Final Score</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, idx) => (
                <tr key={`${file.file_name}-${idx}`} className="border-b border-gray-100">
                  <td className="py-2 text-gray-900">{file.file_name}</td>
                  <td className="py-2 uppercase text-gray-600">{file.language}</td>
                  <td className="py-2">{file.summary?.issue_count ?? 0}</td>
                  <td className="py-2">{file.summary?.security_alerts ?? 0}</td>
                  <td className="py-2">{file.summary?.lines_of_code ?? 0}</td>
                  <td className="py-2">{file.summary?.complexity ?? 0}</td>
                  <td className="py-2">{file.summary?.maintainability ?? 0}</td>
                  <td className="py-2 font-semibold">{file.summary?.final_score ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
