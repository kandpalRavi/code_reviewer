import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function MetricsChart({ metrics }) {
  const data = [
    {
      name: 'Lines of Code',
      value: metrics.lines_of_code,
      max: 500,
    },
    {
      name: 'Complexity',
      value: metrics.complexity,
      max: 50,
    },
    {
      name: 'Maintainability',
      value: metrics.maintainability,
      max: 100,
    },
  ]

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Visual Metrics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#0284c7" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
