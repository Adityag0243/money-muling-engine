import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { SidebarLeft } from './components/layout/SidebarLeft';
import { SidebarRight } from './components/layout/SidebarRight';
import { SARPanel } from './components/SARPanel';
import GraphVisualizer from './components/GraphVisualizer';
import { Toast, useToast } from './components/ui/Toast';
import { LandingPage } from './components/LandingPage';

interface SuspiciousAccount {
  account_id: string;
  suspicion_score: number;
  detected_patterns: string[];
  ring_id: string;
}

interface FraudRing {
  ring_id: string;
  member_accounts: string[];
  pattern_type: string;
  risk_score: number;
}

interface AnalysisSummary {
  total_accounts_analyzed: number;
  suspicious_accounts_flagged: number;
  fraud_rings_detected: number;
  processing_time_seconds: number;
}

interface AnalysisResponse {
  suspicious_accounts: SuspiciousAccount[];
  fraud_rings: FraudRing[];
  summary: AnalysisSummary;
  graph_data: { nodes: any[]; links: any[] };
}

type Stage = 'landing' | 'dashboard';

function App() {
  const [stage, setStage]               = useState<Stage>('landing');
  const [data, setData]                 = useState<AnalysisResponse | null>(null);
  const { toast, showToast, hideToast } = useToast();
  const [selectedRingId, setSelectedRingId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode]     = useState<any | null>(null);
  const [sarRing, setSarRing]               = useState<any | null>(null);

  const handleAnalysisComplete = (result: AnalysisResponse) => {
    setData(result);
    setStage('dashboard');
    showToast('Forensic graph constructed successfully.', 'success');
  };

  const downloadJson = () => {
    if (!data) return;
    const { graph_data, ...r } = data;
    const a = document.createElement('a');
    a.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(r, null, 2))}`;
    a.download = `fincen_extract_${Date.now()}.json`; a.click();
  };

  if (stage === 'landing') {
    return <LandingPage onAnalysisComplete={handleAnalysisComplete} />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-black text-[#F3F4F6] overflow-hidden font-sans">
      <Header
        stats={{
          totalTransactions: data!.summary.total_accounts_analyzed,
          processingTime:    data!.summary.processing_time_seconds,
          fraudRings:        data!.summary.fraud_rings_detected,
          illicitVolume:     0,
        }}
        onExport={downloadJson}
        onBack={() => setStage('landing')}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <SidebarLeft 
          rings={data!.fraud_rings} 
          selectedRingId={selectedRingId} 
          onSelectRing={setSelectedRingId} 
          onGenerateSAR={setSarRing} 
        />
        <main className="flex-1 relative bg-black">
          <GraphVisualizer 
            graphData={data!.graph_data} 
            isolatedRingId={selectedRingId} 
            onNodeClick={setSelectedNode} 
          />
        </main>
        <SidebarRight 
          node={selectedNode} 
          onClose={() => setSelectedNode(null)} 
          showToast={showToast} 
        />
        <SARPanel 
          isOpen={!!sarRing} 
          onClose={() => setSarRing(null)} 
          ringData={sarRing} 
          showToast={showToast} 
        />
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;