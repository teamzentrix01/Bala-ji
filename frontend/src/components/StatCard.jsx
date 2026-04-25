export default function StatCard({ label, value, icon, color = 'cyan' }) {
  const colors = {
    cyan:   'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-300',
    green:  'from-green-500/20 to-green-600/10 border-green-500/30 text-green-300',
    blue:   'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300',
  }

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{label}</p>
          <p className={`text-3xl font-bold ${colors[color].split(' ').pop()}`}>{value}</p>
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  )
}