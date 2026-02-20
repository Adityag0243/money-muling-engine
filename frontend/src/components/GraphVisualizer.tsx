import { useRef, useState, useEffect, useMemo, memo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { ZoomIn, ZoomOut, Maximize, AlertOctagon, DollarSign } from 'lucide-react'; // Added DollarSign
import clsx from 'clsx';

interface GraphVisualizerProps {
  graphData: { nodes: any[]; links: any[] };
  isolatedRingId: string | null;
  onNodeClick: (node: any) => void;
}

const GraphVisualizer = memo(({ graphData, isolatedRingId, onNodeClick }: GraphVisualizerProps) => {
  const fgRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });
  const [showHighRiskOnly, setShowHighRiskOnly] = useState(false);
  const [showAmounts, setShowAmounts] = useState(false); // Added state

  const displayData = useMemo(() => {
    let nodes = graphData.nodes;
    let links = graphData.links;

    if (isolatedRingId) {
      nodes = nodes.filter((n: any) => n.ring && n.ring.includes(isolatedRingId));
    } else if (showHighRiskOnly) {
      nodes = nodes.filter((n: any) => n.suspicion_score > 50);
    }

    const nodeIds = new Set(nodes.map((n: any) => n.id));
    links = links.filter((l: any) =>
      nodeIds.has(typeof l.source === 'object' ? l.source.id : l.source) &&
      nodeIds.has(typeof l.target === 'object' ? l.target.id : l.target)
    );

    return { nodes, links };
  }, [graphData, isolatedRingId, showHighRiskOnly]);

  useEffect(() => {
    const updateDims = () => {
      if (containerRef.current) {
        setDimensions({ w: containerRef.current.clientWidth, h: containerRef.current.clientHeight });
      }
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  const getNodeColor = (node: any) => {
    const score = node.suspicion_score || 0;
    if (score > 80) return '#DC2626'; // Crimson
    if (score > 50) return '#F59E0B'; // Amber
    return '#00A86B'; // Emerald
  };

  const getEdgeWidth = (link: any) => {
    if (!link.amount) return 1;
    return Math.max(0.5, Math.log10(link.amount) * 0.5); 
  };

  return (
    <div className="relative h-full w-full flex flex-col group bg-black overflow-hidden">
      
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
        <div className="glass-panel p-2 rounded-lg flex flex-col gap-2 shadow-xl border border-white/10">
          <button onClick={() => fgRef.current?.zoom(fgRef.current.zoom() * 1.2, 400)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><ZoomIn size={16} /></button>
          <button onClick={() => fgRef.current?.zoom(fgRef.current.zoom() * 0.8, 400)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><ZoomOut size={16} /></button>
          <button onClick={() => fgRef.current?.zoomToFit(400, 40)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><Maximize size={16} /></button>
          <div className="w-full h-px bg-white/10 my-1"></div>
          
          {/* NEW DOLLAR TOGGLE */}
          <button 
            onClick={() => setShowAmounts(!showAmounts)} 
            className={clsx('p-2 rounded transition-colors', showAmounts ? 'bg-[#00A86B]/20 text-[#00A86B]' : 'hover:bg-white/10 text-gray-400')}
            title="Toggle Value Amounts"
          >
            <DollarSign size={16} />
          </button>
          
          <button 
            onClick={() => setShowHighRiskOnly(!showHighRiskOnly)} 
            className={clsx('p-2 rounded transition-colors', showHighRiskOnly ? 'bg-[#DC2626]/20 text-[#DC2626]' : 'hover:bg-white/10 text-gray-400')}
            title="Toggle High Risk Only"
          >
            <AlertOctagon size={16} />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 w-full h-full relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 168, 107, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        {graphData.nodes.length > 0 ? (
          <ForceGraph2D
            ref={fgRef}
            width={dimensions.w}
            height={dimensions.h}
            graphData={displayData}
            nodeLabel={(node: any) => `
              <div style="background: rgba(18,18,18,0.8); border: 1px solid rgba(255,255,255,0.1); padding: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
                <strong style="color: white;">${node.id}</strong><br/>
                Risk Score: <span style="color: ${getNodeColor(node)}">${node.suspicion_score || 0}</span>
              </div>
            `}
            nodeColor={getNodeColor}
            nodeRelSize={4}
            linkColor={(link: any) => link.amount && link.amount > 10000 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.1)'}
            linkWidth={getEdgeWidth}
            linkDirectionalArrowLength={3}
            linkDirectionalArrowRelPos={1}
            backgroundColor="transparent"
            onNodeClick={(node) => {
              onNodeClick(node);
              fgRef.current?.centerAt(node.x, node.y, 1000);
              fgRef.current?.zoom(4, 2000);
            }}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            
            // RENDERING THE DOLLAR AMOUNTS
            linkCanvasObjectMode={() => showAmounts ? 'after' : undefined}
            linkCanvasObject={(link: any, ctx, globalScale) => {
              if (!showAmounts || !link.amount) return;
              const label = `$${link.amount.toLocaleString()}`;
              const fontSize = 11 / globalScale;
              ctx.font = `${fontSize}px Inter, sans-serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

              const x = link.source.x + (link.target.x - link.source.x) / 2;
              const y = link.source.y + (link.target.y - link.source.y) / 2;

              ctx.save();
              ctx.translate(x, y);
              ctx.fillStyle = 'rgba(10, 10, 10, 0.85)';
              ctx.fillRect(-bckgDimensions[0] / 2, -bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#00A86B'; // Emerald Text
              ctx.fillText(label, 0, 0);
              ctx.restore();
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-700 gap-4">
            <p className="text-sm font-mono tracking-widest uppercase opacity-50">Awaiting Graph Data</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-8 p-5 glass-panel rounded-lg shadow-2xl z-10 w-48 border border-white/10">
        <h4 className="text-[10px] font-bold text-gray-500 mb-3 tracking-widest uppercase">Node Taxonomy</h4>
        <div className="space-y-3 text-xs font-mono">
          <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span><span className="text-gray-300">Critical (&gt;80)</span></div>
          <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span><span className="text-gray-300">Suspicious (50-80)</span></div>
          <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#00A86B]"></span><span className="text-gray-400">Neutral (&lt;50)</span></div>
        </div>
      </div>
    </div>
  );
});

export default GraphVisualizer;