export default function ConsultantDashboard() {
  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-3xl p-8 mb-6 border border-white/10">
          <h1 className="text-2xl font-bold mb-1">Hello, Consultant! 👋</h1>
          <p className="text-slate-400">Manage your sessions, earnings, and profile from here.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ label: 'Total Earnings', value: '₹24,500', color: '#a855f7' }, { label: 'Sessions Done', value: '47', color: '#10b981' }, { label: 'Avg Rating', value: '4.8 ⭐', color: '#f59e0b' }, { label: 'Pending Payout', value: '₹3,200', color: '#6366f1' }].map(s => (
            <div key={s.label} className="card text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
