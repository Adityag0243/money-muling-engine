import { Search, AlertTriangle } from 'lucide-react';
import { ThreatCard } from './ThreatCard';
import { useMemo } from 'react';

interface SidebarLeftProps {
  rings: any[];
  selectedRingId: string | null;
  onSelectRing: (id: string | null) => void;
  onGenerateSAR: (ring: any) => void;
}

export function SidebarLeft({ rings, selectedRingId, onSelectRing, onGenerateSAR }: SidebarLeftProps) {
  const ringList = useMemo(() => {
    if (!rings.length) {
      return (
        <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
          <div className="font-label" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>NO ACTIVE THREATS</div>
          <div className="font-label" style={{ fontSize: '9px', marginTop: '4px', opacity: 0.5 }}>SCAN COMPLETE</div>
        </div>
      );
    }
    
    // Sort rings by highest risk score first
    const sortedRings = [...rings].sort((a, b) => b.risk_score - a.risk_score);

    return sortedRings.map(ring => (
      <ThreatCard
        key={ring.ring_id}
        ring={ring}
        isSelected={selectedRingId === ring.ring_id}
        onSelect={id => onSelectRing(selectedRingId === id ? null : id)}
        onGenerateSAR={onGenerateSAR}
      />
    ));
  }, [rings, selectedRingId, onSelectRing, onGenerateSAR]);

  return (
    <aside style={{
      width: '360px', height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-panel)', borderRight: '1px solid var(--border-base)', flexShrink: 0, zIndex: 40,
    }}>
      <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid var(--border-base)', background: 'var(--bg-base)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '20px', height: '20px', background: rings.some(r => r.risk_score > 80) ? 'var(--danger)' : 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertTriangle size={12} style={{ color: '#000' }} />
            </div>
            <span className="font-label" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Triage Console</span>
          </div>
          <div style={{
            padding: '2px 8px', background: 'var(--danger-dim)', border: '1px solid var(--danger)',
            display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            <div style={{ width: '5px', height: '5px', background: 'var(--danger)', borderRadius: '50%' }} className="alert-pulse" />
            <span className="font-mono" style={{ fontSize: '10px', color: 'var(--danger)', fontWeight: 700 }}>{rings.length} ALERTS</span>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input type="text" placeholder="SEARCH RINGS..." className="input-field" style={{ paddingLeft: '32px' }} />
        </div>
      </div>
      <div className="scroll stagger" style={{ flex: 1, overflowY: 'auto', padding: '12px', background: 'var(--bg-panel)' }}>
        {ringList}
      </div>
      <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-base)', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-base)' }}>
        <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }} />
        <span className="font-mono" style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>SYSTEM ONLINE — MONITORS ACTIVE</span>
      </div>
    </aside>
  );
}