import { X, Clock, ArrowRight, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

interface RingDetailsProps {
  ring: any | null;
  graphData: { nodes: any[], links: any[] };
  onClose: () => void;
}

export function RingDetails({ ring, graphData, onClose }: RingDetailsProps) {
  const ringTransactions = useMemo(() => {
    if (!ring || !graphData.links) return [];
    const members = new Set(ring.member_accounts);
    const relevantLinks = graphData.links.filter((link: any) => {
        const src = typeof link.source === 'object' ? link.source.id : link.source;
        const tgt = typeof link.target === 'object' ? link.target.id : link.target;
        return members.has(src) && members.has(tgt);
    });
    return relevantLinks.map((link: any) => ({
        ...link,
        sourceId: typeof link.source === 'object' ? link.source.id : link.source,
        targetId: typeof link.target === 'object' ? link.target.id : link.target,
        parsedDate: new Date(link.timestamp)
    })).sort((a: any, b: any) => a.parsedDate.getTime() - b.parsedDate.getTime());
  }, [ring, graphData]);

  return (
    <AnimatePresence>
      {ring && (
        <motion.div
          initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex flex-col h-full w-full bg-[#080808] border-l border-white/10"
        >
          <div className="p-5 border-b border-white/5 bg-[#0D0D0D]">
             <div className="flex justify-between items-start mb-2">
                 <div>
                    <h2 className="text-xl font-bold text-white font-mono tracking-wide flex items-center gap-2">{ring.ring_id}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-gray-900 border border-gray-700 text-gray-300 text-[10px] font-mono uppercase rounded">{ring.pattern_type}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded font-bold ${ring.risk_score > 80 ? 'bg-[#DC2626]/20 text-[#DC2626]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>Risk {ring.risk_score}</span>
                    </div>
                 </div>
                 <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
             </div>
             <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded flex justify-between items-center">
                 <div className="text-[10px] uppercase text-gray-400 font-mono tracking-wider">Total Illicit Volume</div>
                 <div className="text-lg font-mono font-bold text-[#00A86B] drop-shadow-[0_0_8px_rgba(0,168,107,0.5)]">${ring.total_value?.toLocaleString()}</div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-0 relative scroll bg-[#080808]">
             <div className="absolute left-6 top-4 bottom-4 w-px bg-white/10"></div>
             <div className="p-4 space-y-6">
                 {ringTransactions.length === 0 ? (
                    <div className="text-center text-gray-500 font-mono text-xs py-10">No internal transactions found within ring subset.</div>
                 ) : (
                    ringTransactions.map((tx: any, idx: number) => (
                        <div key={idx} className="relative pl-8 group">
                            <div className="absolute left-[5px] top-1.5 w-3 h-3 bg-[#080808] border-2 border-gray-600 rounded-full group-hover:border-[#00A86B] group-hover:scale-110 transition-all z-10"></div>
                            <div className="p-3 bg-white/5 border border-white/5 rounded hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={10} className="text-gray-500" />
                                    <span className="text-[10px] font-mono text-gray-400">{tx.timestamp}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="font-mono text-xs text-gray-400 truncate max-w-[80px]" title={tx.sourceId}>{tx.sourceId}</div>
                                    <div className="flex-1 border-b border-dashed border-gray-600 relative h-1"><ArrowRight size={10} className="absolute right-0 -top-2 text-gray-500" /></div>
                                    <div className="font-mono text-xs text-white truncate max-w-[80px]" title={tx.targetId}>{tx.targetId}</div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="text-xs font-mono font-bold text-[#00A86B] flex items-center gap-1"><DollarSign size={10} />{tx.amount.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    ))
                 )}
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}