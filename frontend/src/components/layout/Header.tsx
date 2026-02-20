import { Shield, Zap, Database, Activity, Download, ChevronLeft } from 'lucide-react'; // Added ChevronLeft

interface HeaderProps {
  stats: {
    totalTransactions: number;
    processingTime: number;
    fraudRings: number;
    illicitVolume: number;
  };
  onExport: () => void;
  onBack: () => void; // Added onBack prop
}

export function Header({ stats, onExport, onBack }: HeaderProps) {
  const metrics = [
    { icon: <Zap size={12} />, label: 'Latency', value: `${Math.round(stats.processingTime * 1000)}ms`, color: 'var(--accent)' },
    { icon: <Database size={12} />, label: 'Nodes Processed', value: stats.totalTransactions.toLocaleString(), color: 'var(--text-primary)' },
    { icon: <Activity size={12} />, label: 'Active Rings', value: `${stats.fraudRings}`, color: 'var(--danger)', danger: true },
  ];

  return (
    <header style={{
      background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-base)', height: '56px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
      position: 'relative', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* BACK BUTTON */}
        <button 
          onClick={onBack} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', 
            background: 'transparent', border: 'none', color: 'var(--text-muted)', 
            fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
        >
          <ChevronLeft size={16}/> Back
        </button>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-base)' }} />

        {/* BRAND */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', background: 'var(--bg-card)', border: '1px solid var(--border-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            <Shield size={18} style={{ color: 'var(--accent)' }} />
            <div style={{ position: 'absolute', top: '-3px', right: '-3px', width: '6px', height: '6px', background: 'var(--danger)' }} className="alert-pulse" />
          </div>
          <div>
            <div className="font-display" style={{ fontSize: '16px', color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '0.05em' }}>
              MULE<span style={{ color: 'var(--accent)' }}>DEFENSE</span>
            </div>
            <div className="font-mono" style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
              FORENSIC INTELLIGENCE ENGINE v2.0
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div style={{ width: '1px', height: '28px', background: 'var(--border-base)', margin: '0 20px' }} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '28px', height: '28px', background: 'var(--bg-card)', border: '1px solid var(--border-base)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color,
              }}>
                {m.icon}
              </div>
              <div>
                <div className="font-label" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{m.label}</div>
                <div className={`font-mono ${m.danger ? 'glow-danger' : ''}`} style={{ fontSize: '14px', fontWeight: 700, color: m.color, lineHeight: 1 }}>
                  {m.value}
                  {m.danger && <span style={{ fontSize: '9px', marginLeft: '4px', opacity: 0.7 }}>DETECTED</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onExport}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 14px',
            background: 'var(--bg-card)', border: '1px solid var(--border-accent)',
            color: 'var(--text-accent)', cursor: 'pointer', fontSize: '11px',
            fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', transition: 'all 0.1s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; }}
        >
          <Download size={13} />
          Export JSON Result {/* Changed Text */}
        </button>
      </div>
    </header>
  );
}